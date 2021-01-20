export interface CortesPendientes {
  empleado: string;
  idCorte: number;
  fecha: string;
  total: number;
}

export interface TipoMonedas {
  idTipoMoneda: number;
  descripcion: string;
  valor: number;
  orden: number;
  cantidadSeleccionada?: number;
}
