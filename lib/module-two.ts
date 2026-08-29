export const STUDENT_PROFILE = {
  id: 'L-PK-625900',
  name: 'Muhammad Ahmad',
  email: 'ahmad@ucl.ac.uk',
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
    progress: 50,
    day: 'Monday',
    description: 'Programming logic, Python fundamentals, data structures, object-oriented development and applied project work.',
  },
  {
    id: 'm1-finance',
    code: 'N200-88B',
    title: 'Finance 101',
    leader: 'Daniel Schwarz',
    group: 'Module 1',
    credits: 2,
    progress: 29,
    day: 'Tuesday',
    description: 'Financial statements, investment decisions, capital markets, risk, planning and professional financial practice.',
  },
  {
    id: 'm1-ml',
    code: 'G500-99X',
    title: 'Machine Learning CP-1.1',
    leader: 'Lemoda Marina',
    group: 'Module 1',
    credits: 3,
    progress: 16,
    day: 'Wednesday',
    description: 'Machine-learning foundations, data preparation, supervised and unsupervised learning, evaluation and applied modelling.',
  },
  {
    id: 'm1-english',
    code: 'Q300-11C',
    title: 'English Literature',
    leader: 'Ahmad Hamadan',
    group: 'Module 1',
    credits: 2,
    progress: 45,
    day: 'Thursday',
    description: 'Critical reading, literary analysis, research, academic writing and the study of major literary forms and traditions.',
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

const agileTopics = ['Agile fundamentals','Agile frameworks','Product vision and user stories','Product backlog','Scrum','Agile estimation','Sprint planning','Kanban','Agile metrics','Risk and change','Agile quality','Agile teams','Agile and DevOps','Release planning','Reviews and retrospectives','Final Agile review'];
const designTopics = ['Software engineering and SDLC','Requirements engineering','Use cases and UML','Class and sequence modelling','Software architecture','Design principles','UI and UX design','Database design','APIs and integration','Design patterns','Software testing','Debugging and refactoring','Secure software design','Git and collaboration','Deployment and maintenance','Technical demonstration'];
const oopTopics = ['Programming and OOP fundamentals','Decisions, loops and methods','Classes and objects','Constructors and encapsulation','Object relationships','Inheritance','Polymorphism','Abstraction and interfaces','Collections','Exception handling','File handling and persistence','Generics','SOLID principles','OOP design patterns','Testing and refactoring','Final OOP application'];
const commercialTopics = ['Technology commercialization','Customer discovery','Market research','Market sizing','Competitor analysis','Value proposition','MVP and validation','Business models','Pricing','Intellectual property','Legal and ethical issues','Marketing','Sales and retention','Finance and funding','Go-to-market','Commercial pitch'];

function lessons(courseId: string, titles: string[], topics: string[]): Lesson[] {
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
    description: 'Plan, manage, monitor and deliver software projects using Agile, Scrum, Kanban, DevOps and evidence-led improvement.',
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
    description: 'Analyse, design, build, test, secure, deploy and maintain professional software systems.',
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
    description: 'Develop complete object-oriented applications using classes, inheritance, polymorphism, interfaces, persistence, SOLID and patterns.',
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
    description: 'Transform a technology idea into a commercially viable product through research, business modelling, pricing, launch and growth.',
    lessons: lessons('commercial', commercialTitles, commercialTopics),
  },
];

export const allCourses = [...moduleOneCourses, ...moduleTwoCourses];

export const moduleTwoAssessments = [
  { course: 'COMP2001', title: 'Product Backlog and User-Story Portfolio', due: '18 September 2026, 16:00', weight: '15%' },
  { course: 'COMP2002', title: 'Requirements and UML Design Portfolio', due: '2 October 2026, 16:00', weight: '15%' },
  { course: 'COMP2003', title: 'Object-Oriented Programming Assignment 1', due: '16 October 2026, 16:00', weight: '15%' },
  { course: 'COMP2004', title: 'Market Research and Opportunity Analysis', due: '30 October 2026, 16:00', weight: '15%' },
];
