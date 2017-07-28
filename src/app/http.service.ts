import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as globals from './globals';
import { Relationship } from './d3/models/link';
@Injectable()
export class HttpService {

  constructor(private http: Http) { }

  upload(file: File): Promise<any> {
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(globals.server + "/upload", formData, options)
      .toPromise().then(response => {
        return response.json();
      })
  }

  get(endpoint): any {
    return this.http.get(endpoint, this.getHeaders());
  }

  updateProfile(newProfileInfo, profileId): Promise<any> {
    return this.http.patch(globals.profileEndpoint + "/" + profileId, newProfileInfo, this.getHeaders()).toPromise().then(response => {
      console.log(response);
    })
  }

  delete(timedentityid: number): Promise<any> {
    return this.http.delete(globals.profileEndpoint + "/" + timedentityid, this.getHeaders()).toPromise();
  }

  getComments(postid: number): Promise<any> {
    return this.http.get(globals.commentEndpoint + "/" + postid, this.getHeaders()).toPromise().then(response => {
      return Promise.resolve(response.json())
    })
  }

  postComment(comment): Promise<any> {
    return this.http.post(globals.commentEndpoint, comment, this.getHeaders()).toPromise();
  }

  addEvent(event): Promise<any> {
    return this.http.post(globals.eventEndpoint, event, this.getHeaders()).toPromise().then(response => {
      return Promise.resolve(response.json())
    })
  }

  createAccount(accountData) {
    return this.http.post(globals.signupEndpoint, accountData)
  }
  createProfile(profileData): Promise<any> {
    return this.http.post(globals.profileEndpoint, profileData, this.getHeaders()).toPromise().then(response => {
      let body = response.json();
      return body;
    }).catch(error => {
      return Promise.resolve(-1);
    })
  }

  search(firstname, lastname): Promise<any> {
    return this.http.post(globals.server + "/search", {
      firstname: firstname,
      lastname: lastname
    }, this.getHeaders()).toPromise().then(response => {
      return Promise.resolve(response.json());
    })
  }

  createGhost(ghostData): Promise<any> {
    return this.http.post(globals.ghostEndpoint, ghostData, this.getHeaders()).toPromise()
  }

  post(url, data) {
    return this.http.post(url, data, this.getHeaders()).toPromise().then(response => { return Promise.resolve(response) });
  }


  createRelationship(newRelationship: Relationship): Promise<any> {
    return this.http.post(globals.relationshipsEndpoint, {
      profile1: newRelationship.source.id,
      profile2: newRelationship.target.id,
      type: newRelationship.relationshipType,
      time: newRelationship.getTime(),
      visibility: newRelationship.visibility
    }, this.getHeaders()).toPromise().then(response => {
      newRelationship.id = response.json().peopleentityid
      if (newRelationship.event) {
        newRelationship.event.id = newRelationship.id;
        newRelationship.event.owner = newRelationship.id;
        return this.addEvent(newRelationship.event.getAsObject());
      }
    })
  }

  getProfile(id: number): Promise<any> {
    return this.http.get(globals.profileEndpoint + "/" + id, this.getHeaders()).toPromise();
  }

  getEvent(id: number): Promise<any> {
    return this.http.get(globals.eventEndpoint + "/" + id, this.getHeaders()).toPromise().then(response => {
      return Promise.resolve(response);
    }).catch(error => {
      return Promise.resolve(404)
    })
  }


  getGroups(profileId: number): Promise<any> {
    return this.http.get(globals.ownedGroupsEndpoint + "/" + profileId, this.getHeaders()).catch(error => {
      return Promise.resolve(error);
    }).toPromise();
  }
  getHeaders(): any {
    if (globals.getUserId() == null)
      return {};
    let headers = new Headers();
    headers.set("requester", globals.getUserId().toString())
    return { headers: headers };
  }


  isOwned(ownerId, entityId): Promise<boolean> {
    return this.http.post(globals.ownedEndpoint, { ownerid: ownerId, timedentityid: entityId }).toPromise().then(response => {
      return response.json();
    })
  }

  getClaims(userId): Promise<any> {
    return this.http.get(globals.claimEndpoint + "/" + userId).toPromise();
  }

  approveClaim(claimId): Promise<any> {
    return this.http.post(globals.claimEndpoint + "/" + claimId, {}, this.getHeaders()).toPromise();
  }
  refuseClaim(claimId): Promise<any> {
    return this.http.delete(globals.claimEndpoint + "/" + claimId, new RequestOptions(this.getHeaders())).toPromise();
  }


  associateToAccount(content): Promise<any> {
    return this.http.post(globals.profileEndpoint + "/associate", content).toPromise();
  }

  getNotifications(): Promise<any> {
    return this.http.get(globals.notificationEndpoint + "/" + globals.getUserId()).toPromise();
  }

  deleteNotification(notificationId: number): Promise<any> {
    return this.http.delete(globals.notificationEndpoint + "/" + notificationId, new RequestOptions(this.getHeaders())).toPromise();
  }

  deleteGroup(groupId): Promise<any> {
    return this.http.delete(globals.groupEndpoint + "/" + groupId, new RequestOptions(this.getHeaders())).toPromise();
  }

  createGroup(group): Promise<any> {
    return this.http.post(globals.groupEndpoint, group, this.getHeaders()).toPromise();
  }

  updateRelationship(relationship): Promise<any> {
    return this.http.patch(globals.relationshipsEndpoint + "/" + relationship.id, relationship, this.getHeaders()).toPromise();
  }

  updateAccount(newAccountInfo): Promise<any> {
    return this.http.patch(globals.signupEndpoint + "/" + globals.getUserId(), newAccountInfo, this.getHeaders()).toPromise();
  }

  updateParent(parent): Promise<any> {
    return this.http.patch(globals.parentsEndpoint + "/" + parent.id, parent, this.getHeaders()).toPromise();
  }

  updateEvent(event): Promise<any> {
    console.log("In updateevent")
    console.log(event);
    if (event.files) {
      return Promise.all(event.files.map(file => {
        return this.upload(file).then(response => {
          event.media.push({ type: response.type, path: response.path, postid: response.postid })
        })
      })
      ).then(_ => {
        return this.http.patch(globals.eventEndpoint + "/" + event.id, event, this.getHeaders()).toPromise();
      })
    }
  }

  deleteParent(parentId): Promise<any> {
    return this.http.delete(globals.parentsEndpoint + "/" + parentId, this.getHeaders()).toPromise();
  }
}
