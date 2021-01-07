import { Injectable } from '@angular/core';
import { Cliente, ClienteContent } from './../models/cliente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { HandleHttpResponseError } from 'app/shared/utils/handleError';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private http: HttpClient
  ) {}

  getClientes(paginator: number): Observable<ClienteContent>  {
    return this.http.get<ClienteContent>(`${environment.apiURL}/catalog/getAllCustomer/${paginator}`)
    .pipe(
      retry(2),
      catchError(HandleHttpResponseError)
    ); 
  }

  getCliente(idCliente: number): Observable<Cliente>  {
    return this.http.get<Cliente>(`${environment.apiURL}/catalog/getCustomerById/${idCliente}`); 
  }

  getClientesFiltro(texto: string, idRuta: number): Observable<Cliente[]>  {
    return this.http.get<Cliente[]>(`${environment.apiURL}/catalog/getCustomerByFilter/${texto}/${idRuta}`); 
  }

  getClientesPorRuta(idRuta: number): Observable<Cliente[]>  {
    return this.http.get<Cliente[]>(`${environment.apiURL}/catalog/getCustomerByRoute/${idRuta}`); 
  }

  updateCliente(cliente: Partial<Cliente>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/updateCustomer`, JSON.stringify(cliente), { headers: headerss});
  }

  deleteCliente(cliente: Partial <Cliente>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/catalog/deleteCustomer`, JSON.stringify(cliente), { headers: headerss});
  }

}
