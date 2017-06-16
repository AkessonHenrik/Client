import { Inject, Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ProfileViewComponent } from '../../../profile-view/profile-view.component'
@Component({
  selector: 'profileDialog',
  templateUrl: './profileDialog.html',
  styleUrls: ['./profileDialog.css']
})
export class ProfileDialog {
  node: Node;
  constructor( @Inject(MD_DIALOG_DATA) private data: Node, public dialogRef: MdDialogRef<ProfileDialog>) {
    this.node = data;
  }
}