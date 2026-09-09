export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CENTRE_ADMIN = 'CENTRE_ADMIN',
  TEACHER = 'TEACHER',
  PARENT = 'PARENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  centreId?: string;
  phone?: string;
  isActive?: boolean;
}
