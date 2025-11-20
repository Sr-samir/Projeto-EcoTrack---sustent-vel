import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout/main-layout.component';
import { Routes} from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { CadastroComponent } from './auth/cadastro/cadastro.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { RegisterActionComponent } from './components/register-action/register-action.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
    
  },
  {path: 'cadastro',
   component:CadastroComponent},

  {
    path: '', 
    component: MainLayoutComponent,
    children:[
      {path: 'dashboard', component: DashboardComponent},
      {path: 'Profile', component: ProfileComponent},
      {path: 'action', component: RegisterActionComponent}
    ]
  } 

  
];
