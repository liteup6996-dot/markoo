export const STUDENT_PROFILE = {
  id: 'L-PK-625900',
  name: 'Muhammad Ahmad',
  email: 'mahmadhashmi@ucl.ac.uk',
  programme: 'BSc Computer Science',
  mode: 'Distance Learning',
  academicYear: '2026–27',
};

export type Lesson = {
  id: string;
  week: number;
  title: string;
  shortTopic: string;
};

export type StudentCourse = {
  id: string;
  code: string;
  title: string;
  leader: string;
  group: 'Module 1' | 'Module 2';
  credits: number;
  progress: number;
  day: string;
  description: string;
  lessons?: Lesson[];
};

export const moduleOneCourses: StudentCourse[] = [
  {
    id: 'm1-python',
    code: 'G400-62A',
    title: 'Introduction to Python',
    leader: 'Matthew Yee-King',
    group: 'Module 1',
    credits: 3,
    progress: 100,
    day: 'Monday',
    description:
      'Programming logic, Python fundamentals, data structures, object-oriented development and applied project work.',
  },
  {
    id: 'm1-finance',
    code: 'N200-88B',
    title: 'Finance 101',
    leader: 'Daniel Schwarz',
    group: 'Module 1',
    credits: 2,
    progress: 100,
    day: 'Tuesday',
    description:
      'Financial statements, investment decisions, capital markets, risk, planning and professional financial practice.',
  },
  {
    id: 'm1-ml',
    code: 'G500-99X',
    title: 'Machine Learning CP-1.1',
    leader: 'Lemoda Marina',
    group: 'Module 1',
    credits: 3,
    progress: 100,
    day: 'Wednesday',
    description:
      'Machine-learning foundations, data preparation, supervised and unsupervised learning, evaluation and applied modelling.',
  },
  {
    id: 'm1-english',
    code: 'Q300-11C',
    title: 'English Literature',
    leader: 'Ahmad Hamadan',
    group: 'Module 1',
    credits: 2,
    progress: 100,
    day: 'Thursday',
    description:
      'Critical reading, literary analysis, research, academic writing and the study of major literary forms and traditions.',
  },
];

const agileTitles = [
  'Agile Software Development and Project Management Fundamentals',
  'Scrum, Kanban, XP and Modern Agile Frameworks',
  'Product Vision, Epics and User Stories',
  'Building and Prioritising the Product Backlog',
  'Managing Projects Using Scrum',
  'Estimating Software Work in Agile Projects',
  'Planning and Running an Agile Sprint',
  'Visualising and Optimising Software Work with Kanban',
  'Measuring Agile Project Performance',
  'Managing Risk and Change in Agile Projects',
  'Building Quality into Agile Software Projects',
  'Agile Teams, Communication and Leadership',
  'DevOps, Continuous Integration and Continuous Delivery',
  'Agile Release Planning and Product Roadmaps',
  'Continuous Improvement Through Reviews and Retrospectives',
  'Final Agile Project Review',
];

const designTitles = [
  'Introduction to Software Design and Development',
  'Understanding Users and Software Requirements',
  'Modelling Software Requirements with UML',
  'Designing Software with Class and Sequence Diagrams',
  'Fundamentals of Software Architecture',
  'Designing Maintainable and Modular Software',
  'UI/UX Design for Software Applications',
  'Designing Data and Relational Databases',
  'Designing APIs and Connected Software Systems',
  'Reusable Solutions with Software Design Patterns',
  'Testing and Quality Assurance',
  'Debugging, Refactoring and Maintaining Code Quality',
  'Security by Design',
  'Professional Development with Git',
  'Deploying and Maintaining Production Software',
  'Final Software Design and Development Project',
];

const oopTitles = [
  'Introduction to Programming and Object-Oriented Thinking',
  'Program Control and Reusable Methods',
  'Creating Classes and Objects',
  'Constructors, Properties and Encapsulation',
  'Association, Aggregation and Composition',
  'Building Class Hierarchies with Inheritance',
  'Polymorphism and Dynamic Behaviour',
  'Abstract Classes and Interfaces',
  'Managing Groups of Objects',
  'Writing Reliable Programs with Exception Handling',
  'Saving and Loading Application Data',
  'Generics and Type-Safe Reusable Components',
  'SOLID Principles and Professional OOP Design',
  'Applying Design Patterns in Object-Oriented Programs',
  'Testing and Improving Object-Oriented Applications',
  'Object-Oriented Programming Project Demonstration',
];

const commercialTitles = [
  'Turning Technology into a Commercial Product',
  'Finding Problems Worth Solving',
  'Understanding the Target Market',
  'Measuring Commercial Opportunity',
  'Analysing Competitors and Market Position',
  'Building a Strong Software Value Proposition',
  'Minimum Viable Products and Market Validation',
  'Choosing a Revenue and Business Model',
  'Pricing Digital and Software Products',
  'Protecting and Licensing Software Products',
  'Legal and Ethical Responsibilities of Software Businesses',
  'Marketing a Software Product',
  'Software Sales, Funnels and Customer Success',
  'Startup Finance and Funding',
  'Launching and Growing a Software Product',
  'Final Software Business and Investor Pitch',
];

const agileTopics = [
  'Agile fundamentals',
  'Agile frameworks',
  'Product vision and user stories',
  'Product backlog',
  'Scrum',
  'Agile estimation',
  'Sprint planning',
  'Kanban',
  'Agile metrics',
  'Risk and change',
  'Agile quality',
  'Agile teams',
  'Agile and DevOps',
  'Release planning',
  'Reviews and retrospectives',
  'Final Agile review',
];
const designTopics = [
  'Software engineering and SDLC',
  'Requirements engineering',
  'Use cases and UML',
  'Class and sequence modelling',
  'Software architecture',
  'Design principles',
  'UI and UX design',
  'Database design',
  'APIs and integration',
  'Design patterns',
  'Software testing',
  'Debugging and refactoring',
  'Secure software design',
  'Git and collaboration',
  'Deployment and maintenance',
  'Technical demonstration',
];
const oopTopics = [
  'Programming and OOP fundamentals',
  'Decisions, loops and methods',
  'Classes and objects',
  'Constructors and encapsulation',
  'Object relationships',
  'Inheritance',
  'Polymorphism',
  'Abstraction and interfaces',
  'Collections',
  'Exception handling',
  'File handling and persistence',
  'Generics',
  'SOLID principles',
  'OOP design patterns',
  'Testing and refactoring',
  'Final OOP application',
];
const commercialTopics = [
  'Technology commercialization',
  'Customer discovery',
  'Market research',
  'Market sizing',
  'Competitor analysis',
  'Value proposition',
  'MVP and validation',
  'Business models',
  'Pricing',
  'Intellectual property',
  'Legal and ethical issues',
  'Marketing',
  'Sales and retention',
  'Finance and funding',
  'Go-to-market',
  'Commercial pitch',
];

function lessons(
  courseId: string,
  titles: string[],
  topics: string[],
): Lesson[] {
  return titles.map((title, index) => ({
    id: courseId + '-w' + (index + 1),
    week: index + 1,
    title,
    shortTopic: topics[index],
  }));
}

export const moduleTwoCourses: StudentCourse[] = [
  {
    id: 'm2-agile',
    code: 'COMP2001',
    title: 'Agile Software Projects',
    leader: 'Dr Eleanor Walsh',
    group: 'Module 2',
    credits: 15,
    progress: 0,
    day: 'Monday',
    description:
      'Plan, manage, monitor and deliver software projects using Agile, Scrum, Kanban, DevOps and evidence-led improvement.',
    lessons: lessons('agile', agileTitles, agileTopics),
  },
  {
    id: 'm2-design',
    code: 'COMP2002',
    title: 'Software Design and Development',
    leader: 'Dr Nathan Cole',
    group: 'Module 2',
    credits: 15,
    progress: 0,
    day: 'Tuesday',
    description:
      'Analyse, design, build, test, secure, deploy and maintain professional software systems.',
    lessons: lessons('design', designTitles, designTopics),
  },
  {
    id: 'm2-oop',
    code: 'COMP2003',
    title: 'Object-Oriented Programming',
    leader: 'Dr Amina Qureshi',
    group: 'Module 2',
    credits: 15,
    progress: 0,
    day: 'Wednesday',
    description:
      'Develop complete object-oriented applications using classes, inheritance, polymorphism, interfaces, persistence, SOLID and patterns.',
    lessons: lessons('oop', oopTitles, oopTopics),
  },
  {
    id: 'm2-commercial',
    code: 'COMP2004',
    title: 'Software Commercialization and Market Strategy',
    leader: 'Prof. James Whitmore',
    group: 'Module 2',
    credits: 15,
    progress: 0,
    day: 'Thursday',
    description:
      'Transform a technology idea into a commercially viable product through research, business modelling, pricing, launch and growth.',
    lessons: lessons('commercial', commercialTitles, commercialTopics),
  },
];

export const allCourses = [...moduleOneCourses, ...moduleTwoCourses];

export const moduleTwoAssessments = [
  {
    id: 'COMP2001-A1',
    course: 'COMP2001',
    title: 'Product Backlog and User-Story Portfolio',
    available: '29 August 2026, 09:00',
    due: '18 September 2026, 16:00',
    weight: '15%',
    submissionType: 'PDF portfolio and backlog spreadsheet',
    wordLimit: '1,500 words plus backlog artefacts',
    summary:
      'Define a credible product vision, identify users, write testable user stories and prioritise an initial product backlog for the integrated software product.',
    outcomes: [
      'Translate customer needs into epics and user stories',
      'Apply acceptance criteria and a transparent prioritisation method',
      'Plan a coherent minimum viable product release',
    ],
    rubric: [
      ['Product vision and user insight', '25%'],
      ['User-story quality and acceptance criteria', '30%'],
      ['Prioritisation and release rationale', '30%'],
      ['Professional presentation and reflection', '15%'],
    ],
  },
  {
    id: 'COMP2002-A1',
    course: 'COMP2002',
    title: 'Requirements and UML Design Portfolio',
    available: '5 September 2026, 09:00',
    due: '2 October 2026, 16:00',
    weight: '15%',
    submissionType: 'PDF design portfolio',
    wordLimit: '2,000 words plus diagrams',
    summary:
      'Produce a requirements specification and a consistent set of UML models for the integrated software product.',
    outcomes: [
      'Distinguish functional and non-functional requirements',
      'Model user interaction and system behaviour with UML',
      'Justify design decisions using professional evidence',
    ],
    rubric: [
      ['Requirements coverage and traceability', '30%'],
      ['Use-case, class and sequence models', '35%'],
      ['Design rationale', '20%'],
      ['Clarity and referencing', '15%'],
    ],
  },
  {
    id: 'COMP2003-A1',
    course: 'COMP2003',
    title: 'Object-Oriented Programming Assignment 1',
    available: '12 September 2026, 09:00',
    due: '16 October 2026, 16:00',
    weight: '15%',
    submissionType: 'ZIP source archive and PDF report',
    wordLimit: '1,000-word technical commentary',
    summary:
      'Implement the first working domain layer of the product using encapsulation, composition, inheritance and automated tests.',
    outcomes: [
      'Design cohesive classes with appropriate responsibilities',
      'Use object relationships and polymorphism effectively',
      'Demonstrate reliable behaviour with unit tests',
    ],
    rubric: [
      ['Object model and implementation', '40%'],
      ['Correctness and testing', '30%'],
      ['Code quality and maintainability', '20%'],
      ['Technical commentary', '10%'],
    ],
  },
  {
    id: 'COMP2004-A1',
    course: 'COMP2004',
    title: 'Market Research and Opportunity Analysis',
    available: '19 September 2026, 09:00',
    due: '30 October 2026, 16:00',
    weight: '15%',
    submissionType: 'PDF commercial report',
    wordLimit: '2,000 words',
    summary:
      'Evaluate the target market, customer problem, commercial opportunity and competitive position for the integrated software product.',
    outcomes: [
      'Plan and interpret primary customer research',
      'Estimate market size using defensible assumptions',
      'Analyse competitors and articulate product positioning',
    ],
    rubric: [
      ['Customer and problem evidence', '30%'],
      ['Market sizing and opportunity', '25%'],
      ['Competitor and positioning analysis', '30%'],
      ['Professional communication', '15%'],
    ],
  },
];

export type LearningResource = {
  id: string;
  title: string;
  course: string;
  format: 'TXT' | 'CSV' | 'MD' | 'PDF';
  size: string;
  available: boolean;
  fileName: string;
  content?: string;
};

export const learningResources: LearningResource[] = [
  {
    id: 'RES-M2-HANDBOOK',
    title: 'Module 2 Handbook and 16-Week Plan',
    course: 'Module 2',
    format: 'TXT',
    size: '12 KB',
    available: true,
    fileName: 'module-2-handbook.txt',
    content:
      'UCL DISTANCE LEARNING — MODULE 2 HANDBOOK\n\nSoftware Development and Commercialization\nAcademic Year 2026–27\n\nStructure\nFour parallel 15-credit courses over 16 teaching weeks: COMP2001 Agile Software Projects; COMP2002 Software Design and Development; COMP2003 Object-Oriented Programming; COMP2004 Software Commercialization and Market Strategy.\n\nWeekly pattern\nComplete the course overview, required reading, interactive lesson, practical task, knowledge check and forum contribution. Each task contributes to one integrated software product.\n\nAssessment\nConsult the LMS Assignments area for current briefs, criteria and deadlines. All deadlines are shown in UK and Pakistan time.\n\nAcademic integrity\nSubmit your own work, cite sources accurately and retain evidence of your individual contribution.',
  },
  {
    id: 'RES-M2-PROJECT',
    title: 'Integrated Software Product Project Brief',
    course: 'Module 2',
    format: 'MD',
    size: '9 KB',
    available: true,
    fileName: 'integrated-software-product-brief.md',
    content:
      '# Integrated Software Product\n\nDesign, build and prepare for market launch a focused digital product that addresses a validated user problem.\n\n## Required evidence\n- Product vision and prioritised backlog\n- Requirements and UML models\n- Secure object-oriented implementation\n- Test evidence and release plan\n- Market analysis, pricing and launch strategy\n\n## Milestones\n1. Discovery and product vision\n2. Requirements and architecture\n3. Working domain model\n4. MVP demonstration\n5. Commercial pitch\n',
  },
  {
    id: 'RES-AGILE-BACKLOG',
    title: 'Product Backlog Template',
    course: 'COMP2001',
    format: 'CSV',
    size: '2 KB',
    available: true,
    fileName: 'product-backlog-template.csv',
    content:
      'ID,Epic,User Story,Acceptance Criteria,Priority,Estimate,Status\nUS-001,Account access,"As a student, I want secure sign-in so that my learning record is protected","Valid users can sign in; invalid credentials show a clear error",Must,5,Ready\nUS-002,Course learning,"As a student, I want weekly lessons so that I can study in sequence","Lesson title, activity and completion control are visible",Must,8,Backlog\n',
  },
  {
    id: 'RES-DESIGN-UML',
    title: 'UML Modelling Workbook',
    course: 'COMP2002',
    format: 'PDF',
    size: '4.2 MB',
    available: false,
    fileName: 'uml-modelling-workbook.pdf',
  },
  {
    id: 'RES-OOP-GUIDE',
    title: 'OOP Starter Repository Guide',
    course: 'COMP2003',
    format: 'MD',
    size: '6 KB',
    available: true,
    fileName: 'oop-starter-guide.md',
    content:
      '# OOP Starter Guide\n\nCreate a repository with `src`, `tests` and `docs` folders. Keep domain classes independent from interface code. Commit small, tested changes using clear messages.\n\n## Minimum quality checks\n- Encapsulated state\n- Constructor validation\n- Unit tests for expected and exceptional behaviour\n- README with build and run instructions\n- No credentials or generated files in version control\n',
  },
  {
    id: 'RES-BMC',
    title: 'Business Model Canvas Worksheet',
    course: 'COMP2004',
    format: 'CSV',
    size: '3 KB',
    available: true,
    fileName: 'business-model-canvas.csv',
    content:
      'Section,Guiding question,Your evidence\nCustomer segments,Who experiences the problem most strongly?,\nValue proposition,What measurable outcome will the product improve?,\nChannels,How will customers discover and adopt the product?,\nRevenue streams,Who pays and how often?,\nCost structure,What are the main fixed and variable costs?,\nKey metrics,Which behaviours indicate genuine value?,\n',
  },
];
