import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecorridoVendedorComponent } from './components/recorrido-vendedor/recorrido-vendedor.component';

const routes: Routes = [
  {
    path: 'recorrido',
    component: RecorridoVendedorComponent,
    data: { title: 'Recorrido Vendedor', breadcrumb: 'Recorrido Vendedor'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BitacoraCheckinRoutingModule { }
