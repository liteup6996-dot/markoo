'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  Mail,
  Menu,
  MessageSquareText,
  RefreshCw,
  Search,
  Settings,
  Users,
  Video,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ViewRouter } from '@/components/lms-views';
import {
  StudentProvider,
  useStudentRecord,
} from '@/components/student-provider';
import {
  moduleOneCourses,
  moduleTwoAssessments,
  moduleTwoCourses,
  learningResources,
  STUDENT_PROFILE,
} from '@/lib/module-two';

const AUTH_KEY = 'ucl-lms-auth:L-PK-625900';
const zoomUrl = 'https://zoom.us/join';

const nav = [
  [LayoutDashboard, 'Home', 'dashboard'],
  [GraduationCap, 'My Programme', 'programme'],
  [BookOpen, 'My Modules', 'modules'],
  [FileText, 'Assignments', 'assignments'],
  [FileCheck2, 'Exams', 'exams'],
  [BarChart3, 'Grades', 'grades'],
  [CalendarDays, 'Calendar', 'calendar'],
  [Video, 'Live Classes', 'live'],
  [Users, 'Community', 'community'],
  [Mail, 'Messages', 'messages'],
  [MessageSquareText, 'AI Assistant', 'assistant'],
  [Library, 'Resources', 'resources'],
  [CircleHelp, 'Help & Support', 'help'],
] as const;

export function LmsApp() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setSignedIn(localStorage.getItem(AUTH_KEY) === STUDENT_PROFILE.id);
  }, []);

  if (!signedIn) {
    return (
      <SignIn
        onSignIn={() => {
          localStorage.setItem(AUTH_KEY, STUDENT_PROFILE.id);
          setSignedIn(true);
        }}
      />
    );
  }

  return (
    <StudentProvider>
      <AppShell
        onSignOut={() => {
          localStorage.removeItem(AUTH_KEY);
          setSignedIn(false);
        }}
      />
    </StudentProvider>
  );
}

function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const {
    record,
    markNotificationRead,
    markAllNotificationsRead,
    runAutoUpdate,
  } = useStudentRecord();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [active, setActive] = useState('dashboard');
  const unreadNotifications = record.notifications.filter(
    (item) => !item.read,
  ).length;
  const unreadMessages = record.inboxMessages.filter(
    (item) => !item.read,
  ).length;

  useEffect(() => {
    const sync = () =>
      setActive(location.hash.replace('#/', '') || 'dashboard');
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize =
      record.settings.textSize === 'Large' ? '18px' : '16px';
    document.documentElement.style.filter = record.settings.highContrast
      ? 'contrast(1.12)'
      : '';
    document.documentElement.style.scrollBehavior = record.settings.reduceMotion
      ? 'auto'
      : 'smooth';
  }, [record.settings]);

  const navigate = (key: string) => {
    location.hash = '/' + key;
    setActive(key);
    setNavOpen(false);
    setNotificationsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: record.settings.reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-[#d2c8d8] bg-white px-4 lg:px-6">
        <button
          className="focus-ring mr-3 rounded p-1.5 lg:hidden"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={21} />
        </button>
        <button
          onClick={() => navigate('dashboard')}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <Image
            src="/ucl-logo.png"
            alt="UCL"
            width={104}
            height={40}
            priority
            className="h-10 w-[104px] object-cover object-left"
          />
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-bold text-[#32104f]">
              UCL Distance Learning
            </div>
            <div className="text-[11px] text-slate-500">
              Student Learning Environment
            </div>
          </div>
        </button>
        <button
          onClick={() => setSearchOpen(true)}
          className="focus-ring mx-auto hidden h-9 w-[min(34vw,440px)] items-center gap-2 rounded border border-[#cbd2d9] bg-[#f8f9fa] px-3 text-left text-sm text-slate-500 md:flex"
        >
          <Search size={16} /> Search courses, lessons and resources{' '}
          <span className="ml-auto text-xs">Ctrl K</span>
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setNotificationsOpen((open) => !open)}
            className="focus-ring relative rounded p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell size={19} />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-[#d5006d] px-1 text-[9px] font-bold text-white">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('messages')}
            className="focus-ring hidden rounded p-2 text-slate-600 hover:bg-slate-100 sm:block"
            aria-label="Messages"
          >
            <Mail size={19} />
          </button>
          <button
            onClick={() => navigate('settings')}
            className="focus-ring ml-1 flex items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-slate-100"
          >
            <span className="grid size-8 place-items-center rounded-full bg-[#f2eafa] text-xs font-bold text-[#500778]">
              MA
            </span>
            <span className="hidden text-xs leading-tight sm:block">
              <b className="block">{STUDENT_PROFILE.name}</b>
              <span className="text-slate-500">{STUDENT_PROFILE.id}</span>
            </span>
          </button>
        </div>
      </header>

      {notificationsOpen && (
        <section className="fixed right-3 top-[60px] z-[60] w-[min(94vw,390px)] border border-[#cbd2d9] bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-[#32104f]">
                Notifications
              </h2>
              <p className="text-[11px] text-slate-500">
                {unreadNotifications} unread · updates arrive automatically
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={runAutoUpdate}
                className="rounded p-2 text-[#500778] hover:bg-[#f2eafa]"
                aria-label="Check for updates"
                title="Check for updates"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={markAllNotificationsRead}
                className="rounded p-2 text-[#500778] hover:bg-[#f2eafa]"
                aria-label="Mark all notifications read"
                title="Mark all as read"
              >
                <CheckCheck size={17} />
              </button>
            </div>
          </div>
          <div className="max-h-[430px] overflow-y-auto">
            {record.notifications.slice(0, 12).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  navigate(item.target);
                }}
                className={
                  'block w-full border-b p-3 text-left hover:bg-slate-50 ' +
                  (!item.read ? 'bg-[#faf6fd]' : '')
                }
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-[#32104f]">
                  {!item.read && (
                    <span className="size-2 shrink-0 rounded-full bg-[#d5006d]" />
                  )}
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">
                  {item.body}
                </span>
                <span className="mt-1 block text-[10px] text-slate-400">
                  {item.createdAt}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <aside
        className={
          'fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto overscroll-contain border-r border-[#402155] bg-[#32104f] text-white transition-transform lg:top-16 lg:z-30 lg:w-56 ' +
          (navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
        }
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4 lg:hidden">
          <Image
            src="/ucl-logo.png"
            alt="UCL"
            width={112}
            height={40}
            className="h-10 w-28 object-cover object-left"
          />
          <button
            className="rounded p-2 hover:bg-white/10"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="min-h-full p-3 pb-8" aria-label="Primary navigation">
          {nav.map(([Icon, label, key]) => (
            <button
              key={label}
              onClick={() => navigate(key)}
              className={
                'focus-ring mb-0.5 flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ' +
                (active === key
                  ? 'bg-white font-semibold text-[#500778]'
                  : 'text-purple-50 hover:bg-white/10')
              }
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === 'Messages' && unreadMessages > 0 && (
                <span className="ml-auto rounded-full bg-[#00a6a6] px-1.5 text-[10px] font-bold text-white">
                  {unreadMessages}
                </span>
              )}
            </button>
          ))}
          <div className="my-3 border-t border-white/15" />
          <button
            onClick={() => navigate('settings')}
            className={
              'focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm ' +
              (active === 'settings'
                ? 'bg-white font-semibold text-[#500778]'
                : 'text-purple-50 hover:bg-white/10')
            }
          >
            <Settings size={17} /> Profile & Settings
          </button>
          <button
            onClick={onSignOut}
            className="focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm text-purple-50 hover:bg-white/10"
          >
            Sign out
          </button>
        </nav>
      </aside>

      <main className="min-w-0 lg:ml-56">
        <div className="border-b border-[#d4d9de] bg-white px-4 py-2 text-xs text-slate-500 lg:px-7">
          UCL <ChevronRight className="mx-1 inline" size={12} />{' '}
          {nav.find((item) => item[2] === active)?.[1] || 'Profile & Settings'}
        </div>
        {active === 'dashboard' ? (
          <Dashboard navigate={navigate} />
        ) : (
          <ViewRouter active={active} navigate={navigate} />
        )}
      </main>
      {navOpen && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}
      {searchOpen && (
        <SearchPanel onClose={() => setSearchOpen(false)} navigate={navigate} />
      )}
    </div>
  );
}

function SignIn({ onSignIn }: { onSignIn: () => void }) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      studentId.trim().toUpperCase() === STUDENT_PROFILE.id &&
      password === '1621111'
    ) {
      setError('');
      onSignIn();
    } else {
      setError('The student ID or password is incorrect.');
    }
  };
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(340px,520px)_1fr]">
      <main className="flex flex-col justify-between bg-white p-7 sm:p-12 lg:p-16">
        <div>
          <Image
            src="/ucl-logo.png"
            alt="University College London"
            width={176}
            height={68}
            priority
            className="h-[68px] w-[176px] object-cover object-left"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[.08em] text-[#500778]">
            Distance Learning Portal · Asia Region
          </p>
        </div>
        <form className="my-10 max-w-sm" onSubmit={submit}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[.08em] text-[#500778]">
            Secure student access
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#32104f]">
            Sign in to your studies
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Access online teaching, learning materials, assessments and
            university support services.
          </p>
          <label
            className="mt-7 block text-sm font-semibold"
            htmlFor="student-id"
          >
            Student ID
          </label>
          <Input
            id="student-id"
            required
            autoComplete="username"
            placeholder="Enter your student ID"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            className="mt-1.5 h-10 rounded"
          />
          <label
            className="mt-4 block text-sm font-semibold"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            id="password"
            required
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 h-10 rounded"
          />
          <label className="mt-3 flex items-center gap-2 text-xs">
            <input type="checkbox" defaultChecked /> Keep me signed in on this
            device
          </label>
          {error && (
            <div
              role="alert"
              className="mt-4 border-l-4 border-red-600 bg-red-50 p-3 text-xs text-red-900"
            >
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="mt-6 h-10 w-full rounded bg-[#500778] hover:bg-[#3d075d]"
          >
            Sign in
          </Button>
        </form>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
          <a
            href="https://www.ucl.ac.uk/staff/task/get-help-service-desk"
            target="_blank"
            rel="noopener noreferrer"
          >
            IT Support
          </a>
          <a href="#/settings">Accessibility</a>
          <a
            href="https://www.ucl.ac.uk/legal-services/privacy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <a
            href="https://www.ucl.ac.uk/isd/news"
            target="_blank"
            rel="noopener noreferrer"
          >
            Service updates
          </a>
        </div>
      </main>
      <aside className="hidden bg-[#32104f] p-16 text-white lg:flex lg:flex-col lg:justify-end">
        <Image
          src="/ucl-logo.png"
          alt=""
          width={256}
          height={96}
          priority
          className="mb-auto h-24 w-64 object-cover object-left"
        />
        <p className="text-sm font-bold uppercase tracking-[.12em] text-[#86d1d4]">
          Distance Learning · Asia Region
        </p>
        <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight">
          UCL Learning Management Portal
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-purple-100">
          A secure digital environment for online teaching, assessments, live
          classes, academic communication and student support.
        </p>
        <div className="mt-10 border-t border-white/20 pt-5 text-sm text-purple-200">
          Teaching times and academic deadlines are displayed in both local and
          UK time.
        </div>
      </aside>
    </div>
  );
}

function Dashboard({ navigate }: { navigate: (key: string) => void }) {
  const { record } = useStudentRecord();
  const completed = moduleTwoCourses
    .flatMap((course) => course.lessons || [])
    .filter((lesson) => record.completedLessonIds.includes(lesson.id)).length;
  return (
    <div className="mx-auto max-w-[1440px] p-4 lg:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Academic Year 2026–27 · Distance Learning
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#32104f]">
            Welcome back, Muhammad
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {STUDENT_PROFILE.programme} · Student ID {STUDENT_PROFILE.id}
          </p>
        </div>
        <Badge
          variant="outline"
          className="rounded border-emerald-200 bg-emerald-50 text-emerald-800"
        >
          Active student
        </Badge>
      </div>
      <div className="mb-5 flex gap-3 border-l-4 border-[#500778] bg-[#f2eafa] p-3.5 text-sm text-[#32104f]">
        <Layers3Icon />
        <span>
          <b>Module 2 added:</b> Software Development and Commercialization is
          now your latest module with four courses and 64 lessons.
        </span>
        <button
          onClick={() => navigate('modules')}
          className="ml-auto shrink-0 font-semibold underline"
        >
          Open
        </button>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,.72fr)]">
        <div className="space-y-5">
          <section className="overflow-hidden border bg-white">
            <SectionHead
              title="Upcoming Module 2 deadlines"
              action="View assignments"
              onAction={() => navigate('assignments')}
            />
            <div className="overflow-x-auto">
              <table className="academic-table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Deadline</th>
                    <th>Weight</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleTwoAssessments.slice(0, 3).map((item) => {
                    const submitted = record.submissions.some(
                      (submission) => submission.assessment === item.title,
                    );
                    return (
                      <tr key={item.title}>
                        <td>
                          <b className="block text-[#500778]">{item.title}</b>
                          <span className="text-xs text-slate-500">
                            {item.course}
                          </span>
                        </td>
                        <td>
                          {item.due}
                          <span className="block text-xs text-slate-500">
                            20:00 Pakistan time
                          </span>
                        </td>
                        <td>{item.weight}</td>
                        <td>
                          <Badge
                            variant="outline"
                            className={
                              'rounded ' +
                              (submitted
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800')
                            }
                          >
                            {submitted ? 'Submitted' : 'Available'}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded"
                            onClick={() => navigate('assignments')}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
          <section className="border bg-white">
            <SectionHead
              title="Latest active courses"
              action="View all courses"
              onAction={() => navigate('modules')}
            />
            <div className="divide-y">
              {moduleTwoCourses.map((course) => {
                const count =
                  course.lessons?.filter((lesson) =>
                    record.completedLessonIds.includes(lesson.id),
                  ).length || 0;
                const progress = Math.round((count / 16) * 100);
                return (
                  <div
                    key={course.id}
                    className="grid gap-4 p-4 sm:grid-cols-[1fr_190px_auto] sm:items-center"
                  >
                    <div>
                      <button
                        onClick={() => navigate('modules')}
                        className="text-left font-semibold text-[#500778] hover:underline"
                      >
                        {course.code} — {course.title}
                      </button>
                      <p className="mt-1 text-xs text-slate-500">
                        {course.leader} · {course.day}
                      </p>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>Learning progress</span>
                        <b>{progress}%</b>
                      </div>
                      <Progress
                        value={progress}
                        className="[&_[data-slot=progress-indicator]]:bg-[#500778]"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded text-[#500778]"
                      onClick={() => navigate('modules')}
                    >
                      Open <ChevronRight />
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="border-t bg-[#fafafa] px-4 py-2 text-xs text-slate-500">
              Module 2 completion: {completed} of 64 lessons · Module 1 is 100%
              complete.
            </div>
          </section>
        </div>
        <div className="space-y-5">
          <section className="border bg-white">
            <SectionHead
              title="Next live classes"
              action="Full timetable"
              onAction={() => navigate('live')}
            />
            <div className="divide-y">
              {moduleTwoCourses.slice(0, 2).map((course, index) => (
                <div key={course.id} className="p-4">
                  <div className="flex gap-3">
                    <div className="w-14 text-sm font-bold text-[#500778]">
                      {13 + index}:00
                      <span className="block text-[10px] font-normal text-slate-500">
                        Pakistan
                      </span>
                    </div>
                    <div>
                      <b className="block text-sm">
                        {course.lessons?.[0].title}
                      </b>
                      <span className="text-xs text-slate-500">
                        {course.code} · {course.day}
                      </span>
                    </div>
                  </div>
                  <a
                    href={zoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex h-8 items-center gap-1.5 rounded bg-[#500778] px-3 text-sm font-semibold text-white"
                  >
                    <Video size={15} /> Join meeting on Zoom
                  </a>
                </div>
              ))}
            </div>
          </section>
          <section className="border bg-white">
            <SectionHead title="Previous Module 1 progress" />
            <div className="divide-y">
              {moduleOneCourses.map((course) => (
                <div key={course.id} className="p-3.5">
                  <div className="flex justify-between text-sm">
                    <b>{course.title}</b>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress
                    value={course.progress}
                    className="mt-2 [&_[data-slot=progress-indicator]]:bg-[#00a6a6]"
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="border bg-white">
            <SectionHead title="Recent announcements" />
            <div className="divide-y">
              {record.notifications.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.target)}
                  className="block w-full p-3.5 text-left hover:bg-slate-50"
                >
                  <b className="text-sm text-[#32104f]">{item.title}</b>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">
                    {item.body}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {item.createdAt} · Programme Office
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Layers3Icon() {
  return <BookOpen className="shrink-0 text-[#500778]" size={19} />;
}

function SectionHead({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <h2 className="text-[15px] font-bold text-[#32104f]">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="text-xs font-semibold text-[#500778] hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  );
}

function SearchPanel({
  onClose,
  navigate,
}: {
  onClose: () => void;
  navigate: (key: string) => void;
}) {
  const [query, setQuery] = useState('');
  const results = [
    ...moduleTwoCourses.map((course) => ({
      label: course.code + ' — ' + course.title,
      meta: 'Course',
      target: 'modules',
    })),
    ...moduleTwoCourses.flatMap((course) =>
      (course.lessons ?? []).map((lesson) => ({
        label: course.code + ' · Week ' + lesson.week + ' — ' + lesson.title,
        meta: 'Lesson',
        target: 'modules',
      })),
    ),
    ...moduleTwoAssessments.map((assessment) => ({
      label: assessment.title,
      meta: assessment.course + ' assessment',
      target: 'assignments',
    })),
    ...learningResources.map((resource) => ({
      label: resource.title,
      meta: resource.course + ' resource',
      target: 'resources',
    })),
  ]
    .filter((result) =>
      (result.label + ' ' + result.meta)
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .slice(0, 8);
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-[70] bg-black/40 p-4"
      onMouseDown={onClose}
    >
      <div
        role="presentation"
        className="mx-auto mt-[10vh] max-w-2xl border bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center border-b p-3">
          <Search className="ml-1 text-slate-500" size={18} />
          <Input
            placeholder="Search UCL learning"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 border-0 shadow-none focus-visible:ring-0"
          />
          <button
            onClick={onClose}
            className="rounded p-2 hover:bg-slate-100"
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            {query ? 'Search results' : 'Suggested results'}
          </p>
          {results.map((result) => (
            <button
              key={result.meta + result.label}
              onClick={() => {
                onClose();
                navigate(result.target);
              }}
              className="flex w-full items-center gap-3 border-b px-2 py-3 text-left text-sm hover:bg-slate-50"
            >
              <span className="grid size-7 place-items-center bg-[#f2eafa] text-[#500778]">
                <Search size={14} />
              </span>
              <span>
                <b className="block font-semibold">{result.label}</b>
                <span className="text-xs text-slate-500">{result.meta}</span>
              </span>
              <ChevronRight className="ml-auto" size={15} />
            </button>
          ))}
          {results.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500">
              No courses, lessons, assessments or resources match “{query}”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
