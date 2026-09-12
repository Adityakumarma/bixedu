import { Student } from './student.model';
import { Batch } from './batch.model';
import { User } from './user.model';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceRecord {
  _id?: string;
  centreId?: string;
  batchId?: string | Partial<Batch>;
  studentId?: string | Partial<Student>;
  date?: string;
  status: AttendanceStatus;
  markedBy?: string | Partial<User>;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentAttendanceItem {
  student: Student;
  status: AttendanceStatus;
  remarks?: string;
  markedAt?: string | null;
  isRecorded?: boolean;
}

export interface BatchAttendanceData {
  batch: Partial<Batch>;
  date: string;
  studentsCount: number;
  records: StudentAttendanceItem[];
}

export interface BatchAttendanceSavePayload {
  batchId: string;
  date: string;
  records: {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}

export interface AttendanceHistoryFilter {
  batchId?: string;
  studentId?: string;
  status?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendanceRate: number;
}
