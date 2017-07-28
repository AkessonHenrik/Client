import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { NewPersonDialog } from '../tree/dialogs/personDialog';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import * as globals from '../globals';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications;
  constructor(public dialog: MdDialog, private httpService: HttpService, ) { }

  ngOnInit() {
    this.getNotifications();
  }
  getNotifications() {
    this.httpService.getNotifications().then(response => {
      console.log(response);
      this.notifications = response.json();
    })
  }
  accept(notificationId: number) {
    this.httpService.deleteNotification(notificationId).then(response => {
      this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
    });
  }
  refuse(notification) {
    this.httpService.delete(notification.entityid).then(response => {
      this.getNotifications();
    })
  }

  createProfile(notification) {
    if (notification.content.indexOf("You now own") < 0) {
      let dialogRef = this.dialog.open(NewPersonDialog);
      dialogRef.afterClosed().subscribe(node => {
        if (node !== undefined) {
          this.httpService.createProfile({
            "firstname": node.firstname,
            "lastname": node.lastname,
            "gender": globals.genders.indexOf(node.gender),
            "profilePicture": node.image,
            "birthDay": node.birthDay,
            "deathDay": node.deathDay,
            "born": node.born,
            "visibility": node.visibility,
            "died": node.died
          }).then(response => {
            node.id = response.id;
            node.image = response.image;
            return this.httpService.associateToAccount({
              accountId: globals.getUserId(),
              profileId: node.id
            }).then(response => {
              localStorage["treemily_profileid"] = node.id
            })
          })
        }
      });
    }
    this.accept(notification.id);
  }
}
