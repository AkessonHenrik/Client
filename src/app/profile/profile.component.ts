import { Component, OnInit } from '@angular/core';
import { Node, Relationship } from '../d3/models';
import { ParentComponent } from '../parent/parent.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  thisProfile: Node;
  relationships: Relationship[];
  
  constructor() { }

  ngOnInit() {
  }

}
