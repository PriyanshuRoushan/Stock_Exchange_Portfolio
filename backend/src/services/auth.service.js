import bcrypt from "bcrypt";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import pool from "../config/db.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerService = async({ username, email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
        "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
        [trimmedEmail]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const derivedUsername = (username && username.trim()) || trimmedEmail.split("@")[0];

    // new user
    const newUser = await pool.query(
        `INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email`,
        [derivedUsername, trimmedEmail, hashedPassword]
    );

    return newUser.rows[0];
};

export const loginService = async({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const trimmedEmail = email.trim().toLowerCase();

    const user = await pool.query(
        "SELECT id, username, email, password FROM users WHERE LOWER(email) = LOWER($1)",
        [trimmedEmail]
    );

    if (user.rows.length === 0) {
        throw new Error("Invalid Credentials");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
        throw new Error("Invalid Credentials");
    }

    return {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
    };
};

export const googleAuthService = async ({ idToken, accessToken }) => {
    let email, name, picture, googleId;

    if (idToken) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
            googleId = payload.sub;
        } catch (err) {
            const res = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
            email = res.data.email;
            name = res.data.name || email.split("@")[0];
            googleId = res.data.sub;
        }
    } else if (accessToken) {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        email = res.data.email;
        name = res.data.name;
        picture = res.data.picture;
        googleId = res.data.sub;
    } else {
        throw new Error("Google token is required");
    }

    if (!email) {
        throw new Error("Unable to retrieve email from Google token");
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await pool.query(
        "SELECT id, username, email FROM users WHERE LOWER(email) = LOWER($1)",
        [trimmedEmail]
    );

    if (existingUser.rows.length > 0) {
        return existingUser.rows[0];
    }

    const derivedUsername = name ? name.trim() : trimmedEmail.split("@")[0];
    const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = await pool.query(
        `INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email`,
        [derivedUsername, trimmedEmail, hashedPassword]
    );

    return newUser.rows[0];
};