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
    console.log("=======================")
    console.log(profileData)
    console.log("=======================")
    const n: Node = new Node(-1 * Math.ceil(Math.random() * 100), undefined, profileData.firstName, profileData.lastName, profileData.gender, profileData.birthDay, profileData.deathDay, profileData.born, profileData.died);
    this.dialogRef.close(n);
  }
}