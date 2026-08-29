'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleAlert, Clock3, Download, ExternalLink, File, FileCheck2, FileText,
  Headphones, Library, LockKeyhole, Mail, MessageSquareText, Paperclip,
  PlayCircle, Plus, Search, Send, Settings2, ShieldCheck, Upload, UserRound,
  Users, Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type Navigate = (key: string) => void;

export function ViewRouter({ active, navigate }: { active: string; navigate: Navigate }) {
  switch (active) {
    case 'programme': return <ProgrammeView navigate={navigate} />;
    case 'modules': return <ModulesView navigate={navigate} />;
    case 'assignments': return <AssignmentsView />;
    case 'exams': return <ExamsView />;
    case 'grades': return <GradesView />;
    case 'calendar': return <CalendarView />;
    case 'live': return <LiveView />;
    case 'community': return <CommunityView />;
    case 'messages': return <MessagesView />;
    case 'assistant': return <AssistantView />;
    case 'resources': return <ResourcesView />;
    case 'help': return <HelpView />;
    case 'settings': return <SettingsView />;
    default: return <EmptyView navigate={navigate} />;
  }
}

function Page({ title, intro, actions, children }: { title: string; intro: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1440px] p-4 lg:p-7">
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div><h1 className="text-2xl font-bold tracking-tight text-[#172b45]">{title}</h1><p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">{intro}</p></div>{actions}
    </div>{children}
  </div>;
}

function Panel({ title, action, children, className = '' }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={'border border-[#d3d9df] bg-white ' + className}>
    <div className="flex min-h-11 items-center justify-between border-b border-[#d9dee2] px-4 py-2.5"><h2 className="text-[15px] font-bold text-[#172b45]">{title}</h2>{action}</div>{children}
  </section>;
}

function Status({ children, tone = 'grey' }: { children: React.ReactNode; tone?: 'green' | 'amber' | 'red' | 'blue' | 'grey' }) {
  const tones = { green: 'border-emerald-200 bg-emerald-50 text-emerald-800', amber: 'border-amber-200 bg-amber-50 text-amber-900', red: 'border-red-200 bg-red-50 text-red-800', blue: 'border-blue-200 bg-blue-50 text-blue-800', grey: 'border-slate-200 bg-slate-50 text-slate-700' };
  return <Badge variant="outline" className={'rounded font-semibold ' + tones[tone]}>{children}</Badge>;
}

const moduleRows = [
  ['EDUC0011', 'Digital Learning Environments', 'Dr Maya Okafor', '15', 'Term 1', '68', 'Current'],
  ['EDUC0012', 'Research Methods', 'Dr Sarah Bennett', '15', 'Term 1', '54', 'Current'],
  ['EDUC0013', 'Learning Analytics', 'Prof. Daniel Wu', '15', 'Term 1', '73', 'Current'],
  ['STAT0010', 'Applied Statistics', 'Dr Priya Shah', '15', 'Term 2', '18', 'Upcoming'],
  ['COMP0015', 'Foundations of Artificial Intelligence', 'Dr Leon Fischer', '15', 'Term 2', '0', 'Upcoming'],
  ['EDUC0014', 'Education and Technology', 'Prof. Rachel Green', '15', 'Term 3', '100', 'Completed'],
];

function ProgrammeView({ navigate }: { navigate: Navigate }) {
  const choices = ['EDUC0021'];
  const [selected, setSelected] = useState<string[]>(() => choices);
  const optional = [
    ['EDUC0021', 'AI in Education', '15', 'Term 2', '22 places'],
    ['EDUC0024', 'Digital Assessment', '15', 'Term 2', '14 places'],
    ['EDUC0033', 'Education Policy', '15', 'Term 3', 'Waitlist'],
    ['COMP0030', 'Human–Computer Interaction', '15', 'Term 3', '9 places'],
  ];
  const toggle = (code: string) => setSelected(s => s.includes(code) ? s.filter(x => x !== code) : s.length < 2 ? [...s, code] : s);
  return <Page title="My Programme" intro="MSc Digital Education · Distance Learning · Academic Year 2026–27">
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <Panel title="Programme overview"><dl className="grid gap-x-8 gap-y-4 p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Programme code','TMSDIGEDU'],['Mode of study','Distance Learning'],['Duration','2 years, part-time'],
            ['Department','Faculty of Education'],['Programme Director','Prof. Rachel Green'],['Academic Advisor','Dr Michael Chen'],
          ].map(x => <div key={x[0]}><dt className="text-xs text-slate-500">{x[0]}</dt><dd className="mt-1 font-semibold">{x[1]}</dd></div>)}
        </dl></Panel>
        <Panel title="Programme structure" action={<Button size="sm" variant="outline" className="rounded" onClick={() => navigate('modules')}>View all modules</Button>}>
          <div className="overflow-x-auto"><table className="academic-table min-w-[680px]"><thead><tr><th>Teaching period</th><th>Module</th><th>Credits</th><th>Status</th></tr></thead><tbody>
            {moduleRows.slice(0,5).map(r => <tr key={r[0]}><td>{r[4]}</td><td><button onClick={() => navigate('modules')} className="font-semibold text-[#17365d] hover:underline">{r[0]} — {r[1]}</button></td><td>{r[3]}</td><td><Status tone={r[6] === 'Current' ? 'blue' : 'grey'}>{r[6]}</Status></td></tr>)}
          </tbody></table></div>
        </Panel>
        <Panel title="Optional module selection" action={<span className="text-xs font-semibold text-slate-600">{selected.length * 15}/30 credits selected</span>}>
          <div className="border-b bg-[#f7f9fa] p-3 text-sm text-slate-700">Choose 30 credits. Selections close <b>14 September 2026, 16:00 UK time</b>.</div>
          <div className="overflow-x-auto"><table className="academic-table min-w-[720px]"><thead><tr><th></th><th>Module</th><th>Credits</th><th>Term</th><th>Availability</th></tr></thead><tbody>
            {optional.map(r => <tr key={r[0]}><td><input aria-label={'Select ' + r[1]} type="checkbox" checked={selected.includes(r[0])} onChange={() => toggle(r[0])} /></td><td><b className="block text-[#17365d]">{r[0]} — {r[1]}</b><span className="text-xs text-slate-500">Online seminars · No prerequisites</span></td><td>{r[2]}</td><td>{r[3]}</td><td><Status tone={r[4] === 'Waitlist' ? 'amber' : 'green'}>{r[4]}</Status></td></tr>)}
          </tbody></table></div>
          <div className="flex justify-end border-t p-3"><Button className="rounded bg-[#17365d]" disabled={selected.length !== 2}>Submit module choices</Button></div>
        </Panel>
      </div>
      <div className="space-y-5">
        <Panel title="Credit progress"><div className="p-4"><div className="flex items-baseline justify-between"><span className="text-sm text-slate-600">Credits completed</span><b className="text-2xl text-[#17365d]">45<span className="text-sm font-normal text-slate-500"> / 180</span></b></div><Progress value={25} className="mt-3 [&_[data-slot=progress-indicator]]:bg-[#236a73]" /><div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-sm"><div><span className="block text-xs text-slate-500">Current</span><b>45 credits</b></div><div><span className="block text-xs text-slate-500">Remaining</span><b>90 credits</b></div></div></div></Panel>
        <Panel title="Key contacts"><div className="divide-y">{[['RG','Prof. Rachel Green','Programme Director'],['MC','Dr Michael Chen','Academic Advisor'],['PA','Programme Administration','Student queries']].map(c => <div key={c[1]} className="flex items-center gap-3 p-4"><span className="grid size-9 place-items-center rounded-full bg-[#e8f1f1] text-xs font-bold text-[#0f5960]">{c[0]}</span><div><b className="block text-sm">{c[1]}</b><span className="text-xs text-slate-500">{c[2]}</span></div><button className="ml-auto text-[#0f5960]" aria-label={'Message ' + c[1]}><Mail size={17}/></button></div>)}</div></Panel>
        <Panel title="Programme documents"><div className="divide-y">{['Programme handbook 2026–27','Assessment regulations','Distance-learning guide'].map(d => <button key={d} className="flex w-full items-center gap-3 p-3.5 text-left text-sm hover:bg-slate-50"><FileText size={17} className="text-slate-500"/>{d}<Download size={15} className="ml-auto text-[#0f5960]"/></button>)}</div></Panel>
      </div>
    </div>
  </Page>;
}

function ModulesView({ navigate }: { navigate: Navigate }) {
  const [filter, setFilter] = useState('Current');
  const [open, setOpen] = useState<string | null>(null);
  if (open) return <ModuleDetail onBack={() => setOpen(null)} navigate={navigate} />;
  const shown = filter === 'All' ? moduleRows : moduleRows.filter(r => r[6] === filter);
  return <Page title="My Modules" intro="Browse current, upcoming and completed modules across your programme." actions={<Button variant="outline" className="rounded">Compact view</Button>}>
    <Panel title="Enrolled modules" action={<div className="flex gap-1">{['Current','Upcoming','Completed','All'].map(f => <button key={f} onClick={() => setFilter(f)} className={'rounded px-2.5 py-1 text-xs font-semibold ' + (filter === f ? 'bg-[#17365d] text-white' : 'hover:bg-slate-100 text-slate-600')}>{f}</button>)}</div>}>
      <div className="overflow-x-auto"><table className="academic-table min-w-[880px]"><thead><tr><th>Module</th><th>Credits</th><th>Module leader</th><th>Teaching period</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>
        {shown.map(r => <tr key={r[0]}><td><button onClick={() => setOpen(r[0])} className="text-left font-semibold text-[#17365d] hover:underline">{r[0]} — {r[1]}</button></td><td>{r[3]}</td><td>{r[2]}</td><td>{r[4]}</td><td><div className="flex w-32 items-center gap-2"><Progress value={Number(r[5])} className="flex-1 [&_[data-slot=progress-indicator]]:bg-[#236a73]"/><span className="text-xs">{r[5]}%</span></div></td><td><Status tone={r[6] === 'Completed' ? 'green' : r[6] === 'Current' ? 'blue' : 'grey'}>{r[6]}</Status></td><td><Button onClick={() => setOpen(r[0])} variant="ghost" size="sm" className="rounded text-[#0f5960]">Open <ChevronRight/></Button></td></tr>)}
      </tbody></table></div>
    </Panel>
  </Page>;
}

function ModuleDetail({ onBack, navigate }: { onBack: () => void; navigate: Navigate }) {
  const [tab, setTab] = useState('Learning Content');
  const [done, setDone] = useState<string[]>(() => ['Week 1','Week 2']);
  const moduleNav = ['Overview','Learning Content','Announcements','Assignments','Assessments','Discussions','Live Sessions','Recordings','Reading List','Grades','Participants'];
  return <Page title="EDUC0012 — Research Methods" intro="Module Leader: Dr Sarah Bennett · 15 credits · Term 1 · Faculty of Education" actions={<Button variant="outline" onClick={onBack} className="rounded">Back to modules</Button>}>
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <nav className="h-fit border border-[#d3d9df] bg-white p-2" aria-label="Module navigation">{moduleNav.map(n => <button key={n} onClick={() => n === 'Assignments' ? navigate('assignments') : n === 'Grades' ? navigate('grades') : setTab(n)} className={'mb-0.5 flex w-full items-center px-3 py-2 text-left text-sm ' + (tab === n ? 'border-l-3 border-[#236a73] bg-[#e8f1f1] font-semibold text-[#17365d]' : 'hover:bg-slate-50')}>{n}</button>)}</nav>
      <div className="space-y-5">
        {tab === 'Overview' ? <ModuleOverview/> : tab === 'Announcements' ? <Panel title="Module announcements"><div className="divide-y">{['Assessment 1 marking rubric has been published.','Week 6 lecture recording is now available.','Office hour moved to Thursday at 16:30.'].map((x,i) => <article key={x} className="p-4"><h3 className="font-semibold text-[#17365d]">{x}</h3><p className="mt-1 text-xs text-slate-500">Posted by Dr Sarah Bennett · {25-i} August 2026</p></article>)}</div></Panel> : <LearningContent done={done} setDone={setDone}/>}
      </div>
    </div>
  </Page>;
}

function ModuleOverview() {
  return <><Panel title="Module overview"><div className="max-w-4xl p-5 text-sm leading-7 text-slate-700"><p>This module introduces the principles and practice of educational research, with emphasis on designing ethical, rigorous studies in digitally mediated learning environments.</p><h3 className="mt-5 font-bold text-[#172b45]">Learning outcomes</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Evaluate qualitative and quantitative research traditions.</li><li>Design a coherent research question and methodology.</li><li>Apply ethical principles to education research.</li><li>Interpret evidence and communicate limitations clearly.</li></ul></div></Panel><Panel title="Assessment breakdown"><div className="overflow-x-auto"><table className="academic-table"><thead><tr><th>Assessment</th><th>Weight</th><th>Deadline</th></tr></thead><tbody><tr><td>Research Proposal</td><td>30%</td><td>3 September 2026, 16:00 UK</td></tr><tr><td>Research Report</td><td>70%</td><td>12 January 2027, 16:00 UK</td></tr></tbody></table></div></Panel></>;
}

function LearningContent({ done, setDone }: { done: string[]; setDone: (v: string[]) => void }) {
  const weeks = [
    ['Week 1','Introduction to educational research','Lecture recording · Slides · Essential reading'],
    ['Week 2','Research questions and literature','Lecture recording · Guided activity · Quiz'],
    ['Week 3','Qualitative research designs','Lecture recording · Seminar preparation · Discussion'],
    ['Week 4','Quantitative methods and sampling','Lecture recording · Dataset · Practice activity'],
    ['Week 5','Research ethics','Lecture recording · Ethics case study · Required reading'],
    ['Week 6','Designing your research proposal','Lecture recording · Assessment workshop · Template'],
  ];
  const [expanded, setExpanded] = useState('Week 6');
  return <Panel title="Weekly learning content" action={<span className="text-xs text-slate-500">{done.length} of {weeks.length} weeks complete</span>}><div className="divide-y">{weeks.map((w,i) => {
    const complete = done.includes(w[0]); const locked = i === 5 ? false : i > 5;
    return <div key={w[0]}><button onClick={() => setExpanded(expanded === w[0] ? '' : w[0])} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"><span className={'grid size-7 place-items-center rounded-full ' + (complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{complete ? <Check size={16}/> : locked ? <LockKeyhole size={14}/> : i+1}</span><span><b className="block text-sm text-[#17365d]">{w[0]} — {w[1]}</b><span className="text-xs text-slate-500">{w[2]}</span></span><ChevronDown size={17} className={'ml-auto transition-transform ' + (expanded === w[0] ? 'rotate-180' : '')}/></button>{expanded === w[0] && <div className="border-t bg-[#f8fafb] p-4 sm:pl-14"><div className="grid gap-2 md:grid-cols-2">{[['Lecture recording','38 minutes',PlayCircle],['Lecture slides','PDF · 2.4 MB',FileText],['Essential reading','Online article',BookOpen],['Learning activity','20 minutes',FileCheck2]].map(([name,meta,Icon]) => { const I = Icon as typeof FileText; return <button key={String(name)} className="flex items-center gap-3 border bg-white p-3 text-left hover:border-[#236a73]"><I size={18} className="text-[#0f5960]"/><span><b className="block text-sm">{String(name)}</b><span className="text-xs text-slate-500">{String(meta)}</span></span><ExternalLink size={14} className="ml-auto text-slate-400"/></button>})}</div><label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={complete} onChange={() => setDone(complete ? done.filter(x => x !== w[0]) : [...done,w[0]])}/> Mark this week complete</label></div>}</div>
  })}</div></Panel>;
}

function AssignmentsView() {
  const [selected, setSelected] = useState(false);
  const [file, setFile] = useState('');
  const [declared, setDeclared] = useState(false);
  const [receipt, setReceipt] = useState('');
  if (selected) return <Page title="Research Proposal" intro="EDUC0012 Research Methods · Assessment 1 · 30% weighting" actions={<Button variant="outline" className="rounded" onClick={() => setSelected(false)}>Back to assignments</Button>}>
    {receipt ? <div className="mb-5 flex gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm text-emerald-950"><CheckCircle2/><div><b>Submission received</b><p className="mt-1">Receipt {receipt} · 29 August 2026, 15:42 PKT. A confirmation has been added to your mailbox.</p></div></div> : null}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-5"><Panel title="Assessment brief"><div className="p-5 text-sm leading-7 text-slate-700"><p>Develop a research proposal investigating a focused issue in digital education. Your proposal should establish a research problem, review relevant literature and justify an appropriate methodology.</p><h3 className="mt-4 font-bold">Submission requirements</h3><ul className="list-disc pl-5"><li>2,500 words, excluding references</li><li>PDF or DOCX, maximum 20 MB</li><li>Use the programme referencing guide</li><li>Anonymous marking: use your candidate number only</li></ul></div></Panel><Panel title="Marking criteria"><div className="overflow-x-auto"><table className="academic-table"><thead><tr><th>Criterion</th><th>Weight</th><th>High distinction</th></tr></thead><tbody>{[['Research rationale','25%','Compelling and critically grounded'],['Literature review','25%','Excellent synthesis of current evidence'],['Methodology','35%','Rigorous, feasible and ethically informed'],['Academic communication','15%','Precise, coherent and correctly referenced']].map(r => <tr key={r[0]}><td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div></Panel></div>
    <div className="space-y-5"><Panel title="Deadline"><div className="p-4"><b className="block text-lg text-[#172b45]">3 September 2026, 16:00</b><p className="mt-1 text-xs text-slate-500">UK time (Europe/London)</p><p className="mt-2 text-sm"><b>20:00 Pakistan time</b> · 5 days remaining</p></div></Panel><Panel title="Submit your work"><form className="p-4" onSubmit={e => {e.preventDefault(); setReceipt('SUB-' + Math.floor(100000 + Math.random()*899999));}}><label className="flex min-h-28 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#aeb8c1] bg-[#f8fafb] p-4 text-center hover:border-[#236a73]"><Upload className="text-[#0f5960]"/><span className="mt-2 text-sm font-semibold">{file || 'Choose a file to upload'}</span><span className="mt-1 text-xs text-slate-500">PDF or DOCX · Maximum 20 MB</span><input required type="file" accept=".pdf,.docx" className="sr-only" onChange={e => setFile(e.target.files?.[0]?.name || '')}/></label><label className="mt-4 flex items-start gap-2 text-xs leading-5"><input type="checkbox" checked={declared} onChange={e => setDeclared(e.target.checked)} className="mt-1"/> I confirm this submission is my own work and complies with the Academic Integrity Code.</label><Button disabled={!file || !declared} className="mt-4 h-10 w-full rounded bg-[#17365d]">Submit assessment</Button><p className="mt-3 text-center text-xs text-slate-500">You may replace your file before the deadline.</p></form></Panel></div></div>
  </Page>;
  return <Page title="Assignments" intro="Assessment deadlines, submissions and marking status across all enrolled modules."><Panel title="Current assessments" action={<Button size="sm" variant="outline" className="rounded">Export deadlines</Button>}><div className="overflow-x-auto"><table className="academic-table min-w-[900px]"><thead><tr><th>Assessment</th><th>Module</th><th>Due</th><th>Weight</th><th>Submission status</th><th>Grade status</th><th></th></tr></thead><tbody>
    {[
      ['Research Proposal','EDUC0012','3 Sep 2026, 16:00','30%','Draft saved','Awaiting submission'],
      ['Learning Analytics Report','EDUC0013','10 Sep 2026, 16:00','40%','Not submitted','Not marked'],
      ['Critical Review','EDUC0011','18 Sep 2026, 16:00','35%','Not submitted','Not marked'],
      ['Online Quiz 2','STAT0010','21 Sep 2026, 23:59','20%','Not started','Not marked'],
      ['Literature Review','EDUC0012','12 Aug 2026, 16:00','25%','Submitted','Feedback released'],
    ].map((r,i) => <tr key={r[0]}><td><button onClick={() => i === 0 && setSelected(true)} className="font-semibold text-[#17365d] hover:underline">{r[0]}</button></td><td>{r[1]}</td><td>{r[2]}<span className="block text-xs text-slate-500">Europe/London</span></td><td>{r[3]}</td><td><Status tone={r[4] === 'Submitted' ? 'green' : r[4] === 'Draft saved' ? 'amber' : 'grey'}>{r[4]}</Status></td><td>{r[5]}</td><td><Button onClick={() => i === 0 && setSelected(true)} size="sm" variant="outline" className="rounded">View</Button></td></tr>)}
  </tbody></table></div></Panel></Page>;
}

function ExamsView() {
  const [stage, setStage] = useState<'list'|'quiz'|'result'>('list');
  const [answer, setAnswer] = useState('');
  if (stage === 'quiz') return <Page title="Practice Quiz — Research Methods" intro="Attempt 1 of 2 · 20 minutes · Answers are saved automatically" actions={<Status tone="green">Saved</Status>}><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]"><Panel title="Question 1 of 5"><div className="p-5"><p className="font-semibold">Which sampling approach is most appropriate when every member of a population has an equal probability of selection?</p><fieldset className="mt-5 space-y-2">{['Purposive sampling','Simple random sampling','Snowball sampling','Convenience sampling'].map(o => <label key={o} className={'flex cursor-pointer items-center gap-3 border p-3 text-sm ' + (answer === o ? 'border-[#236a73] bg-[#e8f1f1]' : 'hover:bg-slate-50')}><input type="radio" name="q1" checked={answer === o} onChange={() => setAnswer(o)}/>{o}</label>)}</fieldset><div className="mt-6 flex justify-between"><Button variant="outline" className="rounded" disabled>Previous</Button><Button className="rounded bg-[#17365d]" onClick={() => setStage('result')} disabled={!answer}>Submit practice quiz</Button></div></div></Panel><Panel title="Question navigator"><div className="grid grid-cols-5 gap-2 p-4">{[1,2,3,4,5].map(n => <button key={n} className={'grid size-9 place-items-center border text-sm font-semibold ' + (n === 1 ? 'border-[#236a73] bg-[#e8f1f1]' : 'bg-white')}>{n}</button>)}</div><div className="border-t p-4 text-sm"><div className="flex justify-between"><span>Time remaining</span><b>19:42</b></div><div className="mt-2 flex justify-between text-xs text-slate-500"><span>Answered</span><span>{answer ? 1 : 0} of 5</span></div></div></Panel></div></Page>;
  if (stage === 'result') return <Page title="Practice Quiz Result" intro="Submitted 29 August 2026, 15:51 PKT"><div className="mx-auto max-w-2xl border border-[#d3d9df] bg-white p-7 text-center"><CheckCircle2 size={42} className="mx-auto text-emerald-600"/><h2 className="mt-3 text-xl font-bold text-[#172b45]">Attempt submitted</h2><p className="mt-2 text-sm text-slate-600">Your answer was saved successfully. Practice feedback is available immediately.</p><div className="mx-auto mt-5 max-w-sm border bg-[#f8fafb] p-4 text-left text-sm"><div className="flex justify-between"><span>Score</span><b>1 / 1 reviewed question</b></div><div className="mt-2 flex justify-between"><span>Correct answer</span><b>Simple random sampling</b></div></div><Button onClick={() => setStage('list')} className="mt-5 rounded bg-[#17365d]">Return to assessments</Button></div></Page>;
  return <Page title="Exams & Assessments" intro="Upcoming formal examinations, online quizzes and practice assessments."><div className="mb-5 border-l-4 border-blue-600 bg-blue-50 p-4 text-sm text-blue-950"><b>Times shown in both Europe/London and Asia/Karachi.</b> Confirm your time-zone preference before starting a timed assessment.</div><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]"><Panel title="Upcoming assessments"><div className="divide-y">{[
    ['STAT0010','Online Statistics Examination','18 Dec 2026 · 10:00 London / 15:00 Pakistan','120 minutes','Online timed examination'],
    ['EDUC0012','Research Methods Practice Quiz','Available until 21 Sep 2026','20 minutes','Practice assessment'],
  ].map((e,i) => <div key={e[1]} className="p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-xs font-bold text-[#0f5960]">{e[0]}</span><h3 className="mt-1 font-semibold text-[#17365d]">{e[1]}</h3><p className="mt-1 text-xs text-slate-500">{e[4]}</p></div><Status tone={i ? 'blue' : 'amber'}>{i ? 'Available now' : 'Upcoming'}</Status></div><div className="mt-4 grid gap-3 border-t pt-3 text-sm sm:grid-cols-2"><span><CalendarDays className="mr-2 inline text-slate-500" size={15}/>{e[2]}</span><span><Clock3 className="mr-2 inline text-slate-500" size={15}/>{e[3]}</span></div><Button onClick={() => i && setStage('quiz')} variant={i ? 'default' : 'outline'} className={'mt-4 rounded ' + (i ? 'bg-[#17365d]' : '')}>{i ? 'Start practice quiz' : 'View exam guidance'}</Button></div>)}</div></Panel><Panel title="Exam readiness"><div className="p-4 text-sm"><ul className="space-y-3">{['Test your device and browser','Confirm your time zone','Read permitted materials','Check accessibility adjustments'].map((x,i) => <li key={x} className="flex gap-2"><span className={'mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ' + (i < 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{i < 2 ? <Check size={13}/> : i+1}</span>{x}</li>)}</ul><Button variant="outline" className="mt-5 w-full rounded">Run technical check</Button></div></Panel></div></Page>;
}

function GradesView() {
  const [showFeedback, setShowFeedback] = useState(false);
  const rows = [
    ['EDUC0012','Literature Review','25%','72','Distinction','Released','24 Aug 2026'],
    ['EDUC0013','Learning Analytics Quiz','20%','81','Distinction','Released','20 Aug 2026'],
    ['EDUC0011','Critical Reflection','35%','68','Merit','Released','8 Aug 2026'],
    ['COMP0015','Foundations of AI Assessment','40%','75','Distinction','Provisional','2 Aug 2026'],
  ];
  return <Page title="Grades & Results" intro="Coursework marks and feedback. Formal results are confirmed separately by the Board of Examiners." actions={<Button variant="outline" className="rounded"><Download/> Download results statement</Button>}>
    <div className="mb-5 border-l-4 border-blue-600 bg-blue-50 p-3.5 text-sm text-blue-950">Results shown here may be provisional until formally confirmed by the relevant Board of Examiners.</div>
    <Panel title="Assessment gradebook"><div className="overflow-x-auto"><table className="academic-table min-w-[900px]"><thead><tr><th>Module</th><th>Assessment</th><th>Weight</th><th>Mark</th><th>Grade</th><th>Status</th><th>Released</th><th></th></tr></thead><tbody>{rows.map((r,i) => <tr key={r[1]}><td><b className="text-[#17365d]">{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td className="font-bold">{r[3]}</td><td>{r[4]}</td><td><Status tone={r[5] === 'Released' ? 'green' : 'amber'}>{r[5]}</Status></td><td>{r[6]}</td><td><Button onClick={() => i === 0 && setShowFeedback(!showFeedback)} size="sm" variant="outline" className="rounded">Feedback</Button></td></tr>)}</tbody></table></div>
    {showFeedback && <div className="border-t bg-[#f8fafb] p-5"><div className="grid gap-5 lg:grid-cols-[1fr_220px]"><div><h3 className="font-bold text-[#172b45]">Feedback — Literature Review</h3><p className="mt-3 text-sm leading-6 text-slate-700">A well-structured and thoughtfully argued review. Your synthesis of recent literature is particularly strong, and the discussion demonstrates clear awareness of methodological limitations. For further development, make the connection between your conceptual framework and research questions more explicit.</p><h4 className="mt-4 text-sm font-bold">Areas for development</h4><ul className="mt-2 list-disc pl-5 text-sm text-slate-700"><li>Strengthen the rationale for database inclusion criteria.</li><li>Use the conceptual framework more consistently in the conclusion.</li></ul></div><div className="border bg-white p-4 text-sm"><span className="text-xs text-slate-500">Rubric score</span><b className="mt-1 block text-3xl text-[#17365d]">72/100</b><Button variant="outline" className="mt-4 w-full rounded"><Download/> Feedback PDF</Button></div></div></div>}</Panel>
  </Page>;
}

function CalendarView() {
  const [view, setView] = useState('Week');
  const events = [
    ['Mon','10:00','EDUC0011 Lecture','class'],['Tue','14:00','Learning Analytics Seminar','class'],['Wed','16:00','Research Proposal Deadline','deadline'],['Thu','16:30','Office Hour','support'],['Fri','11:00','Study Group','personal'],
  ];
  return <Page title="Calendar & Timetable" intro="Academic events shown in your preferred time zone: Asia/Karachi (UTC+5)." actions={<Button variant="outline" className="rounded"><Download/> Export calendar</Button>}><Panel title="29 August – 4 September 2026" action={<div className="flex gap-1">{['Month','Week','Agenda'].map(v => <button key={v} onClick={() => setView(v)} className={'rounded px-2.5 py-1 text-xs font-semibold ' + (view === v ? 'bg-[#17365d] text-white' : 'hover:bg-slate-100')}>{v}</button>)}</div>}>
    {view === 'Agenda' ? <div className="divide-y">{events.map(e => <div key={e[2]} className="grid grid-cols-[60px_70px_1fr] p-4 text-sm"><b>{e[0]}</b><span>{e[1]}</span><span className="font-semibold text-[#17365d]">{e[2]}</span></div>)}</div> : <div className="overflow-x-auto"><div className="grid min-w-[880px] grid-cols-7 divide-x">{['Monday 31','Tuesday 1','Wednesday 2','Thursday 3','Friday 4','Saturday 5','Sunday 6'].map((d,di) => <div key={d} className="min-h-[480px]"><div className="border-b bg-[#f5f7f8] p-3 text-center text-xs font-bold">{d}</div><div className="p-2">{events.filter(e => ['Mon','Tue','Wed','Thu','Fri'][di] === e[0]).map(e => <button key={e[2]} className={'w-full border-l-3 p-2 text-left text-xs ' + (e[3] === 'deadline' ? 'border-red-500 bg-red-50' : e[3] === 'class' ? 'border-blue-500 bg-blue-50' : 'border-[#236a73] bg-[#e8f1f1]')}><b>{e[1]}</b><span className="mt-1 block">{e[2]}</span><span className="mt-1 block text-[10px] text-slate-500">Local time</span></button>)}</div></div>)}</div></div>}
    <div className="flex flex-wrap gap-4 border-t p-3 text-xs text-slate-600"><span><i className="mr-1 inline-block size-2 bg-blue-500"/> Classes</span><span><i className="mr-1 inline-block size-2 bg-red-500"/> Deadlines</span><span><i className="mr-1 inline-block size-2 bg-[#236a73]"/> Support & personal</span><span className="ml-auto"><b>University time:</b> Europe/London</span></div>
  </Panel></Page>;
}

function LiveView() {
  const [joined, setJoined] = useState('');
  return <Page title="Live Classes" intro="Join scheduled teaching, access preparation materials and revisit past recordings.">{joined && <div className="mb-5 flex items-center gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-3 text-sm text-emerald-950"><CheckCircle2/> Simulated session launched: {joined}</div>}<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><Panel title="Upcoming sessions"><div className="divide-y">{[
    ['EDUC0013','Learning Analytics Seminar','Today · 14:00 London / 18:00 Pakistan','Dr Priya Shah','60 minutes'],
    ['EDUC0012','Research Methods Office Hour','3 Sep · 16:30 London / 20:30 Pakistan','Dr Sarah Bennett','45 minutes'],
    ['EDUC0011','Digital Learning Lecture','7 Sep · 10:00 London / 14:00 Pakistan','Dr Maya Okafor','90 minutes'],
  ].map((s,i) => <div key={s[1]} className="p-4"><div className="flex flex-wrap justify-between gap-3"><div><span className="text-xs font-bold text-[#0f5960]">{s[0]}</span><h3 className="mt-1 font-semibold text-[#17365d]">{s[1]}</h3><p className="mt-1 text-xs text-slate-500">{s[3]} · {s[4]}</p></div><Status tone={i === 0 ? 'green' : 'blue'}>{i === 0 ? 'Starting soon' : 'Scheduled'}</Status></div><p className="mt-3 text-sm"><Clock3 className="mr-2 inline text-slate-500" size={15}/>{s[2]}</p><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => setJoined(s[1])} className="rounded bg-[#17365d]"><Video/> Join live session</Button><Button variant="outline" className="rounded">Preparation materials</Button><Button variant="ghost" className="rounded"><CalendarDays/> Add to calendar</Button></div></div>)}</div></Panel><div className="space-y-5"><Panel title="Connection guidance"><div className="p-4 text-sm leading-6 text-slate-700"><Headphones size={20} className="mb-2 text-[#0f5960]"/><p>Join five minutes early. A headset and stable connection are recommended.</p><Button variant="outline" className="mt-3 w-full rounded">Test microphone and camera</Button></div></Panel><Panel title="Recent recordings"><div className="divide-y">{['Week 5 — Research Ethics','Week 4 — Quantitative Methods','Learning Analytics Lab 3'].map(r => <button key={r} className="flex w-full items-center gap-3 p-3 text-left text-sm hover:bg-slate-50"><PlayCircle size={18} className="text-[#0f5960]"/>{r}<ChevronRight size={14} className="ml-auto"/></button>)}</div></Panel></div></div></Page>;
}

function CommunityView() {
  const [posts, setPosts] = useState([
    ['Methods reading group — Week 6','Aisha Rahman','8 replies','12 minutes ago','Lecturer answered'],
    ['Question about sampling frame','Tom Evans','5 replies','1 hour ago','EDUC0012'],
    ['Pakistan time-zone study group','Nadia Khan','11 replies','Yesterday','Distance Learners'],
    ['Critical reflection peer review','Samira Cole','4 replies','Yesterday','EDUC0011'],
  ]);
  const [subject, setSubject] = useState('');
  return <Page title="Discussions & Community" intro="Module forums, programme discussion and distance-learner study groups." actions={<Button className="rounded bg-[#17365d]" onClick={() => document.getElementById('new-topic')?.scrollIntoView()}><Plus/> New topic</Button>}><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]"><Panel title="Recent discussions"><div className="divide-y">{posts.map((p,i) => <button key={p[0]} className="flex w-full gap-3 p-4 text-left hover:bg-slate-50"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e8f1f1] text-xs font-bold text-[#0f5960]">{p[1].split(' ').map(x => x[0]).join('')}</span><span><b className="block text-sm text-[#17365d]">{p[0]}</b><span className="mt-1 block text-xs text-slate-500">Started by {p[1]} · {p[2]} · {p[3]}</span><Status tone={i === 0 ? 'green' : 'grey'}>{p[4]}</Status></span><ChevronRight size={16} className="ml-auto mt-2 text-slate-400"/></button>)}</div></Panel><div className="space-y-5"><Panel title="Your communities"><div className="divide-y">{[['MSc Digital Education','342 members'],['Distance Learner Community','1,284 members'],['Research Methods Study Group','18 members']].map(g => <div key={g[0]} className="flex items-center gap-3 p-3"><Users size={18} className="text-[#0f5960]"/><div><b className="block text-sm">{g[0]}</b><span className="text-xs text-slate-500">{g[1]}</span></div></div>)}</div></Panel><Panel title="Create a discussion"><form id="new-topic" className="p-4" onSubmit={e => {e.preventDefault(); if(subject){setPosts([[subject,'Alex Morgan','0 replies','Just now','EDUC0012'],...posts]);setSubject('');}}}><label className="text-xs font-semibold">Forum</label><select className="mt-1 h-9 w-full rounded border bg-white px-2 text-sm"><option>EDUC0012 — General Discussion</option><option>Programme Community</option></select><label className="mt-3 block text-xs font-semibold">Topic subject</label><Input value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 rounded" required/><label className="mt-3 block text-xs font-semibold">Message</label><Textarea className="mt-1 min-h-24 rounded" required/><Button className="mt-3 w-full rounded bg-[#17365d]">Post topic</Button></form></Panel></div></div></Page>;
}

function MessagesView() {
  const messages = [
    ['Dr Sarah Bennett','Feedback on Research Proposal','Your revised research question is much clearer…','10:42','unread'],
    ['Programme Administration','Optional Module Selection Opens Monday','Module selection will open at 09:00…','Yesterday','unread'],
    ['IT Services','Scheduled LMS Maintenance','Campus Learning will be unavailable…','27 Aug','read'],
    ['Student Support','Distance Learning Study Skills Workshop','Registration is now open for…','25 Aug','read'],
  ];
  const [selected, setSelected] = useState(0);
  const [compose, setCompose] = useState(false);
  const [sent, setSent] = useState(false);
  return <Page title="Messages" intro="Your university mailbox for teaching, programme and support communication." actions={<Button className="rounded bg-[#17365d]" onClick={() => setCompose(true)}><Plus/> Compose</Button>}>{sent && <div className="mb-4 border-l-4 border-emerald-600 bg-emerald-50 p-3 text-sm">Message sent and copied to your Sent folder.</div>}<div className="grid min-h-[620px] border border-[#d3d9df] bg-white lg:grid-cols-[220px_360px_minmax(0,1fr)]"><aside className="border-b p-3 lg:border-b-0 lg:border-r"><Button onClick={() => setCompose(true)} className="w-full rounded bg-[#17365d]"><Plus/> New message</Button><nav className="mt-3 grid grid-cols-3 gap-1 lg:block">{['Inbox  3','Starred','Important','Sent','Drafts  1','Archived','Trash'].map((x,i) => <button key={x} className={'mb-1 w-full rounded px-3 py-2 text-left text-sm ' + (i === 0 ? 'bg-[#e8f1f1] font-semibold text-[#17365d]' : 'hover:bg-slate-50')}>{x}</button>)}</nav></aside><div className="border-b lg:border-b-0 lg:border-r"><div className="border-b p-3"><Input placeholder="Search messages" className="rounded"/></div><div className="divide-y">{messages.map((m,i) => <button key={m[1]} onClick={() => {setSelected(i);setCompose(false);}} className={'w-full p-3 text-left ' + (selected === i && !compose ? 'bg-[#e8f1f1]' : 'hover:bg-slate-50')}><div className="flex justify-between gap-2"><b className="truncate text-sm">{m[0]}</b><span className="text-[10px] text-slate-500">{m[3]}</span></div><div className="mt-1 truncate text-sm text-[#17365d]">{m[1]}</div><div className="mt-1 truncate text-xs text-slate-500">{m[2]}</div></button>)}</div></div><div>{compose ? <form className="p-5" onSubmit={e => {e.preventDefault();setSent(true);setCompose(false);}}><h2 className="text-lg font-bold text-[#172b45]">New message</h2><label className="mt-5 block text-xs font-semibold">To</label><Input required placeholder="Search university directory" className="mt-1 rounded"/><label className="mt-3 block text-xs font-semibold">Related module</label><select className="mt-1 h-9 w-full rounded border bg-white px-2 text-sm"><option>General enquiry</option><option>EDUC0012 Research Methods</option></select><label className="mt-3 block text-xs font-semibold">Subject</label><Input required className="mt-1 rounded"/><label className="mt-3 block text-xs font-semibold">Message</label><Textarea required className="mt-1 min-h-48 rounded"/><div className="mt-4 flex gap-2"><Button type="button" variant="outline" className="rounded"><Paperclip/> Attach</Button><Button className="ml-auto rounded bg-[#17365d]"><Send/> Send message</Button></div></form> : <article className="p-5"><div className="border-b pb-4"><h2 className="text-lg font-bold text-[#172b45]">{messages[selected][1]}</h2><div className="mt-3 flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-[#e8f1f1] text-xs font-bold text-[#0f5960]">SB</span><div><b className="block text-sm">{messages[selected][0]}</b><span className="text-xs text-slate-500">to Alex Morgan · 29 August 2026, {messages[selected][3]}</span></div></div></div><div className="max-w-3xl py-5 text-sm leading-7 text-slate-700"><p>Hello Alex,</p><p className="mt-3">Thank you for sending your revised research question. The scope is now much clearer and should be manageable within the proposal word limit.</p><p className="mt-3">Please make sure the sampling strategy is explicitly connected to the population you have defined. I have added two comments to your draft for you to consider.</p><p className="mt-3">Best wishes,<br/>Sarah</p></div><div className="flex gap-2 border-t pt-4"><Button variant="outline" className="rounded">Reply</Button><Button variant="ghost" className="rounded">Forward</Button></div></article>}</div></div></Page>;
}

function AssistantView() {
  const prompts = ["What's due this week?","Explain my latest feedback","Help me revise Week 5","Find my exam timetable","How do extensions work?"];
  const [messages, setMessages] = useState<{from:'user'|'assistant';text:string}[]>([{from:'assistant',text:'Good afternoon, Alex. I can help you find course information, explain study materials and plan your work. I cannot confirm formal grades, deadline changes or extensions.'}]);
  const [input, setInput] = useState('');
  const ask = (q: string) => { if(!q.trim()) return; setMessages(m => [...m,{from:'user',text:q},{from:'assistant',text:q.toLowerCase().includes('due') ? 'You have three upcoming deadlines: Research Proposal on 3 September at 16:00 UK time, Learning Analytics Report on 10 September, and Critical Review on 18 September. The Research Proposal is currently saved as a draft.' : q.toLowerCase().includes('extension') ? 'You can apply through Help & Support → Academic Support → Extenuating Circumstances. An extension is only valid after formal approval; please confirm the outcome with your Programme Administrator.' : 'Week 5 focuses on research ethics: informed consent, data minimisation, participant risk and responsible data storage. I can create a short revision plan or explain any one of these concepts.'}]); setInput(''); };
  return <Page title="Learning Assistant" intro="Optional AI study support with references to your permitted module materials."><div className="grid min-h-[650px] gap-5 xl:grid-cols-[260px_minmax(0,1fr)_300px]"><Panel title="Conversations"><div className="p-3"><Button variant="outline" className="w-full rounded"><Plus/> New conversation</Button><button className="mt-3 w-full border-l-3 border-[#236a73] bg-[#e8f1f1] p-3 text-left text-sm"><b className="block">Today’s study plan</b><span className="mt-1 block text-xs text-slate-500">Updated just now</span></button></div></Panel><section className="flex flex-col border border-[#d3d9df] bg-white"><div className="border-b px-4 py-3"><h2 className="font-bold text-[#172b45]">Study support</h2><p className="text-xs text-slate-500">Context: MSc Digital Education · All enrolled modules</p></div><div className="flex-1 space-y-4 p-4">{messages.map((m,i) => <div key={i} className={'flex gap-3 ' + (m.from === 'user' ? 'justify-end' : '')}>{m.from === 'assistant' && <span className="grid size-8 shrink-0 place-items-center bg-[#17365d] text-[10px] font-bold text-white">AI</span>}<div className={'max-w-[80%] p-3 text-sm leading-6 ' + (m.from === 'user' ? 'bg-[#17365d] text-white' : 'border bg-[#f8fafb] text-slate-700')}><p>{m.text}</p>{m.from === 'assistant' && i > 0 && <div className="mt-3 border-t pt-2 text-xs"><b>Sources</b><button className="mt-1 block text-[#0f5960] underline">EDUC0012 Module Handbook</button><button className="mt-1 block text-[#0f5960] underline">Week 5 Lecture Slides</button></div>}</div></div>)}</div><div className="border-t p-3"><div className="mb-2 flex gap-2 overflow-x-auto pb-1">{prompts.slice(0,3).map(p => <button onClick={() => ask(p)} key={p} className="shrink-0 rounded-full border px-3 py-1 text-xs hover:bg-slate-50">{p}</button>)}</div><form className="flex gap-2" onSubmit={e => {e.preventDefault();ask(input);}}><Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about your studies or Campus Learning" className="h-10 rounded"/><Button className="h-10 rounded bg-[#17365d]" aria-label="Send"><Send/></Button></form><p className="mt-2 text-[10px] text-slate-500">AI can make mistakes. Confirm formal academic decisions with university staff.</p></div></section><div className="space-y-5"><Panel title="Try asking"><div className="divide-y">{prompts.map(p => <button onClick={() => ask(p)} key={p} className="flex w-full items-center gap-2 p-3 text-left text-sm hover:bg-slate-50">{p}<ChevronRight size={14} className="ml-auto"/></button>)}</div></Panel><Panel title="Academic safeguards"><div className="p-4 text-xs leading-5 text-slate-600"><ShieldCheck className="mb-2 text-[#0f5960]"/><p>The assistant cannot change deadlines, grant extensions, release grades or make formal academic decisions.</p></div></Panel></div></div></Page>;
}

function ResourcesView() {
  const [query, setQuery] = useState('');
  const resources = [
    ['Module handbook','EDUC0012','PDF','2.1 MB'],['Research proposal template','EDUC0012','DOCX','184 KB'],['Referencing guide','University Library','PDF','1.4 MB'],['Week 5 lecture slides','EDUC0012','PDF','3.8 MB'],['Learning analytics dataset','EDUC0013','CSV','820 KB'],['Academic writing guide','Student Support','Web','Online'],
  ];
  const filtered = resources.filter(r => r.join(' ').toLowerCase().includes(query.toLowerCase()));
  return <Page title="Resources & Library" intro="Module files, reading lists, databases and university academic resources."><div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)]"><Panel title="Browse resources"><nav className="p-2">{['Module Resources','Reading Lists','University Library','Digital Journals','Databases & eBooks','Research Guides','Referencing Support','Software Downloads'].map((x,i) => <button key={x} className={'w-full px-3 py-2 text-left text-sm ' + (i === 0 ? 'border-l-3 border-[#236a73] bg-[#e8f1f1] font-semibold' : 'hover:bg-slate-50')}>{x}</button>)}</nav></Panel><Panel title="Module resources" action={<div className="relative"><Search size={15} className="absolute left-2.5 top-2 text-slate-500"/><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter resources" className="h-8 w-56 rounded pl-8"/></div>}><div className="overflow-x-auto"><table className="academic-table min-w-[700px]"><thead><tr><th>Resource</th><th>Source</th><th>Type</th><th>Size</th><th></th></tr></thead><tbody>{filtered.map(r => <tr key={r[0]}><td><div className="flex items-center gap-2"><File size={17} className="text-[#0f5960]"/><b className="text-[#17365d]">{r[0]}</b></div></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><Button size="sm" variant="outline" className="rounded">{r[2] === 'Web' ? <ExternalLink/> : <Download/>}{r[2] === 'Web' ? 'Open' : 'Download'}</Button></td></tr>)}</tbody></table></div></Panel></div></Page>;
}

function HelpView() {
  const [submitted, setSubmitted] = useState(false);
  return <Page title="Help & Support" intro="Find guidance or contact academic, technical and distance-learning support.">{submitted && <div className="mb-5 flex gap-3 border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm"><CheckCircle2/><div><b>Support request created</b><p>Ticket SUP-28417 is open. A confirmation has been sent to your mailbox.</p></div></div>}<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]"><div className="space-y-5"><Panel title="Search the help centre"><div className="p-4"><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-500" size={18}/><Input className="h-10 rounded pl-10" placeholder="Search account, assignments, exams, accessibility…"/></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{['Getting Started','Assignments','Exams','Live Classes','Technical Problems','Accessibility','Academic Support','Library','Distance Learning'].map(x => <button key={x} className="flex items-center gap-2 border p-3 text-left text-sm font-semibold text-[#17365d] hover:border-[#236a73]"><CircleAlert size={16}/>{x}<ChevronRight size={14} className="ml-auto"/></button>)}</div></div></Panel><Panel title="Distance learning support"><div className="grid gap-0 sm:grid-cols-2">{[['Studying online','Planning routines and engaging remotely'],['Time-zone guidance','Understand deadlines and live-session times'],['Connectivity advice','Prepare for unstable or limited internet'],['Academic writing','Workshops, appointments and resources'],['Wellbeing services','Confidential support for students'],['Digital library access','Use journals, databases and eBooks']].map(x => <button key={x[0]} className="border-b p-4 text-left hover:bg-slate-50 sm:odd:border-r"><b className="text-sm text-[#17365d]">{x[0]}</b><span className="mt-1 block text-xs text-slate-500">{x[1]}</span></button>)}</div></Panel></div><Panel title="Create a support request"><form className="p-4" onSubmit={e => {e.preventDefault();setSubmitted(true);}}><label className="text-xs font-semibold">Category</label><select className="mt-1 h-9 w-full rounded border bg-white px-2 text-sm"><option>Technical problem</option><option>Academic support</option><option>Accessibility</option><option>Assessment query</option></select><label className="mt-3 block text-xs font-semibold">Priority</label><select className="mt-1 h-9 w-full rounded border bg-white px-2 text-sm"><option>Normal</option><option>High — work blocked</option><option>Critical — timed assessment</option></select><label className="mt-3 block text-xs font-semibold">Subject</label><Input required className="mt-1 rounded"/><label className="mt-3 block text-xs font-semibold">Description</label><Textarea required className="mt-1 min-h-28 rounded" placeholder="Tell us what happened and what you have already tried."/><Button type="button" variant="outline" className="mt-3 rounded"><Paperclip/> Add attachment</Button><Button className="mt-4 w-full rounded bg-[#17365d]">Submit support request</Button></form></Panel></div></Page>;
}

function SettingsView() {
  const [saved, setSaved] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [textSize, setTextSize] = useState('Standard');
  useEffect(() => { document.documentElement.style.fontSize = textSize === 'Large' ? '18px' : '16px'; document.documentElement.style.filter = contrast ? 'contrast(1.12)' : ''; }, [textSize, contrast]);
  return <Page title="Settings & Accessibility" intro="Manage your time zone, communication preferences and learning accessibility tools.">{saved && <div className="mb-5 border-l-4 border-emerald-600 bg-emerald-50 p-3 text-sm">Your preferences have been saved on this device.</div>}<div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]"><Panel title="Settings"><nav className="p-2">{['Profile','Time zone & language','Notifications','Accessibility','Privacy','Security'].map((x,i) => <button key={x} className={'w-full px-3 py-2 text-left text-sm ' + (i === 1 ? 'border-l-3 border-[#236a73] bg-[#e8f1f1] font-semibold' : 'hover:bg-slate-50')}>{x}</button>)}</nav></Panel><div className="space-y-5"><Panel title="Time zone & language"><div className="grid gap-5 p-5 sm:grid-cols-2"><div><label className="text-sm font-semibold">Preferred time zone</label><select className="mt-2 h-10 w-full rounded border bg-white px-2 text-sm"><option>Asia/Karachi (UTC+5)</option><option>Europe/London (UTC+1)</option><option>America/New_York (UTC−4)</option></select><p className="mt-2 text-xs text-slate-500">Deadlines display both university and local time.</p></div><div><label className="text-sm font-semibold">Language</label><select className="mt-2 h-10 w-full rounded border bg-white px-2 text-sm"><option>English (United Kingdom)</option></select></div></div></Panel><Panel title="Accessibility preferences"><div className="divide-y"><label className="flex items-center justify-between gap-4 p-4 text-sm"><span><b className="block">Higher contrast</b><span className="text-xs text-slate-500">Increase contrast between interface elements.</span></span><input type="checkbox" checked={contrast} onChange={e => setContrast(e.target.checked)} className="size-4"/></label><div className="flex items-center justify-between gap-4 p-4 text-sm"><span><b className="block">Text size</b><span className="text-xs text-slate-500">Increase base text throughout Campus Learning.</span></span><select value={textSize} onChange={e => setTextSize(e.target.value)} className="h-9 rounded border bg-white px-2"><option>Standard</option><option>Large</option></select></div><label className="flex items-center justify-between gap-4 p-4 text-sm"><span><b className="block">Reduce motion</b><span className="text-xs text-slate-500">Minimise non-essential interface animation.</span></span><input type="checkbox" defaultChecked className="size-4"/></label><label className="flex items-center justify-between gap-4 p-4 text-sm"><span><b className="block">Always show lecture transcripts</b><span className="text-xs text-slate-500">Open transcripts alongside recorded lectures.</span></span><input type="checkbox" className="size-4"/></label></div><div className="flex justify-end border-t p-4"><Button onClick={() => setSaved(true)} className="rounded bg-[#17365d]">Save preferences</Button></div></Panel><Panel title="Profile summary"><div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">{[['Full name','Alex Morgan'],['Student number','26018472'],['University email','alex.morgan@example.test'],['Programme','MSc Digital Education'],['Study mode','Distance Learning'],['Academic year','2026–27']].map(x => <div key={x[0]}><span className="text-xs text-slate-500">{x[0]}</span><b className="mt-1 block text-sm">{x[1]}</b></div>)}</div></Panel></div></div></Page>;
}

function EmptyView({ navigate }: { navigate: Navigate }) {
  return <Page title="Campus Learning" intro="This area is available in the student environment."><div className="border border-[#d3d9df] bg-white p-8 text-center"><Settings2 className="mx-auto text-[#0f5960]"/><h2 className="mt-3 font-bold">Return to your dashboard</h2><Button onClick={() => navigate('dashboard')} className="mt-4 rounded bg-[#17365d]">Go home</Button></div></Page>;
}
