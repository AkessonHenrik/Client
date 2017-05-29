import { Inject, Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'expandDialog',
  templateUrl: './expandDialog.html',
  styleUrls: ['./expandDialog.css']
})
export class ExpandDialog {
  node: Node;
  constructor( @Inject(MD_DIALOG_DATA) private data: Node, public dialogRef: MdDialogRef<ExpandDialog>) {
    this.node = data;
  }
}