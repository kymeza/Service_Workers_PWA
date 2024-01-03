import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private readonly pushServerUrl = 'https://localhost:7113/api/PWA/sendNotification';

  constructor(private http: HttpClient) {}

  public async subscribeToNotifications() {
    // Request permission for browser notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    }

    // Subscribe to the push service
    const sw = await navigator.serviceWorker.getRegistration();
    if (!sw) {
    throw new Error('Service Worker registration not found');
    }
    const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: this.urlBase64ToUint8Array('BGrY-ywGaKnr1_dNxDv1NltSfFbSP2_37Iq-QjlNLGhU4tF3nFFlW7sYCcT4gqe-crssiBMSFS-GBpanzkSeaDE')
    });


    // Send subscription object to the backend
    await firstValueFrom(
      this.http.post(this.pushServerUrl, subscription)
    );
    console.log('Subscription sent to the server');
    
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
