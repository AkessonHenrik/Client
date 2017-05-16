import { Component } from '@angular/core';
import { TreeComponent } from './tree/tree.component';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  people: [{ id: number, firstName: string, lastName: string, image: string }];
  relationships: [{ id: number, from: number, to: number }];
  parents: [{ parent: number, child: number, parentType: string }];
  constructor(private http: Http) {
    this.http.get('assets/stark.json')
      .subscribe(res => {
        this.people = res.json().people;
        this.relationships = res.json().relationships;
        this.parents = res.json().parents;
        /*
        console.log("PEOPLE");
        console.log(this.people);
        console.log("RELATIONSHIPS");
        console.log(this.relationships);
        console.log("PARENTS");
        console.log(this.parents);
        this.parents.forEach(parent => {
          if(parent.parentType === "single") {
            console.log(this.people.filter(person => person.id === parent.parent)[0].firstName + ' is parent of ' + this.people.filter(person => person.id === parent.child)[0].firstName)
          } else {
            let toShow: String = "";
            // First parent name
            toShow += this.people.filter(p => p.id === this.relationships.filter(rel => rel.id === parent.parent)[0].from)[0].firstName;
            toShow += " and ";
            toShow += this.people.filter(p => p.id === this.relationships.filter(rel => rel.id === parent.parent)[0].to)[0].firstName;
            toShow += " are parents of ";
            toShow += this.people.filter(p => p.id === parent.child)[0].firstName;
            console.log(toShow);
          }
      }) // */
      });
  }
}
