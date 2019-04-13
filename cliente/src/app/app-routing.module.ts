import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSingupComponent } from './components/login-singup/login-singup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppComponent } from './app.component';
import { ConfigUserComponent } from './components/config-user/config-user.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CartaComponent } from './components/carta/carta.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { IndexComponent } from './components/index/index.component';



const routes: Routes = [
  {path:'login', component: LoginSingupComponent},
  {path: 'contacto', component: AboutUsComponent},
  {path: 'mis-datos', component: ConfigUserComponent},
  {path: 'carta', component: CartaComponent},
  {path: 'reserva', component: ReservaComponent},
  {path: '',component: IndexComponent},
  {path:'**',component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
