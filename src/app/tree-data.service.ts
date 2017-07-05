import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as globals from './globals';
@Injectable()
export class TreeDataService {
  static jsonNodes: [{ id: number, firstname: string, lastname: string, gender: number, image: string }];
  static jsonRelationships: [{ id: number, profile1: number, profile2: number, type: number, begintime: any, endtime: any, time: string }];
  static jsonParents: [{ id: number, parent: number, child: number, parentType: string, biological: boolean }];
  constructor(private http: Http) {
  }
  getData(baseNodeId: number): any {
    return this.http.get(globals.familyEndpoint + "/" + baseNodeId)
      .toPromise()
      .then(res => {
        TreeDataService.jsonNodes = res.json().people;
        TreeDataService.jsonRelationships = res.json().relationships;
        TreeDataService.jsonParents = res.json().parents;
        return Promise.resolve({ nodes: TreeDataService.jsonNodes, links: TreeDataService.jsonRelationships, parents: TreeDataService.jsonParents });
      })
  }
}
