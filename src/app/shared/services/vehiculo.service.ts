import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Vehiculo, VehiculoContent } from './../models/vehiculo';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(
    private http: HttpClient
  ) { }

  getVehiculos(paginator: number): Observable<VehiculoContent>  {
    return this.http.get<VehiculoContent>(`${environment.apiURL}/catalog/getAllVehicle/${paginator}`); 
  }

  getVehiculo(idVehiculo) {
    return this.http.get<Vehiculo>(`${environment.apiURL}/catalog/getVehicleById/${idVehiculo}`);
  }

  getVehiculosFiltro(texto: string): Observable<Vehiculo[]>  {
    return this.http.get<Vehiculo[]>(`${environment.apiURL}/catalog/getVehicleByFilter/${texto}`); 
  }

  updateVehiculo(vehiculo: Partial<Vehiculo>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/updateVehicle`, JSON.stringify(vehiculo), { headers: headerss});
  }

  deleteVehiculo(empleado: Partial <Vehiculo>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteEmploye`, JSON.stringify(empleado), { headers: headerss});
  }

  deleteImagenVehiculo(img: any): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteImageVehicle`, JSON.stringify(img), { headers: headerss});
  }

}

