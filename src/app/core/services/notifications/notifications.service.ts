import { inject, Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { ToastService } from '../toast/toast.service';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { NotificationResponse } from '../../models/notification.interface';
import { checkToken } from 'src/app/shared/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private toastService = inject(ToastService);
  private apiService = inject(ApiService);

  constructor() {}

  async addListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
      this.toastService.error(err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {}
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {}
    );
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  async getDeliveredNotifications() {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
  }

  /**
   * Get notifications from API
   * @param page Page number for pagination
   * @param search Search term for filtering notifications
   * @returns Observable with notification response
   */
  getNotifications(
    page: number = 1,
    search?: string
  ): Observable<NotificationResponse> {
    let params: any = { page };

    if (search && search.trim()) {
      params.search = search.trim();
    }

    return this.apiService.get<NotificationResponse>('notifications', {
      params,
      context: checkToken(),
    });
  }

  /**
   * Mark notification as read
   * @param notificationId ID of the notification to mark as read
   * @returns Observable with the updated notification
   */
  markAsRead(notificationId: number): Observable<any> {
    return this.apiService.patch(`/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   * @returns Observable with the response
   */
  markAllAsRead(): Observable<any> {
    return this.apiService.patch('/notifications/mark-all-read', {});
  }

  // async getReceivedNotifications() {
  //   const notificationList =
  //     await PushNotifications.
  // }
}
