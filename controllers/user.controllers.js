import { db } from "../db/index.js";
import { usersTable } from "../models/user.model.js";
import { signupPostRequestBodySchema } from "../validation/request.validation.js";
import {hashPasswordWithSalt} from "../utils/hash.js";



export const signup = async (req, res) => {
try {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(req.body);

if(validationResult.error){
    return res.status(400).json({ error: validationResult.error.message });
}

const { firstname, lastname, email, password } = validationResult.data;

const existingUser = await db.select().from(usersTable).where(usersTable.email.eq(email)).first();

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

res.status(201).json({ message: "User created successfully", userId: user.insertId });

} catch (error) {
    console.error("Error during signup:", error);
    res.status(401).json({ error: "Error while signing up" });
}

}