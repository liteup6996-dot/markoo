'use client';

import { useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Download,
  ExternalLink,
  File,
  FileCheck2,
  FileText,
  Headphones,
  Layers3,
  Mail,
  MessageSquareText,
  Paperclip,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  allCourses,
  learningResources,
  moduleTwoAssessments,
  moduleTwoCourses,
  STUDENT_PROFILE,
  type StudentCourse,
  type LearningResource,
} from '@/lib/module-two';
import { useStudentRecord } from '@/components/student-provider';

type Navigate = (key: string) => void;

type NoticeState = { tone: 'success' | 'error' | 'info'; text: string } | null;

function ActionNotice({
  notice,
  onClose,
}: {
  notice: NoticeState;
  onClose: () => void;
}) {
  if (!notice) return null;
  const tones = {
    success: 'border-emerald-600 bg-emerald-50 text-emerald-950',
    error: 'border-red-600 bg-red-50 text-red-950',
    info: 'border-blue-600 bg-blue-50 text-blue-950',
  };
  return (
    <div
      role={notice.tone === 'error' ? 'alert' : 'status'}
      className={
        'mb-5 flex items-start gap-3 border-l-4 p-3 text-sm ' +
        tones[notice.tone]
      }
    >
      <CircleAlert className="mt-0.5 shrink-0" size={17} />
      <span className="flex-1 leading-6">{notice.text}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss message"
        className="rounded p-1 hover:bg-black/5"
      >
        <X size={15} />
      </button>
    </div>
  );
}

function saveTextFile(fileName: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type: type + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function requestResource(
  resource: LearningResource,
  setNotice: (notice: NoticeState) => void,
) {
  if (!resource.available || !resource.content) {
    setNotice({
      tone: 'error',
      text:
        resource.title +
        ' is not yet available for download. The teaching team will publish it in the relevant teaching week.',
    });
    return;
  }
  const mime = resource.format === 'CSV' ? 'text/csv' : 'text/plain';
  saveTextFile(resource.fileName, resource.content, mime);
  setNotice({
    tone: 'success',
    text: resource.title + ' has been downloaded successfully.',
  });
}

function assessmentBriefText(
  assessment: (typeof moduleTwoAssessments)[number],
) {
  return [
    'UCL DISTANCE LEARNING — ASSESSMENT BRIEF',
    '',
    assessment.course + ' — ' + assessment.title,
    'Available: ' + assessment.available,
    'Deadline: ' + assessment.due + ' UK time',
    'Weight: ' + assessment.weight,
    'Submission: ' + assessment.submissionType,
    'Length: ' + assessment.wordLimit,
    '',
    'TASK',
    assessment.summary,
    '',
    'LEARNING OUTCOMES',
    ...assessment.outcomes.map((outcome, index) => index + 1 + '. ' + outcome),
    '',
    'MARKING CRITERIA',
    ...assessment.rubric.map(
      ([criterion, weight]) => criterion + ': ' + weight,
    ),
    '',
    'Submit your own work and acknowledge all sources in accordance with UCL academic integrity requirements.',
  ].join('\n');
}

export function ViewRouter({
  active,
  navigate,
}: {
  active: string;
  navigate: Navigate;
}) {
  switch (active) {
    case 'programme':
      return <ProgrammeView navigate={navigate} />;
    case 'modules':
      return <ModulesView />;
    case 'assignments':
      return <AssignmentsView />;
    case 'exams':
      return <ExamsView />;
    case 'grades':
      return <GradesView />;
    case 'calendar':
      return <CalendarView />;
    case 'live':
      return <LiveView />;
    case 'community':
      return <CommunityView />;
    case 'messages':
      return <MessagesView />;
    case 'assistant':
      return <AssistantView />;
    case 'resources':
      return <ResourcesView />;
    case 'help':
      return <HelpView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <ProgrammeView navigate={navigate} />;
  }
}

function Page({
  title,
  intro,
  actions,
  children,
}: {
  title: string;
  intro: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1440px] p-4 lg:p-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#32104f]">
            {title}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
            {intro}
          </p>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={'border border-[#d3d9df] bg-white ' + className}>
      <div className="flex min-h-11 items-center justify-between border-b border-[#d9dee2] px-4 py-2.5">
        <h2 className="text-[15px] font-bold text-[#32104f]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Status({
  children,
  tone = 'grey',
}: {
  children: React.ReactNode;
  tone?: 'green' | 'amber' | 'red' | 'blue' | 'grey';
}) {
  const tones = {
    green: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    red: 'border-red-200 bg-red-50 text-red-800',
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    grey: 'border-slate-200 bg-slate-50 text-slate-700',
  };
  return (
    <Badge variant="outline" className={'rounded font-semibold ' + tones[tone]}>
      {children}
    </Badge>
  );
}

function ProgrammeView({ navigate }: { navigate: Navigate }) {
  return (
    <Page
      title="My Programme"
      intro={
        STUDENT_PROFILE.programme +
        ' · ' +
        STUDENT_PROFILE.mode +
        ' · Academic Year ' +
        STUDENT_PROFILE.academicYear
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Panel title="Student programme record">
            <dl className="grid gap-x-8 gap-y-4 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Student ID', STUDENT_PROFILE.id],
                ['Programme', STUDENT_PROFILE.programme],
                ['Mode of study', STUDENT_PROFILE.mode],
                ['Academic year', STUDENT_PROFILE.academicYear],
                ['Faculty', 'Faculty of Engineering Sciences'],
                ['Record status', 'Active and verified'],
              ].map((x) => (
                <div key={x[0]}>
                  <dt className="text-xs text-slate-500">{x[0]}</dt>
                  <dd className="mt-1 font-semibold">{x[1]}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel
            title="Programme modules"
            action={
              <Button
                size="sm"
                variant="outline"
                className="rounded"
                onClick={() => navigate('modules')}
              >
                Open all courses
              </Button>
            }
          >
            <div className="border-b bg-[#f8f6fa] p-4">
              <div className="flex items-start gap-3">
                <Layers3 className="mt-0.5 text-[#500778]" size={20} />
                <div>
                  <b className="text-sm text-[#32104f]">
                    Module 2 — Software Development and Commercialization
                  </b>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Latest module · 16 weeks · four parallel courses · 64
                    structured lessons · one integrated software-product
                    project.
                  </p>
                </div>
                <Status tone="green">Latest</Status>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="academic-table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Course</th>
                    <th>Credits</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allCourses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.group}</td>
                      <td>
                        <b className="block text-[#500778]">
                          {course.code} — {course.title}
                        </b>
                        <span className="text-xs text-slate-500">
                          {course.leader}
                        </span>
                      </td>
                      <td>{course.credits}</td>
                      <td>{course.progress}%</td>
                      <td>
                        <Status
                          tone={course.group === 'Module 2' ? 'blue' : 'green'}
                        >
                          {course.group === 'Module 2'
                            ? 'Newly enrolled'
                            : 'Complete'}
                        </Status>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel title="Integrated Module 2 project">
            <div className="p-5 text-sm leading-6 text-slate-700">
              <p>
                Across all four Module 2 courses, Muhammad will build one
                substantial software product and a credible commercialization
                plan. Each weekly task contributes directly to the final
                technical demonstration and investor pitch.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    'Agile delivery',
                    'Vision, backlog, sprints, risks and releases',
                  ],
                  [
                    'Software engineering',
                    'Requirements, architecture, database, APIs and deployment',
                  ],
                  [
                    'Object-oriented implementation',
                    'Classes, persistence, SOLID, testing and patterns',
                  ],
                  [
                    'Commercial readiness',
                    'Market, pricing, finance, launch and growth',
                  ],
                ].map((x) => (
                  <div key={x[0]} className="border bg-[#fafafa] p-3">
                    <b className="text-[#32104f]">{x[0]}</b>
                    <p className="mt-1 text-xs text-slate-600">{x[1]}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Learning record">
            <div className="p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-600">
                  Module 1 completion
                </span>
                <b className="text-2xl text-[#500778]">
                  100
                  <span className="text-sm font-normal text-slate-500">%</span>
                </b>
              </div>
              <Progress
                value={100}
                className="mt-3 [&_[data-slot=progress-indicator]]:bg-[#500778]"
              />
              <p className="mt-3 text-xs leading-5 text-slate-500">
                All Module 1 courses and assessed activities are complete.
              </p>
            </div>
          </Panel>
          <Panel title="Module 2 assessments">
            <div className="divide-y">
              {moduleTwoAssessments.map((a) => (
                <div key={a.title} className="p-3.5">
                  <b className="block text-sm text-[#32104f]">{a.title}</b>
                  <span className="mt-1 block text-xs text-slate-500">
                    {a.course} · {a.weight} · Due {a.due}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Programme contacts">
            <div className="divide-y">
              {[
                ['EC', 'Dr Eleanor Walsh', 'Module 2 Lead'],
                ['NC', 'Dr Nathan Cole', 'Software Development'],
                ['AQ', 'Dr Amina Qureshi', 'Object-Oriented Programming'],
              ].map((c) => (
                <div key={c[1]} className="flex items-center gap-3 p-3.5">
                  <span className="grid size-9 place-items-center rounded-full bg-[#f2eafa] text-xs font-bold text-[#500778]">
                    {c[0]}
                  </span>
                  <div>
                    <b className="block text-sm">{c[1]}</b>
                    <span className="text-xs text-slate-500">{c[2]}</span>
                  </div>
                  <button
                    onClick={() => navigate('messages')}
                    className="ml-auto rounded p-2 text-[#500778] hover:bg-[#f2eafa]"
                    aria-label={'Message ' + c[1]}
                  >
                    <Mail size={16} />
                  </button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

function ModulesView() {
  const { record } = useStudentRecord();
  const [filter, setFilter] = useState<'All' | 'Module 1' | 'Module 2'>('All');
  const [selected, setSelected] = useState<StudentCourse | null>(null);
  if (selected)
    return <CourseDetail course={selected} onBack={() => setSelected(null)} />;
  const shown =
    filter === 'All'
      ? allCourses
      : allCourses.filter((course) => course.group === filter);
  const progressFor = (course: StudentCourse) =>
    course.group === 'Module 2' && course.lessons
      ? Math.round(
          (course.lessons.filter((lesson) =>
            record.completedLessonIds.includes(lesson.id),
          ).length /
            course.lessons.length) *
            100,
        )
      : course.progress;
  return (
    <Page
      title="My Modules"
      intro="Module 1 history is preserved and Module 2 is now the latest active learning block."
    >
      <Panel
        title="Enrolled courses"
        action={
          <div className="flex gap-1">
            {(['All', 'Module 1', 'Module 2'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={
                  'rounded px-2.5 py-1 text-xs font-semibold ' +
                  (filter === item
                    ? 'bg-[#500778] text-white'
                    : 'hover:bg-slate-100')
                }
              >
                {item}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="academic-table min-w-[920px]">
            <thead>
              <tr>
                <th>Course</th>
                <th>Module</th>
                <th>Leader</th>
                <th>Schedule</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((course) => {
                const progress = progressFor(course);
                return (
                  <tr key={course.id}>
                    <td>
                      <button
                        onClick={() => setSelected(course)}
                        className="text-left font-semibold text-[#500778] hover:underline"
                      >
                        {course.code} — {course.title}
                      </button>
                      <span className="mt-1 block max-w-lg text-xs text-slate-500">
                        {course.description}
                      </span>
                    </td>
                    <td>{course.group}</td>
                    <td>{course.leader}</td>
                    <td>{course.day}</td>
                    <td>
                      <div className="flex w-36 items-center gap-2">
                        <Progress
                          value={progress}
                          className="flex-1 [&_[data-slot=progress-indicator]]:bg-[#500778]"
                        />
                        <span className="text-xs">{progress}%</span>
                      </div>
                    </td>
                    <td>
                      <Status
                        tone={course.group === 'Module 2' ? 'blue' : 'green'}
                      >
                        {course.group === 'Module 2' ? 'Active' : 'Complete'}
                      </Status>
                    </td>
                    <td>
                      <Button
                        onClick={() => setSelected(course)}
                        size="sm"
                        variant="outline"
                        className="rounded"
                      >
                        Open <ChevronRight />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}

function CourseDetail({
  course,
  onBack,
}: {
  course: StudentCourse;
  onBack: () => void;
}) {
  const { record, toggleLesson } = useStudentRecord();
  const [tab, setTab] = useState('Weekly Learning');
  const [expanded, setExpanded] = useState(course.lessons?.[0]?.id || '');
  const [activity, setActivity] = useState<{
    lessonId: string;
    name: string;
  } | null>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const completed =
    course.lessons?.filter((lesson) =>
      record.completedLessonIds.includes(lesson.id),
    ).length || 0;
  const progress = course.lessons?.length
    ? Math.round((completed / course.lessons.length) * 100)
    : course.progress;
  return (
    <Page
      title={course.code + ' — ' + course.title}
      intro={
        course.group +
        ' · ' +
        course.leader +
        ' · ' +
        course.credits +
        ' credits'
      }
      actions={
        <Button variant="outline" className="rounded" onClick={onBack}>
          Back to modules
        </Button>
      }
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <div className="mb-5 flex flex-wrap items-center gap-4 border border-[#d3d9df] bg-white p-4">
        <div className="min-w-[220px] flex-1">
          <b className="text-sm text-[#32104f]">Course progress</b>
          <p className="mt-1 text-xs text-slate-500">
            {course.group === 'Module 2'
              ? completed + ' of 16 weekly lessons completed'
              : 'All learning activities completed'}
          </p>
        </div>
        <div className="flex w-64 items-center gap-3">
          <Progress
            value={progress}
            className="flex-1 [&_[data-slot=progress-indicator]]:bg-[#500778]"
          />
          <b className="text-sm">{progress}%</b>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="h-fit border border-[#d3d9df] bg-white p-2">
          {[
            'Overview',
            'Weekly Learning',
            'Assessments',
            'Announcements',
            'Discussions',
            'Resources',
          ].map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={
                'mb-0.5 w-full px-3 py-2 text-left text-sm ' +
                (tab === item
                  ? 'border-l-3 border-[#500778] bg-[#f2eafa] font-semibold text-[#32104f]'
                  : 'hover:bg-slate-50')
              }
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="space-y-5">
          {tab === 'Overview' || !course.lessons ? (
            <>
              <Panel title="Course overview">
                <div className="p-5 text-sm leading-7 text-slate-700">
                  <p>{course.description}</p>
                  <h3 className="mt-4 font-bold text-[#32104f]">
                    Learning approach
                  </h3>
                  <p className="mt-1">
                    Weekly lectures, structured reading, practical work,
                    knowledge checks, discussion and an integrated project task.
                  </p>
                </div>
              </Panel>
              {course.group === 'Module 1' && (
                <Panel title="Previous activity">
                  <div className="p-5 text-sm text-slate-700">
                    <p>
                      Your previously completed learning remains available. New
                      activity will continue from this point.
                    </p>
                  </div>
                </Panel>
              )}
            </>
          ) : tab === 'Assessments' ? (
            <AssessmentBreakdown course={course} />
          ) : tab === 'Weekly Learning' ? (
            <Panel
              title="16-week learning plan"
              action={
                <span className="text-xs font-semibold text-slate-500">
                  {completed}/16 complete
                </span>
              }
            >
              <div className="divide-y">
                {course.lessons.map((lesson) => {
                  const done = record.completedLessonIds.includes(lesson.id);
                  return (
                    <div key={lesson.id}>
                      <button
                        onClick={() =>
                          setExpanded(expanded === lesson.id ? '' : lesson.id)
                        }
                        className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"
                      >
                        <span
                          className={
                            'grid size-8 shrink-0 place-items-center rounded-full ' +
                            (done
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-[#f2eafa] text-[#500778]')
                          }
                        >
                          {done ? <Check size={16} /> : lesson.week}
                        </span>
                        <span>
                          <b className="block text-sm text-[#32104f]">
                            Week {lesson.week} — {lesson.title}
                          </b>
                          <span className="text-xs text-slate-500">
                            {lesson.shortTopic}
                          </span>
                        </span>
                        <ChevronDown
                          size={17}
                          className={
                            'ml-auto ' +
                            (expanded === lesson.id ? 'rotate-180' : '')
                          }
                        />
                      </button>
                      {expanded === lesson.id && (
                        <div className="border-t bg-[#fafafa] p-4 sm:pl-16">
                          <p className="max-w-4xl text-sm leading-6 text-slate-700">
                            This lesson develops practical understanding of{' '}
                            {lesson.shortTopic.toLowerCase()} and applies it to
                            the integrated Module 2 software product.
                          </p>
                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {[
                              ['Interactive lesson', '35 minutes', BookOpen],
                              ['Lecture recording', '48 minutes', PlayCircle],
                              ['Presentation slides', 'PDF · 2.8 MB', FileText],
                              ['Knowledge check', '8 questions', FileCheck2],
                              [
                                'Practical or lab',
                                'Project contribution',
                                Layers3,
                              ],
                              [
                                'Discussion forum',
                                'Tutor moderated',
                                MessageSquareText,
                              ],
                            ].map(([name, meta, Icon]) => {
                              const I = Icon as typeof FileText;
                              return (
                                <button
                                  key={String(name)}
                                  onClick={() => {
                                    const activityName = String(name);
                                    if (activityName === 'Lecture recording') {
                                      setNotice({
                                        tone: 'error',
                                        text: 'The recording will be published after the live class has taken place.',
                                      });
                                      return;
                                    }
                                    if (
                                      activityName === 'Presentation slides'
                                    ) {
                                      setNotice({
                                        tone: 'error',
                                        text: 'Presentation slides are not yet available for this teaching week.',
                                      });
                                      return;
                                    }
                                    setActivity({
                                      lessonId: lesson.id,
                                      name: activityName,
                                    });
                                  }}
                                  className="flex items-center gap-3 border bg-white p-3 text-left hover:border-[#500778]"
                                >
                                  <I size={17} className="text-[#500778]" />
                                  <span>
                                    <b className="block text-sm">
                                      {String(name)}
                                    </b>
                                    <span className="text-xs text-slate-500">
                                      {String(meta)}
                                    </span>
                                  </span>
                                  <ChevronRight size={14} className="ml-auto" />
                                </button>
                              );
                            })}
                          </div>
                          {activity?.lessonId === lesson.id && (
                            <div className="mt-3 border border-[#b9a7c7] bg-white p-4 text-sm leading-6 text-slate-700">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <b className="text-[#32104f]">
                                    {activity.name}
                                  </b>
                                  <p className="mt-1">
                                    {activity.name === 'Knowledge check'
                                      ? 'Check your understanding: explain the week’s key concept in your own words, identify one practical example and note one question for the tutor.'
                                      : activity.name === 'Practical or lab'
                                        ? 'Apply this week’s concept to the integrated software product. Produce one small artefact, review it against the lesson criteria and bring it to the next live class.'
                                        : activity.name === 'Discussion forum'
                                          ? 'Post a 150–250 word response connecting the lesson topic to your product idea, then reply constructively to one classmate.'
                                          : 'Work through the lesson explanation, examples and short reflection before completing the weekly practical activity.'}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setActivity(null)}
                                  aria-label="Close activity"
                                  className="rounded p-1 hover:bg-slate-100"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            </div>
                          )}
                          <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => toggleLesson(lesson.id)}
                            />{' '}
                            Mark Week {lesson.week} complete
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>
          ) : tab === 'Announcements' ? (
            <Panel title="Course announcements">
              <div className="divide-y">
                {[
                  [
                    'Week 1 learning activities are open',
                    'Begin with the course overview, complete the interactive lesson and bring your first project artefact to the live class.',
                    'Today, 16:30',
                  ],
                  [
                    'Required reading and class preparation',
                    'The Week 1 reading guide and preparation checklist are available in the lesson area.',
                    'Today, 10:15',
                  ],
                  [
                    'Assessment briefing schedule',
                    'A live assessment briefing and question session will take place in Week 2.',
                    '28 Aug, 18:00',
                  ],
                ].map(([title, body, date]) => (
                  <article key={title} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <b className="text-sm text-[#32104f]">{title}</b>
                      <span className="text-[10px] text-slate-500">{date}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {body}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {course.leader}
                    </p>
                  </article>
                ))}
              </div>
            </Panel>
          ) : tab === 'Discussions' ? (
            <Panel title="Course discussions">
              <div className="divide-y">
                {record.discussionTopics
                  .filter(
                    (topic) =>
                      topic.forum === course.title ||
                      topic.forum === 'Module 2 Programme Forum',
                  )
                  .slice(0, 8)
                  .map((topic) => (
                    <article key={topic.id} className="flex gap-3 p-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f2eafa] text-xs font-bold text-[#500778]">
                        {topic.initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <b className="text-sm text-[#32104f]">
                            {topic.subject}
                          </b>
                          {topic.role && (
                            <Status tone="blue">{topic.role}</Status>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {topic.author} · {topic.createdAt} · {topic.replies}{' '}
                          replies
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {topic.body}
                        </p>
                      </div>
                    </article>
                  ))}
              </div>
            </Panel>
          ) : tab === 'Resources' ? (
            <Panel title="Course resources">
              <div className="divide-y">
                {learningResources
                  .filter(
                    (resource) =>
                      resource.course === course.code ||
                      resource.course === course.group,
                  )
                  .map((resource) => (
                    <div
                      key={resource.id}
                      className="flex flex-wrap items-center gap-3 p-4"
                    >
                      <File className="text-[#500778]" size={18} />
                      <div className="min-w-[220px] flex-1">
                        <b className="block text-sm text-[#32104f]">
                          {resource.title}
                        </b>
                        <span className="text-xs text-slate-500">
                          {resource.format} · {resource.size}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded"
                        onClick={() => requestResource(resource, setNotice)}
                      >
                        <Download /> Download
                      </Button>
                    </div>
                  ))}
              </div>
            </Panel>
          ) : (
            <Panel title={tab}>
              <div className="p-5 text-sm leading-6 text-slate-700">
                Course information is available from your teaching team.
              </div>
            </Panel>
          )}
        </div>
      </div>
    </Page>
  );
}

function AssessmentBreakdown({ course }: { course: StudentCourse }) {
  const [notice, setNotice] = useState<NoticeState>(null);
  const published = moduleTwoAssessments.find(
    (assessment) => assessment.course === course.code,
  );
  const rows =
    course.id === 'm2-agile'
      ? [
          ['Weekly activities and quizzes', '20%'],
          ['Product backlog and user-story assignment', '15%'],
          ['Sprint planning and estimation exercise', '15%'],
          ['Agile project portfolio', '25%'],
          ['Final Agile project presentation', '25%'],
        ]
      : course.id === 'm2-design'
        ? [
            ['Requirements and UML assignment', '15%'],
            ['UI and database design practical', '15%'],
            ['Testing and security assignment', '15%'],
            ['Technical development project', '35%'],
            ['Final demonstration and report', '20%'],
          ]
        : course.id === 'm2-oop'
          ? [
              ['Programming labs', '20%'],
              ['OOP assignment 1', '15%'],
              ['OOP assignment 2', '15%'],
              ['Mid-module programming assessment', '20%'],
              ['Final OOP application', '30%'],
            ]
          : [
              ['Market research assignment', '15%'],
              ['Business Model Canvas', '15%'],
              ['Marketing and pricing activity', '15%'],
              ['Commercialization plan', '30%'],
              ['Final pitch', '25%'],
            ];
  return (
    <>
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <Panel title="Assessment structure">
        <div className="overflow-x-auto">
          <table className="academic-table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Weight</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row[0]}>
                  <td>
                    <b>{row[0]}</b>
                  </td>
                  <td>{row[1]}</td>
                  <td>
                    <Status tone={index === 0 ? 'blue' : 'grey'}>
                      {index === 0 ? 'Available' : 'Scheduled'}
                    </Status>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      {published && (
        <Panel title="Published assessment brief">
          <div className="p-5 text-sm leading-6 text-slate-700">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <b className="text-[#32104f]">{published.title}</b>
                <p className="mt-1 text-xs text-slate-500">
                  Available {published.available} · Due {published.due} UK time
                </p>
              </div>
              <Status tone="blue">Available</Status>
            </div>
            <p className="mt-4">{published.summary}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="border bg-[#fafafa] p-3">
                <b className="text-xs uppercase tracking-wide text-[#500778]">
                  Submission format
                </b>
                <p className="mt-1">{published.submissionType}</p>
                <p className="text-xs text-slate-500">{published.wordLimit}</p>
              </div>
              <div className="border bg-[#fafafa] p-3">
                <b className="text-xs uppercase tracking-wide text-[#500778]">
                  Learning outcomes
                </b>
                <ul className="mt-1 list-disc pl-4 text-xs">
                  {published.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              className="mt-4 rounded bg-[#500778]"
              onClick={() => {
                saveTextFile(
                  published.id.toLowerCase() + '-assessment-brief.txt',
                  assessmentBriefText(published),
                );
                setNotice({
                  tone: 'success',
                  text:
                    published.title + ' assessment brief has been downloaded.',
                });
              }}
            >
              <Download /> Download assessment brief
            </Button>
          </div>
        </Panel>
      )}
    </>
  );
}

function AssignmentsView() {
  const { record, addSubmission } = useStudentRecord();
  const [selected, setSelected] = useState<
    (typeof moduleTwoAssessments)[number] | null
  >(null);
  const [fileName, setFileName] = useState('');
  const [declared, setDeclared] = useState(false);
  const [receipt, setReceipt] = useState('');
  const [notice, setNotice] = useState<NoticeState>(null);
  if (selected)
    return (
      <Page
        title={selected.title}
        intro={
          selected.course + ' · Module 2 · ' + selected.weight + ' weighting'
        }
        actions={
          <Button
            variant="outline"
            className="rounded"
            onClick={() => setSelected(null)}
          >
            Back to assignments
          </Button>
        }
      >
        <ActionNotice notice={notice} onClose={() => setNotice(null)} />
        {receipt && (
          <div className="mb-5 flex gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm text-emerald-950">
            <CheckCircle2 />
            <div>
              <b>Submission received</b>
              <p className="mt-1">Your receipt number is {receipt}.</p>
            </div>
          </div>
        )}
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <Panel title="Assessment brief">
              <div className="p-5 text-sm leading-7 text-slate-700">
                <p>{selected.summary}</p>
                <h3 className="mt-4 font-bold text-[#32104f]">
                  Learning outcomes
                </h3>
                <ul className="list-disc pl-5">
                  {selected.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                <h3 className="mt-4 font-bold text-[#32104f]">
                  Marking rubric
                </h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="academic-table min-w-[520px]">
                    <tbody>
                      {selected.rubric.map(([criterion, weight]) => (
                        <tr key={criterion}>
                          <td>{criterion}</td>
                          <td className="w-24 font-semibold">{weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 border bg-[#fafafa] p-3 text-xs">
                  <b>Submission:</b> {selected.submissionType}
                  <br />
                  <b>Length:</b> {selected.wordLimit}
                  <br />
                  <b>Available:</b> {selected.available}
                </div>
                <Button
                  variant="outline"
                  className="mt-4 rounded"
                  onClick={() => {
                    saveTextFile(
                      selected.id.toLowerCase() + '-assessment-brief.txt',
                      assessmentBriefText(selected),
                    );
                    setNotice({
                      tone: 'success',
                      text:
                        selected.title +
                        ' assessment brief has been downloaded.',
                    });
                  }}
                >
                  <Download /> Download full brief
                </Button>
              </div>
            </Panel>
            <Panel title="Existing submission history">
              <div className="divide-y">
                {record.submissions.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex flex-wrap justify-between gap-2">
                      <b className="text-sm text-[#32104f]">
                        {item.assessment}
                      </b>
                      <Status tone="green">{item.status}</Status>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.course} · {item.fileName} · {item.submittedAt}
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      Receipt {item.id}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
          <Panel title="Submit assessment">
            <form
              className="p-4"
              onSubmit={(event) => {
                event.preventDefault();
                const created = addSubmission({
                  assessment: selected.title,
                  course: selected.course,
                  fileName,
                });
                setReceipt(created.id);
                setFileName('');
                setDeclared(false);
              }}
            >
              <div className="border bg-[#f8f6fa] p-3 text-sm">
                <b>Deadline</b>
                <p className="mt-1">{selected.due} UK time</p>
                <p className="text-xs text-slate-500">20:00 Pakistan time</p>
              </div>
              <label className="mt-4 flex min-h-28 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#b9a7c7] bg-[#fafafa] p-4 text-center">
                <Upload className="text-[#500778]" />
                <span className="mt-2 text-sm font-semibold">
                  {fileName || 'Choose a file'}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PDF, DOCX or ZIP · Maximum 20 MB
                </span>
                <input
                  required
                  type="file"
                  accept=".pdf,.docx,.zip"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return setFileName('');
                    if (file.size > 20 * 1024 * 1024) {
                      event.target.value = '';
                      setFileName('');
                      setNotice({
                        tone: 'error',
                        text: 'This file is larger than 20 MB. Choose a smaller PDF, DOCX or ZIP file.',
                      });
                      return;
                    }
                    setFileName(file.name);
                  }}
                />
              </label>
              <label className="mt-4 flex items-start gap-2 text-xs leading-5">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={(event) => setDeclared(event.target.checked)}
                  className="mt-1"
                />{' '}
                I confirm this submission is my own work and complies with UCL
                academic integrity requirements.
              </label>
              <Button
                disabled={!fileName || !declared}
                className="mt-4 h-10 w-full rounded bg-[#500778]"
              >
                Submit assessment
              </Button>
            </form>
          </Panel>
        </div>
      </Page>
    );
  return (
    <Page
      title="Assignments"
      intro={
        'Module 1 history and the latest Module 2 assessment schedule for ' +
        STUDENT_PROFILE.id +
        '.'
      }
    >
      <Panel title="Current assessment schedule">
        <div className="overflow-x-auto">
          <table className="academic-table min-w-[880px]">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Course</th>
                <th>Due</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {moduleTwoAssessments.map((item) => {
                const submitted = record.submissions.some(
                  (submission) => submission.assessment === item.title,
                );
                return (
                  <tr key={item.title}>
                    <td>
                      <button
                        onClick={() => setSelected(item)}
                        className="font-semibold text-[#500778] hover:underline"
                      >
                        {item.title}
                      </button>
                    </td>
                    <td>{item.course}</td>
                    <td>
                      {item.due}
                      <span className="block text-xs text-slate-500">
                        Europe/London
                      </span>
                    </td>
                    <td>{item.weight}</td>
                    <td>
                      <Status tone={submitted ? 'green' : 'amber'}>
                        {submitted ? 'Submitted' : 'Available'}
                      </Status>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded"
                        onClick={() => setSelected(item)}
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
      </Panel>
    </Page>
  );
}

function ExamsView() {
  const [stage, setStage] = useState<'list' | 'quiz' | 'result'>('list');
  const [answer, setAnswer] = useState('');
  const [notice, setNotice] = useState<NoticeState>(null);
  if (stage === 'quiz')
    return (
      <Page
        title="Module 2 Readiness Check"
        intro="Practice assessment · Five questions"
        actions={<Status tone="green">Practice only</Status>}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <Panel title="Question 1 of 5">
            <div className="p-5">
              <p className="font-semibold">
                Which artefact should connect customer value, project scope and
                the first Agile release?
              </p>
              <fieldset className="mt-5 space-y-2">
                {[
                  'A product backlog aligned to an MVP',
                  'A final investor pitch only',
                  'A database backup',
                  'A code-style guide only',
                ].map((option) => (
                  <label
                    key={option}
                    className={
                      'flex cursor-pointer gap-3 border p-3 text-sm ' +
                      (answer === option
                        ? 'border-[#500778] bg-[#f2eafa]'
                        : 'hover:bg-slate-50')
                    }
                  >
                    <input
                      type="radio"
                      name="quiz"
                      checked={answer === option}
                      onChange={() => setAnswer(option)}
                    />
                    {option}
                  </label>
                ))}
              </fieldset>
              <Button
                className="mt-5 rounded bg-[#500778]"
                disabled={!answer}
                onClick={() => setStage('result')}
              >
                Submit practice check
              </Button>
            </div>
          </Panel>
          <Panel title="Assessment status">
            <div className="p-4 text-sm">
              <div className="flex justify-between">
                <span>Time remaining</span>
                <b>19:42</b>
              </div>
              <div className="mt-3 flex justify-between">
                <span>Answered</span>
                <b>{answer ? 1 : 0}/5</b>
              </div>
              <p className="mt-4 border-t pt-3 text-xs leading-5 text-slate-500">
                This is practice only and does not affect the formal grade
                record.
              </p>
            </div>
          </Panel>
        </div>
      </Page>
    );
  if (stage === 'result')
    return (
      <Page title="Practice Check Result" intro="Module 2 readiness assessment">
        <div className="mx-auto max-w-2xl border bg-white p-7 text-center">
          <CheckCircle2 className="mx-auto text-emerald-600" size={42} />
          <h2 className="mt-3 text-xl font-bold text-[#32104f]">
            Answer submitted
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Correct: the product backlog should be aligned to the MVP and
            customer value.
          </p>
          <Button
            className="mt-5 rounded bg-[#500778]"
            onClick={() => setStage('list')}
          >
            Return to assessments
          </Button>
        </div>
      </Page>
    );
  return (
    <Page
      title="Exams & Knowledge Checks"
      intro="Practice and formal assessments for the active student record."
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel title="Available now">
          <div className="p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#500778]">
                  MODULE 2
                </span>
                <h3 className="mt-1 font-semibold text-[#32104f]">
                  Software Product Readiness Check
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  5 questions · 20 minutes · Attempt 1 of 2
                </p>
              </div>
              <Status tone="blue">Practice</Status>
            </div>
            <Button
              className="mt-4 rounded bg-[#500778]"
              onClick={() => setStage('quiz')}
            >
              Start practice check
            </Button>
          </div>
        </Panel>
        <Panel title="Formal exam calendar">
          <div className="p-4 text-sm">
            <b>Object-Oriented Programming Assessment</b>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              18 December 2026 · 10:00 London / 15:00 Pakistan · 120 minutes
            </p>
            <Button
              variant="outline"
              className="mt-3 w-full rounded"
              onClick={() => {
                saveTextFile(
                  'oop-formal-assessment-guidance.txt',
                  'UCL DISTANCE LEARNING — FORMAL ASSESSMENT GUIDANCE\n\nObject-Oriented Programming Assessment\n18 December 2026 · 10:00 London / 15:00 Pakistan\nDuration: 120 minutes\n\nBefore the assessment\n- Complete the system check at least 48 hours before the start time.\n- Use a supported browser and stable internet connection.\n- Keep your student ID available.\n\nDuring the assessment\n- Read every question carefully.\n- Submit before the timer expires.\n- Contact the invigilation support channel immediately if a technical problem occurs.\n',
                );
                setNotice({
                  tone: 'success',
                  text: 'Formal exam guidance has been downloaded.',
                });
              }}
            >
              View exam guidance
            </Button>
          </div>
        </Panel>
      </div>
    </Page>
  );
}

function GradesView() {
  const [notice, setNotice] = useState<NoticeState>(null);
  const grades = [
    [
      'G400-62A',
      'Python Programming Fundamentals Portfolio',
      '72',
      'Distinction',
      'Released',
      '27 Aug 2026',
    ],
    [
      'N200-88B',
      'Financial Statements Case Exercise',
      '68',
      'Merit',
      'Released',
      '22 Aug 2026',
    ],
    [
      'G500-99X',
      'Machine Learning Foundations Quiz',
      '81',
      'Distinction',
      'Released',
      '18 Aug 2026',
    ],
    [
      'Q300-11C',
      'Critical Literary Analysis',
      '75',
      'Distinction',
      'Released',
      '12 Aug 2026',
    ],
  ];
  return (
    <Page
      title="Grades & Results"
      intro={
        'Formal and provisional results for ' +
        STUDENT_PROFILE.name +
        ' · ' +
        STUDENT_PROFILE.id
      }
      actions={
        <Button
          variant="outline"
          className="rounded"
          onClick={() => {
            saveTextFile(
              'L-PK-625900-grade-statement.csv',
              [
                'Course,Assessment,Mark,Grade,Status,Released',
                ...grades.map((row) =>
                  row.map((value) => '"' + value + '"').join(','),
                ),
              ].join('\n'),
              'text/csv',
            );
            setNotice({
              tone: 'success',
              text: 'Your grade statement has been downloaded.',
            });
          }}
        >
          <Download /> Download statement
        </Button>
      }
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <div className="mb-5 border-l-4 border-blue-600 bg-blue-50 p-3 text-sm text-blue-950">
        Module 2 has just been added, so no Module 2 grades have been released.
        Module 1 results remain unchanged.
      </div>
      <Panel title="Assessment gradebook">
        <div className="overflow-x-auto">
          <table className="academic-table min-w-[820px]">
            <thead>
              <tr>
                <th>Course</th>
                <th>Assessment</th>
                <th>Mark</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Released</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((row) => (
                <tr key={row[1]}>
                  <td>
                    <b className="text-[#500778]">{row[0]}</b>
                  </td>
                  <td>{row[1]}</td>
                  <td className="font-bold">{row[2]}/100</td>
                  <td>{row[3]}</td>
                  <td>
                    <Status tone="green">{row[4]}</Status>
                  </td>
                  <td>{row[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}

const zoomUrl = 'https://zoom.us/join';

function ZoomLink({
  children = 'Join meeting',
}: {
  children?: React.ReactNode;
}) {
  return (
    <a
      href={zoomUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 items-center gap-1.5 rounded bg-[#500778] px-3 text-sm font-semibold text-white hover:bg-[#3d075d]"
    >
      <Video size={15} />
      {children}
    </a>
  );
}

function CalendarView() {
  const events = moduleTwoCourses.map((course, index) => ({
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'][index],
    time: ['13:00', '14:00', '13:00', '14:00'][index],
    course,
  }));
  return (
    <Page
      title="Calendar & Timetable"
      intro="Module 2 runs four classes each week. Times are displayed in Asia/Karachi with the UK equivalent."
    >
      <Panel
        title="Week 1 · Module 2 timetable"
        action={<Status tone="blue">Asia/Karachi (UTC+5)</Status>}
      >
        <div className="overflow-x-auto">
          <table className="academic-table min-w-[820px]">
            <thead>
              <tr>
                <th>Day</th>
                <th>Local time</th>
                <th>UK time</th>
                <th>Class</th>
                <th>Lecturer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.course.id}>
                  <td>
                    <b>{event.day}</b>
                  </td>
                  <td>{event.time}–15:00 PKT</td>
                  <td>{Number(event.time.slice(0, 2)) - 4}:00 London</td>
                  <td>
                    <b className="text-[#500778]">{event.course.title}</b>
                    <span className="block text-xs text-slate-500">
                      Week 1 — {event.course.lessons?.[0].title}
                    </span>
                  </td>
                  <td>{event.course.leader}</td>
                  <td>
                    <ZoomLink />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}

function LiveView() {
  const [notice, setNotice] = useState<NoticeState>(null);
  return (
    <Page
      title="Live Classes"
      intro="All live Module 2 teaching links open the official Zoom join page in a new tab."
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Panel title="Upcoming Module 2 sessions">
          <div className="divide-y">
            {moduleTwoCourses.map((course, index) => (
              <div key={course.id} className="p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#500778]">
                      {course.code}
                    </span>
                    <h3 className="mt-1 font-semibold text-[#32104f]">
                      {course.lessons?.[0].title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {course.title} · {course.leader}
                    </p>
                  </div>
                  <Status tone={index === 0 ? 'green' : 'blue'}>
                    {index === 0 ? 'Next class' : 'Scheduled'}
                  </Status>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span>
                    <CalendarDays
                      className="mr-1.5 inline text-slate-500"
                      size={15}
                    />
                    {course.day}, {13 + (index % 2)}:00 PKT
                  </span>
                  <ZoomLink />
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded"
                    onClick={() => {
                      saveTextFile(
                        course.code.toLowerCase() + '-week-1-preparation.txt',
                        course.code +
                          ' — ' +
                          course.title +
                          '\nWeek 1 preparation\n\n1. Read the course overview.\n2. Complete the Week 1 interactive lesson.\n3. Note one question for the tutor.\n4. Bring your first integrated-project idea to the live class.\n\nSession: ' +
                          course.day +
                          ', ' +
                          (13 + (index % 2)) +
                          ':00 PKT\nTutor: ' +
                          course.leader,
                      );
                      setNotice({
                        tone: 'success',
                        text:
                          course.code +
                          ' preparation materials have been downloaded.',
                      });
                    }}
                  >
                    Preparation materials
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Connection guidance">
            <div className="p-4 text-sm leading-6 text-slate-700">
              <Headphones className="mb-2 text-[#500778]" />
              <p>
                Join five minutes early. Use your UCL display name and student
                ID when requested.
              </p>
              <a
                href="https://zoom.us/test"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-[#500778] underline"
              >
                Test Zoom audio and video{' '}
                <ExternalLink className="ml-1" size={14} />
              </a>
            </div>
          </Panel>
          <Panel title="Recent recordings">
            <div className="p-4 text-sm text-slate-500">
              Module 2 recordings will appear here after each live session.
              Module 1 recordings remain available in their original courses.
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

function CommunityView() {
  const { record, addDiscussion, runAutoUpdate } = useStudentRecord();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [forum, setForum] = useState('Module 2 Programme Forum');
  const [notice, setNotice] = useState<NoticeState>(null);
  return (
    <Page
      title="Discussions & Community"
      intro="Connect with classmates and tutors across your programme."
      actions={
        <Button variant="outline" className="rounded" onClick={runAutoUpdate}>
          <RefreshCw /> Check for new posts
        </Button>
      }
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Panel
          title="Programme feed"
          action={
            <span className="text-xs text-slate-500">
              Updates automatically
            </span>
          }
        >
          <div className="divide-y">
            {record.discussionTopics.map((topic) => (
              <div key={topic.id} className="flex gap-3 p-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f2eafa] text-xs font-bold text-[#500778]">
                  {topic.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <b className="text-sm text-[#32104f]">{topic.subject}</b>
                    {topic.role && <Status tone="blue">{topic.role}</Status>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {topic.author} · {topic.forum} · {topic.createdAt}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {topic.body}
                  </p>
                  <button
                    onClick={() =>
                      setNotice({
                        tone: 'info',
                        text:
                          'Reply editor opened for “' +
                          topic.subject +
                          '”. Your reply will appear after tutor moderation.',
                      })
                    }
                    className="mt-2 text-xs font-semibold text-[#500778] hover:underline"
                  >
                    {topic.replies} replies · Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Create a Module 2 topic">
          <form
            className="p-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (subject) {
                addDiscussion(subject, forum, body);
                setSubject('');
                setBody('');
                setNotice({
                  tone: 'success',
                  text: 'Your discussion topic has been posted.',
                });
              }
            }}
          >
            <label className="text-xs font-semibold" htmlFor="community-forum">
              Forum
            </label>
            <select
              id="community-forum"
              value={forum}
              onChange={(event) => setForum(event.target.value)}
              className="mt-1 h-9 w-full rounded border bg-white px-2 text-sm"
            >
              <option>Module 2 Programme Forum</option>
              <option>Agile Software Projects</option>
              <option>Software Design and Development</option>
              <option>Object-Oriented Programming</option>
              <option>Software Commercialization and Market Strategy</option>
            </select>
            <label
              className="mt-3 block text-xs font-semibold"
              htmlFor="community-subject"
            >
              Subject
            </label>
            <Input
              id="community-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              className="mt-1 rounded"
            />
            <label
              className="mt-3 block text-xs font-semibold"
              htmlFor="community-message"
            >
              Message
            </label>
            <Textarea
              id="community-message"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
              className="mt-1 min-h-28 rounded"
            />
            <Button className="mt-3 w-full rounded bg-[#500778]">
              Post topic
            </Button>
          </form>
        </Panel>
      </div>
    </Page>
  );
}

function MessagesView() {
  const { record, addMessage, markMessageRead, runAutoUpdate } =
    useStudentRecord();
  const [selectedId, setSelectedId] = useState(
    record.inboxMessages[0]?.id ?? '',
  );
  const [compose, setCompose] = useState(false);
  const [query, setQuery] = useState('');
  const [attachment, setAttachment] = useState('');
  const [notice, setNotice] = useState<NoticeState>(null);
  const inbox = record.inboxMessages.filter((item) =>
    (item.sender + ' ' + item.subject + ' ' + item.preview)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const selected =
    inbox.find((item) => item.id === selectedId) ??
    record.inboxMessages.find((item) => item.id === selectedId) ??
    inbox[0];
  return (
    <Page
      title="Messages"
      intro="Read university messages and contact your teaching teams."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" className="rounded" onClick={runAutoUpdate}>
            <RefreshCw /> Check mail
          </Button>
          <Button
            className="rounded bg-[#500778]"
            onClick={() => setCompose(true)}
          >
            <Plus /> Compose
          </Button>
        </div>
      }
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <div className="grid min-h-[620px] border bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border-b lg:border-b-0 lg:border-r">
          <div className="border-b p-3">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search mailbox"
              className="rounded"
            />
          </div>
          <div className="max-h-[470px] divide-y overflow-y-auto">
            {inbox.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedId(item.id);
                  markMessageRead(item.id);
                  setCompose(false);
                }}
                className={
                  'w-full p-3 text-left ' +
                  (selected?.id === item.id && !compose
                    ? 'bg-[#f2eafa]'
                    : 'hover:bg-slate-50')
                }
              >
                <div className="flex items-center gap-2">
                  {!item.read && (
                    <span className="size-2 rounded-full bg-[#d5006d]" />
                  )}
                  <b className="text-sm">{item.sender}</b>
                  <span className="ml-auto text-[10px] text-slate-500">
                    {item.createdAt}
                  </span>
                </div>
                <div className="mt-1 text-sm font-medium text-[#500778]">
                  {item.subject}
                </div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {item.preview}
                </div>
              </button>
            ))}
            {inbox.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-500">
                No messages match your search.
              </div>
            )}
          </div>
          {record.sentMessages.length > 0 && (
            <div className="border-t p-3">
              <b className="text-xs uppercase tracking-wide text-slate-500">
                Sent
              </b>
              {record.sentMessages.slice(0, 4).map((message) => (
                <div
                  key={message.id}
                  className="mt-2 border-l-2 border-[#b9a7c7] pl-2 text-xs"
                >
                  <b>{message.subject}</b>
                  <span className="block text-slate-500">
                    To {message.recipient} · {message.sentAt}
                  </span>
                  {message.attachment && (
                    <span className="block text-slate-500">
                      Attachment: {message.attachment}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {compose ? (
            <form
              className="p-5"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const recipient = form.get('recipient');
                const subject = form.get('subject');
                const body = form.get('body');
                if (
                  typeof recipient !== 'string' ||
                  typeof subject !== 'string' ||
                  typeof body !== 'string'
                )
                  return;
                addMessage(recipient, subject, body, attachment || undefined);
                setAttachment('');
                setCompose(false);
                setNotice({
                  tone: 'success',
                  text: 'Your message has been sent.',
                });
              }}
            >
              <h2 className="text-lg font-bold text-[#32104f]">New message</h2>
              <label
                className="mt-5 block text-xs font-semibold"
                htmlFor="message-recipient"
              >
                Recipient
              </label>
              <select
                id="message-recipient"
                name="recipient"
                className="mt-1 h-10 w-full rounded border bg-white px-3 text-sm"
              >
                <option>Module 2 Programme Office</option>
                <option>Dr Eleanor Walsh</option>
                <option>Dr Nathan Cole</option>
                <option>Dr Amina Qureshi</option>
                <option>Prof. James Whitmore</option>
                <option>IT Services</option>
              </select>
              <label
                className="mt-3 block text-xs font-semibold"
                htmlFor="message-subject"
              >
                Subject
              </label>
              <Input
                id="message-subject"
                name="subject"
                required
                className="mt-1 rounded"
              />
              <label
                className="mt-3 block text-xs font-semibold"
                htmlFor="message-body"
              >
                Message
              </label>
              <Textarea
                id="message-body"
                name="body"
                required
                className="mt-1 min-h-48 rounded"
              />
              <label className="mt-3 inline-flex h-9 cursor-pointer items-center gap-2 rounded border px-3 text-sm font-semibold hover:bg-slate-50">
                <Paperclip size={16} /> {attachment || 'Attach file'}
                <input
                  type="file"
                  className="sr-only"
                  onChange={(event) =>
                    setAttachment(event.target.files?.[0]?.name ?? '')
                  }
                />
              </label>
              <Button className="mt-3 ml-2 rounded bg-[#500778]">
                <Send /> Send
              </Button>
            </form>
          ) : selected ? (
            <article className="p-5">
              <h2 className="text-lg font-bold text-[#32104f]">
                {selected.subject}
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                From {selected.sender} · to {STUDENT_PROFILE.name} (
                {STUDENT_PROFILE.id}) · {selected.createdAt}
              </p>
              <div className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">
                <p>Hello Muhammad,</p>
                <p className="mt-3">{selected.body}</p>
                <p className="mt-3">
                  Kind regards,
                  <br />
                  {selected.sender}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-5 rounded"
                onClick={() => setCompose(true)}
              >
                Reply
              </Button>
            </article>
          ) : (
            <div className="grid min-h-[420px] place-items-center text-sm text-slate-500">
              Select a message to read it.
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

function LegacyMessagesView() {
  const { record, addMessage } = useStudentRecord();
  const inbox = [
    [
      'Dr Eleanor Walsh',
      'Welcome to Module 2',
      'The four courses are now available in your learning plan.',
      'Today',
    ],
    [
      'Programme Administration',
      'Module 2 enrolment confirmed',
      'Your enrolment has been attached to L-PK-625900.',
      'Yesterday',
    ],
    [
      'IT Services',
      'Account security guidance',
      'Review the latest multi-factor authentication guidance.',
      '27 Aug',
    ],
  ];
  const [selected, setSelected] = useState(0);
  const [compose, setCompose] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <Page
      title="Messages"
      intro="Read university messages and contact your teaching teams."
      actions={
        <Button
          className="rounded bg-[#500778]"
          onClick={() => setCompose(true)}
        >
          <Plus /> Compose
        </Button>
      }
    >
      {sent && (
        <div className="mb-4 border-l-4 border-emerald-600 bg-emerald-50 p-3 text-sm">
          Message sent successfully.
        </div>
      )}
      <div className="grid min-h-[600px] border bg-white lg:grid-cols-[360px_minmax(0,1fr)]">
        <div className="border-b lg:border-b-0 lg:border-r">
          <div className="border-b p-3">
            <Input placeholder="Search mailbox" className="rounded" />
          </div>
          <div className="divide-y">
            {inbox.map((item, index) => (
              <button
                key={item[1]}
                onClick={() => {
                  setSelected(index);
                  setCompose(false);
                }}
                className={
                  'w-full p-3 text-left ' +
                  (selected === index && !compose
                    ? 'bg-[#f2eafa]'
                    : 'hover:bg-slate-50')
                }
              >
                <div className="flex justify-between">
                  <b className="text-sm">{item[0]}</b>
                  <span className="text-[10px] text-slate-500">{item[3]}</span>
                </div>
                <div className="mt-1 text-sm text-[#500778]">{item[1]}</div>
                <div className="mt-1 truncate text-xs text-slate-500">
                  {item[2]}
                </div>
              </button>
            ))}
          </div>
          {record.sentMessages.length > 0 && (
            <div className="border-t p-3">
              <b className="text-xs uppercase tracking-wide text-slate-500">
                Recently sent
              </b>
              {record.sentMessages.slice(0, 3).map((message) => (
                <div key={message.id} className="mt-2 text-xs">
                  <b>{message.subject}</b>
                  <span className="block text-slate-500">
                    To {message.recipient} · {message.sentAt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {compose ? (
            <form
              className="p-5"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                addMessage(
                  String(form.get('recipient')),
                  String(form.get('subject')),
                );
                setSent(true);
                setCompose(false);
              }}
            >
              <h2 className="text-lg font-bold text-[#32104f]">New message</h2>
              <label className="mt-5 block text-xs font-semibold">
                Recipient
              </label>
              <Input
                name="recipient"
                required
                defaultValue="Module 2 Programme Office"
                className="mt-1 rounded"
              />
              <label className="mt-3 block text-xs font-semibold">
                Subject
              </label>
              <Input name="subject" required className="mt-1 rounded" />
              <label className="mt-3 block text-xs font-semibold">
                Message
              </label>
              <Textarea required className="mt-1 min-h-48 rounded" />
              <Button type="button" variant="outline" className="mt-3 rounded">
                <Paperclip /> Attach
              </Button>
              <Button className="mt-3 ml-2 rounded bg-[#500778]">
                <Send /> Send
              </Button>
            </form>
          ) : (
            <article className="p-5">
              <h2 className="text-lg font-bold text-[#32104f]">
                {inbox[selected][1]}
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                From {inbox[selected][0]} · to {STUDENT_PROFILE.name} (
                {STUDENT_PROFILE.id})
              </p>
              <div className="mt-5 max-w-3xl text-sm leading-7 text-slate-700">
                <p>Hello Muhammad,</p>
                <p className="mt-3">{inbox[selected][2]}</p>
                <p className="mt-3">
                  Your previous Module 1 progress has not been replaced. Module
                  2 has been added as the latest active module and contains all
                  four parallel courses.
                </p>
                <p className="mt-3">
                  Kind regards,
                  <br />
                  {inbox[selected][0]}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-5 rounded"
                onClick={() => setCompose(true)}
              >
                Reply
              </Button>
            </article>
          )}
        </div>
      </div>
    </Page>
  );
}

function AssistantView() {
  const { record, addAssistantExchange } = useStudentRecord();
  const prompts = [
    'What is new in Module 2?',
    'What is due first?',
    'Show my Monday class',
    'Explain the integrated project',
  ];
  const [input, setInput] = useState('');
  const ask = (question: string) => {
    if (!question.trim()) return;
    const lower = question.toLowerCase();
    const answer = lower.includes('due')
      ? 'The first Module 2 deadline is the Product Backlog and User-Story Portfolio on 18 September 2026 at 16:00 UK time.'
      : lower.includes('monday')
        ? 'Your Monday class is COMP2001 Agile Software Projects. Week 1 is “Agile Software Development and Project Management Fundamentals”.'
        : lower.includes('project')
          ? 'You will build one software product across all four courses: Agile planning, software design, object-oriented implementation and a commercialization plan.'
          : 'Module 2 contains Agile Software Projects, Software Design and Development, Object-Oriented Programming, and Software Commercialization and Market Strategy.';
    addAssistantExchange(question, answer);
    setInput('');
  };
  return (
    <Page
      title="UCL Learning Assistant"
      intro="Academic support grounded in the L-PK-625900 module record."
    >
      <div className="grid min-h-[620px] gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex flex-col border bg-white">
          <div className="border-b p-4">
            <b className="text-[#32104f]">Module 2 study support</b>
            <p className="text-xs text-slate-500">
              Context: {STUDENT_PROFILE.name} · {STUDENT_PROFILE.id}
            </p>
          </div>
          <div className="flex-1 space-y-4 p-4">
            {record.assistantMessages.map((message, index) => (
              <div
                key={index}
                className={
                  'flex gap-3 ' + (message.from === 'user' ? 'justify-end' : '')
                }
              >
                {message.from === 'assistant' && (
                  <span className="grid size-8 shrink-0 place-items-center bg-[#500778] text-[10px] font-bold text-white">
                    UCL
                  </span>
                )}
                <div
                  className={
                    'max-w-[82%] p-3 text-sm leading-6 ' +
                    (message.from === 'user'
                      ? 'bg-[#500778] text-white'
                      : 'border bg-[#fafafa]')
                  }
                >
                  {message.text}
                  {message.from === 'assistant' && index > 0 && (
                    <div className="mt-3 border-t pt-2 text-xs">
                      <b>Sources</b>
                      <span className="mt-1 block text-[#500778]">
                        Module 2 syllabus · Student timetable · Assessment
                        schedule
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t p-3"
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your modules"
              className="h-10 rounded"
            />
            <Button className="h-10 rounded bg-[#500778]">
              <Send />
            </Button>
          </form>
        </section>
        <div className="space-y-5">
          <Panel title="Quick questions">
            <div className="divide-y">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => ask(prompt)}
                  className="flex w-full items-center p-3 text-left text-sm hover:bg-slate-50"
                >
                  {prompt}
                  <ChevronRight size={14} className="ml-auto" />
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Academic safeguards">
            <div className="p-4 text-xs leading-5 text-slate-600">
              <ShieldCheck className="mb-2 text-[#500778]" />
              <p>
                The assistant cannot change grades, deadlines or formal academic
                decisions.
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

function ResourcesView() {
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState<NoticeState>(null);
  const filtered = learningResources.filter((item) =>
    (item.title + ' ' + item.course + ' ' + item.format)
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Page
      title="Resources & Library"
      intro="Module 1 resources remain available and the latest Module 2 materials are now indexed."
    >
      <ActionNotice notice={notice} onClose={() => setNotice(null)} />
      <Panel
        title="Latest Module 2 resources"
        action={
          <div className="relative">
            <Search
              className="absolute left-2.5 top-2 text-slate-500"
              size={15}
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter resources"
              className="h-8 w-56 rounded pl-8"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="academic-table min-w-[720px]">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Course</th>
                <th>Type</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <File size={17} className="text-[#500778]" />
                      <b className="text-[#32104f]">{item.title}</b>
                    </div>
                  </td>
                  <td>{item.course}</td>
                  <td>{item.format}</td>
                  <td>{item.size}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded"
                      onClick={() => requestResource(item, setNotice)}
                    >
                      <Download /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Page>
  );
}

function HelpView() {
  const { record, addTicket } = useStudentRecord();
  const [ticketId, setTicketId] = useState('');
  return (
    <Page
      title="Help & Support"
      intro="Get academic, accessibility and technical support."
      actions={
        <a
          href="https://www.ucl.ac.uk/staff/task/get-help-service-desk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded bg-[#500778] px-3 text-sm font-semibold text-white"
        >
          Open UCL Service Desk <ExternalLink size={15} />
        </a>
      }
    >
      {ticketId && (
        <div className="mb-5 flex gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm">
          <CheckCircle2 />
          <div>
            <b>Support request received</b>
            <p>Your reference number is {ticketId}.</p>
          </div>
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="Help centre">
          <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                'UCL IT Services Desk',
                'https://www.ucl.ac.uk/staff/task/get-help-service-desk',
              ],
              [
                'Student Support and Wellbeing',
                'https://www.ucl.ac.uk/study/support-and-wellbeing/mental-health-and-wellbeing/ucl-student-support-and-wellbeing-services-phone-lines',
              ],
              [
                'Disability and neurodiversity support',
                'https://www.ucl.ac.uk/study/support-and-wellbeing/disability-and-neurodiversity/support-we-offer/how-we-can-support-you',
              ],
              ['UCL students information', 'https://www.ucl.ac.uk/students/'],
              ['Zoom test meeting', 'https://zoom.us/test'],
              [
                'UCL privacy information',
                'https://www.ucl.ac.uk/legal-services/privacy/',
              ],
            ].map(([label, url]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border p-3 text-left text-sm font-semibold text-[#32104f] hover:border-[#500778]"
              >
                <CircleAlert size={16} />
                {label}
                <ExternalLink size={14} className="ml-auto" />
              </a>
            ))}
          </div>
          {record.supportTickets.length > 0 && (
            <div className="border-t p-4">
              <b className="text-sm">Previous tickets</b>
              {record.supportTickets.map((ticket) => (
                <p key={ticket.id} className="mt-2 text-xs text-slate-600">
                  <b>{ticket.id}</b> · {ticket.subject} · {ticket.status}
                </p>
              ))}
            </div>
          )}
        </Panel>
        <Panel title="Create a support request">
          <form
            className="p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const subject = form.get('subject');
              if (typeof subject === 'string') setTicketId(addTicket(subject));
            }}
          >
            <label className="text-xs font-semibold" htmlFor="support-category">
              Category
            </label>
            <select
              id="support-category"
              name="category"
              className="mt-1 h-9 w-full rounded border bg-white px-2 text-sm"
            >
              <option>Module 2 access</option>
              <option>Technical problem</option>
              <option>Assessment query</option>
              <option>Accessibility</option>
            </select>
            <label
              className="mt-3 block text-xs font-semibold"
              htmlFor="support-subject"
            >
              Subject
            </label>
            <Input
              id="support-subject"
              name="subject"
              required
              className="mt-1 rounded"
            />
            <label
              className="mt-3 block text-xs font-semibold"
              htmlFor="support-description"
            >
              Description
            </label>
            <Textarea
              id="support-description"
              name="description"
              required
              className="mt-1 min-h-28 rounded"
            />
            <Button className="mt-4 w-full rounded bg-[#500778]">
              Submit request
            </Button>
          </form>
        </Panel>
      </div>
    </Page>
  );
}

function SettingsView() {
  const { record, updateSettings } = useStudentRecord();
  const [confirmation, setConfirmation] = useState('');
  const settings = record.settings;
  const applySettings = (next: Partial<typeof settings>) => {
    updateSettings(next);
    setConfirmation('Your preferences have been updated.');
  };
  return (
    <Page
      title="Profile & Settings"
      intro="Manage your student information, accessibility preferences and account options."
    >
      {confirmation && (
        <div className="mb-5 border-l-4 border-emerald-600 bg-emerald-50 p-3 text-sm">
          {confirmation}
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Panel title="Student profile">
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Full name', STUDENT_PROFILE.name],
                ['Student ID', STUDENT_PROFILE.id],
                ['University email', STUDENT_PROFILE.email],
                ['Programme', STUDENT_PROFILE.programme],
                ['Study mode', STUDENT_PROFILE.mode],
                ['Academic year', STUDENT_PROFILE.academicYear],
              ].map((item) => (
                <div key={item[0]}>
                  <span className="text-xs text-slate-500">{item[0]}</span>
                  <b className="mt-1 block text-sm">{item[1]}</b>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Accessibility and time zone">
            <div className="divide-y">
              <div className="flex items-center justify-between gap-4 p-4 text-sm">
                <span>
                  <b className="block">Preferred time zone</b>
                  <span className="text-xs text-slate-500">
                    Deadlines also show Europe/London.
                  </span>
                </span>
                <select
                  aria-label="Preferred time zone"
                  value={settings.timeZone}
                  onChange={(event) =>
                    applySettings({ timeZone: event.target.value })
                  }
                  className="h-9 rounded border bg-white px-2"
                >
                  <option>Asia/Karachi (UTC+5)</option>
                  <option>Europe/London (UTC+1)</option>
                </select>
              </div>
              <label className="flex items-center justify-between gap-4 p-4 text-sm">
                <span>
                  <b className="block">Larger interface text</b>
                  <span className="text-xs text-slate-500">
                    Increase base text throughout the LMS.
                  </span>
                </span>
                <input
                  aria-label="Larger interface text"
                  type="checkbox"
                  checked={settings.textSize === 'Large'}
                  onChange={(event) =>
                    applySettings({
                      textSize: event.target.checked ? 'Large' : 'Standard',
                    })
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-4 p-4 text-sm">
                <span>
                  <b className="block">Higher contrast</b>
                  <span className="text-xs text-slate-500">
                    Increase visual distinction between elements.
                  </span>
                </span>
                <input
                  aria-label="Higher contrast"
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(event) =>
                    applySettings({ highContrast: event.target.checked })
                  }
                />
              </label>
              <label className="flex items-center justify-between gap-4 p-4 text-sm">
                <span>
                  <b className="block">Reduce motion</b>
                  <span className="text-xs text-slate-500">
                    Limit interface animation and scrolling effects.
                  </span>
                </span>
                <input
                  aria-label="Reduce motion"
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(event) =>
                    applySettings({ reduceMotion: event.target.checked })
                  }
                />
              </label>
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="Notification preferences">
            <div className="divide-y text-sm">
              {[
                ['Assignment reminders', 'assignmentReminders'],
                ['Live-class reminders', 'liveClassReminders'],
                ['Grades and feedback', 'gradeAlerts'],
                ['Discussion replies', 'discussionReplies'],
              ].map(([label, key]) => (
                <label
                  key={String(label)}
                  className="flex items-center justify-between gap-4 p-4"
                >
                  <span>{label}</span>
                  <input
                    aria-label={String(label)}
                    type="checkbox"
                    checked={Boolean(settings[key as keyof typeof settings])}
                    onChange={(event) =>
                      applySettings({ [key]: event.target.checked })
                    }
                  />
                </label>
              ))}
            </div>
          </Panel>
          <Panel title="Account security">
            <div className="p-4 text-sm leading-6 text-slate-700">
              <ShieldCheck className="mb-2 text-[#500778]" />
              <p>
                <b>Multi-factor authentication:</b> Enabled
              </p>
              <p className="mt-2">
                <b>Last sign-in:</b> 29 August 2026, 17:08 PKT
              </p>
              <p className="mt-3 border-t pt-3 text-xs text-slate-500">
                Contact UCL IT Services if you notice unfamiliar account
                activity.
              </p>
            </div>
          </Panel>
          <Panel title="Privacy">
            <div className="p-4 text-sm leading-6 text-slate-700">
              Your academic information is visible only to you and authorised
              university staff.
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
