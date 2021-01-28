import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemisionComponent } from './components/remision/remision.component';
import { ArqueoComponent } from './components/arqueo/arqueo.component';
import { CuentasPorRecibirComponent } from './components/cuentas-por-recibir/cuentas-por-recibir.component';
import { CortesPendientesComponent } from './components/cortes-pendientes/cortes-pendientes.component';
import { SaldarCuentaComponent } from './components/saldar-cuenta/saldar-cuenta.component';
import { VerCortesComponent } from './components/ver-cortes/ver-cortes.component';

const routes: Routes = [
  {
    path:'remision',
    component: RemisionComponent,
    data: { title: 'Remisión', breadcrumb: 'Remisión'},
  },
  {
    path:'arqueo',
    component: ArqueoComponent,
    data: { title: 'Arqueo', breadcrumb: 'Arqueo'},
  },
  {
    path:'cuentas-por-cobrar',
    component: CuentasPorRecibirComponent,
    data: { title: 'Cuentas por Cobrar', breadcrumb: 'Cuentas por Cobrar'},
  },
  {
    path:'cortes-pendientes',
    component: CortesPendientesComponent,
    data: { title: 'Cortes Pendientes', breadcrumb: 'Cortes Pendientes'},
  },
  {
    path:'saldar-cuenta/:idCliente',
    component: SaldarCuentaComponent,
    data: { title: 'Saldar Cuenta', breadcrumb: 'Saldar Cuenta'},
  },
  {
    path:'ver-cortes',
    component: VerCortesComponent,
    data: { title: 'Cortes Realizados', breadcrumb: 'Cortes Realizados'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
