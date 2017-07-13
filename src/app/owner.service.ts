import { Injectable } from '@angular/core';
import { HttpService } from './http-service.service';
import * as globals from './globals';
@Injectable()
export class OwnerService {

  constructor(private httpService: HttpService) { }
  isOwned(profileId: number): Promise<boolean> {
    return this.httpService.post(globals.server + "/owned", {
      ownerid: globals.getUserId(),
      timedentityid: profileId
    }).then(response => {
      if(response.json() === true) {
        return Promise.resolve(true);
      } else {
        return Promise.resolve(false);
      }
    })
  }
}
