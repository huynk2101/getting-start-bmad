export interface Student {
  id: string;
  name: string;
  studentId: string;
  enrolledSince: string;
  email: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  teacherName: string;
  schedule: string;
  studentCount: number;
  nextExam?: string;
  studentIds: string[];
}

export interface ExamOption {
  label: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: ExamOption[];
  correctIndex: number;
}

export type ExamStatus = "upcoming" | "open" | "closed" | "finalized";

export interface Exam {
  id: string;
  title: string;
  classId: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: ExamStatus;
  questions: ExamQuestion[];
  totalStudents: number;
  submittedCount: number;
}

export type GradingStatus = "pending" | "graded" | "absent";

export interface RosterEntry {
  studentId: string;
  classId: string;
  score?: number;
  gradingStatus: GradingStatus;
  absent: boolean;
}

export interface ScheduleEntry {
  classId: string;
  className: string;
  time: string;
  endTime: string;
  teacher: string;
  day: string;
}

export interface ResultEntry {
  examId: string;
  studentId: string;
  answers: Record<string, number>;
  score?: number;
  submitted: boolean;
  submittedAt?: string;
}

export const students: Student[] = [
  { id: "s1", name: "Alex Rivera", studentId: "STU-1001", enrolledSince: "Sep 2026", email: "alex.r@school.edu" },
  { id: "s2", name: "Morgan Lee", studentId: "STU-1002", enrolledSince: "Sep 2026", email: "morgan.l@school.edu" },
  { id: "s3", name: "Jordan Kim", studentId: "STU-1003", enrolledSince: "Sep 2026", email: "jordan.k@school.edu" },
  { id: "s4", name: "Taylor Swift", studentId: "STU-1004", enrolledSince: "Sep 2026", email: "taylor.s@school.edu" },
  { id: "s5", name: "Casey Chen", studentId: "STU-1005", enrolledSince: "Sep 2026", email: "casey.c@school.edu" },
  { id: "s6", name: "Riley Patel", studentId: "STU-1006", enrolledSince: "Sep 2026", email: "riley.p@school.edu" },
];

export const classes: ClassInfo[] = [
  { id: "c1", name: "Biology 101", teacherName: "Mr. Chen", schedule: "Mon / Wed / Fri 09:00", studentCount: 6, nextExam: "Biology Midterm", studentIds: ["s1", "s2", "s3", "s4", "s5", "s6"] },
  { id: "c2", name: "Chemistry", teacherName: "Mr. Chen", schedule: "Tue / Thu 10:15", studentCount: 5, studentIds: ["s1", "s2", "s3", "s5", "s6"] },
  { id: "c3", name: "Algebra", teacherName: "Mr. Chen", schedule: "Mon / Wed 13:00", studentCount: 4, studentIds: ["s1", "s3", "s4", "s6"] },
  { id: "c4", name: "English Lit", teacherName: "Mr. Chen", schedule: "Tue / Thu 10:30", studentCount: 3, studentIds: ["s1", "s2", "s4"] },
];

export const exams: Exam[] = [
  {
    id: "e1",
    title: "Biology Midterm",
    classId: "c1",
    date: "Fri",
    time: "08:00",
    durationMinutes: 45,
    status: "open",
    totalStudents: 6,
    submittedCount: 4,
    questions: [
      { id: "q1", text: "What is the powerhouse of the cell?", options: [{ label: "A", text: "Nucleus" }, { label: "B", text: "Mitochondria" }, { label: "C", text: "Ribosome" }, { label: "D", text: "Golgi apparatus" }], correctIndex: 1 },
      { id: "q2", text: "Which molecule carries genetic information?", options: [{ label: "A", text: "RNA" }, { label: "B", text: "Protein" }, { label: "C", text: "DNA" }, { label: "D", text: "Lipids" }], correctIndex: 2 },
      { id: "q3", text: "What is the process by which plants make food?", options: [{ label: "A", text: "Respiration" }, { label: "B", text: "Fermentation" }, { label: "C", text: "Digestion" }, { label: "D", text: "Photosynthesis" }], correctIndex: 3 },
      { id: "q4", text: "Which organelle is responsible for protein synthesis?", options: [{ label: "A", text: "Ribosome" }, { label: "B", text: "Lysosome" }, { label: "C", text: "Vacuole" }, { label: "D", text: "Centriole" }], correctIndex: 0 },
      { id: "q5", text: "What is the cell membrane primarily composed of?", options: [{ label: "A", text: "Cellulose" }, { label: "B", text: "Lipid bilayer" }, { label: "C", text: "Chitin" }, { label: "D", text: "Peptidoglycan" }], correctIndex: 1 },
      { id: "q6", text: "Which process converts glucose to pyruvate?", options: [{ label: "A", text: "Krebs cycle" }, { label: "B", text: "Glycolysis" }, { label: "C", text: "Electron transport" }, { label: "D", text: "Calvin cycle" }], correctIndex: 1 },
      { id: "q7", text: "What is the function of white blood cells?", options: [{ label: "A", text: "Carry oxygen" }, { label: "B", text: "Fight infection" }, { label: "C", text: "Clot blood" }, { label: "D", text: "Transport nutrients" }], correctIndex: 1 },
      { id: "q8", text: "Which kingdom includes fungi?", options: [{ label: "A", text: "Plantae" }, { label: "B", text: "Animalia" }, { label: "C", text: "Fungi" }, { label: "D", text: "Protista" }], correctIndex: 2 },
      { id: "q9", text: "What is the basic unit of heredity?", options: [{ label: "A", text: "Chromosome" }, { label: "B", text: "Gene" }, { label: "C", text: "Allele" }, { label: "D", text: "Genome" }], correctIndex: 1 },
      { id: "q10", text: "What type of bond involves sharing electrons?", options: [{ label: "A", text: "Ionic" }, { label: "B", text: "Covalent" }, { label: "C", text: "Metallic" }, { label: "D", text: "Hydrogen" }], correctIndex: 1 },
    ],
  },
  {
    id: "e2",
    title: "Chemistry Quiz 2",
    classId: "c2",
    date: "Thu",
    time: "10:15",
    durationMinutes: 30,
    status: "finalized",
    totalStudents: 5,
    submittedCount: 5,
    questions: [
      { id: "cq1", text: "What is the chemical symbol for Gold?", options: [{ label: "A", text: "Go" }, { label: "B", text: "Gd" }, { label: "C", text: "Au" }, { label: "D", text: "Ag" }], correctIndex: 2 },
      { id: "cq2", text: "Which gas is most abundant in Earth's atmosphere?", options: [{ label: "A", text: "Oxygen" }, { label: "B", text: "Carbon dioxide" }, { label: "C", text: "Nitrogen" }, { label: "D", text: "Hydrogen" }], correctIndex: 2 },
      { id: "cq3", text: "What is the atomic number of Carbon?", options: [{ label: "A", text: "4" }, { label: "B", text: "6" }, { label: "C", text: "8" }, { label: "D", text: "12" }], correctIndex: 1 },
      { id: "cq4", text: "What type of bond involves sharing electrons?", options: [{ label: "A", text: "Ionic" }, { label: "B", text: "Covalent" }, { label: "C", text: "Metallic" }, { label: "D", text: "Hydrogen" }], correctIndex: 1 },
      { id: "cq5", text: "What is the pH of pure water?", options: [{ label: "A", text: "6" }, { label: "B", text: "7" }, { label: "C", text: "8" }, { label: "D", text: "14" }], correctIndex: 1 },
    ],
  },
  {
    id: "e3",
    title: "Algebra Test 1",
    classId: "c3",
    date: "Wed",
    time: "13:00",
    durationMinutes: 40,
    status: "finalized",
    totalStudents: 4,
    submittedCount: 4,
    questions: [
      { id: "aq1", text: "Solve for x: 2x + 6 = 14", options: [{ label: "A", text: "3" }, { label: "B", text: "4" }, { label: "C", text: "5" }, { label: "D", text: "8" }], correctIndex: 1 },
      { id: "aq2", text: "What is the slope of y = 3x + 2?", options: [{ label: "A", text: "2" }, { label: "B", text: "3" }, { label: "C", text: "5" }, { label: "D", text: "6" }], correctIndex: 1 },
      { id: "aq3", text: "Factor: x^2 - 9", options: [{ label: "A", text: "(x-3)(x+3)" }, { label: "B", text: "(x-9)(x+1)" }, { label: "C", text: "(x-3)^2" }, { label: "D", text: "(x+3)^2" }], correctIndex: 0 },
      { id: "aq4", text: "What is the square root of 64?", options: [{ label: "A", text: "6" }, { label: "B", text: "7" }, { label: "C", text: "8" }, { label: "D", text: "9" }], correctIndex: 2 },
    ],
  },
  {
    id: "e4",
    title: "English Lit Quiz",
    classId: "c4",
    date: "Mon",
    time: "10:30",
    durationMinutes: 20,
    status: "upcoming",
    totalStudents: 3,
    submittedCount: 0,
    questions: [
      { id: "eq1", text: "Who wrote 'Romeo and Juliet'?", options: [{ label: "A", text: "Charles Dickens" }, { label: "B", text: "Jane Austen" }, { label: "C", text: "William Shakespeare" }, { label: "D", text: "Mark Twain" }], correctIndex: 2 },
      { id: "eq2", text: "What is a protagonist?", options: [{ label: "A", text: "The villain" }, { label: "B", text: "The main character" }, { label: "C", text: "The setting" }, { label: "D", text: "The theme" }], correctIndex: 1 },
    ],
  },
];

export const roster: RosterEntry[] = [
  { studentId: "s1", classId: "c1", gradingStatus: "graded", score: 85, absent: false },
  { studentId: "s2", classId: "c1", gradingStatus: "pending", absent: false },
  { studentId: "s3", classId: "c1", gradingStatus: "pending", absent: false },
  { studentId: "s4", classId: "c1", gradingStatus: "absent", absent: true },
  { studentId: "s5", classId: "c1", gradingStatus: "pending", absent: false },
  { studentId: "s6", classId: "c1", gradingStatus: "graded", score: 72, absent: false },
  { studentId: "s1", classId: "c2", gradingStatus: "graded", score: 92, absent: false },
  { studentId: "s2", classId: "c2", gradingStatus: "graded", score: 88, absent: false },
  { studentId: "s3", classId: "c2", gradingStatus: "graded", score: 76, absent: false },
  { studentId: "s5", classId: "c2", gradingStatus: "graded", score: 84, absent: false },
  { studentId: "s6", classId: "c2", gradingStatus: "graded", score: 80, absent: false },
  { studentId: "s1", classId: "c3", gradingStatus: "graded", score: 78, absent: false },
  { studentId: "s3", classId: "c3", gradingStatus: "graded", score: 91, absent: false },
  { studentId: "s4", classId: "c3", gradingStatus: "graded", score: 65, absent: false },
  { studentId: "s6", classId: "c3", gradingStatus: "graded", score: 88, absent: false },
];

export const schedules: ScheduleEntry[] = [
  { classId: "c1", className: "Biology 101", time: "09:00", endTime: "09:50", teacher: "Mr. Chen", day: "Mon" },
  { classId: "c1", className: "Biology 101", time: "09:00", endTime: "09:50", teacher: "Mr. Chen", day: "Wed" },
  { classId: "c1", className: "Biology 101", time: "09:00", endTime: "09:50", teacher: "Mr. Chen", day: "Fri" },
  { classId: "c2", className: "Chemistry", time: "10:15", endTime: "11:05", teacher: "Mr. Chen", day: "Tue" },
  { classId: "c2", className: "Chemistry", time: "10:15", endTime: "11:05", teacher: "Mr. Chen", day: "Thu" },
  { classId: "c3", className: "Algebra", time: "13:00", endTime: "13:50", teacher: "Mr. Chen", day: "Mon" },
  { classId: "c3", className: "Algebra", time: "13:00", endTime: "13:50", teacher: "Mr. Chen", day: "Wed" },
  { classId: "c4", className: "English Lit", time: "10:30", endTime: "11:20", teacher: "Mr. Chen", day: "Tue" },
  { classId: "c4", className: "English Lit", time: "10:30", endTime: "11:20", teacher: "Mr. Chen", day: "Thu" },
];

export const results: ResultEntry[] = [
  { examId: "e1", studentId: "s2", answers: {}, submitted: false },
  { examId: "e1", studentId: "s3", answers: {}, submitted: false },
  { examId: "e1", studentId: "s4", answers: {}, submitted: false },
  { examId: "e1", studentId: "s5", answers: {}, submitted: false },
  { examId: "e1", studentId: "s6", answers: { q1: 1, q2: 2, q3: 3, q4: 0, q5: 1, q6: 1, q7: 0, q8: 2, q9: 1, q10: 1 }, score: 72, submitted: true },
  { examId: "e2", studentId: "s1", answers: { cq1: 2, cq2: 2, cq3: 1, cq4: 1, cq5: 1 }, score: 92, submitted: true },
  { examId: "e2", studentId: "s2", answers: { cq1: 2, cq2: 2, cq3: 1, cq4: 1, cq5: 0 }, score: 88, submitted: true },
  { examId: "e3", studentId: "s1", answers: { aq1: 1, aq2: 1, aq3: 0, aq4: 2 }, score: 78, submitted: true },
];
