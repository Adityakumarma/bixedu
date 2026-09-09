import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage)
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/students/students.page').then((m) => m.StudentsPage)
      },
      {
        path: 'parents',
        loadComponent: () => import('./pages/parents/parents.page').then((m) => m.ParentsPage)
      },
      {
        path: 'batches',
        loadComponent: () => import('./pages/batches/batches.page').then((m) => m.BatchesPage)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./pages/attendance/attendance.page').then((m) => m.AttendancePage)
      },
      {
        path: 'fees',
        loadComponent: () => import('./pages/fees/fees.page').then((m) => m.FeesPage)
      },
      {
        path: 'exams',
        loadComponent: () => import('./pages/exams/exams.page').then((m) => m.ExamsPage)
      },
      {
        path: 'staff',
        loadComponent: () => import('./pages/staff/staff.page').then((m) => m.StaffPage)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.page').then((m) => m.NotificationsPage)
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.page').then((m) => m.ReportsPage)
      },
      {
        path: 'subscription',
        loadComponent: () => import('./pages/subscription/subscription.page').then((m) => m.SubscriptionPage)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
