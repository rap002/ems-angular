import { Routes } from '@angular/router';
import { EmployeeList } from './features/employee/employee-list/employee-list';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { guardInterceptorGuard } from './guard/guard-interceptor-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [guardInterceptorGuard] },
  { path: 'employees', component: EmployeeList, canActivate: [guardInterceptorGuard] },
  { path: 'employees/add', loadComponent: () => import('./features/employee/employee-form/employee-form').then(m => m.EmployeeForm), canActivate: [guardInterceptorGuard] },
  { path: 'employees/edit/:id', loadComponent: () => import('./features/employee/employee-form/employee-form').then(m => m.EmployeeForm), canActivate: [guardInterceptorGuard] },
  { path: 'employees/:id', loadComponent: () => import('./features/employee/employee-details/employee-details').then(m => m.EmployeeDetails), canActivate: [guardInterceptorGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
