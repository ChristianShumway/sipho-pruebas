import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from './../../../../../environments/environment';
import { Cliente } from '../../../../shared/models/cliente';
import * as html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material';
import { ClienteService } from 'app/shared/services/cliente.service';

@Component({
  selector: 'app-ver-codigo-qr',
  templateUrl: './ver-codigo-qr.component.html',
  styleUrls: ['./ver-codigo-qr.component.scss']
})
export class VerCodigoQrComponent implements OnInit {

  public cliente: Cliente;
  public idCliente;
  public codigoQR;

  @ViewChild('printme', {static:false}) public printme: ElementRef;
  @ViewChild('downloadFront', {static:false}) public front: ElementRef;
  @ViewChild('canvas', {static:false}) canvas: ElementRef;
  @ViewChild('downloadLink', {static:false}) downloadLink: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getDataCustomer();
  }

  getDataCustomer() {
    this.route.params.subscribe( (data:Params) => {
      this.idCliente = data.idCliente;
      this.getCustomer(data.idCliente);
    });
  }

  getCustomer(idCliente){
    this.clienteService.getCliente(idCliente).subscribe(
      (cliente: Cliente) => {
        console.log(cliente);
        this.cliente = cliente;
        this.codigoQR = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.cliente.qr}`);
      },
      error => console.log(error)
    );
  }

  printGafete() {
      html2canvas(this.front.nativeElement).then( canvas => {
      // this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = `codigo-qr-${this.cliente.razonSocial}.png`;
      this.downloadLink.nativeElement.click();
    });
    this.useAlerts('Código QR descargado', ' ', 'success-dialog');
  }

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }


}
