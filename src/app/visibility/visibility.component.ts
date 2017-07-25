import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import * as globals from '../globals';
@Component({
  selector: 'app-visibility',
  templateUrl: './visibility.component.html',
  styleUrls: ['./visibility.component.css']
})
export class VisibilityComponent implements OnInit {
  @Input('profileId') profileId: number;
  @Output('onSubmit') onSubmit: EventEmitter<any> = new EventEmitter<any>();;
  visibilityType: string;
  includedPeople: { name: string, id: number }[] = [];
  excludedPeople: { name: string, id: number }[] = [];
  constructor(private httpService: HttpService) { }

  includedPerson: { name: string, id: number };
  excludedPerson: { name: string, id: number };

  groups: Group[];

  limitedTo: {
    included: {
      groups: number[],
      people: number[]
    },
    excluded: {
      groups: number[],
      people: number[]
    },
  } = { included: { groups: [], people: [] }, excluded: { groups: [], people: [] } };

  ngOnInit() {
    this.visibilityType = "public"
    if (globals.getUserId() !== null) {
      console.log(globals.getUserId())
      this.httpService.getGroups(globals.getUserId()).then(response => {
        this.groups = response.json();
      })
    }
  }
  getPeople(id: number) {
    let result = "";
    let group: Group = this.groups.filter(g => g.id === id)[0];
    for (let i = 0; i < group.people.length; i++) {
      result += group.people[i];
      if (i !== group.people.length - 1) {
        result += ", "
      }
    }
    return result;
  }

  submit() {
    if (this.visibilityType === 'private') {
      this.onSubmit.emit({ visibility: "private" });
    } else if (this.visibilityType === 'public') {
      this.onSubmit.emit({ visibility: "public" });
    } else {

      this.limitedTo.included.people = this.includedPeople.map(a => { return a.id });
      this.limitedTo.excluded.people = this.excludedPeople.map(a => { return a.id });

      this.onSubmit.emit({ visibility: "limited", included: this.limitedTo.included, excluded: this.limitedTo.excluded });
    }
  }

  includeGroup(group: Group) {
    console.log("Include group")
    if (!this.limitedTo.included.groups) {
      this.limitedTo.included.groups = [];
    }
    if (this.limitedTo.included.groups.includes(group.id)) {
      this.limitedTo.included.groups = this.limitedTo.included.groups.filter(groupId => groupId !== group.id);
    } else {
      this.limitedTo.included.groups.push(group.id);
    }
  }
  excludeGroup(group: Group) {
    console.log("Exclude group");
    if (!this.limitedTo.excluded.groups) {
      this.limitedTo.excluded.groups = [];
    }
    if (this.limitedTo.excluded.groups.includes(group.id)) {
      this.limitedTo.excluded.groups = this.limitedTo.excluded.groups.filter(groupId => groupId !== group.id);
    } else {
      this.limitedTo.excluded.groups.push(group.id);
    }
  }

  excludePerson(value) {
    this.excludedPeople.push({ name: value.firstname + " " + value.lastname, id: value.id })
    this.excludeSearchResults = [];
  }

  includeSearchResults = [];
  searchInclude(value): string {
    this.includeSearchResults = [];
    this.httpService.search(value, "").then(response => {
      this.includeSearchResults = this.includeSearchResults.concat(response)
    })
    return "";
  }

  excludeSearchResults = [];

  searchExclude(value): string {
    this.excludeSearchResults = [];
    this.httpService.search(value, "").then(response => {
      this.excludeSearchResults = this.excludeSearchResults.concat(response)
    })
    return "";
  }

  includePerson(value) {
    this.includedPeople.push({ name: value.firstname + " " + value.lastname, id: value.id })
    this.includeSearchResults = [];
  }

  removeIncludedPerson(person) {
    this.includedPeople = this.includedPeople.filter(p => p.id !== person.id)
  }
  removeExcludedPerson(person) {
    this.excludedPeople = this.excludedPeople.filter(p => p.id !== person.id)
  }
}

export class Group {
  id: number;
  owner: number;
  name: string;
  people: number[];
}