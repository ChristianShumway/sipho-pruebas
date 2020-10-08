import { Component, OnInit, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { EmpleadoService } from 'app/shared/services/empleado.service';
// import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-foto-gafete',
  templateUrl: './foto-gafete.component.html',
  styleUrls: ['./foto-gafete.component.scss']
})
export class FotoGafeteComponent implements OnInit, AfterViewInit {

  @ViewChild("video", {static: false}) public video: ElementRef;
  @ViewChild("canvas", {static: false}) public canvas: ElementRef;
  idEmpleado;
  idUsuarioLogeado;
  public captures: Array<any> = [];
  public pictureCapture;
 
  constructor(
    // private bottomSheetRef: MatBottomSheetRef<FotoGafeteComponent>,
    // @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private route: ActivatedRoute,
    private autenticacionService: AutenticacionService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    console.log(this.idUsuarioLogeado);
    this.route.params.subscribe( (data:Params) => {
      console.log(data.idEmpleado);
      this.idEmpleado = data.idEmpleado;
    });
  }

  ngAfterViewInit() {
    this.showCamera();
  }

  public showCamera() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then( stream => {
        try {
          this.video.nativeElement.srcObject = stream;
        } catch (error) {
          this.video.nativeElement.src = window.URL.createObjectURL(stream);
        }
        this.video.nativeElement.play();
      });
    } 
  }

  public capture() {
    var context = this.canvas.nativeElement.getContext("2d").drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL("image/png"));
    this.pictureCapture = this.canvas.nativeElement.toDataURL("image/png");
    console.log(this.captures);
    console.log(this.pictureCapture);
    // this.bottomSheetRef.dismiss();
  }

  public savePicture() {
    const dataPhoto = {
      data: this.pictureCapture,
      idEmploye: parseInt(this.idEmpleado),
      idEmployeModified: this.idUsuarioLogeado
    };

    console.log(dataPhoto);

    // this.empleadoService.uploadFotoEmpleado(dataPhoto).subscribe(
    //   result => console.log(result),
    //   error => console.log(error)
    // );
  }

  public otherPicture() {
    this.pictureCapture = "";
    this.showCamera();
  }


  

}
