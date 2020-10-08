import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from './../../../../../environments/environment';
import { Empleado } from '../../../../shared/models/empleado';
import * as html2canvas from 'html2canvas';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-ver-gafete',
  templateUrl: './ver-gafete.component.html',
  styleUrls: ['./ver-gafete.component.scss']
})
export class VerGafeteComponent implements OnInit {

  empleado: Empleado;
  idEmpleado;
  fotoEmpleado;
  codigoBarras;
  codigoQR;


  @ViewChild('printme', {static:false}) public printme: ElementRef;
  @ViewChild('downloadFront', {static:false}) public front: ElementRef;
  @ViewChild('downloadBack', {static:false}) public back: ElementRef;
  @ViewChild('canvas', {static:false}) canvas: ElementRef;
  @ViewChild('downloadLink', {static:false}) downloadLink: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private empleatoService: EmpleadoService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getDataEmploye();
  }

  getDataEmploye() {
    this.route.params.subscribe( (data:Params) => {
      console.log(data.idEmpleado);
      this.idEmpleado = data.idEmpleado;
      this.getEmploye(data.idEmpleado);
      this.getGafete(data.idEmpleado);
    });
  }

  getEmploye(idEmpleado){
    this.empleatoService.getEmpleado(idEmpleado).subscribe(
      (empleado: Empleado) => {
        console.log(empleado);
        this.empleado = empleado;
      },
      error => console.log(error)
    );
  }

  getGafete(idEmpleado) {
    this.empleatoService.getGafeteEmpleado(idEmpleado).subscribe(
      result => {
        console.log(result);
        this.fotoEmpleado = `${environment.urlImages}${result.photo}`;
        // this.fotoEmpleado = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${this.fotoEmpleado}`);
        this.codigoBarras = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${result.barCode}`);
        this.codigoQR = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${result.qrCode}`);
      },
      error => console.log(error)
    );
  }

  printGafete() {
    html2canvas(this.printme.nativeElement).then(canvas => {
      // this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'gafete.png';
      this.downloadLink.nativeElement.click();
    });
    html2canvas(this.front.nativeElement).then( canvas => {
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = `gafete-frente-${this.empleado.nombre}.png`;
      this.downloadLink.nativeElement.click();
    });
    html2canvas(this.back.nativeElement).then( canvas => {
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = `gafete-atras-${this.empleado.nombre}.png`;
      this.downloadLink.nativeElement.click();
    });
  }

  takePicture(){
    console.log('toma foto');
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
