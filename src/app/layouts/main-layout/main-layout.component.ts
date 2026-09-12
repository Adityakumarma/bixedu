import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonButton,
  IonRouterOutlet,
  IonMenuToggle
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  title: string;
  url: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonRouterOutlet,
    IonMenuToggle
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  public authService = inject(AuthService);
  public router = inject(Router);

  public currentUser$ = this.authService.currentUser$;
  public currentCentre$ = this.authService.currentCentre$;

  public navItems: NavItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: 'grid-outline' },
    { title: 'Students', url: '/students', icon: 'people-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Parents', url: '/parents', icon: 'heart-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Batches', url: '/batches', icon: 'library-outline' },
    { title: 'Attendance', url: '/attendance', icon: 'calendar-outline' },
    { title: 'Fees', url: '/fees', icon: 'wallet-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Exams & Results', url: '/exams', icon: 'school-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Staff', url: '/staff', icon: 'person-add-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Notifications', url: '/notifications', icon: 'notifications-outline' },
    { title: 'Reports & Analytics', url: '/reports', icon: 'bar-chart-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Subscription', url: '/subscription', icon: 'card-outline', roles: ['SUPER_ADMIN', 'CENTRE_ADMIN'] },
    { title: 'Settings', url: '/settings', icon: 'settings-outline' }
  ];

  public get filteredNavItems(): NavItem[] {
    const user = this.authService.currentUserValue;
    if (!user) return [];
    return this.navItems.filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      return item.roles.includes(user.role);
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.authService.getProfile().subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

