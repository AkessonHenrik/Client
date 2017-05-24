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
      });
  }
}
