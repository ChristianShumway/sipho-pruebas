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

import { BitacoraCheckinRoutingModule } from './bitacora-checkin-routing.module';
import { RecorridoVendedorComponent } from './components/recorrido-vendedor/recorrido-vendedor.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);


@NgModule({
  declarations: [RecorridoVendedorComponent],
  imports: [
    CommonModule,
    BitacoraCheckinRoutingModule,
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
  ]
})
export class BitacoraCheckinModule { }
