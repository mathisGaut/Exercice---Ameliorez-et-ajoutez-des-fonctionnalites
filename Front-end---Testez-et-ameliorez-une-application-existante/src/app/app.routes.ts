import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { StudentListComponent } from './pages/students/student-list/student-list.component';
import { authGuard } from './core/guards/auth.guard';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'students', component: StudentListComponent, canActivate: [authGuard] },
  { path: 'students/edit/:id', component: StudentFormComponent, canActivate: [authGuard] },
  { path: 'students/new', component: StudentFormComponent, canActivate: [authGuard] },

  // Redirection automatique vers la page de login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
