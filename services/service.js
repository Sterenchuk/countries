import fetch from "node-fetch";
import { HttpError } from "../classes/http-error.js";

export class Service {
  constructor(rep) {
    this.repository = rep;
  }

  async getAvailableCountries() {
    try {
      const availableCountriesResponse = await fetch(
        "https://date.nager.at/api/v3/AvailableCountries"
      );

      if (!availableCountriesResponse.ok) {
        throw new HttpError(
          "Error accessing API",
          availableCountriesResponse.statusCode
        );
      }

      const availableCountries = await availableCountriesResponse.json();
      return availableCountries;
    } catch (e) {
      throw new Error("Failed to fetch available countries");
    }
  }

  async getFullCountryInfo(countryCode) {
    try {
      const countryInfoResponse = await fetch(
        `https://date.nager.at/api/v3/CountryInfo/${countryCode}`
      );

      if (!countryInfoResponse.ok) {
        throw new HttpError(
          "Error accessing API",
          countryInfoResponse.statusCode
        );
      }

      const countryInfo = await countryInfoResponse.json();
      return countryInfo;
    } catch (error) {
      if (error instanceof HttpError) {
        return null;
      }
      throw new Error("Failed to fetch population information");
    }
  }

  async getCountryPopulationInfo(countryCode) {
    try {
      const countryInfo = await this.getFullCountryInfo(countryCode);
      const countryName = countryInfo.commonName;

      const populationInfoResponse = await fetch(
        "https://countriesnow.space/api/v0.1/countries/population",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: countryName }),
        }
      );
      if (!populationInfoResponse.ok) {
        throw new HttpError(
          "Error accessing API",
          populationInfoResponse.statusCode
        );
      }

      const populationInfo = await populationInfoResponse.json();
      return populationInfo;
    } catch (error) {
      if (error instanceof HttpError) {
        return null;
      }
      throw new Error("Failed to fetch population information");
    }
  }

  async getCountryFlagImg(countryCode) {
    try {
      const countryImgResponse = await fetch(
        "https://countriesnow.space/api/v0.1/countries/flag/images",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ iso2: countryCode }),
        }
      );
      const countryData = await countryImgResponse.json();
      if (countryData.error) {
        throw new HttpError("No flag image found", 404);
      }

      const flagURL = countryData.data.flag;
      if (!flagURL) {
        throw new HttpError("No flag image found", 404);
      }

      return flagURL;
    } catch (error) {
      if (error instanceof HttpError) {
        return null;
      }
      throw new Error("Failed to fetch population information");
    }
  }

  async addCountryHolidaysToCalendar(userId, countryCode, year, holidays) {
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`
      );

      if (!response.ok) {
        throw new HttpError(
          "Error accessing API for public holidays",
          response.status
        );
      }

      const allHolidays = await response.json();

      // Filter if specific holidays are provided, else store all
      const selectedHolidays = holidays?.length
        ? allHolidays.filter((h) =>
            holidays.some(
              (holiday) =>
                h.name.includes(holiday) || h.localName.includes(holiday)
            )
          )
        : allHolidays;

      if (selectedHolidays.length === 0) {
        throw new HttpError(404, "No matching holidays found");
      }

      return this.repository.saveHolidays(
        userId,
        countryCode,
        year,
        selectedHolidays
      );
    } catch (error) {
      if (error instanceof HttpError) {
        throw error; // Propagate HTTP errors
      }
      throw new Error(`Failed to add holidays to calendar: ${error.message}`);
    }
  }
}
