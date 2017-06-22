import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node } from '../../d3'
@Component({
  selector: 'persondialog',
  templateUrl: './persondialog.html',
  styleUrls: ['./persondialog.css']
})
export class NewPersonDialog {
  constructor(public dialogRef: MdDialogRef<NewPersonDialog>) {
  }
  createPerson(profileData) {
    console.log(profileData)
    const n: Node = new Node(Math.ceil(Math.random()), undefined, profileData.firstName, profileData.lastName);
    // console.log(n)
    this.dialogRef.close(n);
  }
}