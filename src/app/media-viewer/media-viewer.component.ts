import { Input, Component, OnInit } from '@angular/core';
import { MediaComponent, ImageComponent, VideoComponent, AudioComponent } from '../media/media.component'
@Component({
  selector: 'app-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.css']
})
export class MediaViewerComponent implements OnInit {
  @Input('media') media: [{ type: string, path: string, postid: number }]
  constructor() { }
  i: number = 0;
  increment() {
    this.i++;
    if (this.i === this.media.length) {
      this.i = 0;
    }
  }

  viewComments(media) {
    console.log("View comments: " + media.postid);
  }

  comment: string;
  submitComment() {
    console.log(this.comment);
    this.comment = "";
  }
  // <input type="text" style="color: black; width: 100%;" [(ngModel)]="comment" (keyup.enter)="submitComment()">

  decrement() {
    this.i--;
    if (this.i === -1) {
      this.i = this.media.length - 1;
    }
  }
  
  ngOnInit() {
    console.log(this.media);
  }
}
