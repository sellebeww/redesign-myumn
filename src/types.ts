import type { Text } from "./lib/preferences";

export interface Course {
  id: string;
  code: string;
  name: string;
  sks: number;
  classSection: string;
  lecturerName: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  attendanceCount: number;
  attendanceTotal: number;
  grades?: {
    quiz: number;
    assignment: number;
    uts: number;
    uas: number;
    finalScore: number;
    gradeLetter: string;
  };
}
export interface Address {
  id: string;
  type: "Permanent (KTP)" | "Correspondence (Domisili)";
  street: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
}
export interface PhoneRecord {
  id: string;
  type: Text;
  countryCode: string;
  number: string;
  isPrimary: boolean;
}
export interface EmailRecord {
  id: string;
  type: Text;
  address: string;
  isPrimary: boolean;
}
export interface PreEnrollmentItem {
  id: string;
  code: string;
  name: string;
  sks: number;
  lecturer: string;
  schedule: string;
  enrolledCount: number;
  quota: number;
  selected?: boolean;
}
export interface SKKMEvent {
  id: string;
  activityName: Text;
  category: "Scientific and Reasoning" | "Talents and Interests" | "Organization and Personality Development" | "Community Development";
  role: Text;
  points: number;
  date: string;
  status: "Approved" | "Pending";
  certificateNumber?: string;
}
export interface HelpTicketReply {
  sender: "Student" | "HelpDesk Staff";
  message: Text;
  timestamp: string;
}
export interface HelpTicket {
  id: string;
  category: Text;
  subject: Text;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  description: Text;
  replies: HelpTicketReply[];
}
export interface FinanceItem {
  id: string;
  componentName: Text;
  semester: number;
  billingPeriod: Text;
  dueDate: string;
  amount: number;
  status: "Paid" | "Unpaid";
  paymentDate?: string;
}
export interface ExamRecord {
  id: string;
  courseName: string;
  examType: "Midterm Exam" | "Final Exam";
  date: string;
  time: string;
  room: Text;
  seatNumber: string;
}
export interface HandbookItem {
  title: Text;
  content: Text;
}
