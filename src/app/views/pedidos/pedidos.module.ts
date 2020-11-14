import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { SharedModule } from './../../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';


import { PedidosRoutingModule } from './pedidos-routing.module';
import { RealizarPedidoComponent } from './components/realizar-pedido/realizar-pedido.component';
import { VerPedidosComponent } from './components/ver-pedidos/ver-pedidos.component';
import { AgregarOrdenPedidoComponent } from './components/agregar-orden-pedido/agregar-orden-pedido.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    RealizarPedidoComponent,
    VerPedidosComponent,
    AgregarOrdenPedidoComponent
  ],
  imports: [
    CommonModule,
    PedidosRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDatatableModule,
    ChartsModule,
    FileUploadModule,
    SharedModule,
    QuillModule,
    NgxMaskModule.forRoot(options),
    AgmCoreModule
  ],
  entryComponents: []
})
export class PedidosModule { }
