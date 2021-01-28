import { Empleado } from './empleado';
import { Ruta } from './ruta';

export interface DetallesCorte {
  desgloseMoneda: DesgloseMoneda[];
  corte: DetalleCorte;
  vales: DetallesVale[];
}

export interface DesgloseMoneda {
  descripcion: string;
  cantidad: number;
  total: number;
}

export interface DetalleCorte {
  idCorte: number;
  idCaja: number;
  transaccion: number;
  retiro: number;
  incremento: number;
  devolucion: number;
  excento: number;
  grabado: number;
  importe: number;
  descuento: number;
  total: number;
  abonoCredito: number;
  valeCaja: number;
  pagosPersonales: number;
  transaccionInicial: number;
  transaccionFinal: number;
  promociones: number;
  fechaCreacion: string;
  idEmpleado: number;
  estatus: number;
}

export interface DetallesVale {
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
