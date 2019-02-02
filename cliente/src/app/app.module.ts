import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NavBarLoginComponent } from './components/nav-bar-login/nav-bar-login.component';
import { NavBarNotloginComponent } from './components/nav-bar-notlogin/nav-bar-notlogin.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarLoginComponent,
    NavBarNotloginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
