import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, CircleUserRound, LoaderCircle, LogIn, Menu, Search, ShieldCheck } from 'lucide-react';
import { supabase, supabaseReady } from './lib/supabase';
import './index.css';

const inputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10';
const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange/90 disabled:cursor-not-allowed disabled:opacity-60';

function Header({ session }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
      <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy font-bold text-white">SJ</span>
        <span><b className="block text-navy">SmartJob Rwanda</b><small className="text-[10px] uppercase tracking-[.2em] text-slate-500">Find your next opportunity</small></span>
      </Link>
      <nav className="hidden items-center gap-7 md:flex">
        <Link className="text-sm text-slate-600 hover:text-navy" to="/jobs">Browse jobs</Link>
        <Link className="text-sm text-slate-600 hover:text-navy" to="/about">About</Link>
        {session ? <Link className="text-sm font-semibold text-navy" to="/dashboard">Dashboard</Link> : <Link className="text-sm text-slate-600 hover:text-navy" to="/login">Login</Link>}
        {!session && <Link className={buttonClass} to="/get-started">Get started <ArrowRight size={16} /></Link>}
        {session && <button className="text-sm text-slate-600 hover:text-red-600" onClick={() => supabase.auth.signOut()}>Log out</button>}
      </nav>
      <button className="rounded-lg border border-slate-200 p-2 md:hidden" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Menu size={20} /></button>
    </div>
    {menuOpen && <nav className="grid gap-3 border-t border-slate-100 px-5 py-4 md:hidden">
      <Link onClick={() => setMenuOpen(false)} to="/jobs">Browse jobs</Link><Link onClick={() => setMenuOpen(false)} to="/about">About</Link>
      {session ? <><Link onClick={() => setMenuOpen(false)} to="/dashboard">Dashboard</Link><button className="text-left" onClick={() => { supabase.auth.signOut(); setMenuOpen(false); }}>Log out</button></> : <><Link onClick={() => setMenuOpen(false)} to="/login">Login</Link><Link onClick={() => setMenuOpen(false)} to="/get-started">Get started</Link></>}
    </nav>}
  </header>;
}

function SetupNotice() {
  if (supabaseReady) return null;
  return <div className="mx-auto my-6 max-w-7xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Supabase isn’t configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, then run <code>supabase/schema.sql</code> in your Supabase SQL Editor to enable accounts and live job data.</div>;
}

function Landing() {
  return <><section className="bg-gradient-to-br from-navy via-slate-900 to-slate-800 text-white"><div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:py-28">
    <div><span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs">Your career journey starts here</span><h1 className="mt-7 max-w-2xl text-5xl font-bold leading-tight sm:text-6xl">Find work that moves you forward.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Discover trusted opportunities across Rwanda, apply with confidence, and follow every step of your journey in one place.</p><div className="mt-9 flex flex-wrap gap-3"><Link className={buttonClass} to="/jobs">Explore jobs <ArrowRight size={16}/></Link><Link className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10" to="/get-started">Create an account</Link></div>
    <div className="mt-12 flex gap-10 text-sm text-slate-300"><div><b className="block text-2xl text-white">Rwanda-wide</b>Local opportunities</div><div><b className="block text-2xl text-white">One profile</b>Simple applications</div></div></div>
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-soft backdrop-blur"><div className="rounded-2xl bg-white p-6 text-navy"><div className="flex items-center gap-3"><span className="rounded-xl bg-orange/10 p-3 text-orange"><Search/></span><div><b className="text-lg">A better way to job search</b><p className="text-sm text-slate-500">Start exploring opportunities today</p></div></div><div className="mt-6 space-y-3"><Link to="/jobs" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-orange"><span><b>Browse open positions</b><small className="mt-1 block text-slate-500">Search by role, location and category</small></span><ArrowRight size={18}/></Link><Link to="/get-started" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-orange"><span><b>Join as an employer</b><small className="mt-1 block text-slate-500">Build your team with local talent</small></span><ArrowRight size={18}/></Link></div></div></div>
  </div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><div className="grid gap-5 md:grid-cols-3">{[[BriefcaseBusiness,'Discover jobs','Explore published opportunities and find roles that fit your skills.'],[CircleUserRound,'Create your profile','Keep your information and career details ready for applications.'],[ShieldCheck,'Track your progress','Follow application status updates from your account.']].map(([Icon,title,description])=><article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><Icon className="text-orange"/><h2 className="mt-4 text-lg font-bold text-navy">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></article>)}</div></section></>;
}

function AuthFrame({ eyebrow, title, description, children }) {
  return <main className="mx-auto max-w-xl px-4 py-14 sm:px-6"><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-soft sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-orange">{eyebrow}</p><h1 className="mt-3 text-3xl font-bold text-navy">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>{children}</div></main>;
}

function GetStarted() {
  return <AuthFrame eyebrow="Get started" title="How will you use SmartJob?" description="Choose the account type that fits you. You can sign in to an existing account at any time.">
    <div className="mt-7 grid gap-4 sm:grid-cols-2"><Link to="/register/job-seeker" className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange hover:shadow-soft"><CircleUserRound className="text-orange"/><b className="mt-4 block text-navy">I’m looking for a job</b><span className="mt-2 block text-sm text-slate-500">Create a candidate account and apply to jobs.</span><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange">Create seeker account <ArrowRight size={15}/></span></Link><Link to="/register/employer" className="rounded-2xl border border-slate-200 p-5 transition hover:border-orange hover:shadow-soft"><Building2 className="text-orange"/><b className="mt-4 block text-navy">I’m hiring</b><span className="mt-2 block text-sm text-slate-500">Register your company and find talent.</span><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange">Create employer account <ArrowRight size={15}/></span></Link></div>
    <p className="mt-7 text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-orange" to="/login">Log in</Link></p>
  </AuthFrame>;
}

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  async function submit(event) {
    event.preventDefault(); setError('');
    if (!supabaseReady) return setError('Connect Supabase first using the setup instructions above.');
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: form.email.trim(), password: form.password });
    setBusy(false);
    if (authError) return setError(authError.message);
    navigate('/dashboard', { replace: true });
  }
  return <AuthFrame eyebrow="Welcome back" title="Log in to your account" description="Sign in to continue to your SmartJob dashboard."><form className="mt-7 space-y-5" onSubmit={submit}><label className="block text-sm font-medium">Email address<input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com"/></label><label className="block text-sm font-medium">Password<input required type="password" autoComplete="current-password" className={inputClass} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Your password"/></label>{error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className={`${buttonClass} w-full`} type="submit">{busy?<LoaderCircle className="animate-spin" size={17}/>:<LogIn size={17}/>} {busy?'Signing in…':'Log in'}</button></form><p className="mt-6 text-center text-sm text-slate-600">New to SmartJob? <Link className="font-semibold text-orange" to="/get-started">Get started</Link></p></AuthFrame>;
}

function Register({ role }) {
  const navigate = useNavigate();
  const employer = role === 'employer';
  const [form,setForm]=React.useState({name:'',email:'',password:'',company:'',location:''});
  const [busy,setBusy]=React.useState(false);const [error,setError]=React.useState('');const [message,setMessage]=React.useState('');
  async function submit(event){event.preventDefault();setError('');setMessage('');if(!supabaseReady)return setError('Connect Supabase first using the setup instructions above.');if(form.password.length<8)return setError('Choose a password with at least 8 characters.');if(employer&&!form.company.trim())return setError('Enter your company name.');setBusy(true);
    const {data,error:authError}=await supabase.auth.signUp({email:form.email.trim(),password:form.password,options:{data:{full_name:form.name.trim(),role:role}}});
    if(authError){setBusy(false);return setError(authError.message);}
    if(data.session){const {error:profileError}=await supabase.from('profiles').upsert({id:data.user.id,email:form.email.trim(),full_name:form.name.trim(),role,location:form.location.trim()||null},{onConflict:'id'});if(profileError){setBusy(false);return setError(`Account created, but profile setup failed: ${profileError.message}`);}if(employer){const {error:companyError}=await supabase.from('companies').insert({owner_id:data.user.id,name:form.company.trim(),location:form.location.trim()||null,status:'pending'});if(companyError){setBusy(false);return setError(`Account created, but company setup failed: ${companyError.message}`);}}setBusy(false);navigate('/dashboard',{replace:true});return;}
    setBusy(false);setMessage('Check your email to confirm your account, then log in.');
  }
  return <AuthFrame eyebrow={employer?'Employer registration':'Job seeker registration'} title={employer?'Create your company account':'Create your job seeker account'} description={employer?'Set up a company account to start recruiting on SmartJob Rwanda.':'Build your profile and discover opportunities across Rwanda.'}>
    <form className="mt-7 space-y-4" onSubmit={submit}><label className="block text-sm font-medium">{employer?'Your full name':'Full name'}<input required maxLength={100} autoComplete="name" className={inputClass} value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>{employer&&<label className="block text-sm font-medium">Company name<input required maxLength={160} className={inputClass} value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></label>}<label className="block text-sm font-medium">Email address<input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label className="block text-sm font-medium">Location<input maxLength={120} className={inputClass} value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Kigali, Rwanda"/></label><label className="block text-sm font-medium">Password<input required minLength={8} type="password" autoComplete="new-password" className={inputClass} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 8 characters"/></label>{error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message&&<p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}<button disabled={busy} className={`${buttonClass} w-full`} type="submit">{busy?<LoaderCircle className="animate-spin" size={17}/>:null}{busy?'Creating account…':'Create account'}</button></form><p className="mt-6 text-center text-sm text-slate-600">Already registered? <Link className="font-semibold text-orange" to="/login">Log in</Link></p></AuthFrame>;
}

function Jobs() {
  const [jobs,setJobs]=React.useState([]);const [query,setQuery]=React.useState('');const [loading,setLoading]=React.useState(true);const [error,setError]=React.useState('');
  React.useEffect(()=>{let active=true;async function load(){if(!supabaseReady){setLoading(false);return;}const {data,error:dbError}=await supabase.from('jobs').select('id,title,location,employment_type,experience_level,salary_min,salary_max,description,created_at,companies(name),job_categories(name)').eq('status','approved').order('created_at',{ascending:false}).limit(100);if(!active)return;if(dbError)setError(dbError.message);else setJobs(data||[]);setLoading(false);}load();return()=>{active=false;};},[]);
  const filtered=jobs.filter(j=>`${j.title} ${j.location} ${j.companies?.name||''} ${j.job_categories?.name||''}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-orange">Opportunities</p><h1 className="mt-2 text-4xl font-bold text-navy">Browse jobs</h1><p className="mt-3 text-slate-600">Search current published roles from employers.</p></div><label className="mt-7 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><Search className="text-slate-400" size={18}/><input aria-label="Search jobs" className="w-full bg-transparent outline-none" placeholder="Search by job title, company, location or category" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="mt-7 space-y-4">{loading?<p className="text-slate-500">Loading published jobs…</p>:error?<p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">Could not load jobs: {error}</p>:filtered.length===0?<div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="font-semibold text-navy">{supabaseReady?'No published jobs found':'Connect Supabase to browse live jobs'}</h2><p className="mt-2 text-sm text-slate-500">{supabaseReady?'Try another search, or check back later for new opportunities.':'Set up your Supabase project and schema to load job listings.'}</p></div>:filtered.map(job=><article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><p className="text-sm font-semibold text-orange">{job.job_categories?.name||'Opportunity'}</p><h2 className="mt-2 text-xl font-bold text-navy">{job.title}</h2><p className="mt-1 text-sm text-slate-600">{job.companies?.name||'Company'} · {job.location} · {job.employment_type}</p>{job.description&&<p className="mt-4 text-sm leading-6 text-slate-600">{job.description}</p>}<p className="mt-3 text-xs text-slate-500">{job.experience_level||'Experience flexible'}{job.salary_min?` · RWF ${Number(job.salary_min).toLocaleString()}${job.salary_max?`–${Number(job.salary_max).toLocaleString()}`:''}`:''}</p></article>)}</div></main>;
}

function Dashboard({ session }) {
  const [profile,setProfile]=React.useState(null);const [error,setError]=React.useState('');
  React.useEffect(()=>{let active=true;if(supabaseReady&&session?.user){supabase.from('profiles').select('full_name,role').eq('id',session.user.id).maybeSingle().then(({data,error:dbError})=>{if(active){setProfile(data);if(dbError)setError(dbError.message);}});}return()=>{active=false;};},[session]);
  if(!session)return <Navigate to="/login" replace/>;
  const role=profile?.role||session.user.user_metadata?.role||'job_seeker';
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-orange">{role.replace('_',' ')}</p><h1 className="mt-2 text-4xl font-bold text-navy">Welcome{profile?.full_name?`, ${profile.full_name}`:''}</h1><p className="mt-3 text-slate-600">You’re signed in as {session.user.email}.</p>{error&&<p className="mt-4 text-sm text-red-700">Profile details could not load: {error}</p>}<div className="mt-8 grid gap-4 sm:grid-cols-2"><Link to="/jobs" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft hover:border-orange"><BriefcaseBusiness className="text-orange"/><h2 className="mt-3 font-semibold text-navy">Browse jobs</h2><p className="mt-1 text-sm text-slate-500">Find published opportunities.</p></Link>{role==='employer'&&<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><Building2 className="text-orange"/><h2 className="mt-3 font-semibold text-navy">Employer account</h2><p className="mt-1 text-sm text-slate-500">Your company profile is ready for recruitment setup.</p></div>}</div><button className="mt-8 text-sm font-semibold text-slate-600 underline" onClick={()=>supabase.auth.signOut()}>Log out</button></main>;
}

function About(){return <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><p className="text-xs font-bold uppercase tracking-[.2em] text-orange">About us</p><h1 className="mt-3 text-4xl font-bold text-navy">Connecting Rwanda’s talent and opportunity.</h1><p className="mt-5 text-lg leading-8 text-slate-600">SmartJob Rwanda helps job seekers discover work and gives employers a clear starting point to reach local talent. Create an account to get started, or browse published jobs without signing in.</p><Link className={`${buttonClass} mt-7`} to="/get-started">Get started <ArrowRight size={16}/></Link></main>}

function NotFound(){return <main className="mx-auto max-w-xl px-4 py-24 text-center"><p className="text-6xl font-bold text-orange">404</p><h1 className="mt-4 text-3xl font-bold text-navy">Page not found</h1><Link className={`${buttonClass} mt-7`} to="/">Back home</Link></main>}

function App(){const [session,setSession]=React.useState(null);const [ready,setReady]=React.useState(!supabaseReady);
  React.useEffect(()=>{if(!supabaseReady)return;supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true);});const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,nextSession)=>setSession(nextSession));return()=>subscription.unsubscribe();},[]);
  if(!ready)return <div className="grid min-h-screen place-items-center text-slate-500"><LoaderCircle className="animate-spin"/></div>;
  return <BrowserRouter><Header session={session}/><SetupNotice/><Routes><Route path="/" element={<Landing/>}/><Route path="/about" element={<About/>}/><Route path="/jobs" element={<Jobs/>}/><Route path="/get-started" element={<GetStarted/>}/><Route path="/login" element={session?<Navigate to="/dashboard" replace/>:<Login/>}/><Route path="/register/job-seeker" element={session?<Navigate to="/dashboard" replace/>:<Register role="job_seeker"/>}/><Route path="/register/employer" element={session?<Navigate to="/dashboard" replace/>:<Register role="employer"/>}/><Route path="/dashboard" element={<Dashboard session={session}/>}/><Route path="*" element={<NotFound/>}/></Routes><footer className="mt-16 border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} SmartJob Rwanda</span><div className="flex gap-5"><Link to="/about">About</Link><Link to="/jobs">Browse jobs</Link><Link to="/get-started">Get started</Link></div></div></footer></BrowserRouter>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
