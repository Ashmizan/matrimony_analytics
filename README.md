# Matrimony Analytics Platform — Full-Stack PostgreSQL & SQL Analytics

A realistic, end-to-end 500,000-user synthetic matrimony-platform analytics project built with PostgreSQL, SQL, Node.js, Express, React, and Power BI.

The project simulates the data ecosystem behind a modern matrimonial application—from user accounts and profiles to memberships, payments, profile engagement, interests, and matching behavior.

The project combines **data engineering, SQL analytics, backend API development, frontend development, and business intelligence** into a single end-to-end portfolio project.

## Project Overview

The Matrimony Analytics Platform is a realistic, end-to-end **500,000-user synthetic analytics and full-stack application project**.

The project simulates the data ecosystem behind a modern matrimonial application, covering areas such as:

* User accounts
* Demographics
* Profiles
* Memberships
* Membership pricing
* Membership duration
* Profile engagement
* Interests
* Matches
* Geographic information
* Verification
* Revenue-related analysis

Rather than treating SQL as a collection of isolated queries, this project focuses on how application data can be:

**structured → transformed → validated → analyzed → exposed through an API → presented through a frontend → communicated through dashboards**

The project demonstrates practical analytical thinking, relational database skills, data transformation, backend development, frontend development, and business-oriented SQL analysis.

---

# Full-Stack Architecture

The completed project follows an end-to-end architecture:

```text
                    PostgreSQL
                        ↓
                 500,000 Users
                        ↓
             Data Quality & ETL
                        ↓
             SQL Analytical Layer
                        ↓
              Business Analysis
                        ↓
              Node.js + Express
                        ↓
                     REST API
                        ↓
                    React
                        ↓
              Functional Web UI
                        ↓
                  Power BI
```

The project therefore combines both **analytical and application-oriented development**.

### Technology Stack

| Layer                   | Technology          |
| ----------------------- | ------------------- |
| Database                | PostgreSQL          |
| Query Language          | SQL                 |
| Backend                 | Node.js             |
| API Framework           | Express.js          |
| Frontend                | React               |
| Frontend Build Tool     | Vite                |
| Styling                 | CSS / React styling |
| Business Intelligence   | Power BI            |
| Development Environment | Visual Studio Code  |
| Version Control         | GitHub              |

---

# Dataset

The project contains 500,000 synthetic user records representing a global matrimonial platform.

The dataset includes information relating to:

* User IDs
* Created dates
* First and last names
* Age
* Gender
* City
* Country
* Education
* Profession
* Religion
* Mother tongue
* Marital status
* Height
* Annual income
* Profile completion
* Verification status
* Membership plans
* Membership pricing
* Membership duration
* Membership start and end dates
* Profile views
* Interests sent
* Interests received
* Matches

The dataset intentionally contains selected missing values and imperfect structures to create realistic data-quality, transformation, and validation challenges.

**All data is synthetic and created exclusively for educational and portfolio purposes.**

---

# Data Transformation & ETL

One of the project's major transformations involved integrating **500,000 unique synthetic first and last names** into the existing user dataset.

### Transformation Workflow

```text
500,000 Raw Users
        +
500,000 Name Records
        ↓
   Staging Table
        ↓
 Validate user_id
        ↓
   JOIN on user_id
        ↓
 Updated User Dataset
        ↓
Post-Transformation Validation
```

A dedicated `name_import` staging table was created to receive the incoming name data.

Before modifying the primary dataset, the transformation was validated by checking:

* Total staging records
* Distinct `user_id` values
* Successful user-to-name matches
* Final population of first and last names
* Uniqueness of complete names

The transformation successfully matched **500,000 out of 500,000 records**, resulting in a fully populated user dataset containing 500,000 unique full-name combinations.

Example transformation:

```sql
UPDATE raw_users AS u
SET
    first_name = n.first_name,
    last_name = n.last_name
FROM name_import AS n
WHERE u.user_id = n.user_id;
```

This demonstrates a practical ETL workflow involving staging tables, key-based joins, controlled data transformation, and post-transformation validation.

---

# Data Quality Investigation

Before conducting business analysis, the raw dataset was investigated for potential quality issues.

Initial investigations included:

* Duplicate user IDs
* Missing profession information
* Verification completeness
* Membership distribution
* Geographic distribution
* Potentially inconsistent categorical values
* Completeness of transformed fields

For example, the analysis identified **6,089 users with missing profession information**.

Importantly, missing profession data was not interpreted as unemployment.

A missing value simply indicates that the profession was not recorded. It does not establish a user's employment status.

This distinction is maintained throughout the analysis to avoid drawing unsupported conclusions from incomplete data.

---

# SQL & Business Analysis

The database was used to answer realistic product, customer, engagement, membership, and revenue questions.

Examples include:

* Which membership plans have the largest user bases?
* Which membership plans generate the most revenue?
* How does premium membership distribution vary across the platform?
* Which cities contain the largest user populations?
* How active are users in different locations?
* How does Helsinki compare with the overall platform average?
* Which users have the highest profile engagement?
* How does profile activity vary within cities?
* Which membership categories contribute the greatest revenue?

The project incorporates advanced SQL techniques including:

* `SELECT`
* `WHERE`
* `ORDER BY`
* `DISTINCT`
* Aggregate functions
* `GROUP BY`
* `HAVING`
* `CASE`
* Multi-table `JOIN`
* Subqueries
* Correlated subqueries
* Common Table Expressions
* Window functions
* `ROW_NUMBER()`
* `RANK()`
* `DENSE_RANK()`
* `PARTITION BY`
* `SUM() OVER()`
* `AVG() OVER()`
* `LAG()`
* `LEAD()`

---

# Example Window-Function Analysis

Users can be ranked according to their profile views within their respective cities:

```sql
RANK() OVER (
    PARTITION BY city
    ORDER BY profile_views_30d DESC
)
```

This makes it possible to answer questions such as:

> Who are the most-viewed profiles within each city?

Rather than ranking every user globally, `PARTITION BY` creates independent analytical groups, allowing users within each city to be compared against other users in the same city.

This demonstrates how window functions can be used to perform segmented behavioral analysis without collapsing individual records.

---

# Membership Analysis

The platform contains six membership categories:

| Membership Plan | Price (INR) |  Duration |
| --------------- | ----------: | --------: |
| Free            |          ₹0 |      Free |
| Gold            |      ₹4,999 |  3 months |
| Gold Plus       |      ₹6,999 |  3 months |
| Diamond         |      ₹8,999 |  6 months |
| Diamond Plus    |     ₹11,999 |  6 months |
| Platinum Plus   |     ₹15,999 | 12 months |

Membership information is stored directly in the PostgreSQL user dataset and includes:

* Membership plan
* Membership price
* Membership duration
* Membership start date
* Membership end date

The application retrieves membership information through the backend and displays the available plans through the React frontend.

---

# Backend Development

A lightweight backend was developed using **Node.js and Express.js**.

The backend provides an API layer between the React frontend and PostgreSQL database.

### Backend Architecture

```text
React Frontend
      ↓
Express REST API
      ↓
Node.js
      ↓
PostgreSQL
```

The backend establishes a PostgreSQL connection using the `pg` package and exposes API endpoints for application data and analytical results.

### Main API Routes

#### Users

```text
GET /api/users
```

Retrieves user records from the PostgreSQL `raw_users` table.

#### Membership Plans

```text
GET /api/membership-plans
```

Returns membership-level information including:

* Membership plan
* Number of users
* Membership price
* Membership duration

The membership information is aggregated directly from PostgreSQL using SQL.

#### Analytics

```text
GET /api/analytics
```

Executes the project's analytical SQL logic through the backend and returns analytical results through the API.

This demonstrates how SQL analysis can be integrated into an application rather than existing only as standalone database queries.

---

# Frontend Development

A functional frontend was developed using React.

The frontend provides a visual interface for the matrimonial application and communicates with the Node.js backend.

The application includes:

* Matrimony landing page
* User search interface
* Profile presentation
* Navigation
* Membership section
* Membership plan cards
* Membership pricing
* Membership duration
* Membership user counts
* Functional backend-connected components

The membership section presents the six available plans:

```text
Free
Gold
Gold Plus
Diamond
Diamond Plus
Platinum Plus
```

Each plan displays relevant information such as:

* Plan name
* Price
* Duration
* Number of members
* Plan selection interface

The frontend therefore demonstrates how database-driven information can be retrieved through an API and translated into a user-facing application interface.

---

# API + Database Integration

The project demonstrates the complete flow of information:

```text
PostgreSQL
    ↓
SQL Query
    ↓
Node.js / Express
    ↓
REST API
    ↓
React
    ↓
User Interface
```

For example, membership data is stored in PostgreSQL, aggregated through SQL, returned by the Express API, and displayed as membership cards in the React frontend.

This creates a practical connection between **data analysis and application development**.

---

# Power BI Analysis

Power BI was used to transform the SQL analysis into interactive business intelligence.

The dashboard focuses on areas such as:

## Executive Overview

* Total users
* Verified users
* Premium users
* Revenue
* Engagement metrics

## Membership & Revenue

* Membership distribution
* Revenue by membership plan
* Premium conversion
* Membership performance

## User Engagement

* Profile views
* Interests sent and received
* Matches
* Engagement by location
* High-engagement user segments

## Matching Analysis

* User engagement funnel
* Interest-to-match behavior
* Geographic patterns
* High-engagement segments
* Potential conversion opportunities

The objective is to move from raw SQL outputs to decision-ready business intelligence.

---

# Project Structure

The project is organized around the analytical database, backend, frontend, SQL analysis, and Power BI components.

```text
matrimony_analytics/
│
├── backend/
│   └── server.cjs
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── sql/
│   └── SQL analysis queries
│
├── power bi/
│   └── Power BI dashboard
│
└── README.md
```

---

# Full-Stack Application Flow

The completed project can be viewed as two connected layers.

### Analytical Layer

```text
500,000 User Records
        ↓
PostgreSQL
        ↓
Data Quality Investigation
        ↓
ETL / Transformation
        ↓
SQL Analysis
        ↓
Power BI
```

### Application Layer

```text
PostgreSQL
        ↓
Node.js
        ↓
Express API
        ↓
React
        ↓
Matrimony Web Interface
```

Together, these layers demonstrate how a data-driven application can connect its operational database, analytical layer, backend services, frontend interface, and business intelligence environment.

---

# Project Goal

The goal of this project is not simply to demonstrate the ability to write SQL queries.

Instead, it demonstrates an **end-to-end data and application development mindset**:

```text
Understand the application data
          ↓
Identify the underlying data structure
          ↓
Investigate data quality
          ↓
Transform and validate the data
          ↓
Model relationships
          ↓
Analyze business questions
          ↓
Generate meaningful insights
          ↓
Expose analytical data through an API
          ↓
Build a functional frontend
          ↓
Communicate findings through visualization
```

The matrimonial-platform domain provides an engaging and feature-rich environment for the project, while the underlying technical and analytical skills are transferable across a wide range of industries.

---

# Transferable Skills Demonstrated

The project demonstrates skills relevant to:

* Data Analytics
* SQL Analytics
* PostgreSQL
* Data Cleaning
* ETL / Data Transformation
* Relational Data Modeling
* Business Intelligence
* Power BI
* Backend API Development
* Node.js
* Express.js
* React
* REST APIs
* Data-driven UI development
* Analytical Problem Solving

These skills can be applied across industries including:

* Hospitality
* E-commerce
* SaaS
* FinTech
* Marketplaces
* Subscription businesses
* Consumer applications
* Travel
* Other data-driven organizations

---

# Final Project Summary

This project brings together a complete analytical and application workflow around a synthetic 500,000-user matrimonial platform.

It combines:

**PostgreSQL** for data storage and relational analysis
**SQL** for transformation and business analysis
**Node.js + Express** for backend/API development
**React** for the interactive frontend
**Power BI** for business intelligence and visualization

All user data is synthetic and the project is intended exclusively for educational and portfolio purposes.

## Full-Stack Development — A Curiosity-Driven Extension

The full-stack component of this project was added as an extension of the core analytics work, driven primarily by curiosity about how a real data-driven web application connects its database, backend, and frontend.

This project is not intended to represent me as a full-stack developer. My primary focus in this project remains:

- SQL
- PostgreSQL
- Data transformation
- Data quality
- Business analysis
- Data analytics
- Power BI

The Node.js, Express, and React components were developed to explore how the analytical database could interact with a functional web application.

Through this extension, I wanted to understand the practical flow of:

```text
PostgreSQL
    ↓
SQL
    ↓
Node.js / Express API
    ↓
React
    ↓
Web Interface
