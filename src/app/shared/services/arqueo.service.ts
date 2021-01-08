import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Arqueo } from '../models/arqueo';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArqueoService {

  constructor(
    private http: HttpClient
  ) { }

  getArqueo(idRuta: number,): Observable<Arqueo>  {
    return this.http.get<Arqueo>(`${environment.apiURL}/sale/getArqueo/${idRuta}`)
    .pipe(
      retry(3)
    ); 
  }
}
