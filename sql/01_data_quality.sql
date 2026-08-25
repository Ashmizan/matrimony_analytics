MATRIMONY ANALYTICS PLATFORM
01 | DATA QUALITY & SCHEMA VALIDATION
===============================================================================

Objective
---------
Validate the integrity of the 500,000-record application dataset before
downstream analysis.

Validation areas
----------------
• Record and key integrity
• Missing data
• Categorical completeness
• Schema consistency
• Import validation

CASE STUDY — Schema mismatch during CSV ingestion
--------------------------------------------------
During the initial CSV import, PostgreSQL interpreted the `religion` column
as VARCHAR[] instead of the intended scalar VARCHAR(50).

The resulting import error was traced to the schema using PostgreSQL's
information_schema metadata.

Resolution:
    VARCHAR[] → VARCHAR(50)

This illustrates a core ETL principle:

    Successful ingestion ≠ validated data.

Both the data and its underlying schema must be verified before analysis.

Analytical principle
--------------------
Missing data is not automatically treated as a real-world condition.
For example, a NULL profession indicates missing information — not
unemployment.

Database
--------
PostgreSQL
===============================================================================

-- ============================================================================
-- 01. Establishing the dataset baseline
-- ============================================================================

SELECT COUNT(*) AS total_users
FROM raw_users;


-- ============================================================================
-- 02. Validating user ID uniqueness
-- ============================================================================

SELECT
    user_id,
    COUNT(*) AS occurrences
FROM raw_users
GROUP BY user_id
HAVING COUNT(*) > 1;


-- ============================================================================
-- 03. Investigating missing profession data
-- ============================================================================

SELECT COUNT(*) AS missing_profession
FROM raw_users
WHERE profession IS NULL;


-- ============================================================================
-- 04. Assessing verification coverage
-- ============================================================================

SELECT
    verified,
    COUNT(*) AS user_count
FROM raw_users
GROUP BY verified
ORDER BY user_count DESC;


-- ============================================================================
-- 05. Assessing membership distribution
-- ============================================================================

SELECT
    membership_plan,
    COUNT(*) AS user_count
FROM raw_users
GROUP BY membership_plan
ORDER BY user_count DESC;


-- ============================================================================
-- 06. Inspecting the religion column schema
-- ============================================================================

SELECT
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_name = 'raw_users'
  AND column_name = 'religion';


/*
Expected schema:
    religion | character varying | varchar

The column was initially detected as:
    religion | ARRAY | _varchar

The schema was corrected before the dataset was re-imported and
validated for downstream analysis.
