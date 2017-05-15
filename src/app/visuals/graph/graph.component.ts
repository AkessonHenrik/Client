import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { Node } from '../../d3';

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  @Input('nodes') nodes;
  @Input('links') links;
  @Input('parents') parents;
  height: number = 1000;
  width: number = 1000;

  constructor() { }
}
