import { Inject, Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Node } from '../../../d3';
import { TreeComponent } from '../../../tree/tree.component'
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

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
  @Output()
  outputNodeEvent: EventEmitter<Node> = new EventEmitter();
  onMoreClick() {
    console.log("onMoreClick");
    this.tree.handleStuff(this.node)
    this.outputNodeEvent.emit(this.node);
  }
  openDialog() {
    let dialogRef = this.dialog.open(ExpandDialog, {
      data: this.node
    });
    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case "viewProfile": {
          console.log("View " + this.node.firstname + "'s profile");
          break;
        }
        case "expand": {
          console.log("Expand " + this.node.firstname + "'s tree");
          this.onMoreClick();
          break;
        }
      }
    });
  }
}

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