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

import { VentasRoutingModule } from './ventas-routing.module';
import { RemisionComponent } from './components/remision/remision.component';
import { ModalSearchRemisionComponent } from './components/modal-search-remision/modal-search-remision.component';
import { ArqueoComponent } from './components/arqueo/arqueo.component';
import { CuentasPorRecibirComponent } from './components/cuentas-por-recibir/cuentas-por-recibir.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    RemisionComponent,
    ModalSearchRemisionComponent,
    ArqueoComponent,
    CuentasPorRecibirComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
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
    NgxMaskModule
  ],
  entryComponents: [
    ModalSearchRemisionComponent
  ]
})
export class VentasModule { }
