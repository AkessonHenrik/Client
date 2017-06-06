import { Inject, Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Node } from '../../../d3';
import { TreeComponent } from '../../../tree/tree.component'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ProfileDialog } from './profileDialog'

@Component({
  selector: 'g[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;
  @Input('tree') tree: TreeComponent;
  constructor(public dialog: MdDialog) {
  }
  onRightClickEvent() {
    this.tree.importTree(this.node)
  }
  openDialog() {
    let dialogRef = this.dialog.open(ProfileDialog, {
      data: this.node
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
