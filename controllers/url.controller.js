import { shortenPostRequestBodySchema } from '../validation/request.validation.js';
import { nanoid } from 'nanoid';
import { db } from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { eq } from 'drizzle-orm';

export const shortenCode = async (req, res) => {
try {
const validationResult = await shortenPostRequestBodySchema.parseAsync(req.body);

if(validationResult.error) {
    return res.status(400).json({ error: validationResult.error.message });
}

const { url, code } = validationResult.data;

const shortCode = code || nanoid(6); 

const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetURL: url,
      userId: req.user.id,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
    
} catch (error) {
    console.error('Error while shortening URL:', error);
    res.status(404).json({ error: 'Internal server error' });
}

}

export const getUserCodes = async (req, res) => {
  try {
    const userCodes = await db
      .select()
      .from(urlsTable)
      .where(eq(urlsTable.userId, req.user.id))
      .execute();

    return res.status(200).json(userCodes);
  } catch (error) {
    console.error('Error in getting the user codes : ', error);
    res.status(404).json({ error: 'Internal server error' });
  }
};