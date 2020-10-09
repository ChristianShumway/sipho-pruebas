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

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { FamiliaComponent } from './components/familia/familia.component';
import { CrearFamiliaComponent } from './components/crear-familia/crear-familia.component';
import { ModificarFamiliaComponent } from './components/modificar-familia/modificar-familia.component';
import { GruposComponent } from './components/grupos/grupos.component';
import { CrearGrupoComponent } from './components/crear-grupo/crear-grupo.component';
import { ModificarGrupoComponent } from './components/modificar-grupo/modificar-grupo.component';
import { PerfilesComponent } from './components/perfiles/perfiles.component';
import { CrearPerfilComponent } from './components/crear-perfil/crear-perfil.component';
import { ModificarPerfilComponent } from './components/modificar-perfil/modificar-perfil.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';
import { CrearEmpleadoComponent } from './components/crear-empleado/crear-empleado.component';
import { ModificarEmpleadoComponent } from './components/modificar-empleado/modificar-empleado.component';
import { FotoGafeteComponent } from './components/foto-gafete/foto-gafete.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { CrearArticuloComponent } from './components/crear-articulo/crear-articulo.component';
import { ModificarArticuloComponent } from './components/modificar-articulo/modificar-articulo.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { CrearProveedorComponent } from './components/crear-proveedor/crear-proveedor.component';
import { ModificarProveedorComponent } from './components/modificar-proveedor/modificar-proveedor.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CrearClienteComponent } from './components/crear-cliente/crear-cliente.component';
import { ModificarClienteComponent } from './components/modificar-cliente/modificar-cliente.component';
import { VerMapaComponent } from './components/ver-mapa/ver-mapa.component';
import { VerGafeteComponent } from './components/ver-gafete/ver-gafete.component';
import { SubirImagenArticuloComponent } from './components/subir-imagen-articulo/subir-imagen-articulo.component';
import { VerCodigoQrComponent } from './components/ver-codigo-qr/ver-codigo-qr.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { CrearVehiculoComponent } from './components/crear-vehiculo/crear-vehiculo.component';
import { ModificarVehiculoComponent } from './components/modificar-vehiculo/modificar-vehiculo.component';

export let options: Partial<IConfig> | (() => Partial<IConfig>);

@NgModule({
  declarations: [
    FamiliaComponent, 
    CrearFamiliaComponent,
    ModificarFamiliaComponent, 
    GruposComponent, CrearGrupoComponent, 
    ModificarGrupoComponent, 
    PerfilesComponent, 
    CrearPerfilComponent, 
    ModificarPerfilComponent, 
    EmpleadosComponent, 
    CrearEmpleadoComponent, 
    ModificarEmpleadoComponent, 
    FotoGafeteComponent, 
    ArticulosComponent,
    CrearArticuloComponent, 
    ModificarArticuloComponent, 
    ProveedoresComponent, 
    CrearProveedorComponent, 
    ModificarProveedorComponent, 
    ClientesComponent, 
    CrearClienteComponent, 
    ModificarClienteComponent, 
    VerMapaComponent, VerGafeteComponent, SubirImagenArticuloComponent, VerCodigoQrComponent, VehiculosComponent, CrearVehiculoComponent, ModificarVehiculoComponent
  ],
  imports: [
    CommonModule,
    CatalogosRoutingModule,
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
    VerMapaComponent,
    SubirImagenArticuloComponent
    // FotoGafeteComponent
  ]
})
export class CatalogosModule { }
