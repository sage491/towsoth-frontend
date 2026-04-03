import type { FilterConfig } from '../../components/filters/FilterBar';
import type { ContentItem } from '../../types/operations';

export const getContentItems = (): ContentItem[] => [
  {
    id: 'CNT001',
    title: 'Data Structures - Linked Lists',
    type: 'Notes',
    subject: 'CS-301',
    uploadedBy: 'Dr. Sharma',
    uploadDate: '2024-12-15',
    status: 'Published',
    aiScore: 95,
    visibility: 'CS-A3, CS-B3',
  },
  {
    id: 'CNT002',
    title: 'Operating Systems - Process Management',
    type: 'Videos',
    subject: 'CS-302',
    uploadedBy: 'Prof. Kumar',
    uploadDate: '2024-12-20',
    status: 'Draft',
    aiScore: null,
    visibility: 'CS-A3',
  },
  {
    id: 'CNT003',
    title: 'Database Normalization Practice Problems',
    type: 'Assignments',
    subject: 'CS-303',
    uploadedBy: 'Dr. Patel',
    uploadDate: '2024-12-18',
    status: 'Published',
    aiScore: 88,
    visibility: 'CS-A3, CS-B3',
  },
  {
    id: 'CNT004',
    title: 'Advanced Machine Learning Algorithms and Their Applications in Real-World Scenarios',
    type: 'Reading Material',
    subject: 'CS-305',
    uploadedBy: 'Dr. Anjali Subramanian',
    uploadDate: '2024-12-22',
    status: 'Published',
    aiScore: 97,
    visibility: 'CS-A3',
  },
  {
    id: 'CNT005',
    title: 'Computer Networks Lab Manual',
    type: 'Notes',
    subject: 'CS-304',
    uploadedBy: 'Prof. Singh',
    uploadDate: '2024-12-10',
    status: 'Archived',
    aiScore: 62,
    visibility: 'CS-B3',
  },
];

export const getContentFilterConfig = (): FilterConfig[] => [
  {
    id: 'course',
    label: 'Course',
    type: 'dropdown',
    options: [
      { value: 'CS-301', label: 'CS-301' },
      { value: 'CS-302', label: 'CS-302' },
      { value: 'CS-303', label: 'CS-303' },
      { value: 'CS-304', label: 'CS-304' },
      { value: 'CS-305', label: 'CS-305' },
    ],
  },
  {
    id: 'contentType',
    label: 'Content Type',
    type: 'multiselect',
    options: [
      { value: 'Notes', label: 'Notes' },
      { value: 'Videos', label: 'Videos' },
      { value: 'Assignments', label: 'Assignments' },
      { value: 'Reading Material', label: 'Reading Material' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    type: 'toggle',
    options: [
      { value: 'Draft', label: 'Draft' },
      { value: 'Published', label: 'Published' },
      { value: 'Archived', label: 'Archived' },
    ],
  },
  {
    id: 'uploadDate',
    label: 'Upload Date',
    type: 'daterange',
    options: [
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
      { value: 'month', label: 'This Month' },
    ],
  },
  {
    id: 'search',
    label: 'Search',
    type: 'search',
    placeholder: 'Search by title, topic, or course...',
  },
];
