import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemisionComponent } from './components/remision/remision.component';
import { ArqueoComponent } from './components/arqueo/arqueo.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
