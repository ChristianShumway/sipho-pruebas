import { Perfil } from "./perfil";

export interface Empleado {
  idEmpleado?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;
  telefono: string;
  nss: string;
  perfil?: Perfil;
  gafete?: string;
  email: string;
  contrasena?: string;
  idEmpleadoModifico?: number;
  cambiarContrasena?: number;
  imagen?: string;
  fechaIngreso: string;
}

export interface EmpleadoContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Empleado[];
}
