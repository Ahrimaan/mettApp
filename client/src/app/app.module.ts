import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

// User Code Imports
import { AppRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { AuthenticationComponent, AuthService, RegisterUserComponent, UnlockComponent } from './authentication';
import { MettAppointmentComponent, MettAppointmentDetailComponent, AppointmentService  } from './mett-appointment';
import { NavigationComponent } from './navigation';
import { HttpOptions, OrderBy  } from './shared/';
import { AdminComponent, AdminListComponent } from './administrator';
import { Configuration } from './configuration';


@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    MettAppointmentComponent,
    MettAppointmentDetailComponent,
    NavigationComponent,
    RegisterUserComponent,
    OrderBy,
    AdminComponent,
    AdminListComponent,
    UnlockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(AppRoutes),
    Ng2Bs3ModalModule
  ],
  providers: [AuthService,  HttpOptions, AppointmentService, Configuration],
  bootstrap: [AppComponent]
})
export class AppModule { }
