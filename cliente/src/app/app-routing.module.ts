import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSingupComponent } from './components/login-singup/login-singup.component';



const routes: Routes = [
  {path:'login', component: LoginSingupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
