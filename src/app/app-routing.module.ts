import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PostComponent } from './pages/post/post.component';
import { SignupComponent } from './pages/signup/signup.component';


const routes: Routes = [{
  path: 'signup',
  component: AuthComponent
}, {
  path: 'login',
  component: SignupComponent
}, {
  path: '',
  component: DashboardComponent
}, {
  path: 'post',
  component: PostComponent
},
{ path: '', redirectTo: '/', pathMatch: 'full' },
{ path: '**', component: NotFoundPageComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
