import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { NotificationsService } from 'src/app/core/services/notifications/notifications.service';
import {
  Notification,
  NotificationResponse,
} from 'src/app/core/models/notification.interface';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast/toast.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit, OnDestroy {
  private notificationsSvc = inject(NotificationsService);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private destroy$ = new Subject<void>();

  notifications = signal<Notification[]>([]);
  loading = signal<boolean>(false);
  currentPage = 1;
  hasMorePages = false;
  searchControl = new FormControl('');
  searchTerm = '';

  constructor() {}

  ngOnInit() {
    this.setupSearchListener();
  }

  ionViewWillEnter() {
    this.loadNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchListener() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchTerm = searchTerm || '';
        this.currentPage = 1;
        this.loadNotifications();
      });
  }

  loadNotifications() {
    this.loading.set(true);

    this.notificationsSvc
      .getNotifications(this.currentPage, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            if (this.currentPage === 1) {
              this.notifications.set(response.data);
            } else {
              this.notifications.update((prev) => [...prev, ...response.data]);
            }
            this.hasMorePages = !!response.next_page_url;
          }
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.toastService.error('Error al cargar las notificaciones');
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  handleRefresh(event: any) {
    setTimeout(() => event.target.complete(), 1500);
    this.currentPage = 1;
    this.loadNotifications();
  }

  async loadMore() {
    if (this.hasMorePages && !this.loading()) {
      this.currentPage++;
      await this.loadNotifications();
    }
  }

  async markAsRead(notification: Notification) {
    try {
      // Since the new interface doesn't have read status, we'll just show a success message
      this.toastService.success('Notificación vista');
    } catch (error) {
      console.error('Error viewing notification:', error);
      this.toastService.error('Error al ver la notificación');
    }
  }

  async markAllAsRead() {
    try {
      await this.loadingService.present();
      // Since the new interface doesn't have read status, we'll just show a success message
      this.toastService.success('Todas las notificaciones vistas');
    } catch (error) {
      console.error('Error viewing all notifications:', error);
      this.toastService.error('Error al ver todas las notificaciones');
    } finally {
      await this.loadingService.dismiss();
    }
  }

  getUnreadCount(): number {
    // Since the new interface doesn't have read status, we'll return 0
    // or you could implement a different logic based on your needs
    return 0;
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'PANIC':
        return 'warning';
      case 'NORMAL':
        return 'information-circle';
      default:
        return 'information-circle';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'PANIC':
        return 'danger';
      case 'NORMAL':
        return 'primary';
      default:
        return 'primary';
    }
  }
}
