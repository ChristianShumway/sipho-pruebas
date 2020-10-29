export interface Vehiculo {
  idVehiculo?: number;
  marca: string;
  linea: string;
  modelo: string;
  imagen?: string;
  idEmpleadoModifico?: number;
  activo?: number;
  numeroEconomico: string;
  qr?: string;
  vistaTipoCombustible: TipoCombustible;
}

export interface VehiculoContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Vehiculo[];
}

export interface TipoCombustible {
  idTipoCombustible: number;
  descripcion: string;
}
