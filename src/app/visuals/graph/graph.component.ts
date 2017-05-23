import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Node } from '../../d3';
import { MdButtonModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { MdIconRegistry } from '@angular/material';
import { TreeComponent } from '../../tree/tree.component';
@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  @Input('tree') tree: TreeComponent;
  height: number = 720;
  width: number = 1280;
  selectedOption: string;
  openDialog() {
    let dialogRef = this.dialog.open(ChoiceDialog);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }
}