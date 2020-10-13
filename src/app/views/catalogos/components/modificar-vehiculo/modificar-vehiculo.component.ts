import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Vehiculo } from 'app/shared/models/vehiculo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VehiculoService } from 'app/shared/services/vehiculo.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { environment } from './../../../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ModalEliminarComponent } from '../../../../shared/components/modal-eliminar/modal-eliminar.component';
import { debounceTime } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-modificar-vehiculo',
  templateUrl: './modificar-vehiculo.component.html',
  styleUrls: ['./modificar-vehiculo.component.scss']
})
export class ModificarVehiculoComponent implements OnInit {

  vehiculoForm: FormGroup;
  idVehiculo;
  idUsuarioLogeado;
  vehiculo: Vehiculo;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  urlImage = environment.urlImages;
  imgTemp = '/vehicle/image/truck-default.png';
  imgVehicle;

  public uploaderArchivo: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: boolean = false;
  rutaServer: string;
  loadingFile = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private vehiculoService: VehiculoService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getVehiculo();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.initUploadCatalogo();
  }

  getVehiculo() {
    this.imgVehicle = '';
    this.activatedRoute.params.subscribe((data: Params) => {
      this.idVehiculo = data.idVehiculo;
      if (this.idVehiculo) {
        this.vehiculoService.getVehiculo(this.idVehiculo).subscribe(
          (vehiculo: Vehiculo) => {
            console.log(vehiculo);
            if (vehiculo.imagen !== this.imgTemp) {
              this.imgVehicle = `${this.urlImage}${vehiculo.imagen}`;
            }
            this.vehiculo = vehiculo;
            this.vehiculoForm.patchValue(vehiculo);
          },
          error => console.log(error)
        );
      }
    });
  }

  getValidations() {
    this.vehiculoForm = new FormGroup({
      marca: new FormControl('', [
        Validators.required,
      ]),
      linea: new FormControl('', [
        Validators.required,
      ]),
      modelo: new FormControl('', [
        Validators.required,
      ]),
      placa: new FormControl('', [
        Validators.required,
      ]),
      numeroEconomico: new FormControl('', [
        Validators.required,
      ])
    })
  }

  updateVehicle() {
    if (this.vehiculoForm.valid) {
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);

      const vehiculo: Vehiculo = {
        idVehiculo: parseInt(this.idVehiculo),
        idEmpleadoModifico: this.idUsuarioLogeado,
        activo: 1,
        ...this.vehiculoForm.value,
      };
      console.log(vehiculo);

      this.vehiculoService.updateVehiculo(vehiculo).subscribe(
        (response => {
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/vehiculos']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
          } else {
            this.useAlerts(response.mensaje, ' ', 'error-dialog');
          }
        }),
        (error => {
          console.log(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
        })
      );
    }
  }

  deletePicture() {
    const dialogRef = this.dialog.open(ModalEliminarComponent, {
      width: '300px',
      panelClass: 'custom-dialog-container-delete',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.vehiculoService.deleteImagenVehiculo(this.vehiculo).subscribe(
          response => {
            console.log(response);
            if (response.estatus === '05') {
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getVehiculo();
            } else {
              this.useAlerts(response.mensaje, ' ', 'error-dialog');
            }
          },
          error => {
            this.useAlerts(error.message, ' ', 'error-dialog');
            console.log(error);
          }
        );
      }
    });
  }

  initUploadCatalogo() {
    this.rutaServer = environment.rutaServer;

    const headers = [{ name: 'Accept', value: 'application/json' }];
    this.uploaderArchivo = new FileUploader({ url: this.rutaServer + 'catalog/uploadImageVehicle', autoUpload: true, headers: headers });
    this.uploaderArchivo.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('idEmploye', this.idUsuarioLogeado);
      form.append('idVehicle', this.idVehiculo);
      this.loadingFile = true;
      console.log(this.loadingFile);
    };

    this.uploaderArchivo.uploadAll();
    this.uploaderArchivo.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.loadingFile = false;
      const result = JSON.parse(response);
      console.log(result);

      if (result != undefined) {
        if (result.noEstatus === 5) {
          this.useAlerts(result.mensaje, ' ', 'success-dialog');
          this.getVehiculo();
        } else {
          console.log('aqui');
          if (result.status === 500) {
            this.useAlerts('Imágen excede el tamaño, favor de reportar', ' ', 'error-dialog');
          } else {
            this.useAlerts(result.mensaje, ' ', 'error-dialog');
          }
        }
      } else {
        this.useAlerts('Ocurrio un error, favor de reportar', ' ', 'error-dialog');
      }
    };

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
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
