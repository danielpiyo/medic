import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { LocalNotifications } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    await LocalNotifications['requestPermissions']();
  }
}
