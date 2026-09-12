import { User } from './user.model';
import { Batch } from './batch.model';

export interface Staff {
  _id: string;
  userId: User | string;
  centreId: string;
  employeeId?: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  joiningDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
  address?: string;
  qualification?: string;
  notes?: string;
  assignedBatches?: Partial<Batch>[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  employeeId?: string;
  designation?: string;
  joiningDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  address?: string;
  qualification?: string;
  notes?: string;
}

export interface UpdateStaffPayload extends Partial<CreateStaffPayload> {}
