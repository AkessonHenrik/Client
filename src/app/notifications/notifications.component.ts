import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications;
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.httpService.getNotifications().then(response => {
      console.log(response);
      this.notifications = response.json();
    })
  }
  acknowledgeNotification(notificationId: number) {
    this.httpService.deleteNotification(notificationId).then(response => {
      this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
    });
  }
}
