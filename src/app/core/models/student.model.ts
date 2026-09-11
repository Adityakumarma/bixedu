import { Parent } from './parent.model';
import { Batch } from './batch.model';

export interface Student {
  _id: string;
  centreId: string;
  admissionNumber: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  parents?: (string | Parent)[];
  batchId?: string | Batch;
  status: 'ACTIVE' | 'INACTIVE';
  admissionDate?: string;
  profileImage?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentPayload {
  admissionNumber?: string;
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  parents?: string[];
  batchId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  admissionDate?: string;
  profileImage?: string;
  notes?: string;
}
