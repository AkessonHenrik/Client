import { Input, Component, OnInit } from '@angular/core';
import { MediaComponent, ImageComponent, VideoComponent } from '../profile-view/profile-view.component'
@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.css']
})
export class MediaViewerComponent implements OnInit {
  @Input('media') media: [{"type": string, "path": string}]
  constructor() { }
  i: number = 0;
  increment() {
    this.i++;
    if(this.i === this.media.length) {
      this.i = 0;
    }
  }
  decrement() {
    this.i--;
    if(this.i === -1) {
      this.i = this.media.length - 1;
    }
  }
  ngOnInit() {
  }
}
