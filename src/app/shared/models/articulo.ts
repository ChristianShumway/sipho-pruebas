import { Familia } from './familia';

export interface Articulo {
  idArticulo?: number;
  nombre: string;
  familia: Familia;
  estatusArticulo: EstatusArticulo;
  precioPublico: number;
  costo: number;
  idEmpleadoModifico?: number;
  imagenes: any[];
  materiaPrima: number;
}

export interface ArticuloContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Articulo[];
}

export interface EstatusArticulo {
  idEstatusArticulo: number;
  descripcion: string;
}
