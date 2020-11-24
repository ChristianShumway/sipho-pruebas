import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealizarPedidoComponent } from './components/realizar-pedido/realizar-pedido.component';
import { AuthModuleGuard } from '../../shared/services/auth/auth-module.guard';
import { VerPedidosComponent } from './components/ver-pedidos/ver-pedidos.component';
import { AgregarOrdenPedidoComponent } from './components/agregar-orden-pedido/agregar-orden-pedido.component';
import { ModificarPedidoComponent } from './components/modificar-pedido/modificar-pedido.component';
import { ModificarOrdenPedidoComponent } from './components/modificar-orden-pedido/modificar-orden-pedido.component';
import { DevolucionPedidoComponent } from './components/devolucion-pedido/devolucion-pedido.component';
import { ReportesComponent } from './components/reportes/reportes.component';

const routes: Routes = [
  {
    path: 'realizar-pedido/:idRuta',
    component: RealizarPedidoComponent,
    data: { title: 'Realizar Pedido', breadcrumb: 'Realizar Pedido'},
    // canActivate: [AuthModuleGuard],
  },
  {
    path: 'ver-pedidos',
    component: VerPedidosComponent,
    data: { title: 'Ver Pedidos', breadcrumb: 'Ver Pedidos'},
    // canActivate: [AuthModuleGuard],
  },
  {
    path: 'agregar-orden-pedido/:idPedido/:idRuta',
    component: AgregarOrdenPedidoComponent,
    data: { title: 'Agregar Orden al Pedido', breadcrumb: 'Agregar Orden al Pedido'},
    // canActivate: [AuthModuleGuard],
  },
  {
    path: 'modificar-pedido/:idPedido/:idRuta',
    component: ModificarPedidoComponent,
    data: { title: 'Modificar Pedido', breadcrumb: 'Modificar Pedido'},
    // canActivate: [AuthModuleGuard],
  },
  {
    path: 'modificar-orden-pedido/:idPedido/:idRuta',
    component: ModificarOrdenPedidoComponent,
    data: { title: 'Modificar Orden al Pedido', breadcrumb: 'Modificar Orden al Pedido'},
    // canActivate: [AuthModuleGuard],
  },
  {
    path: 'devolucion-pedido',
    component: DevolucionPedidoComponent,
    data: { title: 'Devolución Pedido', breadcrumb: 'Devolución Pedido'},
    // canActivate: [AuthModuleGuard],
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    data: { title: 'Reporte Acumulado por Ruta y Turno', breadcrumb: 'Reporte Acumulado por Ruta y Turno'},
    // canActivate: [AuthModuleGuard],
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
