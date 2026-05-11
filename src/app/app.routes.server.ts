import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'employees/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'employees/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'departments/edit/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'departments/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
