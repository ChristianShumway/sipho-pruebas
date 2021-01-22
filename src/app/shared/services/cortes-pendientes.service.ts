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

  SaveCut(data: TipoMonedas[]): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/sale/cuts/associateCut`, JSON.stringify(data), { headers: headerss}).pipe(
      retry(3)
    );
  }

}
