-- V2__Seed_roles_and_permissions.sql
-- Insert baseline roles and permissions

INSERT INTO roles (name, description, role_key, rank) VALUES
    ('Super Administrator', 'Full system access', 'SUPER_ADMIN', 1),
    ('Institution Administrator', 'Institution-level administrator', 'INSTITUTION_ADMIN', 2),
    ('Faculty', 'Faculty member', 'FACULTY', 3),
    ('Student', 'Student user', 'STUDENT', 4)
ON CONFLICT (role_key) DO NOTHING;

INSERT INTO permissions (name, description, permission_key, category, resource_type) VALUES
    -- Institution permissions
    ('Create Institution', 'Create new institutions', 'INSTITUTION_CREATE', 'INSTITUTION', 'INSTITUTION'),
    ('Read Institution', 'View institution details', 'INSTITUTION_READ', 'INSTITUTION', 'INSTITUTION'),
    ('Update Institution', 'Update institution details', 'INSTITUTION_UPDATE', 'INSTITUTION', 'INSTITUTION'),
    ('Delete Institution', 'Delete institutions', 'INSTITUTION_DELETE', 'INSTITUTION', 'INSTITUTION'),
    ('Suspend Institution', 'Suspend institution operations', 'INSTITUTION_SUSPEND', 'INSTITUTION', 'INSTITUTION'),
    ('Resume Institution', 'Resume institution operations', 'INSTITUTION_RESUME', 'INSTITUTION', 'INSTITUTION'),
    ('Archive Institution', 'Archive institution', 'INSTITUTION_ARCHIVE', 'INSTITUTION', 'INSTITUTION'),
    
    -- User permissions
    ('Create User', 'Create new users', 'USER_CREATE', 'USER', 'USER'),
    ('Read User', 'View user details', 'USER_READ', 'USER', 'USER'),
    ('Update User', 'Update user details', 'USER_UPDATE', 'USER', 'USER'),
    ('Delete User', 'Delete users', 'USER_DELETE', 'USER', 'USER'),
    ('Suspend User', 'Suspend user accounts', 'USER_SUSPEND', 'USER', 'USER'),
    ('Activate User', 'Activate user accounts', 'USER_ACTIVATE', 'USER', 'USER'),
    
    -- Role/Permission permissions
    ('Manage Roles', 'Manage roles and permissions', 'ROLE_MANAGE', 'RBAC', 'ROLE'),
    
    -- Audit permissions
    ('Read Audit Logs', 'View audit logs', 'AUDIT_READ', 'AUDIT', 'AUDIT_LOG'),
    ('Export Audit Logs', 'Export audit logs', 'AUDIT_EXPORT', 'AUDIT', 'AUDIT_LOG'),
    
    -- Analytics permissions
    ('Read Analytics', 'View analytics dashboards', 'ANALYTICS_READ', 'ANALYTICS', 'ANALYTICS'),
    
    -- Billing permissions
    ('Read Billing', 'View billing information', 'BILLING_READ', 'BILLING', 'BILLING'),
    ('Manage Billing', 'Manage billing and invoices', 'BILLING_MANAGE', 'BILLING', 'BILLING')
ON CONFLICT (permission_key) DO NOTHING;

-- Grant Super Admin all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_key = 'SUPER_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Grant Institution Admin most permissions (except system-wide management)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_key = 'INSTITUTION_ADMIN'
AND p.permission_key IN (
    'INSTITUTION_READ', 'INSTITUTION_UPDATE',
    'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE', 'USER_SUSPEND', 'USER_ACTIVATE',
    'ROLE_MANAGE',
    'AUDIT_READ',
    'ANALYTICS_READ',
    'BILLING_READ'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Grant Faculty limited permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_key = 'FACULTY'
AND p.permission_key IN (
    'ANALYTICS_READ'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Grant Student minimal permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.role_key = 'STUDENT'
AND p.permission_key IN ()
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create base features
INSERT INTO features (feature_key, name, description, category, enabled) VALUES
    ('AI_ASSISTANCE', 'AI Assistant', 'AI-powered learning assistance', 'AI', TRUE),
    ('ANALYTICS', 'Analytics & Reporting', 'Advanced analytics and reporting', 'ANALYTICS', TRUE),
    ('COMPLIANCE', 'Compliance Management', 'Compliance tracking and management', 'COMPLIANCE', TRUE),
    ('SECURITY', 'Advanced Security', 'Enterprise security features', 'SECURITY', TRUE),
    ('CUSTOM_BRANDING', 'Custom Branding', 'Custom institution branding', 'FEATURES', TRUE),
    ('API_ACCESS', 'API Access', 'Third-party API integrations', 'INTEGRATIONS', TRUE),
    ('SSO', 'Single Sign-On', 'SAML/OIDC SSO support', 'INTEGRATIONS', TRUE),
    ('DATA_EXPORT', 'Data Export', 'Bulk data export capabilities', 'DATA', TRUE)
ON CONFLICT (feature_key) DO NOTHING;
