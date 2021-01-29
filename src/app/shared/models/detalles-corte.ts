import { Vale } from "./vale";

export interface DetallesCorte {
  desgloseMoneda: DesgloseMoneda[];
  corte: DetalleCorte;
  vales: Vale[];
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
