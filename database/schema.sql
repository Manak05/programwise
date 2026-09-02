-- ============================================================
-- ProgramWise Database Schema
-- Independent demo project inspired by the general problem of
-- comparing online education programs. NOT affiliated with,
-- and does not use any proprietary data/branding from, GradRight.
-- ============================================================

DROP DATABASE IF EXISTS programwise;
CREATE DATABASE programwise;
USE programwise;

-- ------------------------------------------------------------
-- USERS
-- ------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- UNIVERSITIES
-- ------------------------------------------------------------
CREATE TABLE universities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PROVIDERS
-- ------------------------------------------------------------
CREATE TABLE providers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- CAREER GOALS
-- ------------------------------------------------------------
CREATE TABLE career_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- PROGRAMS
-- ------------------------------------------------------------
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    university_id INT NOT NULL,
    provider_id INT NOT NULL,
    category_id INT NOT NULL,
    description TEXT,
    fee DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    duration_months INT NOT NULL,
    delivery_mode ENUM('Online', 'Hybrid') NOT NULL DEFAULT 'Online',
    experience_level ENUM('Beginner', 'Intermediate', 'Experienced') NOT NULL DEFAULT 'Beginner',
    prerequisites TEXT,
    outcomes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_programs_university FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT fk_programs_provider FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    CONSTRAINT fk_programs_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_programs_active ON programs(is_active);
CREATE INDEX idx_programs_category ON programs(category_id);
CREATE INDEX idx_programs_fee ON programs(fee);

-- ------------------------------------------------------------
-- USER PREFERENCES (multiple profiles per user)
-- ------------------------------------------------------------
CREATE TABLE user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    profile_name VARCHAR(100) NOT NULL DEFAULT 'My Preferences',
    career_goal VARCHAR(100),
    budget VARCHAR(50),
    available_hours VARCHAR(50),
    experience_level ENUM('Beginner', 'Intermediate', 'Experienced'),
    delivery_preference ENUM('Online', 'Hybrid'),
    preferred_duration VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_prefs_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_prefs_user ON user_preferences(user_id);

-- ------------------------------------------------------------
-- PROGRAM_CAREER_GOALS (many-to-many junction table)
-- ------------------------------------------------------------
CREATE TABLE program_career_goals (
    program_id INT NOT NULL,
    career_goal_id INT NOT NULL,
    PRIMARY KEY (program_id, career_goal_id),
    CONSTRAINT fk_pcg_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    CONSTRAINT fk_pcg_goal FOREIGN KEY (career_goal_id) REFERENCES career_goals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- SAVED_PROGRAMS (many-to-many junction table)
-- ------------------------------------------------------------
CREATE TABLE saved_programs (
    user_id INT NOT NULL,
    program_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, program_id),
    CONSTRAINT fk_saved_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_saved_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
) ENGINE=InnoDB;
