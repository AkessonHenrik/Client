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
import { TreeComponent, NewParentDialog } from './tree/tree.component';
import { NewPersonDialog } from './tree/dialogs/personDialog';
import { NewRelationshipDialog } from './tree/dialogs/relationshipDialog';
import { ChoiceDialog } from './tree/dialogs/choiceDialog';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component'
import { TreeDataService } from './tree-data.service';
import { ProfileViewComponent, VideoComponent, MediaComponent, ImageComponent, ExternalVideoComponent } from './profile-view/profile-view.component';
import { EventComponent, WorkEventComponent, LifeEventComponent } from './event/event.component';
import { LocationComponent } from './location/location.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { SignupComponent } from './signup/signup.component';
import { MdNativeDateModule } from '@angular/material';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { OwnedProfilesComponent } from './owned-profiles/owned-profiles.component';
const appRoutes: Routes = [
  { path: 'tree/:id', component: TreeComponent },
  { path: 'newTree', component: TreeComponent },
  { path: 'owned', component: OwnedProfilesComponent },
  { path: '', component: WelcomeComponent },
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'mediaViewer', component: MediaViewerComponent }
];


@NgModule({
  declarations: [
    AppComponent,
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
    ExternalVideoComponent,
    ImageComponent,
    NewParentDialog,
    EventComponent,
    LocationComponent,
    WorkEventComponent,
    LifeEventComponent,
    MediaViewerComponent,
    SignupComponent,
    NewProfileComponent,
    OwnedProfilesComponent
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
    MdNativeDateModule
  ],
  providers: [D3Service, TreeDataService],
  bootstrap: [AppComponent, SidenavComponent],
  entryComponents: [ChoiceDialog, NewPersonDialog, NewRelationshipDialog, NewParentDialog, ProfileDialog]
})
export class AppModule { }
