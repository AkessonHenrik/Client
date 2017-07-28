import { Component, Input, OnInit } from '@angular/core';
import { Link } from '../../../d3';
import { ParentComponent } from '../../../parent/parent.component';
import * as globals from '../../../globals';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { EventDialog } from '../../../tree/dialogs/eventDialog';
import { InfoDialog } from '../index'
@Component({
  selector: '[parentVisual]',
  templateUrl: './parent-visual.component.html',
  styleUrls: ['./parent-visual.component.css']
})
export class ParentVisualComponent implements OnInit {

  constructor(public dialog: MdDialog) {
  }
  ngOnInit() {
    this.icon.x = (this.parent.x1 + this.parent.x2) / 2 - 20
    this.icon.y = (this.parent.y1 + this.parent.y2) / 2
    console.log(this.parent);
  }
  @Input('parentVisual') parent: ParentComponent;
  icon = { path: './assets/info.svg', x: 500, y: 500 }
  showMore(): void {
    console.log("Parent showMore");
    console.log(this.parent.id)
    if (globals.loggedIn()) {
      console.log(this.parent)
      this.dialog.open(EventDialog, {
        data: { id: this.parent.id, relationship: false, parent: true }
      })
    } else {
      this.dialog.open(InfoDialog);
    }
  }
}
