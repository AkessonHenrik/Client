import { OnChanges, OnInit, Component, Inject, NgZone, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Node, Relationship } from '../../d3'
import * as globals from '../../globals';
import { HttpService } from '../../http.service';
@Component({
    selector: 'searchdialog',
    templateUrl: './searchDialog.html',
    styleUrls: ['./persondialog.css', './searchDialog.css']
})
export class SearchDialog implements OnInit {
    firstname: string = "";
    lastname: string = "";

    profiles = [];

    nodes: Node[];
    constructor(public dialogRef: MdDialogRef<SearchDialog>, private httpService: HttpService) {
    }
    public ngOnInit() {
        //set custom data from parent component
    }
    search() {
        console.log("Searching for: " + this.firstname + " " + this.lastname);
        this.httpService.search(this.firstname, this.lastname).then(response => {
            console.log(response);
            this.profiles = response;
        })
    }
    import(node) {
        this.dialogRef.close(node);
    }
    getGender(gender: number) {
        return globals.getGender(gender);
    }
}