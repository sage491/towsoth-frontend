import { useMemo, useState } from 'react';

export interface StaffRow {
  id: string;
  name: string;
  staffId: string;
  role: string;
  department: string;
  employmentType: 'Permanent' | 'Contract';
  attendance: number;
  status: 'Active' | 'Inactive';
  performanceRating: number;
  email: string;
  phone: string;
}

const allStaffSeed: StaffRow[] = [
  {
    id: 'STF001',
    name: 'Ramesh Kumar',
    staffId: 'EMP-ADM-001',
    role: 'Administrative Officer',
    department: 'Administration',
    employmentType: 'Permanent',
    attendance: 98.5,
    status: 'Active',
    performanceRating: 4.7,
    email: 'ramesh.k@university.edu',
    phone: '+91 98765 43210',
  },
  {
    id: 'STF002',
    name: 'Priya Sharma',
    staffId: 'EMP-ACC-001',
    role: 'Accountant',
    department: 'Accounts & Finance',
    employmentType: 'Permanent',
    attendance: 97.2,
    status: 'Active',
    performanceRating: 4.8,
    email: 'priya.s@university.edu',
    phone: '+91 98765 43211',
  },
  {
    id: 'STF003',
    name: 'Suresh Patel',
    staffId: 'EMP-LIB-001',
    role: 'Librarian',
    department: 'Library',
    employmentType: 'Permanent',
    attendance: 96.8,
    status: 'Active',
    performanceRating: 4.6,
    email: 'suresh.p@university.edu',
    phone: '+91 98765 43212',
  },
  {
    id: 'STF004',
    name: 'Anjali Verma',
    staffId: 'EMP-LAB-001',
    role: 'Lab Assistant',
    department: 'Laboratory',
    employmentType: 'Contract',
    attendance: 95.4,
    status: 'Active',
    performanceRating: 4.4,
    email: 'anjali.v@university.edu',
    phone: '+91 98765 43213',
  },
  {
    id: 'STF005',
    name: 'Vikram Singh',
    staffId: 'EMP-IT-001',
    role: 'IT Support Specialist',
    department: 'IT Support',
    employmentType: 'Permanent',
    attendance: 98.1,
    status: 'Active',
    performanceRating: 4.9,
    email: 'vikram.s@university.edu',
    phone: '+91 98765 43214',
  },
  {
    id: 'STF006',
    name: 'Meena Reddy',
    staffId: 'EMP-ADM-002',
    role: 'Office Clerk',
    department: 'Administration',
    employmentType: 'Contract',
    attendance: 94.6,
    status: 'Active',
    performanceRating: 4.3,
    email: 'meena.r@university.edu',
    phone: '+91 98765 43215',
  },
  {
    id: 'STF007',
    name: 'Rajesh Nair',
    staffId: 'EMP-MNT-001',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    employmentType: 'Permanent',
    attendance: 96.2,
    status: 'Active',
    performanceRating: 4.5,
    email: 'rajesh.n@university.edu',
    phone: '+91 98765 43216',
  },
  {
    id: 'STF008',
    name: 'Kavita Joshi',
    staffId: 'EMP-SEC-001',
    role: 'Security Officer',
    department: 'Security',
    employmentType: 'Permanent',
    attendance: 99.1,
    status: 'Active',
    performanceRating: 4.6,
    email: 'kavita.j@university.edu',
    phone: '+91 98765 43217',
  },
];

export function useStaffManagementData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const allStaff = allStaffSeed;

  const departments = ['All', 'Administration', 'Accounts & Finance', 'Library', 'Laboratory', 'IT Support', 'Maintenance', 'Security', 'Transport'];
  const roles = ['All', 'Administrative Officer', 'Accountant', 'Librarian', 'Lab Assistant', 'IT Support Specialist', 'Office Clerk', 'Maintenance Supervisor', 'Security Officer'];

  const filteredStaff = useMemo(() => {
    return allStaff.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartment === 'all' || staff.department === selectedDepartment;
      const matchesRole = selectedRole === 'all' || staff.role === selectedRole;
      const matchesEmploymentType = selectedEmploymentType === 'all' || staff.employmentType === selectedEmploymentType;
      const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesRole && matchesEmploymentType && matchesStatus;
    });
  }, [allStaff, searchTerm, selectedDepartment, selectedRole, selectedEmploymentType, selectedStatus]);

  return {
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    selectedRole,
    setSelectedRole,
    selectedEmploymentType,
    setSelectedEmploymentType,
    selectedStatus,
    setSelectedStatus,
    allStaff,
    filteredStaff,
    departments,
    roles,
  };
}
