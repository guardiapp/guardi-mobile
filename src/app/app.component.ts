import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AlertService } from './core/services/alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('audioElement', { static: true })
  audioElement!: ElementRef<HTMLAudioElement>;

  private platform = inject(Platform);
  private primengConfig = inject(PrimeNGConfig);
  private alertService = inject(AlertService);
  private router = inject(Router);

  constructor() {
    this.primengConfig.ripple = true;
    if (this.platform.is('hybrid')) {
      this.showSplash();
      this.setStatusBarStyleLight();
      this.initPush();
      ScreenOrientation.lock({ orientation: 'portrait' });
    }
  }

  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 3000,
    });
  }

  initPush(): void {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      localStorage.setItem('pushToken', token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error en el registro de notificationes: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        const isPanic = notification.title?.toLowerCase().includes('pánico');
        let resident = null;
        let message = notification.body;

        if (isPanic) {
          this.playAlarmSound();
          resident = JSON.parse(notification.data.resident);
          message = `${resident.name} activó una alarma de pánico en el edificio ${resident.apartment.building.name} apartamento ${resident.apartment.identifier}`;
        }

        this.alertService.presentAlert({
          header: notification.title,
          message: message,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                if (isPanic) {
                  this.stopAlarmSound();
                }
              },
            },
          ],
        });
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        this.router.navigate(['/tabs/reservations']);
      }
    );
  }

  async setStatusBarStyleLight() {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#ffffff' });
  }

  private playAlarmSound(): void {
    try {
      const audio = this.audioElement.nativeElement;
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error('Error playing alarm sound:', error);
      });
    } catch (error) {
      console.error('Error accessing audio element:', error);
    }
  }

  private stopAlarmSound(): void {
    try {
      const audio = this.audioElement.nativeElement;
      audio.pause();
      audio.currentTime = 0;
    } catch (error) {
      console.error('Error stopping alarm sound:', error);
    }
  }
}
