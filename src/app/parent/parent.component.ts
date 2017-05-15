import { Component, OnInit } from '@angular/core';
import { Link, Node } from '../d3'
@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  parent: Link | Node;
  child: Node;
  constructor() { }

  ngOnInit() {
  }

}
