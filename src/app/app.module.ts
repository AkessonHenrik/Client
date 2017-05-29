import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { D3Service, D3_DIRECTIVES } from './d3';
import { AppComponent } from './app.component';
import { SHARED_VISUALS, ExpandDialog } from './visuals/shared';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule, MdButtonModule, MdMenuModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { Component, ViewEncapsulation } from '@angular/core';
import 'hammerjs';
import { RouterModule, Routes } from '@angular/router';
import { MdSidenavModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphComponent } from './visuals/graph/graph.component';
import { TreeComponent, ChoiceDialog, NewPersonDialog, NewRelationshipDialog } from './tree/tree.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component'
import { TreeDataService } from './tree-data.service';
const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  { path: 'tree', component: TreeComponent },
  { path: '', component: WelcomeComponent },
  { path: 'login', component: AuthComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    TreeComponent,
    NavbarComponent,
    ChoiceDialog,
    NewPersonDialog,
    NewRelationshipDialog,
    SidenavComponent,
    AuthComponent,
    HomeComponent,
    WelcomeComponent,
    ProfileComponent,
    ExpandDialog
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MdButtonModule,
    MdMenuModule,
    MdSidenavModule,
    NgbModule.forRoot()
  ],
  providers: [D3Service, TreeDataService],
  bootstrap: [AppComponent, ChoiceDialog, NewPersonDialog, NewRelationshipDialog, SidenavComponent, ExpandDialog]
})
export class AppModule { }
