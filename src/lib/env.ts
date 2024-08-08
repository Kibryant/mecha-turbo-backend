import { z } from "zod";
import { config } from "dotenv";

config();

const envSchema = z.object({
    MONGODB_URI: z.string(),
    JWT_SECRET_KEY: z.string(),
    HOTMART_HOTTOK: z.string(),
});

export const env = envSchema.parse(process.env);