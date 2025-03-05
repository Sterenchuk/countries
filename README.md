# countries

Test assessment

# Holiday Calendar Project

## Overview

The Holiday Calendar project allows users to store and retrieve holidays for specific countries and years. The application connects to a PostgreSQL database to store holiday data and provides an API to fetch holidays for a particular country and year.

## Features

- Fetch available countries and holiday data from external APIs.
- Add holidays for specific countries and years to the user's calendar.
- Update holiday data if it already exists in the database.
- Use PostgreSQL to store the holiday data.

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **External APIs**:
  - [Nager Date API](https://date.nager.at/) for holiday data.
  - [CountriesNow API](https://countriesnow.space/) for country information and flags.

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/holiday-calendar.git
   cd holiday-calendar

   ```

2. Install the required dependencies:

npm install

3.  Create a PostgreSQL database and a user_calendar table

CREATE TABLE user_calendar (
id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL,
country_code VARCHAR(3) NOT NULL,
year INTEGER NOT NULL,
holiday_name VARCHAR(255) NOT NULL,
CONSTRAINT user_calendar_user_id_country_code_year_holiday_name_key UNIQUE (user_id, country_code, year, holiday_name)
);

Update the database connection settings in countries/.env file with your PostgreSQL credentials.

5. Start the server:

npm start

## API Endpoints

1. GET /available-countries
   Fetch the list of available countries.

2. GET /country-info/:countryCode
   Fetch detailed information about a country using its country code.

3. GET /country-population/:countryCode
   Fetch population information for a specific country.

4. POST /add-holidays/:userId
   Add holidays for a specific user, country, and year to the user's calendar.

request body
{
"countryCode": "US",
"year": 2025,
"holidays": ["Christmas", "New Year's Day"]
}

response {
"message": "Holidays added to calendar successfully"
}
