import { Student } from './student.model';

export interface Parent {
  _id: string;
  centreId: string;
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  userId?: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  children?: Student[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentPayload {
  name: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  relationship?: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  children?: string[];
}
