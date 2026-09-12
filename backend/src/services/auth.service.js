import bcrypt from "bcrypt";
import pool from "../config/db.js";


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