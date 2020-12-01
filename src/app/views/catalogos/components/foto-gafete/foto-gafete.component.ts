import { Component, OnInit, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { MatSnackBar } from '@angular/material';
import { FileUploader } from 'ng2-file-upload';
import { switchMap } from 'rxjs/operators';

// import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Empleado } from 'app/shared/models/empleado';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-foto-gafete',
  templateUrl: './foto-gafete.component.html',
  styleUrls: ['./foto-gafete.component.scss']
})
export class FotoGafeteComponent implements OnInit, AfterViewInit {

  @ViewChild("video", {static: false}) public video: ElementRef;
  @ViewChild("canvas", {static: false}) public canvas: ElementRef;
  idEmpleado;
  empleado: Empleado;
  idUsuarioLogeado;
  public captures: Array<any> = [];
  public pictureCapture;

  public uploaderProfile: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: boolean = false;
  rutaImg: string;
  rutaServe: string;
  loadingFile = false;

  linkPicture: string = '';
  timeStamp: any;
 
  constructor(
    // private bottomSheetRef: MatBottomSheetRef<FotoGafeteComponent>,
    // @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private route: ActivatedRoute,
    private autenticacionService: AutenticacionService,
    private empleadoService: EmpleadoService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.rutaServe =environment.apiURL;
    this.rutaImg = environment.urlImages;
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.route.params.pipe( 
      switchMap ((data:Params) => this.empleadoService.getEmpleado(data.idEmpleado))
    ).subscribe( 
      (empleado: Empleado) => {
        this.empleado = empleado;
        this.idEmpleado = empleado.idEmpleado;
        this.setLinkPicture(empleado.imagen);
      },
      error => console.log(error)
    );
    this.initUploadImage();
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
    // console.log(this.captures);
    // console.log(this.pictureCapture);
    // this.bottomSheetRef.dismiss();
  }

  public savePicture() {
    const dataPhoto = {
      data: this.pictureCapture,
      idEmpleado: parseInt(this.idEmpleado),
      idEmpleadoModifico: this.idUsuarioLogeado
    };

    console.log(dataPhoto);

    this.empleadoService.uploadFotoEmpleado(dataPhoto).subscribe(
      response =>  {
        console.log(response);
        if (response.estatus === '05') {
          this.router.navigate(['/catalogos/gafete', this.idEmpleado]);
          this.useAlerts(response.mensaje, ' ', 'success-dialog');
        } else {
          this.useAlerts(response.mensaje, ' ', 'error-dialog');
        }
      },
      error => {
        console.log(error);
        this.useAlerts(error.message, ' ', 'error-dialog');
      }
    );
  }

  public otherPicture() {
    this.pictureCapture = "";
    this.showCamera();
  }


  initUploadImage(){
    const headers = [{name: 'Accept', value: 'application/json'}];
    this.uploaderProfile = new FileUploader({ url: this.rutaServe+'/catalog/uploadImageEmploye' , autoUpload: true, headers: headers});
    this.uploaderProfile.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('idEmploye' , this.idEmpleado);
      form.append('idEmployeModified ' , this.idUsuarioLogeado);
      this.loadingFile = true;
     };
    this.uploaderProfile.uploadAll();
    this.uploaderProfile.onCompleteItem =  (item:any, response:any, status:any, headers:any) => {
      this.loadingFile = false;
      console.log(status);
      if(status === 0) {
        this.useAlerts('Ocurrio un error, favor de reportar', ' ', 'error-dialog');
      } else {
        const result = JSON.parse(response);
        console.log(result);
  
        if (result != undefined) {
          if(result.noEstatus === 5) {
            // this.autenticacionService.getEmpleadoLogeado(result.response.idEmpleado);
            this.useAlerts(result.mensaje, ' ', 'success-dialog');
            this.empleado.imagen = result.response.imagen;
            this.setLinkPicture(result.response.imagen);
          } else {
            console.log('aqui');
            if(result.status === 500) {
              this.useAlerts('Imágen excede el tamaño, favor de reportar', ' ', 'error-dialog');   
            } else {
              this.useAlerts(result.message, ' ', 'error-dialog');
            }
          }
        } else {
          this.useAlerts('Ocurrio un error, favor de reportar', ' ', 'error-dialog');
        }
       
      }
    };
  }

  public setLinkPicture(img: string) {
    this.linkPicture = `${this.rutaImg}/employe/photo/${img}?timeStamp=${Date.now()}`;
    // this.timeStamp = (new Date()).getTime();
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
