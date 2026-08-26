const path = require("path");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

// Load backend/.env
process.loadEnvFile(path.join(__dirname, ".env"));

const app = express();

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)
});

// Test database connection
pool.query("SELECT 1")
    .then(() => {
        console.log("PostgreSQL connected successfully!");
    })
    .catch((error) => {
        console.error("PostgreSQL connection error:");
        console.error(error.message);
    });

// Home route
app.get("/", (req, res) => {
    res.send("Matrimony backend is working ❤️");
});

// Users route
app.get("/api/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM raw_users LIMIT 10"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Database query error:");
        console.error(error.message);

        res.status(500).json({
            error: error.message
        });
    }
});
// Membership Plans
app.get("/api/membership-plans", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        membership_plan,
        COUNT(*) AS users,
        MIN(membership_price_inr) AS price,
        MIN(membership_duration_months) AS duration_months
      FROM raw_users
      GROUP BY membership_plan
      ORDER BY MIN(membership_price_inr);
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Membership query error:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});
// BUSINESS ANALYTICS
app.get("/api/analytics", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                membership_plan,

                COUNT(*) AS total_users,

                SUM(membership_price_inr) AS total_revenue,

                ROUND(AVG(membership_price_inr), 2)
                    AS average_membership_price,

                ROUND(AVG(profile_views_30d), 2)
                    AS average_profile_views,

                ROUND(AVG(interests_sent_30d), 2)
                    AS average_interests_sent,

                ROUND(AVG(interests_received_30d), 2)
                    AS average_interests_received,

                ROUND(AVG(matches_30d), 2)
                    AS average_matches

            FROM raw_users

            GROUP BY membership_plan

            ORDER BY total_revenue DESC;
        `);

        res.json(result.rows);

    } catch (error) {
        console.error("Analytics query error:");
        console.error(error.message);

        res.status(500).json({
            error: error.message
        });
    }
});
// Start server
app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
