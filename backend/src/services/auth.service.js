import bcrypt from "bcrypt";
import pool from "../config/db.js";


export const registerService = async({username, email, password}) => {
    const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if(!username || !email || !password){
        throw new Error("All fields are required");
    }

    if(existingUser.rows.length > 0){
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    //new user 
    const newUser = await pool.query(
        `INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email`,
        [username, email, hashedPassword]
    )

    return newUser.rows[0];
};

export const loginService = async({email, password}) => {
    const user = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if(user.rows.length === 0){
        throw new Error("User does not exist");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if(!validPassword){
        throw new Error("Invalid Credentials");
    }

    return{
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
    };
};