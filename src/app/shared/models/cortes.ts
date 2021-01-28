export interface CorteData {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Cortes[];
}

export interface Cortes {
  idCorte: number;
  empleado: string;
  total: number;
  caja: string;
  ruta: string;
  fecha: string;
  idCaja: number;
}



