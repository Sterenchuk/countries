import { pool } from "../DB/db.js";

export class Repository {
  async saveHolidays(userId, countryCode, year, holidays) {
    const upsertQuery = `
      INSERT INTO user_calendar (user_id, country_code, year, holiday_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, country_code, year, holiday_name) 
      DO UPDATE SET holiday_name = EXCLUDED.holiday_name;
    `;

    for (const holiday of holidays) {
      await pool.query(upsertQuery, [userId, countryCode, year, holiday]);
    }

    return { message: "Holidays added or updated successfully" };
  }
}
