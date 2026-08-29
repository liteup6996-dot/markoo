'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STUDENT_PROFILE } from '@/lib/module-two';

export type SubmissionRecord = {
  id: string;
  assessment: string;
  course: string;
  fileName: string;
  submittedAt: string;
  status: 'Submitted';
};

export type DiscussionRecord = {
  id: string;
  subject: string;
  body: string;
  forum: string;
  author: string;
  initials: string;
  role?: string;
  createdAt: string;
  replies: number;
};

export type InboxRecord = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export type NotificationRecord = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  target:
    | 'dashboard'
    | 'modules'
    | 'assignments'
    | 'community'
    | 'messages'
    | 'live';
};

export type StudentRecord = {
  version: 2;
  profileId: string;
  completedLessonIds: string[];
  submissions: SubmissionRecord[];
  discussionTopics: DiscussionRecord[];
  inboxMessages: InboxRecord[];
  notifications: NotificationRecord[];
  sentMessages: {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    attachment?: string;
    sentAt: string;
  }[];
  supportTickets: {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
  }[];
  assistantMessages: { from: 'user' | 'assistant'; text: string }[];
  settings: {
    timeZone: string;
    textSize: 'Standard' | 'Large';
    highContrast: boolean;
    reduceMotion: boolean;
    assignmentReminders: boolean;
    liveClassReminders: boolean;
    gradeAlerts: boolean;
    discussionReplies: boolean;
  };
  lastSavedAt: string;
  lastAutoUpdateEpoch: number;
};

type StudentContextValue = {
  record: StudentRecord;
  hydrated: boolean;
  toggleLesson: (lessonId: string) => void;
  addSubmission: (
    submission: Omit<SubmissionRecord, 'id' | 'submittedAt' | 'status'>,
  ) => SubmissionRecord;
  addDiscussion: (subject: string, forum: string, body?: string) => string;
  addMessage: (
    recipient: string,
    subject: string,
    body?: string,
    attachment?: string,
  ) => void;
  addAssistantExchange: (question: string, answer: string) => void;
  addTicket: (subject: string) => string;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markMessageRead: (id: string) => void;
  runAutoUpdate: () => void;
  updateSettings: (settings: Partial<StudentRecord['settings']>) => void;
  downloadBackup: () => void;
  restoreBackup: (file: File) => Promise<boolean>;
};

const STORAGE_KEY = 'ucl-lms-profile:L-PK-625900:v2';
const LEGACY_STORAGE_KEY = 'ucl-lms-profile:L-PK-625900:v1';

const seededRecord: StudentRecord = {
  version: 2,
  profileId: STUDENT_PROFILE.id,
  completedLessonIds: [],
  submissions: [
    {
      id: 'SUB-M1-482918',
      assessment: 'Python Programming Fundamentals Portfolio',
      course: 'G400-62A',
      fileName: 'LPK625900_python_portfolio.pdf',
      submittedAt: '27 August 2026, 21:42 PKT',
      status: 'Submitted',
    },
    {
      id: 'SUB-M1-391204',
      assessment: 'Financial Statements Case Exercise',
      course: 'N200-88B',
      fileName: 'finance_case_exercise.pdf',
      submittedAt: '21 August 2026, 18:04 PKT',
      status: 'Submitted',
    },
    {
      id: 'SUB-M1-774120',
      assessment: 'Machine Learning Foundations Quiz',
      course: 'G500-99X',
      fileName: 'Online assessment',
      submittedAt: '17 August 2026, 16:36 PKT',
      status: 'Submitted',
    },
    {
      id: 'SUB-M1-630918',
      assessment: 'Critical Literary Analysis',
      course: 'Q300-11C',
      fileName: 'critical_literary_analysis.docx',
      submittedAt: '11 August 2026, 20:15 PKT',
      status: 'Submitted',
    },
  ],
  discussionTopics: [
    {
      id: 'TOPIC-1842',
      subject: 'Choosing an Agile method for our integrated product',
      body: 'Has anyone compared Scrum with a lighter Kanban workflow for the first product release?',
      forum: 'Module 2 Programme Forum',
      author: STUDENT_PROFILE.name,
      initials: 'MA',
      createdAt: '29 August 2026, 16:16 PKT',
      replies: 4,
    },
    {
      id: 'TOPIC-1931',
      subject: 'Week 1 reading group: product vision',
      body: 'I posted a short summary of the product-vision reading. Add your key takeaway before Monday.',
      forum: 'Agile Software Projects',
      author: 'Sofia Khan',
      initials: 'SK',
      createdAt: '29 August 2026, 15:48 PKT',
      replies: 7,
    },
    {
      id: 'TOPIC-2048',
      subject: 'UML practice partners',
      body: 'Looking for two classmates to review use-case and sequence diagrams this Tuesday.',
      forum: 'Software Design and Development',
      author: 'Daniel Wong',
      initials: 'DW',
      createdAt: '29 August 2026, 14:22 PKT',
      replies: 3,
    },
    {
      id: 'TOPIC-2116',
      subject: 'Tutor note: use the weekly Q&A forum',
      body: 'Post technical questions before Thursday so the teaching team can include them in the live clinic.',
      forum: 'Module 2 Programme Forum',
      author: 'Dr Eleanor Walsh',
      initials: 'EW',
      role: 'Tutor',
      createdAt: '29 August 2026, 13:05 PKT',
      replies: 11,
    },
  ],
  inboxMessages: [
    {
      id: 'INBOX-1001',
      sender: 'Dr Eleanor Walsh',
      subject: 'Welcome to Module 2',
      preview: 'The four courses are now available in your learning plan.',
      body: 'The four courses are now available in your learning plan. Begin with each Week 1 overview and review the integrated project brief before Monday. Your teaching team will post weekly announcements and answer questions in the programme forum.',
      createdAt: 'Today, 16:42',
      read: false,
    },
    {
      id: 'INBOX-1002',
      sender: 'Programme Administration',
      subject: 'Module 2 enrolment confirmed',
      preview: 'Your enrolment and timetable are confirmed.',
      body: 'Your enrolment in Software Development and Commercialization is confirmed. Four course spaces, the live timetable and the first assessment briefs are now available.',
      createdAt: 'Today, 14:18',
      read: false,
    },
    {
      id: 'INBOX-1003',
      sender: 'Library Services',
      subject: 'Digital reading lists are ready',
      preview: 'Reading lists for all four Module 2 courses are available.',
      body: 'Digital reading lists for COMP2001, COMP2002, COMP2003 and COMP2004 are ready. Use Resources for the module handbook and weekly materials.',
      createdAt: 'Yesterday, 19:05',
      read: true,
    },
    {
      id: 'INBOX-1004',
      sender: 'IT Services',
      subject: 'Account security guidance',
      preview: 'Review the latest multi-factor authentication guidance.',
      body: 'Keep your UCL account secure by using multi-factor authentication and never sharing your password. Contact the IT Services Desk if you notice unfamiliar account activity.',
      createdAt: '27 Aug, 11:20',
      read: true,
    },
  ],
  notifications: [
    {
      id: 'NOT-1001',
      title: 'Module 2 is open',
      body: 'Start with the four Week 1 course overviews.',
      createdAt: 'A few moments ago',
      read: false,
      target: 'modules',
    },
    {
      id: 'NOT-1002',
      title: 'Assignment brief available',
      body: 'Product Backlog and User-Story Portfolio is ready to view.',
      createdAt: '18 minutes ago',
      read: false,
      target: 'assignments',
    },
    {
      id: 'NOT-1003',
      title: 'New tutor announcement',
      body: 'Dr Eleanor Walsh posted Week 1 guidance.',
      createdAt: '1 hour ago',
      read: true,
      target: 'modules',
    },
  ],
  sentMessages: [],
  supportTickets: [],
  assistantMessages: [
    {
      from: 'assistant',
      text: 'Hello Muhammad. Module 2 — Software Development and Commercialization is active with four courses and 64 weekly lessons. I can help you locate lessons, deadlines, resources and live classes.',
    },
  ],
  settings: {
    timeZone: 'Asia/Karachi (UTC+5)',
    textSize: 'Standard',
    highContrast: false,
    reduceMotion: true,
    assignmentReminders: true,
    liveClassReminders: true,
    gradeAlerts: true,
    discussionReplies: true,
  },
  lastSavedAt: '29 August 2026, 17:08 PKT',
  lastAutoUpdateEpoch: 0,
};

const StudentContext = createContext<StudentContextValue | null>(null);

function makeId(prefix: string) {
  const suffix =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8).toUpperCase()
      : Math.random().toString(36).slice(2, 10).toUpperCase();
  return prefix + '-' + suffix;
}

function nowLabel() {
  return (
    new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Karachi',
    }).format(new Date()) + ' PKT'
  );
}

function isStudentRecord(value: unknown) {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StudentRecord>;
  return (
    candidate.profileId === STUDENT_PROFILE.id &&
    Array.isArray(candidate.completedLessonIds) &&
    Array.isArray(candidate.submissions)
  );
}

function normaliseRecord(value: unknown): StudentRecord {
  if (!isStudentRecord(value)) return seededRecord;
  const candidate = value as Partial<StudentRecord>;
  return {
    ...seededRecord,
    ...candidate,
    version: 2,
    profileId: STUDENT_PROFILE.id,
    completedLessonIds: candidate.completedLessonIds ?? [],
    submissions: candidate.submissions ?? seededRecord.submissions,
    discussionTopics:
      candidate.discussionTopics?.map((topic) => ({
        ...topic,
        body: topic.body ?? '',
        author: topic.author ?? STUDENT_PROFILE.name,
        initials: topic.initials ?? 'MA',
        replies: topic.replies ?? 0,
      })) ?? seededRecord.discussionTopics,
    inboxMessages: candidate.inboxMessages ?? seededRecord.inboxMessages,
    notifications: candidate.notifications ?? seededRecord.notifications,
    sentMessages:
      candidate.sentMessages?.map((message) => ({
        ...message,
        body: message.body ?? '',
      })) ?? [],
    supportTickets: candidate.supportTickets ?? [],
    assistantMessages:
      candidate.assistantMessages ?? seededRecord.assistantMessages,
    settings: { ...seededRecord.settings, ...candidate.settings },
    lastAutoUpdateEpoch: candidate.lastAutoUpdateEpoch ?? 0,
  };
}

const autoUpdates = [
  {
    title: 'New forum reply',
    body: 'Sofia Khan replied to the Week 1 product-vision discussion.',
    target: 'community' as const,
    kind: 'community' as const,
  },
  {
    title: 'Live class reminder',
    body: 'COMP2001 starts Monday at 13:00 PKT. Preparation materials are available.',
    target: 'live' as const,
    kind: 'inbox' as const,
  },
  {
    title: 'Course announcement',
    body: 'Week 1 learning activities have been published in COMP2002.',
    target: 'modules' as const,
    kind: 'notification' as const,
  },
  {
    title: 'Assessment reminder',
    body: 'Review the Product Backlog assignment rubric before beginning your draft.',
    target: 'assignments' as const,
    kind: 'notification' as const,
  },
];

function withAutoUpdate(current: StudentRecord): StudentRecord {
  const enabledUpdates = autoUpdates.filter((item) => {
    if (item.target === 'assignments')
      return current.settings.assignmentReminders;
    if (item.target === 'live') return current.settings.liveClassReminders;
    if (item.target === 'community') return current.settings.discussionReplies;
    return true;
  });
  const update =
    enabledUpdates[current.notifications.length % enabledUpdates.length] ??
    autoUpdates[2];
  const notification: NotificationRecord = {
    id: makeId('NOT'),
    title: update.title,
    body: update.body,
    createdAt: 'Just now',
    read: false,
    target: update.target,
  };
  const next: StudentRecord = {
    ...current,
    notifications: [notification, ...current.notifications].slice(0, 30),
    lastAutoUpdateEpoch: Date.now(),
  };
  if (update.kind === 'community') {
    next.discussionTopics = [
      {
        id: makeId('TOPIC'),
        subject: 'Week 1 product-vision discussion',
        body: 'I added a short example showing how a measurable outcome can make the vision more useful for sprint planning.',
        forum: 'Agile Software Projects',
        author: 'Sofia Khan',
        initials: 'SK',
        createdAt: nowLabel(),
        replies: 2,
      },
      ...current.discussionTopics,
    ].slice(0, 30);
  }
  if (update.kind === 'inbox') {
    next.inboxMessages = [
      {
        id: makeId('INBOX'),
        sender: 'Module 2 Programme Office',
        subject: update.title,
        preview: update.body,
        body:
          update.body +
          ' Open Live Classes to join the session or review the preparation checklist.',
        createdAt: 'Just now',
        read: false,
      },
      ...current.inboxMessages,
    ].slice(0, 30);
  }
  return next;
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [record, setRecord] = useState<StudentRecord>(seededRecord);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ??
        localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) setRecord(normaliseRecord(JSON.parse(saved)));
    } catch {
      setRecord(seededRecord);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }, [hydrated, record]);

  useEffect(() => {
    if (!hydrated) return;
    const firstUpdate = window.setTimeout(() => {
      setRecord((current) => ({
        ...withAutoUpdate(current),
        lastSavedAt: nowLabel(),
      }));
    }, 15000);
    const interval = window.setInterval(() => {
      setRecord((current) => ({
        ...withAutoUpdate(current),
        lastSavedAt: nowLabel(),
      }));
    }, 90000);
    return () => {
      window.clearTimeout(firstUpdate);
      window.clearInterval(interval);
    };
  }, [hydrated]);

  const commit = useCallback(
    (updater: (current: StudentRecord) => StudentRecord) => {
      setRecord((current) => ({
        ...updater(current),
        lastSavedAt: nowLabel(),
      }));
    },
    [],
  );

  const value = useMemo<StudentContextValue>(
    () => ({
      record,
      hydrated,
      toggleLesson: (lessonId) =>
        commit((current) => ({
          ...current,
          completedLessonIds: current.completedLessonIds.includes(lessonId)
            ? current.completedLessonIds.filter((id) => id !== lessonId)
            : [...current.completedLessonIds, lessonId],
        })),
      addSubmission: (submission) => {
        const created: SubmissionRecord = {
          ...submission,
          id: makeId('SUB'),
          submittedAt: nowLabel(),
          status: 'Submitted',
        };
        commit((current) => ({
          ...current,
          submissions: [created, ...current.submissions],
          notifications: [
            {
              id: makeId('NOT'),
              title: 'Submission confirmed',
              body: created.assessment + ' has been received.',
              createdAt: 'Just now',
              read: false,
              target: 'assignments',
            },
            ...current.notifications,
          ],
        }));
        return created;
      },
      addDiscussion: (subject, forum, body = '') => {
        const id = makeId('TOPIC');
        commit((current) => ({
          ...current,
          discussionTopics: [
            {
              id,
              subject,
              body,
              forum,
              author: STUDENT_PROFILE.name,
              initials: 'MA',
              createdAt: nowLabel(),
              replies: 0,
            },
            ...current.discussionTopics,
          ],
        }));
        return id;
      },
      addMessage: (recipient, subject, body = '', attachment) =>
        commit((current) => ({
          ...current,
          sentMessages: [
            {
              id: makeId('MSG'),
              recipient,
              subject,
              body,
              attachment,
              sentAt: nowLabel(),
            },
            ...current.sentMessages,
          ],
        })),
      addAssistantExchange: (question, answer) =>
        commit((current) => ({
          ...current,
          assistantMessages: [
            ...current.assistantMessages,
            { from: 'user', text: question },
            { from: 'assistant', text: answer },
          ],
        })),
      addTicket: (subject) => {
        const id = makeId('SUP');
        commit((current) => ({
          ...current,
          supportTickets: [
            { id, subject, status: 'Open', createdAt: nowLabel() },
            ...current.supportTickets,
          ],
        }));
        return id;
      },
      markNotificationRead: (id) =>
        commit((current) => ({
          ...current,
          notifications: current.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item,
          ),
        })),
      markAllNotificationsRead: () =>
        commit((current) => ({
          ...current,
          notifications: current.notifications.map((item) => ({
            ...item,
            read: true,
          })),
        })),
      markMessageRead: (id) =>
        commit((current) => ({
          ...current,
          inboxMessages: current.inboxMessages.map((item) =>
            item.id === id ? { ...item, read: true } : item,
          ),
        })),
      runAutoUpdate: () => commit((current) => withAutoUpdate(current)),
      updateSettings: (settings) =>
        commit((current) => ({
          ...current,
          settings: { ...current.settings, ...settings },
        })),
      downloadBackup: () => {
        const blob = new Blob([JSON.stringify(record, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'ucl-L-PK-625900-learning-record.json';
        link.click();
        URL.revokeObjectURL(url);
      },
      restoreBackup: async (file) => {
        try {
          const parsed: unknown = JSON.parse(await file.text());
          if (!isStudentRecord(parsed)) return false;
          setRecord({ ...normaliseRecord(parsed), lastSavedAt: nowLabel() });
          return true;
        } catch {
          return false;
        }
      },
    }),
    [commit, hydrated, record],
  );

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudentRecord() {
  const context = useContext(StudentContext);
  if (!context)
    throw new Error('useStudentRecord must be used inside StudentProvider');
  return context;
}
