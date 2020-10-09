import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Vehiculo, VehiculoContent } from './../models/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(
    private http: HttpClient
  ) { }

  getVehiculos(paginator: number): Observable<VehiculoContent>  {
    return this.http.get<VehiculoContent>(`catalog/getAllVehicle/${paginator}`); 
  }

  getVehiculo(idVehiculo) {
    return this.http.get<Vehiculo>(`dashboard/getVehicleById/${idVehiculo}`);
  }

  getVehiculosFiltro(texto: string): Observable<Vehiculo[]>  {
    return this.http.get<Vehiculo[]>(`catalog/getVehicleByFilter/${texto}`); 
  }

  updateVehiculo(vehiculo: Partial<Vehiculo>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/updateVehicle`, JSON.stringify(vehiculo), { headers: headerss});
  }

  deleteVehiculo(empleado: Partial <Vehiculo>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/deleteEmploye`, JSON.stringify(empleado), { headers: headerss});
  }

  deleteImagenVehiculo(img: any): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`catalog/deleteImageVehicle`, JSON.stringify(img), { headers: headerss});
  }


}

// post   uploadImageVehicle    > file   idVehicle        idEmploye
