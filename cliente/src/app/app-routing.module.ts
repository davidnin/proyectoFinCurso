import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSingupComponent } from './components/login-singup/login-singup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AppComponent } from './app.component';



const routes: Routes = [
  {path:'login', component: LoginSingupComponent},
  {path: '',redirectTo: '', pathMatch: 'full'},
  {path:'**',component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
