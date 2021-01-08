import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RemisionComponent } from './components/remision/remision.component';

const routes: Routes = [
  {
    path:'remision',
    component: RemisionComponent,
    data: { title: 'Remisión', breadcrumb: 'Remisión'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
