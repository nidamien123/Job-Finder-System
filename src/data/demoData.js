export const demoCategories = [
  'Engineering',
  'Marketing',
  'Healthcare',
  'Finance',
  'Education',
  'Customer Support',
  'Operations',
  'Design'
];

export const demoCompanies = [
  {
    id: 'c1',
    name: 'Apex Rwanda',
    industry: 'Technology',
    location: 'Kigali',
    logo: 'AR',
    status: 'approved'
  },
  {
    id: 'c2',
    name: 'MediCare Rwanda',
    industry: 'Healthcare',
    location: 'Kigali',
    logo: 'MR',
    status: 'approved'
  },
  {
    id: 'c3',
    name: 'Rwanda Bank Group',
    industry: 'Finance',
    location: 'Kigali',
    logo: 'RB',
    status: 'approved'
  }
];

export const demoJobs = [
  {
    id: 'j1',
    title: 'Frontend Developer',
    company: 'Apex Rwanda',
    location: 'Kigali',
    category: 'Engineering',
    employmentType: 'Full-time',
    salary: 'RWF 1,200,000 - 1,800,000',
    salaryMin: 1200000,
    salaryMax: 1800000,
    experience: '2+ years',
    datePosted: '2026-11-15',
    description: 'Build and maintain responsive interfaces for enterprise and consumer products. Collaborate with product and design teams to deliver polished experiences.',
    requirements: ['React', 'Tailwind CSS', 'API integration', 'Responsive design'],
    featured: true
  },
  {
    id: 'j2',
    title: 'Senior Product Designer',
    company: 'Rwanda Bank Group',
    location: 'Kigali',
    category: 'Design',
    employmentType: 'Contract',
    salary: 'RWF 1,500,000 - 2,000,000',
    salaryMin: 1500000,
    salaryMax: 2000000,
    experience: '4+ years',
    datePosted: '2026-11-10',
    description: 'Lead user-centered design for digital banking and customer journeys in a fast-moving environment.',
    requirements: ['Figma', 'UX Design', 'Research', 'Design Systems'],
    featured: true
  },
  {
    id: 'j3',
    title: 'Customer Success Manager',
    company: 'MediCare Rwanda',
    location: 'Remote',
    category: 'Customer Support',
    employmentType: 'Full-time',
    salary: 'RWF 900,000 - 1,300,000',
    salaryMin: 900000,
    salaryMax: 1300000,
    experience: '1-3 years',
    datePosted: '2026-11-08',
    description: 'Support client onboarding, retention and issue resolution while coordinating with internal teams.',
    requirements: ['CRM', 'Communication', 'Problem solving', 'Healthcare experience'],
    featured: false
  },
  {
    id: 'j4',
    title: 'Hospitality Operations Supervisor',
    company: 'MediCare Rwanda',
    location: 'Kigali',
    category: 'Operations',
    employmentType: 'Full-time',
    salary: 'RWF 1,100,000 - 1,600,000',
    salaryMin: 1100000,
    salaryMax: 1600000,
    experience: '2+ years',
    datePosted: '2026-11-02',
    description: 'Coordinate service delivery, schedule planning and cross-functional operational excellence.',
    requirements: ['Operations', 'Reporting', 'Leadership'],
    featured: true
  },
  {
    id: 'j5',
    title: 'Data Analyst',
    company: 'Apex Rwanda',
    location: 'Kigali',
    category: 'Finance',
    employmentType: 'Internship',
    salary: 'RWF 500,000 - 700,000',
    salaryMin: 500000,
    salaryMax: 700000,
    experience: '0-2 years',
    datePosted: '2026-10-31',
    description: 'Interpret business data, create dashboards and support reporting for strategic decisions.',
    requirements: ['Excel', 'SQL', 'Dashboarding', 'Communication'],
    featured: false
  }
];

export const demoApplications = [
  {
    id: 'a1',
    jobTitle: 'Frontend Developer',
    employer: 'Apex Rwanda',
    status: 'Under Review',
    submittedAt: '2026-11-16',
    applicant: 'Aline Uwase'
  },
  {
    id: 'a2',
    jobTitle: 'Customer Success Manager',
    employer: 'MediCare Rwanda',
    status: 'Shortlisted',
    submittedAt: '2026-11-12',
    applicant: 'Aline Uwase'
  }
];

export const demoNotifications = [
  {
    id: 'n1',
    title: 'Application update',
    message: 'Your application for Frontend Developer is now being reviewed.',
    read: false,
    time: '2 hours ago'
  },
  {
    id: 'n2',
    title: 'Saved job reminder',
    message: 'This job matches your profile and is still open.',
    read: true,
    time: '1 day ago'
  }
];

export const demoProfile = {
  id: 'u1',
  name: 'Aline Uwase',
  email: 'aline.uwase@gmail.com',
  phone: '+250788123456',
  role: 'job_seeker',
  location: 'Kigali',
  bio: 'Product-minded professional specializing in design and digital user experiences.',
  skills: ['React', 'UX Design', 'Analytics', 'Communication'],
  education: ['BSc in Information Systems, University of Rwanda'],
  experience: ['Product Designer at Hub Solutions (2022 - Present)']
};

export const demoAdminStats = {
  users: 1240,
  jobSeekers: 890,
  employers: 260,
  jobs: 418,
  applications: 1832,
  complaints: 12
};
