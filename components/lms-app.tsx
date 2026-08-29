'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Bell, BookOpen, CalendarDays, ChevronRight, CircleHelp, FileCheck2, FileText, GraduationCap, LayoutDashboard, Library, Mail, Menu, MessageSquareText, Search, Settings, Users, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ViewRouter } from '@/components/lms-views';

const modules = [
  { code: 'EDUC0011', title: 'Digital Learning Environments', leader: 'Dr Maya Okafor', progress: 68 },
  { code: 'EDUC0012', title: 'Research Methods', leader: 'Dr Sarah Bennett', progress: 54 },
  { code: 'EDUC0013', title: 'Learning Analytics', leader: 'Prof. Daniel Wu', progress: 73 },
];

const deadlines = [
  ['EDUC0012', 'Research Proposal', '3 Sep, 16:00', '5 days', '30%', 'Draft saved'],
  ['EDUC0013', 'Learning Analytics Report', '10 Sep, 16:00', '12 days', '40%', 'Not submitted'],
  ['EDUC0011', 'Critical Review', '18 Sep, 16:00', '20 days', '35%', 'Not submitted'],
];

const nav = [
  [LayoutDashboard, 'Home', 'dashboard'], [GraduationCap, 'My Programme', 'programme'], [BookOpen, 'My Modules', 'modules'],
  [FileText, 'Assignments', 'assignments'], [FileCheck2, 'Exams', 'exams'], [BarChart3, 'Grades', 'grades'], [CalendarDays, 'Calendar', 'calendar'], [Video, 'Live Classes', 'live'],
  [Users, 'Community', 'community'], [Mail, 'Messages', 'messages'], [MessageSquareText, 'AI Assistant', 'assistant'],
  [Library, 'Resources', 'resources'], [CircleHelp, 'Help & Support', 'help'],
] as const;

export function LmsApp() {
  const [signedIn, setSignedIn] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState('dashboard');

  useEffect(() => {
    setSignedIn(localStorage.getItem('campus-auth') === 'true');
    const sync = () => setActive(location.hash.replace('#/', '') || 'dashboard');
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const navigate = (key: string) => {
    location.hash = `/${key}`;
    setActive(key);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!signedIn) return <SignIn onSignIn={() => { localStorage.setItem('campus-auth', 'true'); setSignedIn(true); }} />;

  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[#ccd2d8] bg-white px-4 lg:px-6">
        <button className="focus-ring mr-3 rounded p-1.5 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 place-items-center bg-[#17365d] text-sm font-bold text-white">CL</div>
          <div className="min-w-0"><div className="truncate text-sm font-bold text-[#17365d]">Campus Learning</div><div className="hidden text-[11px] text-slate-500 sm:block">Distance Learning Environment</div></div>
        </div>
        <button onClick={() => setSearchOpen(true)} className="focus-ring mx-auto hidden h-9 w-[min(36vw,460px)] items-center gap-2 rounded border border-[#cbd2d9] bg-[#f8f9fa] px-3 text-left text-sm text-slate-500 md:flex"><Search size={16} /> Search modules, assignments and resources <span className="ml-auto text-xs">Ctrl K</span></button>
        <div className="ml-auto flex items-center gap-1">
          <button className="focus-ring relative rounded p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#b42318]" /></button>
          <button className="focus-ring hidden rounded p-2 text-slate-600 hover:bg-slate-100 sm:block" aria-label="Messages"><Mail size={19} /></button>
          <button className="focus-ring ml-1 flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100"><span className="grid size-8 place-items-center rounded-full bg-[#e8f1f1] text-xs font-bold text-[#0f5960]">AM</span><span className="hidden text-xs leading-tight sm:block"><b className="block">Alex Morgan</b><span className="text-slate-500">Student</span></span></button>
        </div>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[#cbd2d8] bg-[#172b45] text-white transition-transform lg:top-16 lg:z-30 lg:w-56 ${navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 lg:hidden"><b>Navigation</b><button className="rounded p-2 hover:bg-white/10" onClick={() => setNavOpen(false)} aria-label="Close navigation"><X size={20} /></button></div>
        <nav className="p-3" aria-label="Primary navigation">
          {nav.map(([Icon, label, key]) => <button key={label} onClick={() => navigate(key)} className={`focus-ring mb-0.5 flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ${active === key ? 'bg-white font-semibold text-[#17365d]' : 'text-slate-200 hover:bg-white/10'}`}><Icon size={17} /><span>{label}</span>{label === 'Messages' && <span className="ml-auto rounded-full bg-[#cfe6e5] px-1.5 text-[10px] font-bold text-[#17365d]">3</span>}</button>)}
          <div className="my-3 border-t border-white/15" />
          <button onClick={() => navigate('settings')} className={`focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ${active === 'settings' ? 'bg-white font-semibold text-[#17365d]' : 'text-slate-200 hover:bg-white/10'}`}><Settings size={17} /> Settings</button>
          <button onClick={() => { localStorage.removeItem('campus-auth'); setSignedIn(false); }} className="focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10">Sign out</button>
        </nav>
      </aside>

      <main className="min-w-0 lg:ml-56">
        <div className="border-b border-[#d4d9de] bg-white px-4 py-2 text-xs text-slate-500 lg:px-7">Campus Learning <ChevronRight className="mx-1 inline" size={12} /> {nav.find(n => n[2] === active)?.[1] || 'Settings'}</div>
        {active === 'dashboard' ? <Dashboard /> : <ViewRouter active={active} navigate={navigate} />}
      </main>

      {navOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setNavOpen(false)} />}
      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  return <div className="grid min-h-screen lg:grid-cols-[minmax(340px,520px)_1fr]">
    <main className="flex flex-col justify-between bg-white p-7 sm:p-12 lg:p-16">
      <div className="flex items-center gap-3"><div className="grid size-11 place-items-center bg-[#17365d] font-bold text-white">CL</div><div><b className="text-[#17365d]">Campus Learning</b><p className="text-xs text-slate-500">Distance Learning Environment</p></div></div>
      <form className="my-12 max-w-sm" onSubmit={(e) => { e.preventDefault(); onSignIn(); }}>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-[#0f5960]">Student access</p><h1 className="text-3xl font-bold tracking-tight text-[#172b45]">Sign in to your studies</h1><p className="mt-2 text-sm leading-6 text-slate-600">Access your modules, assessments and university support services.</p>
        <label className="mt-7 block text-sm font-semibold">University email or username</label><Input required defaultValue="student.demo@example.test" className="mt-1.5 h-10 rounded" />
        <label className="mt-4 block text-sm font-semibold">Password</label><Input required type="password" defaultValue="DemoStudent2026!" className="mt-1.5 h-10 rounded" />
        <div className="mt-3 flex justify-between text-xs"><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Remember me</label><a href="#" className="text-[#0f5960] underline">Forgotten password?</a></div>
        <Button type="submit" className="mt-6 h-10 w-full rounded bg-[#17365d]">Sign in</Button><Button type="button" variant="outline" className="mt-3 h-10 w-full rounded">Sign in with University Account</Button>
        <div className="mt-5 rounded border border-[#d6dce1] bg-[#f5f7f8] p-3 text-xs leading-5 text-slate-600"><b>Demo account</b><br />student.demo@example.test · DemoStudent2026!</div>
      </form>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><a href="#">IT Support</a><a href="#">Accessibility</a><a href="#">Privacy</a><a href="#">System status</a></div>
    </main>
    <aside className="hidden bg-[#17365d] p-16 text-white lg:flex lg:flex-col lg:justify-end"><p className="text-sm font-bold uppercase tracking-[.12em] text-[#a9d3d1]">Academic Year 2026–27</p><h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">A reliable place for learning, wherever you are.</h2><p className="mt-4 max-w-xl text-base leading-7 text-slate-200">Plan your week, join live teaching and keep every assessment, conversation and resource in one academic environment.</p><div className="mt-10 border-t border-white/20 pt-5 text-sm text-slate-300">Times and deadlines are shown in both university and your local time zone.</div></aside>
  </div>;
}

function Dashboard() {
  return <div className="mx-auto max-w-[1440px] p-4 lg:p-7">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-slate-500">Saturday, 29 August 2026</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172b45]">Good afternoon, Alex</h1><p className="mt-1 text-sm text-slate-600">MSc Digital Education · Distance Learning · Academic Year 2026–27</p></div><Badge variant="outline" className="rounded border-emerald-200 bg-emerald-50 text-emerald-800">Student status: Active</Badge></div>
    <div className="mb-5 flex gap-3 border-l-4 border-amber-500 bg-amber-50 p-3.5 text-sm text-amber-950"><span><b>Scheduled maintenance:</b> Campus Learning will be unavailable Sunday, 02:00–04:00 UK time.</span><button className="ml-auto shrink-0 font-semibold underline">Details</button></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.72fr)]">
      <div className="space-y-5">
        <section className="overflow-hidden border border-[#d3d9df] bg-white"><SectionHead title="Upcoming deadlines" action="View all assignments" /><div className="overflow-x-auto"><table className="academic-table min-w-[720px]"><thead><tr><th>Assessment</th><th>Deadline</th><th>Remaining</th><th>Weight</th><th>Status</th><th></th></tr></thead><tbody>{deadlines.map(d => <tr key={d[1]}><td><b className="block text-[#17365d]">{d[1]}</b><span className="text-xs text-slate-500">{d[0]}</span></td><td>{d[2]}<span className="block text-xs text-slate-500">London · 20:00 Pakistan</span></td><td>{d[3]}</td><td>{d[4]}</td><td><Badge variant="outline" className="rounded bg-amber-50 text-amber-800">{d[5]}</Badge></td><td><Button size="sm" variant="outline" className="rounded">View</Button></td></tr>)}</tbody></table></div></section>
        <section className="border border-[#d3d9df] bg-white"><SectionHead title="Active modules" action="View all modules" /><div className="divide-y divide-[#e1e5e8]">{modules.map(m => <div key={m.code} className="grid gap-4 p-4 sm:grid-cols-[1fr_190px_auto] sm:items-center"><div><button className="text-left font-semibold text-[#17365d] hover:underline">{m.code} — {m.title}</button><p className="mt-1 text-xs text-slate-500">Module Leader: {m.leader} · Term 1</p></div><div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Learning progress</span><b>{m.progress}%</b></div><Progress value={m.progress} className="[&_[data-slot=progress-indicator]]:bg-[#236a73]" /></div><Button variant="ghost" size="sm" className="justify-start rounded text-[#0f5960]">Open module <ChevronRight /></Button></div>)}</div></section>
      </div>
      <div className="space-y-5">
        <section className="border border-[#d3d9df] bg-white"><SectionHead title="Today’s schedule" action="Timetable" /><div className="divide-y divide-[#e1e5e8]">{[['14:00','EDUC0013','Learning Analytics seminar','Dr Priya Shah'],['16:30','EDUC0012','Research methods office hour','Dr Sarah Bennett']].map(s => <div key={s[0]} className="p-4"><div className="flex gap-3"><div className="w-12 text-sm font-bold text-[#17365d]">{s[0]}<span className="block text-[10px] font-normal text-slate-500">London</span></div><div><b className="block text-sm">{s[2]}</b><span className="text-xs text-slate-500">{s[1]} · {s[3]}</span></div></div><Button size="sm" className="mt-3 rounded bg-[#236a73]">Join online session</Button></div>)}</div></section>
        <section className="border border-[#d3d9df] bg-white"><SectionHead title="Recent announcements" action="View all" /><div className="divide-y divide-[#e1e5e8]">{['Week 6 lecture recording is now available.','Assessment 1 marking rubric has been published.','Virtual office hours have moved to Thursday.'].map((a,i) => <button key={a} className="block w-full p-3.5 text-left hover:bg-slate-50"><b className="text-sm text-[#17365d]">{a}</b><span className="mt-1 block text-xs text-slate-500">{i + 1} day{i ? 's' : ''} ago · EDUC001{i+1}</span></button>)}</div></section>
        <section className="border border-[#d3d9df] bg-white"><SectionHead title="Recent feedback" /><div className="p-4"><div className="flex items-start justify-between"><div><b className="text-sm">Research Methods Literature Review</b><p className="mt-1 text-xs text-slate-500">Feedback released 24 August 2026</p></div><div className="text-right text-2xl font-bold text-[#17365d]">72<span className="text-sm font-normal text-slate-500">/100</span></div></div><Button variant="outline" size="sm" className="mt-3 rounded">Read feedback</Button></div></section>
      </div>
    </div>
  </div>;
}

function SectionHead({ title, action }: { title: string; action?: string }) { return <div className="flex items-center justify-between border-b border-[#d9dee2] px-4 py-3"><h2 className="text-[15px] font-bold text-[#172b45]">{title}</h2>{action && <button className="text-xs font-semibold text-[#0f5960] hover:underline">{action}</button>}</div>; }

function SearchPanel({ onClose }: { onClose: () => void }) { return <div className="fixed inset-0 z-[70] bg-black/40 p-4" onMouseDown={onClose}><div className="mx-auto mt-[10vh] max-w-2xl border border-[#cbd2d8] bg-white shadow-2xl" onMouseDown={e => e.stopPropagation()}><div className="flex items-center border-b p-3"><Search className="ml-1 text-slate-500" size={18} /><Input autoFocus placeholder="Search Campus Learning" className="h-10 border-0 shadow-none focus-visible:ring-0" /><button onClick={onClose} className="rounded p-2 hover:bg-slate-100" aria-label="Close search"><X size={18} /></button></div><div className="p-3"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Suggested results</p>{['EDUC0012 — Research Methods','Research Proposal — Assignment','Week 4 — Statistical Inference','Extension and extenuating circumstances'].map((r,i) => <button key={r} className="flex w-full items-center gap-3 border-b px-2 py-3 text-left text-sm hover:bg-slate-50"><span className="grid size-7 place-items-center bg-slate-100 text-slate-500">{i+1}</span>{r}<ChevronRight className="ml-auto" size={15} /></button>)}</div></div></div>; }
