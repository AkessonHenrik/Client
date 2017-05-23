import { Component, Input } from '@angular/core';
import { Relationship } from '../../../d3';

@Component({
  selector: '[linkVisual]',
  templateUrl: './link-visual.component.html',
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent  {
  @Input('linkVisual') link: Relationship;
  showMore() {
    console.log("showmore")
  }
}
