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
import { ConfigUserComponent } from './components/config-user/config-user.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CartaComponent } from './components/carta/carta.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { UserService } from './services/user.service';
import { TableService } from './services/table.service';
import { ReservedService } from './services/reserved.service';
import { FooterComponent } from './components/footer/footer.component';
import { IndexComponent } from './components/index/index.component';
import { ConocenosComponent } from './components/conocenos/conocenos.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentService } from './services/comment.service';



@NgModule({
  declarations: [
    AppComponent,
    NavBarLoginComponent,
    NavBarNotloginComponent,
    LoginSingupComponent,
    NotFoundComponent,
    ConfigUserComponent,
    AboutUsComponent,
    CartaComponent,
    ReservaComponent,
    FooterComponent,
    IndexComponent,
    ConocenosComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [UserService,TableService,ReservedService,CommentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
