import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TreeDataService {
  static jsonNodes: [{ id: number, firstName: string, lastName: string, image: string }];
  static jsonRelationships: [{ id: number, from: number, to: number, relationshipType: string }];
  static jsonParents: [{ parent: number, child: number, parentType: string, biological: boolean }];
  constructor(private http: Http) {
  }
  getData(baseNodeId: number): any {
    return this.http.get('assets/stark.json')
      .toPromise()
      .then(res => {
        TreeDataService.jsonNodes = res.json().people;
        TreeDataService.jsonRelationships = res.json().relationships;
        TreeDataService.jsonParents = res.json().parents;

        return Promise.resolve({ "nodes": TreeDataService.jsonNodes, "links": TreeDataService.jsonRelationships, "parents": TreeDataService.jsonParents });
      }).then(data => {
        if (baseNodeId === 0) {
          return data;
        }
        let nodesToReturn: { id: number, firstName: string, lastName: string, image: string }[] = [];
        let linksToReturn: { id: number, from: number, to: number, relationshipType: string }[] = [];
        let parentsToReturn: { parent: number, child: number, parentType: string, biological: boolean }[] = [];

        nodesToReturn.push(data.nodes.filter(node => node.id === baseNodeId)[0]);

        // Add base node's parents
        data.parents.forEach(parent => {
          if (parent.child === baseNodeId) {
            if (parent.parentType === "relationship") {
              let parent1Id = data.links.filter(link => link.id === parent.parent)[0].from;
              let parent2Id = data.links.filter(link => link.id === parent.parent)[0].to;
              let parent1 = data.nodes.filter(node => node.id === parent1Id)[0];
              let parent2 = data.nodes.filter(node => node.id === parent2Id)[0];
              nodesToReturn.push(parent1);
              nodesToReturn.push(parent2);
              linksToReturn.push(data.links.filter(link => link.id === parent.parent)[0]);
            } else if (parent.parentType === "single") {
              nodesToReturn.push(data.nodes.filter(node => node.id === parent.parent)[0]);
            }
            parentsToReturn.push(parent);
          }
        })

        console.log("Parents");
        console.log(parentsToReturn);

        // Add base node's relationships
        data.links.forEach(rel => {
          if (rel.from === baseNodeId || rel.to === baseNodeId) {
            linksToReturn.push(rel);
            let otherNodeId = rel.from === baseNodeId ? rel.to : rel.from;
            let otherNode = data.nodes.filter(node => node.id === otherNodeId)[0];
            nodesToReturn.push(otherNode);
          }
        })

        console.log("Relationships");
        console.log(linksToReturn);


        // Add base node's children
        data.parents.forEach(parent => {
          if (parent.parentType === "single") {
            if (parent.parent === baseNodeId) {
              nodesToReturn.push(data.nodes.filter(node => node.id === parent.child)[0]);
              parentsToReturn.push(parent);
            }
          } else if (parent.parentType === "relationship") {
            linksToReturn.forEach(link => {
              if (link.id === parent.parent) {
                let nodeToAdd = data.nodes.filter(node => node.id === parent.child)[0];
                if (!nodesToReturn.includes(nodeToAdd)) {
                  nodesToReturn.push(nodeToAdd)
                }
                parentsToReturn.push(parent);
              }
            })
          }
        })

        console.log("Children");
        console.log(parentsToReturn);

        // Add base node's parents other children
        // Get either rel or node that is base node's parent
        // Add that parents children
        // Add that parent rel

        // Get base node's parents
        let baseParents = parentsToReturn.filter(parent => parent.child === baseNodeId);
        console.log("Base parents");
        console.log(baseParents);


        let siblings: { id: number, firstName: string, lastName: string, image: string }[] = [];

        // Other parent objects whose parent is among baseParents
        let otherParents: { parent: number, child: number, parentType: string, biological: boolean }[] = [];


        baseParents.forEach(baseParent => {
          if (baseParent.parentType === "single") {

            // Check and add all parents if their parent property is in baseParents
            data.parents.filter(parent => parent.parentType === "single").forEach(parent => {
              if (parent.parent === baseParent.parent && !otherParents.includes(parent)) {
                otherParents.push(parent);
              }
            })

            // Add siblings from this parent
            data.nodes.forEach(node => {
              otherParents.forEach(parent => {
                if (parent.child === node.id && !nodesToReturn.includes(node)) {
                  nodesToReturn.push(node);
                }
              })
            })

          } else if (baseParent.parentType === "relationship") {
            data.parents.filter(parent => parent.parentType === "relationship").forEach(parent => {
              if (parent.parent === baseParent.parent) {
                // Get the link
                let parentLink = data.links.filter(link => link.id === parent.parent)[0];

                // Get the child
                let child = data.nodes.filter(node => node.id === parent.child)[0];

                // Add parent, link, child
                if (!nodesToReturn.includes(child)) {
                  nodesToReturn.push(child);
                }
                if (!otherParents.includes(parent)) {
                  otherParents.push(parent);
                }
                if (!linksToReturn.includes(parentLink)) {
                  linksToReturn.push(parentLink);
                }

                // Add other parent of link
                let parent1 = data.nodes.filter(node => node.id === parentLink.from)[0];
                let parent2 = data.nodes.filter(node => node.id === parentLink.to)[0];

                if (!nodesToReturn.includes(parent1)) {
                  nodesToReturn.push(parent1);
                }
                if (!nodesToReturn.includes(parent2)) {
                  nodesToReturn.push(parent2);
                }

              }
            })
          }
        })
        parentsToReturn = parentsToReturn.concat(otherParents);

        return Promise.resolve({ "nodes": nodesToReturn, "links": linksToReturn, "parents": parentsToReturn })
      })
  }
}
