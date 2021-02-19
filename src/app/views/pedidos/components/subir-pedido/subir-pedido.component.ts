import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from './../../../../../environments/environment';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatSnackBar } from '@angular/material';
import { Ruta } from 'app/shared/models/ruta';
import { RutaService } from 'app/shared/services/ruta.service';

@Component({
  selector: 'app-subir-pedido',
  templateUrl: './subir-pedido.component.html',
  styleUrls: ['./subir-pedido.component.scss']
})
export class SubirPedidoComponent implements OnInit {
  public uploaderArchivo: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: boolean = false;
  idUsuarioLogeado;
  rutas: Ruta[] = [];
  idRuta;
  rutaServer: string;
  rutaImg: string;
  host: string;
  loadingFile = false;

  constructor(
    private autenticacionService: AutenticacionService,
    private snackBar: MatSnackBar,
    private rutaService: RutaService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    console.log(this.idUsuarioLogeado);
    this.getCatalogoRuta();
    this.initUploadCatalogo();
  }

  getCatalogoRuta() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      result => {
        this.rutas = result;
        console.log(this.rutas);
      }, 
      error => console.error(error)
    );
  }

  selectRoute(idRuta) {
    this.idRuta = idRuta;
    console.log(this.idRuta);
    // this.rutaSeleccionada = this.rutas.find((ruta: Ruta) => ruta.idRuta = idRuta);
  }

  initUploadCatalogo() {
    this.rutaServer = environment.rutaServer;
    // this.rutaImg = environment.imageServe;
    // this.host = environment.host;

    const headers = [{ name: 'Accept', value: 'application/json'}];
    this.uploaderArchivo = new FileUploader({ url: this.rutaServer + 'production/uploadOrden', autoUpload: true, headers: headers });
    this.uploaderArchivo.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('idRuta', this.idRuta);
      form.append('idEmpleado', this.idUsuarioLogeado);
      this.loadingFile = true;
      console.log(this.loadingFile);
    };

    this.uploaderArchivo.uploadAll();
    this.uploaderArchivo.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.loadingFile = false;
      // console.log(item);
      console.log(response);
      const result = JSON.parse(response);
      console.log(result);

      if (result != undefined) {
        if(result.noEstatus === 5) {
          this.useAlerts(result.mensaje, ' ', 'success-dialog');
        } else {
          this.useAlerts(result.mensaje, ' ', 'error-dialog');
        }
      } else {
        this.useAlerts('Ocurrio un error, favor de reportar', ' ', 'error-dialog');
      }
    };

  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }


}
