import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { CrearArticuloComponent } from './components/crear-articulo/crear-articulo.component';
import { ModificarArticuloComponent } from './components/modificar-articulo/modificar-articulo.component';
import { ArticulosComponent } from './components/articulos/articulos.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { CrearProveedorComponent } from './components/crear-proveedor/crear-proveedor.component';
import { ModificarProveedorComponent } from './components/modificar-proveedor/modificar-proveedor.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { CrearClienteComponent } from './components/crear-cliente/crear-cliente.component';
import { ModificarClienteComponent } from './components/modificar-cliente/modificar-cliente.component';
import { VerGafeteComponent } from './components/ver-gafete/ver-gafete.component';
import { VerCodigoQrComponent } from './components/ver-codigo-qr/ver-codigo-qr.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { CrearVehiculoComponent } from './components/crear-vehiculo/crear-vehiculo.component';
import { ModificarVehiculoComponent } from './components/modificar-vehiculo/modificar-vehiculo.component';
import { PermisosComponent } from './components/permisos/permisos.component';

const routes: Routes = [
  {
    component: FamiliaComponent,
    path: 'familias',
    data: { title: 'Familia', breadcrumb: 'Familia'}
  },
  {
    component: CrearFamiliaComponent,
    path: 'crear-familia',
    data: { title: 'Crear Familia', breadcrumb: 'Crear Familia'}
  },
  {
    component: ModificarFamiliaComponent,
    path: 'modificar-familia/:idFamilia',
    data: { title: 'Modificar Familia', breadcrumb: 'Modificar Familia'}
  },
  {
    component: GruposComponent,
    path: 'grupos',
    data: { title: 'Grupos', breadcrumb: 'Grupos'}
  },
  {
    component: CrearGrupoComponent,
    path: 'crear-grupo',
    data: { title: 'Crear Grupo', breadcrumb: 'Crear Grupo'}
  },
  {
    component: ModificarGrupoComponent,
    path: 'modificar-grupo/:idGrupo',
    data: { title: 'Modificar Grupo', breadcrumb: 'Modificar Grupo'}
  },
  {
    component: PerfilesComponent,
    path: 'perfiles',
    data: { title: 'Perfiles', breadcrumb: 'Perfiles'}
  },
  {
    component: CrearPerfilComponent,
    path: 'crear-perfil',
    data: { title: 'Crear Perfil', breadcrumb: 'Crear Perfil'}
  },
  {
    component: ModificarPerfilComponent,
    path: 'modificar-perfil/:idPerfil',
    data: { title: 'Modificar Perfil', breadcrumb: 'Modificar Perfil'}
  },
  {
    component: EmpleadosComponent,
    path: 'empleados',
    data: { title: 'Empleados', breadcrumb: 'Empleados'}
  },
  {
    component: CrearEmpleadoComponent,
    path: 'crear-empleado',
    data: { title: 'Crear Empleado', breadcrumb: 'Crear Empleado'}
  },
  {
    component: ModificarEmpleadoComponent,
    path: 'modificar-empleado/:idEmpleado',
    data: { title: 'Modificar Empleado', breadcrumb: 'Modificar Empleado'}
  },
  {
    component: VerGafeteComponent,
    path: 'gafete/:idEmpleado',
    data: { title: 'Gafete Empleado', breadcrumb: 'Gafete Empleado'}
  },
  {
    component: FotoGafeteComponent,
    path: 'foto-gafete/:idEmpleado',
    data: { title: 'Tomar Foto Gafete Empleado', breadcrumb: 'Tomar Foto Gafete Empleado'}
  },
  {
    component: ArticulosComponent,
    path: 'articulos',
    data: { title: 'Articulos', breadcrumb: 'Articulos'}
  },
  {
    component: CrearArticuloComponent,
    path: 'crear-articulo',
    data: { title: 'Crear Artículo', breadcrumb: 'Crear Artículo'}
  },
  {
    component: ModificarArticuloComponent,
    path: 'modificar-articulo/:idArticulo',
    data: { title: 'Modificar Artículo', breadcrumb: 'Modificar Artículo'}
  },
  {
    component: ProveedoresComponent,
    path: 'proveedores',
    data: { title: 'Proveedores', breadcrumb: 'Proveedores'}
  },
  {
    component: CrearProveedorComponent,
    path: 'crear-proveedor',
    data: { title: 'Crear Proveedor', breadcrumb: 'Crear Proveedor'}
  },
  {
    component: ModificarProveedorComponent,
    path: 'modificar-proveedor/:idProveedor',
    data: { title: 'Modificar Proveedor', breadcrumb: 'Modificar Proveedor'}
  },
  {
    component: ClientesComponent,
    path: 'clientes',
    data: { title: 'Clientes', breadcrumb: 'Clientes'}
  },
  {
    component: CrearClienteComponent,
    path: 'crear-cliente',
    data: { title: 'Crear Cliente', breadcrumb: 'Crear Cliente'}
  },
  {
    component: ModificarClienteComponent,
    path: 'modificar-cliente/:idCliente',
    data: { title: 'Modificar Cliente', breadcrumb: 'Modificar Cliente'}
  },
  {
    component: VerCodigoQrComponent,
    path: 'qr/:idCliente',
    data: { title: 'Código QR', breadcrumb: 'Código QR'}
  },
  {
    component: VehiculosComponent,
    path: 'vehiculos',
    data: { title: 'Vehículos', breadcrumb: 'Vehículos'}
  },
  {
    component: CrearVehiculoComponent,
    path: 'crear-vehiculo',
    data: { title: 'Crear Vehículo', breadcrumb: 'Crear Vehículo'}
  },
  {
    component: ModificarVehiculoComponent,
    path: 'modificar-vehiculo/:idVehiculo',
    data: { title: 'Modificar Vehículo', breadcrumb: 'Modificar Vehículo'}
  },
  {
    component: PermisosComponent,
    path: 'permisos',
    data: { title: 'Permisos', breadcrumb: 'Permisos'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogosRoutingModule { }
