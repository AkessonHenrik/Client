import { Component, Input } from '@angular/core';
import { Link } from '../../../d3';
import { ParentComponent } from '../../../parent/parent.component';
@Component({
  selector: '[parentVisual]',
  templateUrl: './parent-visual.component.html',
  styleUrls: ['./parent-visual.component.css']
})
export class ParentVisualComponent {
  @Input('parentVisual') parent: ParentComponent;
  showMore(): void {
    console.log("Parent showMore");
  }
}
