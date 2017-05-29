import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node} from '../../d3'
@Component({
  selector: 'persondialog',
  templateUrl: './persondialog.html',
  styleUrls: ['./persondialog.css']
})
export class NewPersonDialog {
  firstname: string;
  lastname: string;
  image: string;
  constructor(public dialogRef: MdDialogRef<NewPersonDialog>) {
  }
  createPerson() {
    const n: Node = new Node(100, undefined, this.firstname, this.lastname);
    console.log(n)
    this.dialogRef.close(n);
  }
}