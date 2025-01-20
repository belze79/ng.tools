import { Routes } from '@angular/router';
import { UserHomeComponent } from './page/user/user.home/user.home.component';
import { userGuard } from './service/user.guard';
import { AdminHomeComponent } from './page/admin/admin.home/admin.home.component';
import { adminGuard } from './service/admin.guard';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { UserPhalangiateComponent } from './page/user/user.phalangiate/user.phalangiate.component';

export const routes: Routes = [
    {path : '', component : UserHomeComponent, canActivate : [userGuard], children : [
        {path : 'phalangiate', component : UserPhalangiateComponent}
    ]},
    {path : 'admin', component : AdminHomeComponent, canActivate : [adminGuard]},
    {path : 'login', component : LoginComponent},
    {path : 'register', component : RegisterComponent},
    {path : '**', redirectTo : 'login'}
];
