import { Component, OnInit } from '@angular/core';
import APP_CONFIG from '../app.config';
import { Node, Link } from '../d3';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  nodes: Node[] = [];
  links: Link[] = [];

  constructor() {
    this.nodes.push(new Node(1, 100, 100, 'https://upload.wikimedia.org/wikipedia/en/5/52/Ned_Stark-Sean_Bean.jpg'));
    this.nodes.push(new Node(2, 300, 100, 'https://upload.wikimedia.org/wikipedia/en/2/25/Catelyn_Stark-Michelle_Fairley_S3.jpg'));
    this.nodes.push(new Node(3, 200, 200, 'http://vignette1.wikia.nocookie.net/gameofthrones/images/e/e9/Robb-3x03.jpg/revision/latest?cb=20130413125346'));
    this.nodes.push(new Node(4, 400, 100, 'https://cdn.pastemagazine.com/www/articles/BaelishBookMain.jpg'));
    this.nodes.push(new Node(5, 500, 100));


    this.links.push(new Link(this.nodes[0], this.nodes[1]));
  }

  ngOnInit() {
  }

}
