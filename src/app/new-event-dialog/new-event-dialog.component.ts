import { Component, Inject, OnInit } from '@angular/core';
import { NewEventComponent } from '../new-event/new-event.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.css']
})
export class NewEventDialogComponent implements OnInit {

  constructor( @Inject(MD_DIALOG_DATA) private data, public dialogRef: MdDialogRef<NewEventDialogComponent>) { }

  ngOnInit() {
    console.log("Owner: ")
    console.log(this.data.owner)
  }
  close(event) {
    this.dialogRef.close();
  }
}
