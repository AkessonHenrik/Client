import { Component, OnInit } from '@angular/core';
import * as globals from '../globals';

@Component({
  selector: 'app-edit-relationship',
  templateUrl: './edit-relationship.component.html',
  styleUrls: ['./edit-relationship.component.css']
})
export class EditRelationshipComponent implements OnInit {

  relationshipTypes: string[]
  relationshipType: string;
  activeTab: number = 0;

  beginDay: number;
  beginMonth: number;
  beginYear: number;

  endDay: number;
  endMonth: number;
  endYear: number;
  location;

  files: File[] = [];
  interval: boolean = false;
  isLocated: boolean = false;
  addDetails: boolean = false;

  constructor() { }

  ngOnInit() {
    this.relationshipTypes = globals.relationshipTypes;
  }

  next() {
    this.activeTab = 1;
  }
  
  addVisibilityToEvent(profileAsObject) {
    profileAsObject.visibility = this.visibility;
    console.log(profileAsObject);
    return profileAsObject;
  }
  visibility = { visibility: "public" }
  addVisibility($event) {
    console.log($event);
    this.visibility = $event;
  }

}
