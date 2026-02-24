import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import bcrypt from "bcrypt";
import {randomBytes,createHmac} from "crypto"



export const signup = async (req, res) => {
try {
const {firstname, lastname, email, password} = req.body;

// Validate input
if (!firstname || !email || !password) {
    return res.status(400).json({ error: "First name, email, and password are required" });
}

// Check if the user with the same email already exists
const existingUser = await db.select().from(usersTable).where(usersTable.email.eq(email)).first();

if (existingUser) {
    return res.status(409).json({ error: "Email already in use" });
}

// Hash the password with the salt and store the salt in the database
// using crypto module to generate a random salt and hash the password with it
// we can also use bcrypt to hash the password, but here we will use crypto for demonstration
const salt = randomBytes(16).toString("hex");
const hashedPassword = createHmac("sha256", salt).update(password).digest("hex");


// insert the new user into the database
const user = await db.insert(usersTable).values({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    salt
}).execute();

return res.status(201).json({ message: "User created successfully", data : {userId : user.id} });

} catch (error) {
    console.error("Error during signup:", error);
    res.status(401).json({ error: "Error while signing up" });
}

}