import { Component, OnInit, Inject } from '@angular/core';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../../parent/parent.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3/models'
import { VisibilityComponent } from '../../visibility/visibility.component';

@Component({
    selector: 'parentdialog',
    templateUrl: './parentdialog.html',
    styleUrls: ['./persondialog.css']
})
export class NewParentDialog implements OnInit {

    parentType: string;
    parentTypes: string[] = ["biological", "adoptive", "guardian"]
    parent: { type: string, id: number };
    child: number;
    nodes: Node[];
    links: Relationship[];
    beginDay: number;
    beginMonth: number;
    beginYear: number;

    error: string;

    createNewParent() {
        if (this.parent && this.child && this.parentType) {
            if (this.parentType !== "biological" && (!this.beginDay || !this.beginMonth || !this.beginYear)) {
                this.error = "Please specify a valid begin date"
            } else {
                let begin = (this.beginDay ? this.beginYear + "-" + this.beginMonth + "-" + this.beginDay : null);
                let newParent: ParentComponent;
                if (this.parent.type === 'link') {
                    newParent = new LinkParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.links.filter(link => link.id === this.parent.id)[0], begin, this.parentTypes.indexOf(this.parentType));
                } else if (this.parent.type === 'node') {
                    newParent = new NodeParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.nodes.filter(node => node.id === this.parent.id)[0], begin, this.parentTypes.indexOf(this.parentType));
                }
                newParent.visibility = this.visibility;
                this.dialogRef.close(newParent);
            }
        }
    }
    constructor( @Inject(MD_DIALOG_DATA) private data: { nodes: Node[], links: Relationship[] }, public dialogRef: MdDialogRef<NewParentDialog>) {

    }
    public ngOnInit() {
        this.nodes = this.data.nodes;
        this.links = this.data.links;
    }
    addVisibilityToEvent(profileAsObject) {
        profileAsObject.visibility = this.visibility;
        console.log(profileAsObject);
        return profileAsObject;
    }
    visibility = { visibility: "public" }
    addVisibility($event) {
        console.log($event);
        this.visibility = $event;
    }
}