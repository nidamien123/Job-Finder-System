import React, { useMemo } from 'react';
import {
  ArrowRight,
  Bell,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Grid3X3,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCircle2,
  Users,
  X
} from 'lucide-react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { demoAdminStats, demoApplications, demoCategories, demoCompanies, demoJobs, demoNotifications, demoProfile } from './data/demoData';
import { supabaseReady } from './lib/supabase';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Contact', to: '/contact' }
];

const dashboardLinks = {
  job_seeker: [
    { label: 'Dashboard', to: '/dashboard/seeker', icon: LayoutDashboard },
    { label: 'Profile', to: '/profile', icon: UserCircle2 },
    { label: 'Applications', to: '/applications', icon: FileText },
    { label: 'Saved Jobs', to: '/saved', icon: Star },
    { label: 'Notifications', to: '/notifications', icon: Bell }
  ],
  employer: [
    { label: 'Dashboard', to: '/dashboard/employer', icon: LayoutDashboard },
    { label: 'Post a Job', to: '/post-job', icon: Briefcase },
    { label: 'Manage Jobs', to: '/manage-jobs', icon: Grid3X3 },
    { label: 'Applicants', to: '/manage-applicants', icon: Users },
    { label: 'Profile', to: '/profile', icon: Building2 }
  ],
  admin: [
    { label: 'Dashboard', to: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
    { label: 'Reports', to: '/admin/reports', icon: ShieldCheck },
    { label: 'Complaints', to: '/admin/complaints', icon: FileText }
  ]
};

function formatCurrency(min, max) {
  return min && max ? `RWF ${Number(min).toLocaleString()} - ${Number(max).toLocaleString()}` : 'Negotiable';
}

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppShell({ user, onLogout, children, currentPage, jobs, savedJobs, onToggleSave, notifications }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile') || location.pathname.startsWith('/applications') || location.pathname.startsWith('/saved') || location.pathname.startsWith('/manage') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/post-job') || location.pathname.startsWith('/notifications');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-lg font-bold text-white">SJ</div>
            <div>
              <div className="text-lg font-semibold tracking-tight text-navy">SmartJob Rwanda</div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-slate-500">recruitment platform</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-navy' : 'text-slate-600 hover:text-navy'}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link to="/notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-navy">
                  <Bell className="h-4 w-4" />
                  {notifications.filter((n) => !n.read).length > 0 && <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange" />}
                </Link>
                <Link to={user.role === 'job_seeker' ? '/dashboard/seeker' : user.role === 'employer' ? '/dashboard/employer' : '/dashboard/admin'} className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                  Dashboard
                </Link>
                <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-navy">Login</Link>
                <Link to="/register/job-seeker" className="rounded-full bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange/90">Get Started</Link>
              </>
            )}
          </div>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 md:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {isDashboard && user ? (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-3xl bg-navy p-5 text-white shadow-soft">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold">{user.name?.split(' ').map((n) => n[0]).slice(0,2).join('')}</div>
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-slate-300 capitalize">{user.role.replace('_', ' ')}</div>
                </div>
              </div>

              <nav className="space-y-2">
                {(dashboardLinks[user.role] || []).map(({ label, to, icon: Icon }) => (
                  <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/5'}`}>
                    <Icon className="h-4 w-4" /> {label}
                  </NavLink>
                ))}
              </nav>
            </aside>

            <main className="min-w-0">{children}</main>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white">SJ</div>
              <div>
                <div className="font-semibold text-navy">SmartJob Rwanda</div>
              </div>
            </div>
            <p className="text-sm text-slate-600">A modern recruitment ecosystem connecting job seekers, employers and administrators across Rwanda.</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Company</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Candidates</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/jobs">Browse jobs</Link></li>
              <li><Link to="/register/job-seeker">Create profile</Link></li>
              <li><Link to="/saved">Saved jobs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Employers</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/register/employer">Register company</Link></li>
              <li><Link to="/post-job">Post vacancies</Link></li>
              <li><Link to="/manage-applicants">Manage applicants</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroSection({ user }) {
  return (
    <section className="bg-gradient-to-r from-navy via-slate-900 to-slate-800 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 ring-1 ring-white/10">
            <Sparkles className="h-3.5 w-3.5 text-orange" /> Trusted by Rwanda’s growing talent ecosystem
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Discover better opportunities, faster.</h1>
          <p className="mt-5 max-w-xl text-base text-slate-200">SmartJob Rwanda connects job seekers with employers, streamlines applications, and helps teams hire smarter through a modern recruitment system.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/jobs" className="rounded-full bg-orange px-5 py-3 font-semibold text-white shadow-soft hover:bg-orange/90">Browse jobs</Link>
            <Link to="/register/employer" className="rounded-full border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white hover:bg-white/10">Hire talent</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-slate-200">
            <div><span className="block text-2xl font-bold text-white">18k+</span> applications</div>
            <div><span className="block text-2xl font-bold text-white">1.2k+</span> active employers</div>
            <div><span className="block text-2xl font-bold text-white">92%</span> satisfaction</div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 shadow-soft ring-1 ring-white/10 backdrop-blur-md">
          <div className="rounded-2xl bg-white p-5 text-slate-800">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Featured roles</div>
                <div className="mt-2 text-xl font-bold text-navy">Top opportunities</div>
              </div>
              <div className="rounded-full bg-orange/10 px-2 py-1 text-xs font-semibold text-orange">Hot</div>
            </div>

            <div className="space-y-4">
              {demoJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-navy">{job.title}</div>
                      <div className="mt-1 text-sm text-slate-500">{job.company}</div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">{job.employmentType}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                    <span className="inline-flex items-center gap-1"><CircleDollarSign className="h-3.5 w-3.5" /> {job.salary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip({ jobs, applications }) {
  return (
    <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Live jobs" value={String(jobs.length)} subtitle="Active vacancies" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Applications" value={String(applications.length)} subtitle="Submitted this month" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Companies" value="320" subtitle="Employer accounts" icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Success rate" value="92%" subtitle="Candidate satisfaction" icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>
    </section>
  );
}

function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between text-slate-600">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10 text-orange">{icon}</div>
      </div>
      <div className="mt-6 text-3xl font-bold text-navy">{value}</div>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function FeatureGrid() {
  const features = [
    { title: 'Smart job matching', text: 'Browse curated jobs based on your location, role and preferred salary with easy filters.', icon: Search },
    { title: 'Application tracking', text: 'Follow status updates from pending to accepted in one simple overview.', icon: FileText },
    { title: 'Employer controls', text: 'Publish jobs, shortlist candidates and review CVs without leaving the dashboard.', icon: Building2 },
    { title: 'Security & moderation', text: 'Admin tools help monitor suspicious listings, complaints and user activity.', icon: ShieldCheck }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange">Why choose us</p>
        <h2 className="mt-3 text-3xl font-bold text-navy">Everything needed to recruit and get hired</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ title, text, icon: Icon }) => (
          <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-navy">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomePage({ jobs, applications, user, onToggleSave, savedJobs, onApply }) {
  const featuredJobs = jobs.slice(0, 3);

  return (
    <>
      <HeroSection user={user} />
      <StatsStrip jobs={jobs} applications={applications} />
      <FeatureGrid />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">Featured jobs</p>
            <h2 className="mt-2 text-3xl font-bold text-navy">Opportunities across Rwanda</h2>
          </div>
          <Link to="/jobs" className="inline-flex items-center gap-2 font-semibold text-navy">
            View all jobs <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredJobs.map((job) => (
            <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{job.category}</div>
                <button onClick={() => onToggleSave(job.id)} className="text-slate-400 hover:text-orange">
                  <Star className={`h-5 w-5 ${savedJobs.includes(job.id) ? 'fill-orange text-orange' : ''}`} />
                </button>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-navy">{job.title}</h3>
              <div className="mt-2 text-sm text-slate-600">{job.company}</div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {job.location}</div>
                <div className="flex gap-2"><Briefcase className="h-4 w-4 text-slate-400" /> {job.employmentType}</div>
                <div className="flex gap-2"><CircleDollarSign className="h-4 w-4 text-slate-400" /> {job.salary}</div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link to={`/jobs/${job.id}`} className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-navy hover:border-slate-300">View details</Link>
                <button onClick={() => onApply(job.id)} className="flex-1 rounded-full bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange/90">Apply now</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">About SmartJob Rwanda</p>
          <h1 className="mt-4 text-4xl font-bold text-navy">Built to empower Rwanda’s future of work.</h1>
          <p className="mt-5 text-lg text-slate-600">SmartJob Rwanda is a digital recruitment platform designed to simplify hiring and make the job market more transparent, efficient and inclusive.</p>
          <p className="mt-5 text-slate-600">We connect employers to qualified candidates, support local job discovery, and provide tools for skill-based recruitment, employer verification and secure application management.</p>
        </div>
        <div className="rounded-3xl bg-navy p-8 text-white shadow-soft">
          <div className="space-y-6">
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Mission</div>
              <p className="mt-3 text-slate-100">To help unemployed people find jobs easily and help companies recruit qualified employees through a reliable digital platform.</p>
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-slate-300">Vision</div>
              <p className="mt-3 text-slate-100">To build an accessible and modern hiring ecosystem that makes talent discovery faster, safer and more efficient nationwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowseJobsPage({ jobs, filters, setFilters, savedJobs, onToggleSave, onApply, searchTerm, setSearchTerm }) {
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompany = job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesType = !filters.type || job.employmentType === filters.type;
      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesSalary = !filters.salary || (Number(job.salaryMin || 0) >= Number(filters.salary));

      return (matchesTitle || matchesCompany) && matchesLocation && matchesCategory && matchesType && matchesExperience && matchesSalary;
    });
  }, [jobs, filters, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-slate-600">Search jobs</label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-soft">
            <Search className="h-4 w-4 text-slate-400" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Job title or company" className="w-full border-none bg-transparent text-sm outline-none" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Select value={filters.location} onChange={(value) => setFilters((prev) => ({ ...prev, location: value }))} options={['', 'Kigali', 'Remote', 'Rwamagana']} placeholder="Location" />
          <Select value={filters.category} onChange={(value) => setFilters((prev) => ({ ...prev, category: value }))} options={['', ...demoCategories]} placeholder="Category" />
          <Select value={filters.type} onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))} options={['', 'Full-time', 'Contract', 'Internship']} placeholder="Type" />
          <Select value={filters.experience} onChange={(value) => setFilters((prev) => ({ ...prev, experience: value }))} options={['', '0-2 years', '1-3 years', '2+ years', '4+ years']} placeholder="Level" />
          <Select value={filters.salary} onChange={(value) => setFilters((prev) => ({ ...prev, salary: value }))} options={['', '500000', '900000', '1200000', '1500000']} placeholder="Min salary" />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">Showing {filteredJobs.length} jobs</div>
        <button onClick={() => setFilters({ location: '', category: '', type: '', experience: '', salary: '' })} className="text-sm font-medium text-orange">Reset filters</button>
      </div>

      <div className="space-y-5">
        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-navy">No jobs match your search.</p>
            <p className="mt-2 text-slate-500">Try broadening the filters or using a different keyword.</p>
          </div>
        ) : filteredJobs.map((job) => (
          <div key={job.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-orange">
                  <Briefcase className="h-3.5 w-3.5" /> {job.category}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-navy">{job.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>{job.company}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                  <span>{job.employmentType}</span>
                  <span>{job.experience}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => onToggleSave(job.id)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
                  {savedJobs.includes(job.id) ? 'Saved' : 'Save job'}
                </button>
                <button onClick={() => onApply(job.id)} className="rounded-full bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange/90">Apply now</button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
              <div>
                <div className="text-sm font-semibold text-navy">{formatCurrency(job.salaryMin, job.salaryMax)}</div>
                <div className="text-xs text-slate-500">Posted {job.datePosted}</div>
              </div>
              <Link to={`/jobs/${job.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                View details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-orange">
      <option value="">{placeholder}</option>
      {options.filter(Boolean).map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

function JobDetailsPage({ jobs, onApply, savedJobs, onToggleSave }) {
  const { id } = useParams();
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return <NotFoundPage />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">{job.category}</div>
            <h1 className="mt-3 text-4xl font-bold text-navy">{job.title}</h1>
            <div className="mt-3 text-lg text-slate-600">{job.company}</div>
            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
              <span className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4" /> {job.employmentType}</span>
              <span className="inline-flex items-center gap-2"><CircleDollarSign className="h-4 w-4" /> {formatCurrency(job.salaryMin, job.salaryMax)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onToggleSave(job.id)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300">
              {savedJobs.includes(job.id) ? 'Saved' : 'Save job'}
            </button>
            <button onClick={() => onApply(job.id)} className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange/90">Apply now</button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-navy">Job description</h3>
              <p className="mt-4 text-slate-600">{job.description}</p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-navy">Requirements</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {job.requirements.map((req) => (
                  <li key={req} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-orange" /> {req}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="rounded-3xl bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-navy">Job overview</h3>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex justify-between gap-3"><span>Experience</span><span className="font-medium text-slate-800">{job.experience}</span></div>
              <div className="flex justify-between gap-3"><span>Employment</span><span className="font-medium text-slate-800">{job.employmentType}</span></div>
              <div className="flex justify-between gap-3"><span>Salary</span><span className="font-medium text-slate-800">{formatCurrency(job.salaryMin, job.salaryMax)}</span></div>
              <div className="flex justify-between gap-3"><span>Location</span><span className="font-medium text-slate-800">{job.location}</span></div>
              <div className="flex justify-between gap-3"><span>Posted</span><span className="font-medium text-slate-800">{job.datePosted}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, user }) {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '' });

  React.useEffect(() => {
    if (user) navigate('/dashboard/seeker');
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      alert('Please fill in both email and password.');
      return;
    }
    onLogin(form.email, form.password);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">Login</p>
        <h1 className="mt-3 text-3xl font-bold text-navy">Welcome back</h1>
        <p className="mt-3 text-slate-600">Use your account to access your dashboard and manage opportunities.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full rounded-full bg-navy px-5 py-3 font-semibold text-white hover:bg-slate-800">
            Sign in
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Demo accounts: <span className="font-semibold">admin@smartjob.rw</span>, <span className="font-semibold">employer@smartjob.rw</span>, <span className="font-semibold">jobseeker@smartjob.rw</span>
        </div>
      </div>
    </div>
  );
}

function RegistrationPage({ type }) {
  const navigate = useNavigate();
  const title = type === 'employer' ? 'Create employer account' : 'Create job seeker profile';
  const [form, setForm] = React.useState({ fullName: '', email: '', password: '', company: '', location: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      alert('Please complete the required fields.');
      return;
    }
    alert('Registration submitted successfully. Your account is ready for onboarding.');
    navigate('/login');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange">{type === 'employer' ? 'Employer registration' : 'Job seeker registration'}</p>
        <h1 className="mt-3 text-3xl font-bold text-navy">{title}</h1>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
            {type === 'employer' ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Company name</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">City</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
              </div>
            )}
          </div>

          {type === 'employer' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
          )}

          <button type="submit" className="w-full rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orange/90">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardSeekerPage({ applications, savedJobs, jobs, notifications }) {
  const applicationCount = applications.length;
  const savedCount = savedJobs.length;
  const activeJobs = jobs.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Applications sent" value={String(applicationCount)} subtitle="Across all roles" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Saved jobs" value={String(savedCount)} subtitle="Ready to apply" icon={<Star className="h-5 w-5" />} />
        <StatCard title="Open positions" value={String(activeJobs)} subtitle="Currently active" icon={<Briefcase className="h-5 w-5" />} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Recent applications</h2>
          <Link to="/applications" className="text-sm font-semibold text-orange">View all</Link>
        </div>
        <div className="space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <div className="font-medium text-navy">{application.jobTitle}</div>
                <div className="text-sm text-slate-500">{application.employer}</div>
              </div>
              <span className="rounded-full bg-orange/10 px-3 py-1 text-xs font-medium text-orange">{application.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Notifications</h2>
          <Link to="/notifications" className="text-sm font-semibold text-orange">Open inbox</Link>
        </div>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((note) => (
            <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-navy">{note.title}</div>
                {!note.read && <span className="h-2.5 w-2.5 rounded-full bg-orange" />}
              </div>
              <div className="mt-2 text-sm text-slate-600">{note.message}</div>
              <div className="mt-2 text-xs text-slate-500">{note.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardEmployerPage({ jobs, applications }) {
  const activeJobs = jobs.length;
  const totalApplicants = applications.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Published jobs" value={String(activeJobs)} subtitle="Current listings" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Applicants" value={String(totalApplicants)} subtitle="Across all postings" icon={<Users className="h-5 w-5" />} />
        <StatCard title="Shortlisted" value="7" subtitle="Candidate shortlist" icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-navy">Applicants overview</h2>
          <Link to="/manage-applicants" className="text-sm font-semibold text-orange">Manage</Link>
        </div>
        <div className="space-y-3">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <div className="font-medium text-navy">{application.applicant}</div>
                <div className="text-sm text-slate-500">Applied for {application.jobTitle}</div>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">{application.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardAdminPage() {
  const stats = demoAdminStats;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Users" value={String(stats.users)} subtitle="registered" icon={<Users className="h-5 w-5" />} />
        <StatCard title="Job seekers" value={String(stats.jobSeekers)} subtitle="active" icon={<UserCircle2 className="h-5 w-5" />} />
        <StatCard title="Employers" value={String(stats.employers)} subtitle="verified" icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="Jobs" value={String(stats.jobs)} subtitle="published" icon={<Briefcase className="h-5 w-5" />} />
        <StatCard title="Applications" value={String(stats.applications)} subtitle="this period" icon={<FileText className="h-5 w-5" />} />
        <StatCard title="Complaints" value={String(stats.complaints)} subtitle="open" icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-navy">Platform moderation</h2>
          <div className="mt-5 space-y-3">
            {['Vacancy approval queue', 'Suspicious account review', 'Complaints management', 'Job category updates'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <span className="font-medium text-slate-700">{item}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">Open</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-navy">Recent reports</h2>
          <div className="mt-5 space-y-3">
            {[
              ['Employer verification', '18 pending approvals'],
              ['Fake job flags', '4 content reports'],
              ['Account blocks', '3 suspicious profiles']
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl bg-slate-50 p-4">
                <div className="font-medium text-navy">{title}</div>
                <div className="mt-1 text-sm text-slate-600">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">My profile</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Full name</div>
            <div className="mt-1 text-lg font-semibold text-navy">{demoProfile.name}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Email</div>
            <div className="mt-1 text-lg font-semibold text-navy">{demoProfile.email}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Location</div>
            <div className="mt-1 text-lg font-semibold text-navy">{demoProfile.location}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {demoProfile.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">{skill}</span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Education</div>
            <div className="mt-2 text-sm text-slate-700">{demoProfile.education.join(', ')}</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Experience</div>
            <div className="mt-2 text-sm text-slate-700">{demoProfile.experience.join(', ')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsPage({ applications }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">My applications</h2>
      <div className="mt-6 space-y-3">
        {applications.map((application) => (
          <div key={application.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
            <div>
              <div className="font-medium text-navy">{application.jobTitle}</div>
              <div className="text-sm text-slate-500">{application.employer}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{application.submittedAt}</span>
              <span className="rounded-full bg-orange/10 px-3 py-1 text-xs font-medium text-orange">{application.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedJobsPage({ jobs, savedJobs }) {
  const saved = jobs.filter((job) => savedJobs.includes(job.id));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">Saved jobs</h2>
      <div className="mt-6 space-y-4">
        {saved.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-6 text-slate-600">No jobs saved yet.</div>
        ) : saved.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
            <div>
              <div className="font-medium text-navy">{job.title}</div>
              <div className="text-sm text-slate-500">{job.company} • {job.location}</div>
            </div>
            <Link to={`/jobs/${job.id}`} className="text-sm font-semibold text-orange">Open</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsPage({ notifications }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">Notifications</h2>
      <div className="mt-6 space-y-3">
        {notifications.map((note) => (
          <div key={note.id} className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-navy">{note.title}</div>
              {!note.read && <span className="h-2.5 w-2.5 rounded-full bg-orange" />}
            </div>
            <div className="mt-2 text-sm text-slate-600">{note.message}</div>
            <div className="mt-2 text-xs text-slate-500">{note.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostJobPage() {
  const [form, setForm] = React.useState({
    title: '',
    company: 'Apex Rwanda',
    location: 'Kigali',
    category: 'Engineering',
    type: 'Full-time',
    salary: 'RWF 1,200,000',
    description: ''
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Your job vacancy has been published successfully.');
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">Post a new job</h2>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Job title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Company</label>
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange">
            {demoCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Employment type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange">
            <option>Full-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Salary range</label>
          <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
        </div>
        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Job description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
        </div>

        <div className="lg:col-span-2">
          <button type="submit" className="rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orange/90">Publish vacancy</button>
        </div>
      </form>
    </div>
  );
}

function ManageJobsPage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">Manage jobs</h2>
      <div className="mt-6 space-y-3">
        {demoJobs.slice(0, 4).map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4">
            <div>
              <div className="font-medium text-navy">{job.title}</div>
              <div className="text-sm text-slate-500">{job.location} • {job.employmentType}</div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700">Edit</button>
              <button className="rounded-full bg-red-500 px-3 py-2 text-sm text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageApplicantsPage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-2xl font-semibold text-navy">Manage applicants</h2>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demoApplications.map((app) => (
              <tr key={app.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-navy">{app.applicant}</td>
                <td className="px-4 py-3 text-slate-600">{app.jobTitle}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-orange/10 px-2 py-1 text-xs font-medium text-orange">{app.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">Accept</button>
                    <button className="rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white">Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-navy p-8 text-white shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">Contact us</p>
          <h1 className="mt-3 text-3xl font-bold">Get in touch with the SmartJob team.</h1>
          <div className="mt-8 space-y-4 text-slate-200">
            <div>Email: support@smartjob.rw</div>
            <div>Phone: +250 788 000 000</div>
            <div>Address: Kigali Innovation City, Rwanda</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
          <form className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
              <input className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Message</label>
              <textarea rows={5} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange" />
            </div>
            <button type="button" className="rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orange/90">Send message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-navy">Privacy policy</h1>
      <div className="mt-6 space-y-5 text-slate-600">
        <p>SmartJob Rwanda respects the privacy of its users and employers. We process personal data only for recruitment and platform security purposes.</p>
        <p>We store profile information, application history and job data securely using Supabase with Row Level Security policies and strict access controls.</p>
        <p>Users may request access, correction or deletion of their personal data by contacting our support team.</p>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-navy">Terms and conditions</h1>
      <div className="mt-6 space-y-5 text-slate-600">
        <p>Users must provide truthful information when creating profiles and applying for jobs.</p>
        <p>Employers are required to describe vacancies accurately and ensure they comply with local employment regulations.</p>
        <p>SmartJob Rwanda reserves the right to review, approve or remove suspicious activity or content that violates platform rules.</p>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-soft">
        <div className="text-6xl font-bold text-orange">404</div>
        <h1 className="mt-5 text-3xl font-bold text-navy">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for may have been moved, deleted or never existed.</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-navy px-5 py-3 font-semibold text-white hover:bg-slate-800">Back to home</Link>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = React.useState({
    id: 'demo-job-seeker',
    name: 'Aline Uwase',
    email: 'jobseeker@smartjob.rw',
    role: 'job_seeker'
  });

  const [jobs, setJobs] = React.useState(demoJobs);
  const [savedJobs, setSavedJobs] = React.useState(['j1']);
  const [applications, setApplications] = React.useState(demoApplications);
  const [notifications, setNotifications] = React.useState(demoNotifications);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    location: '',
    category: '',
    type: '',
    experience: '',
    salary: ''
  });

  const onLogin = (email, password) => {
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail.includes('admin')) {
      setUser({ id: 'admin-1', name: 'System Admin', email, role: 'admin' });
      return;
    }

    if (normalizedEmail.includes('employer')) {
      setUser({ id: 'employer-1', name: 'Rwanda Hiring', email, role: 'employer' });
      return;
    }

    setUser({ id: 'jobseeker-1', name: 'Aline Uwase', email, role: 'job_seeker' });
  };

  const onLogout = () => setUser(null);

  const onToggleSave = (jobId) => {
    setSavedJobs((current) => current.includes(jobId) ? current.filter((id) => id !== jobId) : [...current, jobId]);
  };

  const onApply = (jobId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    const targetJob = jobs.find((job) => job.id === jobId);
    if (!targetJob) return;

    const newApplication = {
      id: `app-${Date.now()}`,
      jobTitle: targetJob.title,
      employer: targetJob.company,
      status: 'Pending',
      submittedAt: new Date().toISOString().slice(0, 10),
      applicant: user.name || 'Candidate'
    };

    setApplications((current) => [newApplication, ...current]);
    setNotifications((current) => [{
      id: `notif-${Date.now()}`,
      title: 'Application submitted',
      message: `Your application for ${targetJob.title} has been received.`,
      read: false,
      time: 'Just now'
    }, ...current]);
    alert('Application submitted successfully.');
  };

  return (
    <BrowserRouter>
      <AppShell user={user} onLogout={onLogout} jobs={jobs} notifications={notifications} savedJobs={savedJobs} onToggleSave={onToggleSave}>
        <Routes>
          <Route path="/" element={<HomePage jobs={jobs} applications={applications} user={user} onToggleSave={onToggleSave} savedJobs={savedJobs} onApply={onApply} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/jobs" element={<BrowseJobsPage jobs={jobs} filters={filters} setFilters={setFilters} savedJobs={savedJobs} onToggleSave={onToggleSave} onApply={onApply} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path="/jobs/:id" element={<JobDetailsPage jobs={jobs} onApply={onApply} savedJobs={savedJobs} onToggleSave={onToggleSave} />} />
          <Route path="/register/job-seeker" element={<RegistrationPage type="job-seeker" />} />
          <Route path="/register/employer" element={<RegistrationPage type="employer" />} />
          <Route path="/login" element={<LoginPage onLogin={onLogin} user={user} />} />
          <Route path="/dashboard/seeker" element={<ProtectedRoute user={user} allowedRoles={['job_seeker']}><DashboardSeekerPage applications={applications} savedJobs={savedJobs} jobs={jobs} notifications={notifications} /></ProtectedRoute>} />
          <Route path="/dashboard/employer" element={<ProtectedRoute user={user} allowedRoles={['employer']}><DashboardEmployerPage jobs={jobs} applications={applications} /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute user={user} allowedRoles={['admin']}><DashboardAdminPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute user={user} allowedRoles={['job_seeker', 'employer', 'admin']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute user={user} allowedRoles={['job_seeker']}><ApplicationsPage applications={applications} /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute user={user} allowedRoles={['job_seeker']}><SavedJobsPage jobs={jobs} savedJobs={savedJobs} /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute user={user} allowedRoles={['job_seeker', 'employer', 'admin']}><NotificationsPage notifications={notifications} /></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute user={user} allowedRoles={['employer']}><PostJobPage /></ProtectedRoute>} />
          <Route path="/manage-jobs" element={<ProtectedRoute user={user} allowedRoles={['employer']}><ManageJobsPage /></ProtectedRoute>} />
          <Route path="/manage-applicants" element={<ProtectedRoute user={user} allowedRoles={['employer']}><ManageApplicantsPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute user={user} allowedRoles={['admin']}><DashboardAdminPage /></ProtectedRoute>} />
          <Route path="/admin/jobs" element={<ProtectedRoute user={user} allowedRoles={['admin']}><DashboardAdminPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute user={user} allowedRoles={['admin']}><DashboardAdminPage /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute user={user} allowedRoles={['admin']}><DashboardAdminPage /></ProtectedRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
