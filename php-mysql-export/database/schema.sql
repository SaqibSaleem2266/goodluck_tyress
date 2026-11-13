-- GOOD LUCK TYRES | Relational MySQL Database Schema (InnoDB)
-- Complete 22 Normalized Tables with Foreign Keys, Cascades & Indexes

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('superadmin', 'manager', 'viewer') DEFAULT 'superadmin',
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Permissions Table
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `module` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Admin Roles Junction Table
CREATE TABLE IF NOT EXISTS `admin_roles` (
  `admin_id` INT UNSIGNED NOT NULL,
  `role_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`admin_id`, `role_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Brands Table
CREATE TABLE IF NOT EXISTS `brands` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `logo` VARCHAR(255) NULL,
  `cover_image` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `website_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_brand_slug` (`slug`),
  INDEX `idx_brand_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `image` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category_slug` (`slug`),
  INDEX `idx_category_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Applications Table
CREATE TABLE IF NOT EXISTS `applications` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Tyres (Products) Table
CREATE TABLE IF NOT EXISTS `tyres` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  `brand_id` VARCHAR(50) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `application` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `size` VARCHAR(50) NOT NULL,
  `width` VARCHAR(50) NULL,
  `aspect_ratio` VARCHAR(50) NULL,
  `rim_diameter` VARCHAR(50) NULL,
  `load_index` VARCHAR(50) NULL,
  `speed_rating` VARCHAR(50) NULL,
  `ply_rating` VARCHAR(50) NULL,
  `construction_type` ENUM('Radial', 'Bias', 'Solid') DEFAULT 'Radial',
  `tread_pattern` VARCHAR(100) NULL,
  `main_image` VARCHAR(255) NOT NULL,
  `pdf_datasheet` VARCHAR(255) NULL,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 5,
  `stock_status` ENUM('in_stock', 'out_of_stock', 'on_order') DEFAULT 'in_stock',
  `availability_date` DATE NULL,
  `publishing_status` ENUM('published', 'draft', 'unpublished') DEFAULT 'published',
  `is_featured` TINYINT(1) DEFAULT 0,
  `display_order` INT DEFAULT 0,
  `seo_title` VARCHAR(255) NULL,
  `seo_description` TEXT NULL,
  `slug` VARCHAR(250) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_tyre_brand` (`brand_id`),
  INDEX `idx_tyre_category` (`category_id`),
  INDEX `idx_tyre_size` (`size`),
  INDEX `idx_tyre_status` (`stock_status`, `publishing_status`),
  INDEX `idx_tyre_slug` (`slug`),
  FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Tyre Gallery Images Table
CREATE TABLE IF NOT EXISTS `tyre_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tyre_id` VARCHAR(50) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(200) NULL,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tyre_id`) REFERENCES `tyres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Tyre Technical Specifications Key-Value Table
CREATE TABLE IF NOT EXISTS `tyre_specifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tyre_id` VARCHAR(50) NOT NULL,
  `spec_key` VARCHAR(100) NOT NULL,
  `spec_value` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`tyre_id`) REFERENCES `tyres`(`id`) ON DELETE CASCADE,
  INDEX `idx_spec_tyre` (`tyre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Inventory Current Snapshot Table
CREATE TABLE IF NOT EXISTS `inventory` (
  `tyre_id` VARCHAR(50) PRIMARY KEY,
  `stock_quantity` INT NOT NULL DEFAULT 0,
  `min_stock_alert` INT NOT NULL DEFAULT 5,
  `stock_status` ENUM('in_stock', 'out_of_stock', 'on_order') DEFAULT 'in_stock',
  `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tyre_id`) REFERENCES `tyres`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Inventory Audit History Table
CREATE TABLE IF NOT EXISTS `inventory_history` (
  `id` VARCHAR(60) PRIMARY KEY,
  `tyre_id` VARCHAR(50) NOT NULL,
  `tyre_name` VARCHAR(200) NOT NULL,
  `previous_quantity` INT NOT NULL,
  `new_quantity` INT NOT NULL,
  `change_amount` INT NOT NULL,
  `change_type` ENUM('add', 'reduce', 'adjust', 'initial') NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `admin_user` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_hist_tyre` (`tyre_id`),
  INDEX `idx_hist_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Dealers Table
CREATE TABLE IF NOT EXISTS `dealers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `contact_person` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `whatsapp` VARCHAR(50) NULL,
  `email` VARCHAR(120) NULL,
  `city` VARCHAR(80) NOT NULL,
  `province` VARCHAR(80) NOT NULL,
  `address` TEXT NOT NULL,
  `google_maps_url` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_dealer_city` (`city`),
  INDEX `idx_dealer_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Corporate Clients Table
CREATE TABLE IF NOT EXISTS `corporate_clients` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `logo` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `website_url` VARCHAR(255) NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Enquiries / Quote Requests Table
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` VARCHAR(50) PRIMARY KEY,
  `full_name` VARCHAR(120) NOT NULL,
  `company_name` VARCHAR(150) NULL,
  `email` VARCHAR(150) NULL,
  `phone` VARCHAR(50) NOT NULL,
  `whatsapp` VARCHAR(50) NULL,
  `brand_name` VARCHAR(100) NULL,
  `category_name` VARCHAR(100) NULL,
  `product_name` VARCHAR(200) NULL,
  `tyre_size` VARCHAR(50) NULL,
  `required_quantity` INT NOT NULL DEFAULT 1,
  `city` VARCHAR(100) NOT NULL,
  `message` TEXT NULL,
  `status` ENUM('new', 'contacted', 'quoted', 'completed', 'cancelled') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_enq_status` (`status`),
  INDEX `idx_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Enquiry Notes Table
CREATE TABLE IF NOT EXISTS `enquiry_notes` (
  `id` VARCHAR(50) PRIMARY KEY,
  `enquiry_id` VARCHAR(50) NOT NULL,
  `author` VARCHAR(100) NOT NULL,
  `note` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Downloads / PDF Catalogues Table
CREATE TABLE IF NOT EXISTS `downloads` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `category` VARCHAR(100) NOT NULL,
  `file_url` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(30) NULL,
  `file_type` VARCHAR(50) DEFAULT 'PDF Document',
  `is_published` TINYINT(1) DEFAULT 1,
  `download_count` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. Homepage Banners Table
CREATE TABLE IF NOT EXISTS `banners` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `subtitle` TEXT NULL,
  `badge_text` VARCHAR(100) NULL,
  `cta_text` VARCHAR(80) NULL,
  `cta_link` VARCHAR(200) NULL,
  `secondary_cta_text` VARCHAR(80) NULL,
  `secondary_cta_link` VARCHAR(200) NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Pages CMS Table
CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `content` LONGTEXT NULL,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Navigation Items Table
CREATE TABLE IF NOT EXISTS `navigation_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(80) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `parent_id` INT UNSIGNED NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Website Settings Table
CREATE TABLE IF NOT EXISTS `website_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Activity Logs Table
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(60) PRIMARY KEY,
  `admin_user` VARCHAR(100) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity` VARCHAR(100) NOT NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_log_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
