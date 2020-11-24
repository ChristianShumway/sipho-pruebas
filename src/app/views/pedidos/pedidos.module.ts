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
import { ModificarPedidoComponent } from './components/modificar-pedido/modificar-pedido.component';
import { ModificarOrdenPedidoComponent } from './components/modificar-orden-pedido/modificar-orden-pedido.component';
import { ModalCerrarPedidoComponent } from './components/modal-cerrar-pedido/modal-cerrar-pedido.component';
import { DevolucionPedidoComponent } from './components/devolucion-pedido/devolucion-pedido.component';
import { FormDevolucionPedidoComponent } from './components/form-devolucion-pedido/form-devolucion-pedido.component';
import { ReportesComponent } from './components/reportes/reportes.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    RealizarPedidoComponent,
    VerPedidosComponent,
    AgregarOrdenPedidoComponent,
    ModificarPedidoComponent,
    ModificarOrdenPedidoComponent,
    ModalCerrarPedidoComponent,
    DevolucionPedidoComponent,
    FormDevolucionPedidoComponent,
    ReportesComponent
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
  entryComponents: [
    ModalCerrarPedidoComponent
  ]
})
export class PedidosModule { }
