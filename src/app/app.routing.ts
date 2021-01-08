import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AuthModuleGuard } from './shared/services/auth/auth-module.guard';
import { ShowLoginGuard } from './shared/services/auth/show-login.guard';

export const rootRouterConfig: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule),
    data: { title: 'Inicio de Sesión' },
    canActivate: [ShowLoginGuard]
  },
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { 
        path: 'sessions', 
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'} 
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard', 
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule), 
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD'}
      },
      { 
        path: 'catalogos', 
        loadChildren: () => import('./views/catalogos/catalogos.module').then(m => m.CatalogosModule), 
        data: { title: 'Catálogos', breadcrumb: 'Catálogos'},
      },
      {
        path: 'perfil', 
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule), 
        data: { title: 'Perfil', breadcrumb: 'Perfil'}
      },
      {
        path: 'bitacora-checkin', 
        loadChildren: () => import('./views/bitacora-checkin/bitacora-checkin.module').then(m => m.BitacoraCheckinModule), 
        data: { title: 'Bitácora Checkin', breadcrumb: 'Bitácora Checkin'}
      },
      {
        path: 'pedidos', 
        loadChildren: () => import('./views/pedidos/pedidos.module').then(m => m.PedidosModule), 
        data: { title: 'Pedidos', breadcrumb: 'Pedidos'}
      },
      {
        path: 'ventas', 
        loadChildren: () => import('./views/ventas/ventas.module').then(m => m.VentasModule), 
        data: { title: 'Ventas', breadcrumb: 'Ventas'}
      },
      {
        path: 'others', 
        loadChildren: () => import('./views/others/others.module').then(m => m.OthersModule), 
        data: { title: 'Others', breadcrumb: 'OTHERS'}
      },
      {
        path: 'charts', 
        loadChildren: () => import('./views/charts/charts.module').then(m => m.AppChartsModule), 
        data: { title: 'Charts', breadcrumb: 'CHARTS'}
      },
    ]
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];

