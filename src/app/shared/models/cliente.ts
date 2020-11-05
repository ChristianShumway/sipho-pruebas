import { Ruta } from './ruta';

export interface Cliente {
  idCliente?: number;
  razonSocial: string;
  propietario: string;
  calle: string;
  numero: string;
  colonia: string;
  codigoPostal: string;
  telefono: string;
  email: string;
  rfc: string;
  ciudad: string;
  latitud: string;
  longitud: string;
  observacion: string;
  idEmpleadoModificacion?: number;
  qr?: string;
  vistaRuta: Ruta;
}

export interface ClienteContent {
  numberPage: number;
  totalPages: number;
  totalItems: number;
  content: Cliente[];
}

