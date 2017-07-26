import { Component, Input } from '@angular/core';
import { Relationship } from '../../../d3';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { EventDialog } from '../../../tree/dialogs/eventDialog';
import * as globals from '../../../globals';
@Component({
  selector: '[linkVisual]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent {
  @Input('linkVisual') link: Relationship;
  constructor(private dialog: MdDialog) { }
  showMore(id: number) {
    if (globals.loggedIn()) {
      let dialogRef = this.dialog.open(EventDialog, {
        data: {
          id: id,
          relationship: true
        }
      });
    }
  }
}
