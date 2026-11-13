# GOOD LUCK TYRES | Production PHP 8+ & MySQL Deployment Guide

This directory contains the complete PHP backend, database schema, and deployment scripts for Good Luck Tyres.

## Database Installation
1. Create a MySQL database (e.g., `goodlucktyres_db`, utf8mb4_unicode_ci collation).
2. Import `database/schema.sql` to generate all 22 tables with foreign keys and indexes.
3. Configure your credentials in `config/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'goodlucktyres_db');
   define('DB_USER', 'your_db_user');
   define('DB_PASS', 'your_db_password');
   ```

## Default Administrator Credentials
- **Login URL**: `/admin/login.php`
- **Email**: `admin@goodlucktyres.com`
- **Initial Password**: `Admin@GLT2026!`
*(Please update your password immediately upon first login via Admin Dashboard -> Change Password)*

## Apache / cPanel .htaccess Rules
Ensure `mod_rewrite` is enabled. Sample `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]
```
