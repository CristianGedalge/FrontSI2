import { Routes } from '@angular/router';
import { AdminLayout } from './layout/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then(m => m.Landing)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboard)
      },
      {
        path: 'mecanicos',
        loadComponent: () => import('./features/admin/mecanicos/mecanicos.component').then(m => m.MecanicosComponent)
      },
      {
        path: 'notificaciones',
        loadComponent: () => import('./features/admin/notificaciones/notificaciones.component').then(m => m.NotificacionesComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/admin/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: 'historial',
        loadComponent: () => import('./features/admin/historial/historial.component').then(m => m.HistorialComponent)
      }
    ]
  },
  {
    path: 'super-admin',
    component: AdminLayout,
    children: [
      {
        path: 'talleres',
        loadComponent: () => import('./features/super-admin/talleres/talleres.component').then(m => m.TalleresComponent)
      },
      {
        path: 'tipos-servicio',
        loadComponent: () => import('./features/super-admin/tipos-servicio/tipos-servicio').then(m => m.TiposServicioComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./features/super-admin/usuarios/usuarios.component').then(m => m.UsuariosComponent)
      }
    ]
  }
];
