export * from './node-visual/node-visual.component';
export * from './link-visual/link-visual.component';
export * from './node-visual/profileDialog';
import { NodeVisualComponent } from './node-visual/node-visual.component';
import { ProfileDialog } from './node-visual/profileDialog';
import { LinkVisualComponent } from './link-visual/link-visual.component';
import { ParentVisualComponent } from './parent-visual/parent-visual.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Component } from '@angular/core';
export const SHARED_VISUALS = [
    NodeVisualComponent,
    LinkVisualComponent,
    ParentVisualComponent,
    ProfileDialog
];

@Component({
    selector: 'infoDialog',
    template: `<h1>You need to be logged in to access information</h1>`
})
export class InfoDialog {
    constructor(public dialogRef: MdDialogRef<InfoDialog>) { }
}