import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Repartidor } from './../models/repartidor';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {

  constructor(
    private http: HttpClient
  ) { }

  getLogDeliveryMan(data): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/delivery/getLogDeliveryMan`, JSON.stringify(data), { headers: headerss});
  }
  
}
