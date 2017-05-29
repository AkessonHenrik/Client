import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'choice-dialog',
  templateUrl: './choiceDialog.html',
  styleUrls: ['./choiceDialog.css']
})
export class ChoiceDialog {
  constructor(public dialogRef: MdDialogRef<ChoiceDialog>) {
  }
}