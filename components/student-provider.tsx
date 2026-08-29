'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STUDENT_PROFILE } from '@/lib/module-two';

export type SubmissionRecord = {
  id: string;
  assessment: string;
  course: string;
  fileName: string;
  submittedAt: string;
  status: 'Submitted';
};

export type StudentRecord = {
  version: 1;
  profileId: string;
  completedLessonIds: string[];
  submissions: SubmissionRecord[];
  discussionTopics: { id: string; subject: string; forum: string; createdAt: string }[];
  sentMessages: { id: string; recipient: string; subject: string; sentAt: string }[];
  supportTickets: { id: string; subject: string; status: string; createdAt: string }[];
  settings: {
    timeZone: string;
    textSize: 'Standard' | 'Large';
    highContrast: boolean;
    reduceMotion: boolean;
  };
  lastSavedAt: string;
};

type StudentContextValue = {
  record: StudentRecord;
  hydrated: boolean;
  toggleLesson: (lessonId: string) => void;
  addSubmission: (submission: Omit<SubmissionRecord, 'id' | 'submittedAt' | 'status'>) => SubmissionRecord;
  addDiscussion: (subject: string, forum: string) => void;
  addMessage: (recipient: string, subject: string) => void;
  addTicket: (subject: string) => string;
  updateSettings: (settings: Partial<StudentRecord['settings']>) => void;
  downloadBackup: () => void;
  restoreBackup: (file: File) => Promise<boolean>;
};

const STORAGE_KEY = 'ucl-lms-profile:L-PK-625900:v1';

const seededRecord: StudentRecord = {
  version: 1,
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
  ],
  discussionTopics: [
    {
      id: 'TOPIC-1842',
      subject: 'Choosing an Agile method for our integrated product',
      forum: 'Module 2 Programme Forum',
      createdAt: '28 August 2026, 19:16 PKT',
    },
  ],
  sentMessages: [],
  supportTickets: [],
  settings: {
    timeZone: 'Asia/Karachi (UTC+5)',
    textSize: 'Standard',
    highContrast: false,
    reduceMotion: true,
  },
  lastSavedAt: '29 August 2026, 15:42 PKT',
};

const StudentContext = createContext<StudentContextValue | null>(null);

function makeId(prefix: string) {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase();
  return prefix + '-' + suffix;
}

function nowLabel() {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  }).format(new Date()) + ' PKT';
}

function isStudentRecord(value: unknown): value is StudentRecord {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StudentRecord>;
  return candidate.version === 1
    && candidate.profileId === STUDENT_PROFILE.id
    && Array.isArray(candidate.completedLessonIds)
    && Array.isArray(candidate.submissions);
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [record, setRecord] = useState<StudentRecord>(seededRecord);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isStudentRecord(parsed)) setRecord(parsed);
      }
    } catch {
      // Keep the seeded record if a device backup is damaged.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }, [hydrated, record]);

  const commit = (updater: (current: StudentRecord) => StudentRecord) => {
    setRecord(current => ({ ...updater(current), lastSavedAt: nowLabel() }));
  };

  const value = useMemo<StudentContextValue>(() => ({
    record,
    hydrated,
    toggleLesson: lessonId => commit(current => ({
      ...current,
      completedLessonIds: current.completedLessonIds.includes(lessonId)
        ? current.completedLessonIds.filter(id => id !== lessonId)
        : [...current.completedLessonIds, lessonId],
    })),
    addSubmission: submission => {
      const created: SubmissionRecord = {
        ...submission,
        id: makeId('SUB'),
        submittedAt: nowLabel(),
        status: 'Submitted',
      };
      commit(current => ({ ...current, submissions: [created, ...current.submissions] }));
      return created;
    },
    addDiscussion: (subject, forum) => commit(current => ({
      ...current,
      discussionTopics: [{ id: makeId('TOPIC'), subject, forum, createdAt: nowLabel() }, ...current.discussionTopics],
    })),
    addMessage: (recipient, subject) => commit(current => ({
      ...current,
      sentMessages: [{ id: makeId('MSG'), recipient, subject, sentAt: nowLabel() }, ...current.sentMessages],
    })),
    addTicket: subject => {
      const id = makeId('SUP');
      commit(current => ({
        ...current,
        supportTickets: [{ id, subject, status: 'Open', createdAt: nowLabel() }, ...current.supportTickets],
      }));
      return id;
    },
    updateSettings: settings => commit(current => ({
      ...current,
      settings: { ...current.settings, ...settings },
    })),
    downloadBackup: () => {
      const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ucl-L-PK-625900-profile-backup.json';
      link.click();
      URL.revokeObjectURL(url);
    },
    restoreBackup: async file => {
      try {
        const parsed: unknown = JSON.parse(await file.text());
        if (!isStudentRecord(parsed)) return false;
        setRecord({ ...parsed, lastSavedAt: nowLabel() });
        return true;
      } catch {
        return false;
      }
    },
  }), [hydrated, record]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudentRecord() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudentRecord must be used inside StudentProvider');
  return context;
}
