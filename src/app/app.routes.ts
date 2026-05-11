import { Routes } from '@angular/router';
import { EmployeeList } from './features/employee/employee-list/employee-list';
import { Login } from './features/auth/login/login';
import { Home } from './features/home/home';
import { DepartmentDetails } from './features/department/department-details/department-details';
import { DepartmentAdd } from './features/department/department-add/department-add';
import { ProjectDetailsComponent } from './features/project/project-details/project-details';
import { ProjectAddComponent } from './features/project/project-add/project-add';
import { ProjectDeleteUpdate } from './features/project/project-delete-update/project-delete-update';
import { guardInterceptorGuard } from './guard/guard-interceptor-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [guardInterceptorGuard] },

  { path: 'employees', component: EmployeeList, canActivate: [guardInterceptorGuard] },
  {
    path: 'employees/add',
    loadComponent: () =>
      import('./features/employee/employee-form/employee-form').then(m => m.EmployeeForm),
    canActivate: [guardInterceptorGuard]
  },
  {
    path: 'employees/edit/:id',
    loadComponent: () =>
      import('./features/employee/employee-form/employee-form').then(m => m.EmployeeForm),
    canActivate: [guardInterceptorGuard]
  },
  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./features/employee/employee-details/employee-details').then(m => m.EmployeeDetails),
    canActivate: [guardInterceptorGuard]
  },

  { path: 'departments', component: DepartmentDetails, canActivate: [guardInterceptorGuard] },
  { path: 'departments/add', component: DepartmentAdd, canActivate: [guardInterceptorGuard] },
  { path: 'departments/edit/:id', component: DepartmentAdd, canActivate: [guardInterceptorGuard] },
  { path: 'departments/:id', component: DepartmentDetails, canActivate: [guardInterceptorGuard] },

  { path: 'projects', component: ProjectDeleteUpdate, canActivate: [guardInterceptorGuard] },
  { path: 'projects/add', component: ProjectAddComponent, canActivate: [guardInterceptorGuard] },
  { path: 'projects/:id', component: ProjectDetailsComponent, canActivate: [guardInterceptorGuard] },
  { path: 'projects/update/:id', component: ProjectAddComponent, canActivate: [guardInterceptorGuard] },
  { 
    path: 'roles', 
    loadComponent: () => import('./features/role/role-list/role-list').then(m => m.RoleList), 
    canActivate: [guardInterceptorGuard] 
  },
  { 
    path: 'roles/add', 
    loadComponent: () => import('./features/role/role-form/role-form').then(m => m.RoleForm), 
    canActivate: [guardInterceptorGuard] 
  },
  { 
    path: 'roles/edit/:id', 
    loadComponent: () => import('./features/role/role-form/role-form').then(m => m.RoleForm), 
    canActivate: [guardInterceptorGuard] 
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
