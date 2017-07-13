import { Inject, Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ProfileViewComponent } from '../../../profile-view/profile-view.component'
import { Node } from '../../../d3/models/node';
import { OwnerService } from '../../../owner.service';
@Component({
  selector: 'profileDialog',
  templateUrl: './profileDialog.html',
  styleUrls: ['./profileDialog.css']
})
export class ProfileDialog {
  node: Node;
  isVisible: boolean = false;
  constructor( @Inject(MD_DIALOG_DATA) private data: Node, public dialogRef: MdDialogRef<ProfileDialog>, private router: Router, private ownerService: OwnerService) {
    this.node = data;
    if(this.node.id > 0) {
      this.ownerService.isOwned(this.node.id).then(result => {
        this.isVisible = result
      })
    }
  }
  redirectToProfilePage() {
    this.router.navigateByUrl('profilePage/' + this.node.id)
    this.dialogRef.close();
  }
}