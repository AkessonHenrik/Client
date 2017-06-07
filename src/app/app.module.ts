import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { D3Service, D3_DIRECTIVES } from './d3';
import { AppComponent } from './app.component';
import { SHARED_VISUALS, ProfileDialog } from './visuals/shared';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule, MdButtonModule, MdMenuModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { Component, ViewEncapsulation } from '@angular/core';
import 'hammerjs';
import { RouterModule, Routes } from '@angular/router';
import { MdSidenavModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphComponent } from './visuals/graph/graph.component';
import { TreeComponent } from './tree/tree.component';
import { NewPersonDialog } from './tree/dialogs/personDialog';
import { NewRelationshipDialog } from './tree/dialogs/relationshipDialog';
import { ChoiceDialog } from './tree/dialogs/choiceDialog';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component'
import { TreeDataService } from './tree-data.service';
import { ProfileViewComponent, VideoComponent, MediaComponent, ImageComponent } from './profile-view/profile-view.component';
import { EventComponent, WorkEventComponent, LifeEventComponent } from './event/event.component';
import { LocationComponent } from './location/location.component';
import { GalleryModule, GalleryConfig } from 'ng-gallery';
const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  { path: 'tree', component: TreeComponent },
  { path: '', component: WelcomeComponent },
  { path: 'login', component: AuthComponent }
];

export const galleryConfig: GalleryConfig = {
  // ...
}


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
    ProfileDialog,
    ProfileViewComponent,
    MediaComponent,
    VideoComponent,
    ImageComponent,
    EventComponent,
    LocationComponent,
    WorkEventComponent,
    LifeEventComponent
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
    NgbModule.forRoot(),
    GalleryModule.forRoot(galleryConfig)
  ],
  providers: [D3Service, TreeDataService],
  bootstrap: [AppComponent, ChoiceDialog, NewPersonDialog, NewRelationshipDialog, SidenavComponent, ProfileDialog]
})
export class AppModule { }
