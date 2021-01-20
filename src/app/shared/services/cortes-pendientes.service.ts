import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CortesPendientes, TipoMonedas } from '../models/cortes-pendientes';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CortesPendientesService {

  constructor(
    private http: HttpClient
  ) { }

  getMoneyType(): Observable<TipoMonedas[]> {
    return this.http.get<TipoMonedas[]>(`${environment.apiURL}/sale/cuts/getMoneyType`).pipe(
      retry(3)
    ); ;
  }

  getCutsPending(): Observable<CortesPendientes[]> {
    return this.http.get<CortesPendientes[]>(`${environment.apiURL}/sale/cuts/getCutsPending`).pipe(
      retry(3)
    ); ;
  }

}
