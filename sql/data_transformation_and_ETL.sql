MATRIMONY ANALYTICS PLATFORM
02 | DATA TRANSFORMATION & ETL

Objective
---------
Integrating 500,000 synthetic user names into the primary user dataset through
a controlled staging-and-transformation workflow.

ETL Strategy
------------
Incoming name data is first isolated in a staging table (`name_import`).
Before modifying the target dataset, the staging data is validated against
the expected record count and the primary key used for integration.

Transformation Key
-------------------
`user_id`

Workflow
--------
Source Data
    ↓
Staging Table
    ↓
Key & Record Validation
    ↓
JOIN-based Transformation
    ↓
Post-Transformation Validation

Validation principle
--------------------
The target table is modified only after the staging data has been verified
to contain the expected population and valid user identifiers.

The transformation is considered successful only when:
    • 500,000 staging records are present
    • 500,000 distinct user IDs are present
    • 500,000 records successfully match the target table
    • First and last names are fully populated
    • 500,000 unique full-name combinations are present

===============================================================================
*/


-- ============================================================================
-- 01. Validating staging-table population
-- ============================================================================

SELECT COUNT(*) AS staging_records
FROM name_import;


-- ============================================================================
-- 02. Validating user ID uniqueness in the staging data
-- ============================================================================

SELECT COUNT(DISTINCT user_id) AS unique_user_ids
FROM name_import;


-- ============================================================================
-- 03. Validating the JOIN before modifying the target table
-- ============================================================================

SELECT COUNT(*) AS matched_records
FROM raw_users AS u
JOIN name_import AS n
    ON u.user_id = n.user_id;


/*
Expected validation:

    staging_records  → 500,000
    unique_user_ids  → 500,000
    matched_records  → 500,000

Only after these checks pass is the transformation performed.
*/


-- ============================================================================
-- 04. JOIN-based data transformation
-- ============================================================================

UPDATE raw_users AS u
SET
    first_name = n.first_name,
    last_name = n.last_name
FROM name_import AS n
WHERE u.user_id = n.user_id;


/*
Transformation logic:

    name_import.user_id = raw_users.user_id
                  ↓
          identify matching user
                  ↓
       transfer first_name
       transfer last_name
*/


-- ============================================================================
-- 05. Validating target-table completeness
-- ============================================================================

SELECT COUNT(*) AS populated_names
FROM raw_users
WHERE first_name IS NOT NULL
  AND last_name IS NOT NULL;

-- ============================================================================
-- 06. Validating full-name uniqueness
-- ============================================================================

SELECT COUNT(DISTINCT first_name || ' ' || last_name) AS unique_full_names
FROM raw_users;

Final state:

    populated_names   → 500,000
    unique_full_names → 500,000

Result:
    500,000 / 500,000 records successfully transformed.
