MATRIMONY ANALYTICS PLATFORM
03 | BUSINESS ANALYSIS
    
Objective
---------
Translating a 500,000-user application dataset into actionable business
questions covering customer behavior, membership performance, revenue,
engagement, geography, and profile activity.

Analytical Philosophy
---------------------
The objective is to determine:
    • What is happening?
    • How large is the effect?
    • Which segments behave differently?
    • What patterns could matter to a product or commercial team?
-----
This file intentionally focuses on foundational and intermediate SQL.

Techniques used:
    • Filtering
    • Aggregation
    • GROUP BY
    • HAVING
    • JOINs
    • DISTINCT
    • ORDER BY
    • LIMIT
    • Date/time filtering where applicable

Q01 | PLATFORM SIZE & GEOGRAPHIC COVERAGE
===============================================================================

Business Question
-----------------
How many users are in the platform, and how many unique cities are represented?

Analytical Objective
--------------------
Establish the overall size of the user base and the geographic coverage of
the synthetic platform.

SQL Approach
------------
Count all user records and count distinct cities.

===============================================================================
*/

SELECT
    COUNT(*) AS total_users,
    COUNT(DISTINCT city) AS unique_cities
FROM raw_users;


/*
Result
------
Total users:   500,000
Unique cities: 15

Business Insight
-----------------
The dataset represents a 500,000-user platform distributed across 15 cities,
providing a broad geographic base for subsequent location-based analysis.
*/


-- ============================================================================
-- Q02 | TOP 10 CITIES BY USER POPULATION
-- ============================================================================

/*
Business Question
-----------------
Which 10 cities have the largest user populations?

Analytical Objective
--------------------
Identify the platform's largest geographic user markets by user volume.

SQL Approach
------------
Group users by city, count the users in each city, sort the results in
descending order, and return the ten largest populations.

===============================================================================
*/

SELECT
    city,
    COUNT(*) AS user_count
FROM raw_users
GROUP BY city
ORDER BY user_count DESC
LIMIT 10;


/*
Result
------
The largest user populations are concentrated in:

1. Delhi
2. London
3. Toronto
4. Hyderabad
5. Bengaluru
6. Kolkata
7. Helsinki
8. Dhaka
9. Ahmedabad
10. ...

Business Insight
-----------------
Delhi represents the largest user market in the dataset, with 33,665 users.
The distribution provides a useful basis for comparing engagement,
membership adoption, and revenue across geographic markets.
*/


-- ============================================================================
-- Q03 | VERIFICATION RATE
-- ============================================================================

/*
Business Question
-----------------
What percentage of the total user base is verified?

Analytical Objective
--------------------
Measure the proportion of users who have completed the platform's verification
process.

SQL Approach
------------
Count verified users using a conditional aggregate and divide by the total
number of users. FILTER is used instead of CASE so that this analysis remains
within the foundational SQL scope of this file.

===============================================================================
*/

SELECT
    COUNT(*) FILTER (WHERE verified = 'true') AS verified_users,
    COUNT(*) AS total_users,
    ROUND(
        COUNT(*) FILTER (WHERE verified = 'true') * 100.0
        / COUNT(*),
        2
    ) AS verified_percentage
FROM raw_users;


/*
Result
------
Verified users:      359,771
Total users:         500,000
Verification rate:   71.95%

Business Insight
-----------------
Approximately 72% of users are verified, indicating that verification covers
a substantial majority of the platform's user base while leaving a meaningful
segment of users who have not completed verification.

