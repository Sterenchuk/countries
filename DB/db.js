import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();

const pgp = pgPromise();
export const pool = pgp(process.env.POSTGRES_URI);
