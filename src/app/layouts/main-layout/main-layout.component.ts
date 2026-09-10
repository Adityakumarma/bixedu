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
  IonAvatar
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
    IonAvatar
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
    { title: 'Students', url: '/students', icon: 'people-outline' },
    { title: 'Parents', url: '/parents', icon: 'heart-outline' },
    { title: 'Batches', url: '/batches', icon: 'library-outline' },
    { title: 'Attendance', url: '/attendance', icon: 'calendar-outline' },
    { title: 'Fees', url: '/fees', icon: 'wallet-outline' },
    { title: 'Exams & Results', url: '/exams', icon: 'school-outline' },
    { title: 'Staff', url: '/staff', icon: 'person-add-outline' },
    { title: 'Notifications', url: '/notifications', icon: 'notifications-outline' },
    { title: 'Reports & Analytics', url: '/reports', icon: 'bar-chart-outline' },
    { title: 'Subscription', url: '/subscription', icon: 'card-outline' },
    { title: 'Settings', url: '/settings', icon: 'settings-outline' }
  ];

  ngOnInit(): void {
    if (this.authService.isAuthenticated) {
      this.authService.getProfile().subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

