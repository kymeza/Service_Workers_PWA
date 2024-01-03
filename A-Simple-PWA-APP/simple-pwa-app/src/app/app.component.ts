import { Component } from '@angular/core';
import { PushNotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  template: `<button (click)="sendNotification()">Send Notification</button>`
})
export class AppComponent {
  constructor(private pushService: PushNotificationService) {}

  sendNotification() {
    this.pushService.subscribeToNotifications().then(() => {
      console.log('Notification subscription successful');
    }).catch(err => {
      console.error('Error subscribing to notifications', err);
    });
  }
}
