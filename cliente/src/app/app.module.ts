import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NavBarLoginComponent } from './components/nav-bar-login/nav-bar-login.component';
import { NavBarNotloginComponent } from './components/nav-bar-notlogin/nav-bar-notlogin.component';
import { LoginSingupComponent } from './components/login-singup/login-singup.component';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarLoginComponent,
    NavBarNotloginComponent,
    LoginSingupComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
