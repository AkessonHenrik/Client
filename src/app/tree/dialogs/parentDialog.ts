import { Component, OnInit, Inject } from '@angular/core';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../../parent/parent.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3/models'
import { VisibilityComponent } from '../../visibility/visibility.component';
import { HttpService } from '../../http.service';
import { LocatedEventComponent, EventComponent } from '../../event/event.component';

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
    endDay: number;
    endMonth: number;
    endYear: number;

    error: string;
    files: File[] = [];

    description: string;
    media: { type: string, path: string, postid: number }[] = [];

    constructor( @Inject(MD_DIALOG_DATA) private data: { nodes: Node[], links: Relationship[], edit: boolean, event: EventComponent }, public dialogRef: MdDialogRef<NewParentDialog>, private httpService: HttpService) {

    }

    createNewParent() {
        if (this.parent && this.child && this.parentType) {
            if (this.parentType !== "biological" && (!this.beginDay || !this.beginMonth || !this.beginYear)) {
                this.error = "Please specify a valid begin date"
            } else {
                let begin = (this.beginDay ? this.beginYear + "-" + this.beginMonth + "-" + this.beginDay : null);
                let ended = (this.endDay ? this.endYear + "-" + this.endMonth + "-" + this.endDay : null);
                let newParent: ParentComponent;
                if (this.parent.type === 'link') {
                    newParent = new LinkParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.links.filter(link => link.id === this.parent.id)[0], [begin, ended], this.parentTypes.indexOf(this.parentType));
                } else if (this.parent.type === 'node') {
                    newParent = new NodeParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.nodes.filter(node => node.id === this.parent.id)[0], [begin, ended], this.parentTypes.indexOf(this.parentType));
                }
                newParent.visibility = this.visibility;
                this.dialogRef.close(newParent);
            }
        }
    }
    public ngOnInit() {
        if (this.data.nodes && this.data.links) {
            this.nodes = this.data.nodes;
            this.links = this.data.links;
        }
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
    deleteParent() {
        this.httpService.delete(this.data.event.id).then(response => {
            this.dialogRef.close();
        })
    }

    updateParent() {
        let returnParent = {}
        let time = [];
        if (this.beginDay && this.beginMonth && this.beginYear)
            time.push(this.beginYear + "-" + this.beginMonth + "-" + this.beginDay);
        if (this.endYear && this.endDay && this.endMonth) {
            time.push(this.endYear + "-" + this.endMonth + "-" + this.endDay);
        }
        if (time.length > 0)
            returnParent["time"] = time;
        if (this.parentType) {
            returnParent["type"] = this.parentType
        }
        returnParent["id"] = this.data.event.id;
        returnParent["visibility"] = this.visibility;
        console.log(returnParent);
        this.dialogRef.close(returnParent);
    }
}