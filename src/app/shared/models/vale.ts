import { Empleado } from './empleado';
import { Ruta } from './ruta';

export interface ValeData {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Vale[];
}

export interface Vale {
  idValeCaja: number;
  empleado: Empleado;
  caja: Caja;
  monto: number;
  motivo: string;
  registro: string;
  idFolioCorte: number;
}

export interface Caja {
  idCaja: number;
  ruta: Ruta;
  nombre: string;
  fechaCreacion: string;
  limiteEfectivo: number;
}