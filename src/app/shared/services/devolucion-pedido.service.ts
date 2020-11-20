import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { DevolucionPedido } from './../models/devolucion-pedido';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevolucionPedidoService {

  constructor(
    private http: HttpClient
  ) { }

  getLogDelivery(date: string, route: number): Observable<DevolucionPedido>  {
    return this.http.get<DevolucionPedido>(`${environment.apiURL}/production/getlogDelivery/${date}/${route}`); 
  }

  saveBitacoraDelivery(delivery: DevolucionPedido): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/production/saveBitacoraDelivery`, JSON.stringify(delivery), { headers: headerss});
  }


}
