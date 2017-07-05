import { Component, OnInit, Inject } from '@angular/core';
import { ParentComponent, NodeParentComponent, LinkParentComponent } from '../../parent/parent.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3/models'
@Component({
    selector: 'parentdialog',
    templateUrl: './parentdialog.html',
    styleUrls: ['./persondialog.css']
})
export class NewParentDialog implements OnInit {

    parentType: string;
    parentTypes: string[] = ["adoptive", "biological", "guardian"]
    parent: { type: string, id: number };
    child: number;
    nodes: Node[];
    links: Relationship[];
    beginDay: number;
    beginMonth: number;
    beginYear: number;

    createNewParent() {
        if (this.parent && this.child && this.parentType) {
            let begin = this.beginDay + "-" + this.beginMonth + "-" + this.beginYear;
            let newParent: ParentComponent;
            if (this.parent.type === 'link') {
                newParent = new LinkParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.links.filter(link => link.id === this.parent.id)[0], begin);
            } else if (this.parent.type === 'node') {
                newParent = new NodeParentComponent(Math.ceil(Math.random() * 100), this.nodes.filter(node => node.id === this.child)[0], this.nodes.filter(node => node.id === this.parent.id)[0], begin);
            }
            this.dialogRef.close(newParent);
        }
    }
    constructor( @Inject(MD_DIALOG_DATA) private data: { nodes: Node[], links: Relationship[] }, public dialogRef: MdDialogRef<NewParentDialog>) {

    }
    public ngOnInit() {
        this.nodes = this.data.nodes;
        this.links = this.data.links;
    }
}