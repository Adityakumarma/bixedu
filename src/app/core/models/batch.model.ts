import { Student } from './student.model';
import { User } from './user.model';

export interface Batch {
  _id: string;
  centreId: string;
  name: string;
  code?: string;
  description?: string;
  course?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  room?: string;
  capacity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  teacherIds?: (string | User)[];
  students?: Student[];
  studentCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BatchPayload {
  name: string;
  code?: string;
  description?: string;
  course?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  days?: string[];
  room?: string;
  capacity?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'COMPLETED';
  teacherIds?: string[];
}
