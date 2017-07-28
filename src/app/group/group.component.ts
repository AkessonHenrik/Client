import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Group } from '../visibility/visibility.component'
import * as globals from '../globals';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  groups: Group[];
  newGroup: Group = new Group();
  name: string;
  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getGroups();
  }
  getGroups() {
    this.httpService.getGroups(globals.getUserId()).then(response => {
      console.log(response.json())
      this.groups = response.json();
    })
  }
  groupPeople: { firstname: string, lastname: string, id: number }[] = [];
  includeSearchResults = [];
  searchInclude(value): string {
    this.includeSearchResults = [];
    this.httpService.search(value, "").then(response => {
      this.includeSearchResults = this.includeSearchResults.concat(response)
    })
    return "";
  }

  includePerson(searchResult) {
    this.groupPeople.push({ firstname: searchResult.firstname, lastname: searchResult.lastname, id: searchResult.id })
    console.log(this.groupPeople)
    this.includeSearchResults = [];
  }

  deleteGroup(groupId) {
    this.httpService.deleteGroup(groupId).then(response => {
      this.groups = this.groups.filter(group => group.id != groupId)
    })
  }

  removeIncludedPerson(person) {
    this.groupPeople = this.groupPeople.filter(p => p.id !== person.id);
  }
  createGroup() {
    this.newGroup.name = this.name;
    this.newGroup.people = this.groupPeople.map(person => { return person.id; })
    this.newGroup.owner = globals.getUserId();
    this.httpService.createGroup(this.newGroup).then(_ => this.getGroups());
  }

}
