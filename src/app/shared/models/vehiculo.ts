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
}

export interface VehiculoContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Vehiculo[];
}
