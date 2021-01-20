import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CuentasPorRecibir, DataCuentasPorRecibir, CuentaPorSaldar } from '../models/cuentas-por-recibir';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CuentasPorRecibirService {

  constructor(
    private http: HttpClient
  ) { }

  getCuentasPorCobrar(page: number,): Observable<CuentasPorRecibir>  {
    return this.http.get<CuentasPorRecibir>(`${environment.apiURL}/sale/accountForReciver/getTotals/${page}`)
    .pipe(
      retry(3)
    ); 
  }

  getCuentasPorSaldar(idCuenta: number,): Observable<CuentaPorSaldar[]>  {
    return this.http.get<CuentaPorSaldar[]>(`${environment.apiURL}/sale/accountForReciver/getAccountForReceiverPending/${idCuenta}`)
    .pipe(
      retry(3)
    ); 
  }
}
