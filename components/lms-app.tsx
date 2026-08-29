'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3, Bell, BookOpen, CalendarDays, ChevronRight, CircleHelp,
  FileCheck2, FileText, GraduationCap, LayoutDashboard, Library, Mail,
  Menu, MessageSquareText, Search, Settings, ShieldCheck, Users, Video, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ViewRouter } from '@/components/lms-views';
import { StudentProvider, useStudentRecord } from '@/components/student-provider';
import { moduleOneCourses, moduleTwoAssessments, moduleTwoCourses, STUDENT_PROFILE } from '@/lib/module-two';

const AUTH_KEY = 'ucl-lms-auth:L-PK-625900';
const zoomUrl = 'https://zoom.us/join';

const nav = [
  [LayoutDashboard, 'Home', 'dashboard'], [GraduationCap, 'My Programme', 'programme'], [BookOpen, 'My Modules', 'modules'],
  [FileText, 'Assignments', 'assignments'], [FileCheck2, 'Exams', 'exams'], [BarChart3, 'Grades', 'grades'], [CalendarDays, 'Calendar', 'calendar'], [Video, 'Live Classes', 'live'],
  [Users, 'Community', 'community'], [Mail, 'Messages', 'messages'], [MessageSquareText, 'AI Assistant', 'assistant'],
  [Library, 'Resources', 'resources'], [CircleHelp, 'Help & Support', 'help'],
] as const;

export function LmsApp() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(localStorage.getItem(AUTH_KEY) === STUDENT_PROFILE.id);
  }, []);

  if (!signedIn) {
    return <SignIn onSignIn={() => {
      localStorage.setItem(AUTH_KEY, STUDENT_PROFILE.id);
      setSignedIn(true);
    }} />;
  }

  return <StudentProvider><AppShell onSignOut={() => {
    localStorage.removeItem(AUTH_KEY);
    setSignedIn(false);
  }}/></StudentProvider>;
}

function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const { record, hydrated } = useStudentRecord();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [active, setActive] = useState('dashboard');

  useEffect(() => {
    const sync = () => setActive(location.hash.replace('#/', '') || 'dashboard');
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = record.settings.textSize === 'Large' ? '18px' : '16px';
    document.documentElement.style.filter = record.settings.highContrast ? 'contrast(1.12)' : '';
    document.documentElement.style.scrollBehavior = record.settings.reduceMotion ? 'auto' : 'smooth';
  }, [record.settings]);

  const navigate = (key: string) => {
    location.hash = '/' + key;
    setActive(key);
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: record.settings.reduceMotion ? 'auto' : 'smooth' });
  };

  return <div className="min-h-screen bg-[#f4f5f6]">
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[#d2c8d8] bg-white px-4 lg:px-6">
      <button className="focus-ring mr-3 rounded p-1.5 lg:hidden" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu size={21}/></button>
      <button onClick={() => navigate('dashboard')} className="flex min-w-0 items-center gap-3 text-left">
        <img src="/ucl-logo.png" alt="UCL" className="h-10 w-[104px] object-cover object-left"/>
        <div className="hidden min-w-0 sm:block"><div className="truncate text-sm font-bold text-[#32104f]">UCL Distance Learning</div><div className="text-[11px] text-slate-500">Student Learning Environment</div></div>
      </button>
      <button onClick={() => setSearchOpen(true)} className="focus-ring mx-auto hidden h-9 w-[min(34vw,440px)] items-center gap-2 rounded border border-[#cbd2d9] bg-[#f8f9fa] px-3 text-left text-sm text-slate-500 md:flex"><Search size={16}/> Search courses, lessons and resources <span className="ml-auto text-xs">Ctrl K</span></button>
      <div className="ml-auto flex items-center gap-1">
        <span className="mr-2 hidden items-center gap-1 text-[10px] text-emerald-700 xl:flex"><ShieldCheck size={13}/>{hydrated ? 'Profile saved' : 'Loading profile'}</span>
        <button className="focus-ring relative rounded p-2 text-slate-600 hover:bg-slate-100" aria-label="Notifications"><Bell size={19}/><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#d5006d]"/></button>
        <button onClick={() => navigate('messages')} className="focus-ring hidden rounded p-2 text-slate-600 hover:bg-slate-100 sm:block" aria-label="Messages"><Mail size={19}/></button>
        <button onClick={() => navigate('settings')} className="focus-ring ml-1 flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100"><span className="grid size-8 place-items-center rounded-full bg-[#f2eafa] text-xs font-bold text-[#500778]">MA</span><span className="hidden text-xs leading-tight sm:block"><b className="block">{STUDENT_PROFILE.name}</b><span className="text-slate-500">{STUDENT_PROFILE.id}</span></span></button>
      </div>
    </header>

    <aside className={'fixed inset-y-0 left-0 z-50 w-64 border-r border-[#402155] bg-[#32104f] text-white transition-transform lg:top-16 lg:z-30 lg:w-56 ' + (navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 lg:hidden"><img src="/ucl-logo.png" alt="UCL" className="h-10 w-28 object-cover object-left"/><button className="rounded p-2 hover:bg-white/10" onClick={() => setNavOpen(false)} aria-label="Close navigation"><X size={20}/></button></div>
      <nav className="p-3" aria-label="Primary navigation">{nav.map(([Icon,label,key]) => <button key={label} onClick={() => navigate(key)} className={'focus-ring mb-0.5 flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ' + (active === key ? 'bg-white font-semibold text-[#500778]' : 'text-purple-50 hover:bg-white/10')}><Icon size={17}/><span>{label}</span>{label === 'Messages' && <span className="ml-auto rounded-full bg-[#00a6a6] px-1.5 text-[10px] font-bold text-white">3</span>}</button>)}<div className="my-3 border-t border-white/15"/><button onClick={() => navigate('settings')} className={'focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ' + (active === 'settings' ? 'bg-white font-semibold text-[#500778]' : 'text-purple-50 hover:bg-white/10')}><Settings size={17}/> Profile & Settings</button><button onClick={onSignOut} className="focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-purple-50 hover:bg-white/10">Sign out</button></nav>
    </aside>

    <main className="min-w-0 lg:ml-56"><div className="border-b border-[#d4d9de] bg-white px-4 py-2 text-xs text-slate-500 lg:px-7">UCL <ChevronRight className="mx-1 inline" size={12}/> {nav.find(item => item[2] === active)?.[1] || 'Profile & Settings'}</div>{active === 'dashboard' ? <Dashboard navigate={navigate}/> : <ViewRouter active={active} navigate={navigate}/>}</main>
    {navOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-black/35 lg:hidden" onClick={() => setNavOpen(false)}/>}
    {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} navigate={navigate}/>}
  </div>;
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  const [studentId, setStudentId] = useState(STUDENT_PROFILE.id);
  const [password, setPassword] = useState('1621111');
  const [error, setError] = useState('');
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (studentId.trim().toUpperCase() === STUDENT_PROFILE.id && password === '1621111') {
      setError('');
      onSignIn();
    } else {
      setError('The student ID or password is incorrect.');
    }
  };
  return <div className="grid min-h-screen lg:grid-cols-[minmax(340px,520px)_1fr]">
    <main className="flex flex-col justify-between bg-white p-7 sm:p-12 lg:p-16">
      <div><img src="/ucl-logo.png" alt="University College London" className="h-[68px] w-[176px] object-cover object-left"/><p className="mt-3 text-xs font-semibold uppercase tracking-[.08em] text-[#500778]">Distance Learning Environment</p></div>
      <form className="my-10 max-w-sm" onSubmit={submit}><p className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-[#500778]">Student access</p><h1 className="text-3xl font-bold tracking-tight text-[#32104f]">Sign in to your studies</h1><p className="mt-2 text-sm leading-6 text-slate-600">Your Module 1 record and latest Module 2 content are linked to this profile.</p><label className="mt-7 block text-sm font-semibold" htmlFor="student-id">Student ID</label><Input id="student-id" required autoComplete="username" value={studentId} onChange={event => setStudentId(event.target.value)} className="mt-1.5 h-10 rounded"/><label className="mt-4 block text-sm font-semibold" htmlFor="password">Password</label><Input id="password" required type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-1.5 h-10 rounded"/><label className="mt-3 flex items-center gap-2 text-xs"><input type="checkbox" defaultChecked/> Keep me signed in on this device</label>{error && <div role="alert" className="mt-4 border-l-4 border-red-600 bg-red-50 p-3 text-xs text-red-900">{error}</div>}<Button type="submit" className="mt-6 h-10 w-full rounded bg-[#500778] hover:bg-[#3d075d]">Sign in</Button><div className="mt-5 rounded border border-[#d6dce1] bg-[#f8f6fa] p-3 text-xs leading-5 text-slate-600"><b>Student profile</b><br/>ID: L-PK-625900<br/>Password: 1621111</div></form>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><a href="#/help">IT Support</a><a href="#/settings">Accessibility</a><a href="#">Privacy</a><a href="#">System status</a></div>
    </main>
    <aside className="hidden bg-[#32104f] p-16 text-white lg:flex lg:flex-col lg:justify-end"><img src="/ucl-logo.png" alt="" className="mb-auto h-24 w-64 object-cover object-left"/><p className="text-sm font-bold uppercase tracking-[.12em] text-[#86d1d4]">Module 2 now available</p><h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">Software Development and Commercialization</h2><p className="mt-4 max-w-xl text-base leading-7 text-purple-100">Four parallel courses, 64 structured lessons and one integrated software product from discovery through deployment and market launch.</p><div className="mt-10 border-t border-white/20 pt-5 text-sm text-purple-200">Progress and activity are saved under L-PK-625900 on this device.</div></aside>
  </div>;
}

function Dashboard({ navigate }: { navigate: (key: string) => void }) {
  const { record } = useStudentRecord();
  const completed = moduleTwoCourses.flatMap(course => course.lessons || []).filter(lesson => record.completedLessonIds.includes(lesson.id)).length;
  return <div className="mx-auto max-w-[1440px] p-4 lg:p-7">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm text-slate-500">Academic Year 2026–27 · Distance Learning</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#32104f]">Welcome back, Muhammad</h1><p className="mt-1 text-sm text-slate-600">{STUDENT_PROFILE.programme} · Student ID {STUDENT_PROFILE.id}</p></div><div className="flex gap-2"><Badge variant="outline" className="rounded border-emerald-200 bg-emerald-50 text-emerald-800">Active student</Badge><Badge variant="outline" className="rounded border-purple-200 bg-purple-50 text-[#500778]">Saved {record.lastSavedAt}</Badge></div></div>
    <div className="mb-5 flex gap-3 border-l-4 border-[#500778] bg-[#f2eafa] p-3.5 text-sm text-[#32104f]"><Layers3Icon/><span><b>Module 2 added:</b> Software Development and Commercialization is now your latest module with four courses and 64 lessons.</span><button onClick={() => navigate('modules')} className="ml-auto shrink-0 font-semibold underline">Open</button></div>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.72fr)]"><div className="space-y-5">
      <section className="overflow-hidden border bg-white"><SectionHead title="Upcoming Module 2 deadlines" action="View assignments" onAction={() => navigate('assignments')}/><div className="overflow-x-auto"><table className="academic-table min-w-[720px]"><thead><tr><th>Assessment</th><th>Deadline</th><th>Weight</th><th>Status</th><th></th></tr></thead><tbody>{moduleTwoAssessments.slice(0,3).map(item => <tr key={item.title}><td><b className="block text-[#500778]">{item.title}</b><span className="text-xs text-slate-500">{item.course}</span></td><td>{item.due}<span className="block text-xs text-slate-500">20:00 Pakistan time</span></td><td>{item.weight}</td><td><Badge variant="outline" className="rounded bg-amber-50 text-amber-800">Not submitted</Badge></td><td><Button size="sm" variant="outline" className="rounded" onClick={() => navigate('assignments')}>View</Button></td></tr>)}</tbody></table></div></section>
      <section className="border bg-white"><SectionHead title="Latest active courses" action="View all courses" onAction={() => navigate('modules')}/><div className="divide-y">{moduleTwoCourses.map(course => { const count = course.lessons?.filter(lesson => record.completedLessonIds.includes(lesson.id)).length || 0; const progress = Math.round(count/16*100); return <div key={course.id} className="grid gap-4 p-4 sm:grid-cols-[1fr_190px_auto] sm:items-center"><div><button onClick={() => navigate('modules')} className="text-left font-semibold text-[#500778] hover:underline">{course.code} — {course.title}</button><p className="mt-1 text-xs text-slate-500">{course.leader} · {course.day}</p></div><div><div className="mb-1 flex justify-between text-xs text-slate-500"><span>Learning progress</span><b>{progress}%</b></div><Progress value={progress} className="[&_[data-slot=progress-indicator]]:bg-[#500778]"/></div><Button variant="ghost" size="sm" className="rounded text-[#500778]" onClick={() => navigate('modules')}>Open <ChevronRight/></Button></div>})}</div><div className="border-t bg-[#fafafa] px-4 py-2 text-xs text-slate-500">Module 2 completion: {completed} of 64 lessons · Module 1 history remains unchanged.</div></section>
    </div><div className="space-y-5">
      <section className="border bg-white"><SectionHead title="Next live classes" action="Full timetable" onAction={() => navigate('live')}/><div className="divide-y">{moduleTwoCourses.slice(0,2).map((course,index) => <div key={course.id} className="p-4"><div className="flex gap-3"><div className="w-14 text-sm font-bold text-[#500778]">{13+index}:00<span className="block text-[10px] font-normal text-slate-500">Pakistan</span></div><div><b className="block text-sm">{course.lessons?.[0].title}</b><span className="text-xs text-slate-500">{course.code} · {course.day}</span></div></div><a href={zoomUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-8 items-center gap-1.5 rounded bg-[#500778] px-3 text-sm font-semibold text-white"><Video size={15}/> Join meeting on Zoom</a></div>)}</div></section>
      <section className="border bg-white"><SectionHead title="Previous Module 1 progress"/><div className="divide-y">{moduleOneCourses.map(course => <div key={course.id} className="p-3.5"><div className="flex justify-between text-sm"><b>{course.title}</b><span>{course.progress}%</span></div><Progress value={course.progress} className="mt-2 [&_[data-slot=progress-indicator]]:bg-[#00a6a6]"/></div>)}</div></section>
      <section className="border bg-white"><SectionHead title="Recent announcements"/><div className="divide-y">{['Module 2 learning content is now available.','All live-class buttons now open Zoom.','Your Module 1 record has been retained.'].map((item,index) => <div key={item} className="p-3.5"><b className="text-sm text-[#32104f]">{item}</b><span className="mt-1 block text-xs text-slate-500">{index === 0 ? 'Today' : index + ' days ago'} · Programme Office</span></div>)}</div></section>
    </div></div>
  </div>;
}

function Layers3Icon() {
  return <BookOpen className="shrink-0 text-[#500778]" size={19}/>;
}

function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="flex items-center justify-between border-b px-4 py-3"><h2 className="text-[15px] font-bold text-[#32104f]">{title}</h2>{action && <button onClick={onAction} className="text-xs font-semibold text-[#500778] hover:underline">{action}</button>}</div>;
}

function SearchPanel({ onClose, navigate }: { onClose: () => void; navigate: (key: string) => void }) {
  const results = ['COMP2001 — Agile Software Projects','Week 1 — Software Engineering and the SDLC','Object-Oriented Programming Assignment 1','Module 2 Integrated Software Project'];
  return <div className="fixed inset-0 z-[70] bg-black/40 p-4" onMouseDown={onClose}><div className="mx-auto mt-[10vh] max-w-2xl border bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}><div className="flex items-center border-b p-3"><Search className="ml-1 text-slate-500" size={18}/><Input autoFocus placeholder="Search UCL learning" className="h-10 border-0 shadow-none focus-visible:ring-0"/><button onClick={onClose} className="rounded p-2 hover:bg-slate-100" aria-label="Close search"><X size={18}/></button></div><div className="p-3"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Suggested results</p>{results.map((result,index) => <button key={result} onClick={() => { onClose(); navigate(index === 2 ? 'assignments' : 'modules'); }} className="flex w-full items-center gap-3 border-b px-2 py-3 text-left text-sm hover:bg-slate-50"><span className="grid size-7 place-items-center bg-[#f2eafa] text-[#500778]">{index+1}</span>{result}<ChevronRight className="ml-auto" size={15}/></button>)}</div></div></div>;
}
