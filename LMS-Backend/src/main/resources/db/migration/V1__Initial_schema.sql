-- V1__Initial_schema.sql
-- Create base tables for multi-tenant LMS backend

CREATE TABLE IF NOT EXISTS institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    timezone VARCHAR(50),
    academic_session VARCHAR(255),
    plan VARCHAR(50),
    active_users INT DEFAULT 0,
    storage_usage DOUBLE PRECISION DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    admin_email VARCHAR(255),
    auto_structure_enabled BOOLEAN DEFAULT FALSE,
    branding JSONB,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    CHECK (status IN ('ACTIVE', 'SUSPENDED', 'ARCHIVED'))
);

CREATE INDEX idx_institution_status ON institutions(status);
CREATE INDEX idx_institution_created_at ON institutions(created_at);

CREATE TABLE IF NOT EXISTS institution_features (
    institution_id INT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    feature_id VARCHAR(100) NOT NULL,
    PRIMARY KEY (institution_id, feature_id)
);

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    role_key VARCHAR(100) NOT NULL UNIQUE,
    rank INT NOT NULL DEFAULT 100,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE INDEX idx_role_name ON roles(name);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    permission_key VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    resource_type VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

CREATE INDEX idx_permission_key ON permissions(permission_key);

CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    UNIQUE (role_id, permission_id)
);

CREATE INDEX idx_role_perm ON role_permissions(role_id, permission_id);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    institution_id INT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role_id INT REFERENCES roles(id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    last_login TIMESTAMP,
    activity_level VARCHAR(50) DEFAULT 'MEDIUM',
    phone VARCHAR(20),
    verified BOOLEAN DEFAULT FALSE,
    last_password_change TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    UNIQUE (institution_id, email),
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    CHECK (activity_level IN ('HIGH', 'MEDIUM', 'LOW'))
);

CREATE INDEX idx_user_institution_email ON users(institution_id, email);
CREATE INDEX idx_user_status ON users(status);
CREATE INDEX idx_user_institution_status ON users(institution_id, status);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    institution_id INT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    user_id INT,
    user_email VARCHAR(255),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id INT,
    status VARCHAR(50) DEFAULT 'SUCCESS',
    ip_address VARCHAR(50),
    metadata JSONB,
    CHECK (status IN ('SUCCESS', 'WARNING', 'ERROR'))
);

CREATE INDEX idx_audit_institution_id ON audit_logs(institution_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_user_id ON audit_logs(user_id);

CREATE TABLE IF NOT EXISTS features (
    id SERIAL PRIMARY KEY,
    feature_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    enabled BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_feature_key ON features(feature_key);
