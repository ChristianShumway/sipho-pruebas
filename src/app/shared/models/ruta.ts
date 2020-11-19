import { Empleado } from './empleado';

export interface Ruta {
  idRuta?: number;
  descripcion: string;
  idEmpleadoModifico: number;
  encargado: Empleado;
  coEncargado: Empleado;
}

export interface RutaContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Ruta[];
}

