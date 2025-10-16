// Admin users database (in production, this would be in your backend database)
export const adminUsers = [
  {
    id: 1,
    email: 'admin@towsoth.edu',
    password: 'admin123', // In production, this would be hashed
    name: 'Super Admin',
    role: 'super_admin',
    permissions: ['manage_content', 'manage_users', 'view_analytics', 'system_settings'],
    createdAt: '2024-01-01',
    isActive: true
  },
  {
    id: 2,
    email: 'content.manager@towsoth.edu',
    password: 'content123',
    name: 'Content Manager',
    role: 'content_admin',
    permissions: ['manage_content', 'view_analytics'],
    createdAt: '2024-01-15',
    isActive: true
  },
  {
    id: 3,
    email: 'teacher@towsoth.edu',
    password: 'teacher123',
    name: 'Subject Teacher',
    role: 'teacher',
    permissions: ['manage_content'],
    createdAt: '2024-02-01',
    isActive: true
  }
];

// Admin roles and their capabilities
export const adminRoles = {
  super_admin: {
    name: 'Super Administrator',
    description: 'Full system access',
    permissions: ['manage_content', 'manage_users', 'view_analytics', 'system_settings', 'manage_admins']
  },
  content_admin: {
    name: 'Content Administrator',
    description: 'Manage educational content',
    permissions: ['manage_content', 'view_analytics']
  },
  teacher: {
    name: 'Teacher',
    description: 'Manage subject content',
    permissions: ['manage_content']
  }
};

// Function to validate admin credentials
export const validateAdminCredentials = (email, password) => {
  const admin = adminUsers.find(user => 
    user.email === email && 
    user.password === password && 
    user.isActive
  );
  
  if (admin) {
    const { password: _, ...adminData } = admin; // Remove password from returned data
    return {
      success: true,
      admin: adminData,
      permissions: adminRoles[admin.role].permissions
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials or inactive account'
  };
};

// Function to check if user has specific permission
export const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions.includes(requiredPermission);
};
