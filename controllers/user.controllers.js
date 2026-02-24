import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { signupPostRequestBodySchema , loginPostRequestBodySchema } from "../validation/request.validation.js";
import {hashPasswordWithSalt} from "../utils/hash.js";
import { eq } from "drizzle-orm";
import { getUserByEmail } from "../services/user.service.js";
import jwt from 'jsonwebtoken';
import { createUserToken } from "../utils/token.js";




export const signup = async (req, res) => {
try {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

if(validationResult.error){
    return res.status(400).json({ error: validationResult.error.message });
}

const { firstname, lastname, email, password } = validationResult.data;

const existingUser = await getUserByEmail(email);
if(existingUser){
    return res.status(400).json({ error: "Email already exists" });
}

const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

 const user = await db.insert(usersTable).values({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    salt
}).execute();

console.log("User creation result:", user);
res.status(201).json({ message: "User created successfully", user });

} catch (error) {
    console.error("Error during signup:", error);
    res.status(401).json({ error: "Error while signing up" });
}

}

export const login = async (req, res) => {
try {
const validationResult = await loginPostRequestBodySchema.safeParseAsync(req.body);

if(validationResult.error){
    return res.status(400).json({ error: validationResult.error.message });
}

const { email, password } = validationResult.data;
const user = await getUserByEmail(email);

if(!user){
    return res.status(400).json({ error: "User with this email does not exist" });
}
const { password: hashedPassword } = hashPasswordWithSalt(password, user.salt); // This hashed password should be same as that of the password stored in the database

if (hashedPassword !== user.password) {
    return res.status(400).json({ error: "Invalid password" });
}

const token = await createUserToken({ id: user.id });
res.status(200).json({ message: "Login successful", token });

} catch (error) {
    console.error("Error during login:", error);
    res.status(401).json({ error: "Error while logging in" });
}






}

