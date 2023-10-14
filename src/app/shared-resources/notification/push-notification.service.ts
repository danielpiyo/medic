import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private socket: any;

  constructor() {}

  // Connect to the WebSocket server
  connect() {
    this.socket = io(`${environment.socketIoURL}`); // Replace with your server URL
  }

  // Send a message to the server
  sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  // Listen for messages from the server
  receiveMessage(callback: (message: any) => void) {
    this.socket.on('message', callback);
  }

  // Disconnect from the WebSocket server
  disconnect() {
    this.socket.disconnect();
  }
}
