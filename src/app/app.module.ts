import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { D3Service, D3_DIRECTIVES } from './d3';
import { AppComponent } from './app.component';
import { SHARED_VISUALS, ProfileDialog, InfoDialog } from './visuals/shared';
import { NavbarComponent } from './navbar/navbar.component';
import { MaterialModule, MdButtonModule, MdMenuModule } from '@angular/material';
import { MdIconModule } from '@angular/material';
import { Component, ViewEncapsulation } from '@angular/core';
import 'hammerjs';
import { RouterModule, Routes } from '@angular/router';
import { MdSidenavModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeComponent } from './tree/tree.component';
import { EventDialog, ChoiceDialog, NewPersonDialog, NewRelationshipDialog, NewParentDialog, SearchDialog } from './tree/dialogs/';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ProfileComponent } from './profile/profile.component'
import { TreeDataService } from './tree-data.service';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { VideoComponent, MediaComponent, AudioComponent, ImageComponent, ExternalVideoComponent } from './media/media.component';
import { EventComponent, WorkEventComponent, LocatedEventComponent, MoveEventComponent } from './event/event.component';
import { LocationComponent } from './location/location.component';
import { MediaViewerComponent } from './media-viewer/media-viewer.component';
import { SignupComponent } from './signup/signup.component';
import { MdNativeDateModule } from '@angular/material';
import { NewProfileComponent } from './new-profile/new-profile.component';
import { OwnedProfilesComponent } from './owned-profiles/owned-profiles.component';
import { NewEventComponent } from './new-event/new-event.component';
import { HttpService } from './http.service';
import { OwnerService } from './owner.service';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NewEventDialogComponent } from './new-event-dialog/new-event-dialog.component';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { VisibilityComponent } from './visibility/visibility.component';
import { EditRelationshipComponent } from './edit-relationship/edit-relationship.component';
import { ClaimComponent } from './claim/claim.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { GroupComponent } from './group/group.component';
import { AccountComponent } from './account/account.component';
const appRoutes: Routes = [
  { path: 'tree/:id', component: TreeComponent },
  { path: 'newTree', component: TreeComponent },
  { path: 'owned', component: OwnedProfilesComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'mediaViewer', component: MediaViewerComponent },
  { path: 'accountSettings', component: AccountComponent },
  { path: 'profilePage/:id', component: ProfilePageComponent },
  { path: 'claims', component: ClaimComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'groups', component: GroupComponent }
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
    InfoDialog,
    WelcomeComponent,
    ProfileComponent,
    ProfileDialog,
    ProfileViewComponent,
    MediaComponent,
    VideoComponent,
    ExternalVideoComponent,
    ImageComponent,
    NewParentDialog,
    SearchDialog,
    EventComponent,
    LocationComponent,
    WorkEventComponent,
    MediaViewerComponent,
    SignupComponent,
    NewProfileComponent,
    EventDialog,
    AudioComponent,
    OwnedProfilesComponent,
    MoveEventComponent,
    LocatedEventComponent,
    NewEventComponent,
    ProfilePageComponent,
    NewEventDialogComponent,
    EditProfileDialogComponent,
    VisibilityComponent,
    EditRelationshipComponent,
    ClaimComponent,
    NotificationsComponent,
    GroupComponent,
    AccountComponent
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
  providers: [D3Service, TreeDataService, HttpService, OwnerService],
  bootstrap: [AppComponent, SidenavComponent],
  entryComponents: [ChoiceDialog, NewPersonDialog, NewRelationshipDialog, NewParentDialog, ProfileDialog, SearchDialog, NewEventDialogComponent, EventDialog, EditProfileDialogComponent, EditRelationshipComponent, InfoDialog]
})
export class AppModule { }
