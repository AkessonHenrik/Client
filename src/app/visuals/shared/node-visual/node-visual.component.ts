import {
  Inject, Component, Input, Output,
  EventEmitter, ChangeDetectorRef,
  HostListener, ChangeDetectionStrategy
} from '@angular/core';
import { Node } from '../../../d3';
import { TreeComponent } from '../../../tree/tree.component'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ProfileDialog } from './profileDialog'
import * as globals from '../../../globals';
import { InfoDialog } from '../index';
@Component({
  selector: '[node]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('node') node: Node;
  globals;
  constructor(public dialog: MdDialog) {
    this.globals = globals;
  }

  openDialog() {
    if (globals.loggedIn()) {
      let dialogRef = this.dialog.open(ProfileDialog, {
        data: this.node
      });
    } else {
      this.dialog.open(InfoDialog);
    }
  }
}

