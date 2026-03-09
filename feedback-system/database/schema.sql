-- ============================================================
-- Customer Feedback Management System — Database Schema
-- Run this file once to set up your MySQL database
-- Usage: mysql -u root -p < schema.sql
-- ============================================================

-- Create and select the database
CREATE DATABASE IF NOT EXISTS feedback_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE feedback_db;

-- Drop table if re-running
DROP TABLE IF EXISTS feedbacks;

-- Main feedbacks table
CREATE TABLE feedbacks (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name                VARCHAR(120)    NOT NULL,
  email               VARCHAR(255)    NOT NULL,
  message             TEXT            NOT NULL,

  -- Sentiment analysis results (VADER)
  sentiment_label     ENUM('Positive','Negative','Neutral') NOT NULL DEFAULT 'Neutral',
  sentiment_compound  DECIMAL(6,4)    NOT NULL DEFAULT 0.0000,
  sentiment_positive  DECIMAL(6,4)    NOT NULL DEFAULT 0.0000,
  sentiment_negative  DECIMAL(6,4)    NOT NULL DEFAULT 0.0000,
  sentiment_neutral   DECIMAL(6,4)    NOT NULL DEFAULT 0.0000,

  created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_sentiment_label (sentiment_label),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------
-- Optional: seed sample data for testing
-- -------------------------------------------------------
INSERT INTO feedbacks (name, email, message, sentiment_label, sentiment_compound, sentiment_positive, sentiment_negative, sentiment_neutral) VALUES
('Alice Johnson',  'alice@example.com',  'Absolutely love your service! Everything works perfectly and the support team is amazing.',  'Positive',  0.8779, 0.4820, 0.0000, 0.5180),
('Bob Martinez',   'bob@example.com',    'The product is okay but delivery was really slow and packaging was damaged.',                  'Negative', -0.4215, 0.0000, 0.2280, 0.7720),
('Carol White',    'carol@example.com',  'I received my order today. It came in a box.',                                                 'Neutral',   0.0000, 0.0000, 0.0000, 1.0000),
('David Kim',      'david@example.com',  'Fantastic experience from start to finish! Will definitely order again.',                     'Positive',  0.7650, 0.4530, 0.0000, 0.5470),
('Eva Chen',       'eva@example.com',    'Terrible customer service. Nobody responded to my emails for two weeks.',                     'Negative', -0.6597, 0.0000, 0.3420, 0.6580);

-- Verify data
SELECT id, name, sentiment_label, sentiment_compound FROM feedbacks;
