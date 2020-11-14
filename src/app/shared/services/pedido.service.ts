import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Pedido, PedidoContent, DetallesPedido } from './../models/pedido';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    private http: HttpClient
  ) { }

  
  
  // getVitrinasFiltro(texto: string): Observable<Vitrina[]>  {
    //   return this.http.get<Vitrina[]>(`${environment.apiURL}/catalog/getVitrinaByFilter/${texto}`); 
    // }
    
  updatePedido(pedido: Partial<Pedido>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/delivery/updateOrder`, JSON.stringify(pedido), { headers: headerss});
  }
  
  getPedidos(date: string, page: number): Observable<PedidoContent>  {
    return this.http.get<PedidoContent>(`${environment.apiURL}/delivery/getOrderByDate/${date}/${page}`); 
  }
  
  getPedido(idPedido) {
    return this.http.get<Pedido>(`${environment.apiURL}/delivery/getOrderById/${idPedido}`);
  }

  updateDetallesPedido(detallesPedido: Partial<DetallesPedido[]>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/delivery/updateDetOrder`, JSON.stringify(detallesPedido), { headers: headerss});
  }

  deletePedido(pedido: Partial <Pedido>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/delivery/deleteorder`, JSON.stringify(pedido), { headers: headerss});
  }

  deleteDetallesPedido(detallesPedido: Partial <DetallesPedido[]>): Observable<any>{
    const headerss = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${environment.apiURL}/delivery/deleteDetOrder`, JSON.stringify(detallesPedido), { headers: headerss});
  }

}

// delivery/updateOrder  -post  pedido
// getOrderByDate/{date}/{page}  -get
// updateDetOrder -post detpedido
// deleteorder- post pedido
// deleteDetOrder- post detpedido

// deleteorder-´pst detpedido

