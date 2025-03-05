import { HttpError } from "../classes/http-error.js";

const COUNTRY_CODE_REGEX = /^[A-Z]{2,3}$/;

export class Controller {
  constructor(Service) {
    this.service = Service;
  }

  async getAvailableCountries(req, res) {
    try {
      const availableCountries = await this.service.getAvailableCountries();

      if (!availableCountries) {
        return res.status(404).json({ message: "No available countries" });
      }

      res.status(200).json(availableCountries);
    } catch (error) {
      if (error instanceof HttpError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
      }
    }
  }

  async getFullCountryInfo(req, res) {
    const { countryCode } = req.params;
    try {
      if (!COUNTRY_CODE_REGEX.test(countryCode)) {
        return res.status(400).json({ message: "Invalid country code" });
      }

      const countryInfo = await this.service.getFullCountryInfo(countryCode);

      if (!countryInfo) {
        return res.status(404).json({ message: "No country info found" });
      }

      res.status(200).json(countryInfo);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
        console.error(err);
      }
    }
  }

  async getCountryPopulationInfo(req, res) {
    const { countryCode } = req.params;
    try {
      if (!COUNTRY_CODE_REGEX.test(countryCode)) {
        return res.status(400).json({ message: "Invalid country code" });
      }

      const populationInfo = await this.service.getCountryPopulationInfo(
        countryCode
      );

      if (!populationInfo) {
        return res.status(404).json({ message: "No population info found" });
      }

      res.status(200).json(populationInfo);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
        console.error(err);
      }
    }
  }

  async getCountryFlagImg(req, res) {
    const { countryCode } = req.params;
    try {
      if (!COUNTRY_CODE_REGEX.test(countryCode)) {
        return res.status(400).json({ message: "Invalid country code" });
      }

      const flagUrl = await this.service.getCountryFlagImg(countryCode);

      if (!flagUrl) {
        return res.status(404).json({ message: "No flag image found" });
      }

      res.status(200).redirect(flagUrl);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
        console.error(err);
      }
    }
  }

  async addCountryHolidaysToCalendar(req, res) {
    const { userId } = req.params;
    const { countryCode, year, holidays } = req.body;

    try {
      if (!COUNTRY_CODE_REGEX.test(countryCode)) {
        return res.status(400).json({ message: "Invalid country code" });
      }

      if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        return res.status(400).json({ message: "Invalid year" });
      }

      if (
        holidays &&
        (!Array.isArray(holidays) ||
          holidays.some((h) => typeof h !== "string"))
      ) {
        return res.status(400).json({ message: "Invalid holiday data" });
      }

      const result = await this.service.addCountryHolidaysToCalendar(
        userId,
        countryCode,
        year,
        holidays
      );

      res.status(200).json(result);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal server error" });
        console.error(err);
      }
    }
  }
}
