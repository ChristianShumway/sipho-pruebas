import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from './../../../../../environments/environment';
import * as html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material';
import { VehiculoService } from 'app/shared/services/vehiculo.service';
import { Vehiculo } from 'app/shared/models/vehiculo';

@Component({
  selector: 'app-ver-codigo-qr-vehiculo',
  templateUrl: './ver-codigo-qr-vehiculo.component.html',
  styleUrls: ['./ver-codigo-qr-vehiculo.component.scss']
})
export class VerCodigoQrVehiculoComponent implements OnInit {

  public vehiculo: Vehiculo;
  public idVehiculo;
  public codigoQR;

  @ViewChild('printme', {static:false}) public printme: ElementRef;
  @ViewChild('downloadFront', {static:false}) public front: ElementRef;
  @ViewChild('canvas', {static:false}) canvas: ElementRef;
  @ViewChild('downloadLink', {static:false}) downloadLink: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private vehiculoService: VehiculoService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getDataVehicle();
  }

  getDataVehicle() {
    this.route.params.subscribe( (data:Params) => {
      this.idVehiculo = data.idVehiculo;
      this.getVehicle(data.idVehiculo);
    });
  }

  getVehicle(idVehiculo){
    this.vehiculoService.getVehiculo(idVehiculo).subscribe(
      (vehiculo: Vehiculo) => {
        console.log(vehiculo);
        this.vehiculo = vehiculo;
        this.codigoQR = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.vehiculo.qr}`);
      },
      error => console.log(error)
    );
  }

  printGafete() {
      html2canvas(this.front.nativeElement).then( canvas => {
      // this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = `codigo-qr-${this.vehiculo.numeroEconomico}.png`;
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
