import express from "express";
import dotenv from "dotenv";
import { Controller } from "./controllers/controller.js";
import { Service } from "./services/service.js";
import { Repository } from "./repositories/repository.js";
import { pool } from "./DB/db.js";

const repository = new Repository();
const service = new Service(repository);
const controller = new Controller(service);

dotenv.config();

const app = express();

app.use(express.json());

// Bind controller method to the instance
app.get(
  "/api/v0.1/available-countries",
  controller.getAvailableCountries.bind(controller)
);

app.get(
  "/api/v0.1/country-info/full/:countryCode",
  controller.getFullCountryInfo.bind(controller)
);

app.get(
  "/api/v0.1/country-info/population/:countryCode",
  controller.getCountryPopulationInfo.bind(controller)
);

app.get(
  "/api/v0.1/country-info/flag/:countryCode",
  controller.getCountryFlagImg.bind(controller)
);

app.post(
  "/users/:userId/calendar/holidays",
  controller.addCountryHolidaysToCalendar.bind(controller)
);

pool.connect();
pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("DB connection error:", err));
