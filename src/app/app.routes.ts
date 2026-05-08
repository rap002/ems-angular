import { Routes } from '@angular/router';
import { EmployeeList } from './features/employee/employee-list/employee-list';
import { Login } from './features/auth/login/login';
import { guardInterceptorGuard } from './guard/guard-interceptor-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'employees', component: EmployeeList, canActivate: [guardInterceptorGuard] },
  { path: '', redirectTo: '/employees', pathMatch: 'full' }
];
