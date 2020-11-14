import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RealizarPedidoComponent } from './components/realizar-pedido/realizar-pedido.component';
import { AuthModuleGuard } from '../../shared/services/auth/auth-module.guard';
import { VerPedidosComponent } from './components/ver-pedidos/ver-pedidos.component';
import { AgregarOrdenPedidoComponent } from './components/agregar-orden-pedido/agregar-orden-pedido.component';

const routes: Routes = [
  {
    path: 'realizar-pedido',
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
    path: 'agregar-orden-pedido/:idPedido',
    component: AgregarOrdenPedidoComponent,
    data: { title: 'Agregar Orden al Pedido', breadcrumb: 'Agregar Orden al Pedido'},
    // canActivate: [AuthModuleGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
