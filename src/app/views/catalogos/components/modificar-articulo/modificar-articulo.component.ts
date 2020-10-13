import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Articulo, EstatusArticulo } from 'app/shared/models/articulo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ArticuloService } from 'app/shared/services/articulo.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { FamiliaService } from 'app/shared/services/familia.service';
import { Familia } from 'app/shared/models/familia';
import { environment } from './../../../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ModalEliminarComponent } from '../../../../shared/components/modal-eliminar/modal-eliminar.component';
import { debounceTime } from 'rxjs/operators';
import { FileUploader } from 'ng2-file-upload';
import { parse } from 'querystring';

@Component({
  selector: 'app-modificar-articulo',
  templateUrl: './modificar-articulo.component.html',
  styleUrls: ['./modificar-articulo.component.scss']
})
export class ModificarArticuloComponent implements OnInit {

  articuloForm: FormGroup;
  idArticulo;
  idUsuarioLogeado;
  articulo: Articulo;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  familias: Familia[] = [];
  catalogEstatus: EstatusArticulo[] = [];
  urlImage = environment.urlImages;
  imgArticle;
  selectedVal;

  public uploaderArchivo: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: boolean = false;
  rutaServer: string;
  loadingFile = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
    private activatedRoute: ActivatedRoute,
    private articuloService: ArticuloService,
    private familiaService: FamiliaService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getValidations();
    this.getArticulo();
    this.getCatalogs();
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.initUploadCatalogo();
  }

  getArticulo() {
    this.imgArticle = '';
    this.activatedRoute.params.subscribe((data: Params) => {
      this.idArticulo = data.idArticulo;
      if (this.idArticulo) {
        this.articuloService.getArticulo(this.idArticulo).subscribe(
          (articulo: Articulo) => {
            console.log(articulo);
            if(articulo.imagenes.length > 0) {
              this.imgArticle = `${this.urlImage}${articulo.imagenes[0].path}`;
            }
            this.articulo = articulo;
            this.articuloForm.patchValue(articulo);
            this.selectedVal = this.articulo.materiaPrima.toString();
            console.log(this.selectedVal);
            this.articuloForm.get('familia').setValue(articulo.familia.idFamilia);
            this.articuloForm.get('estatusArticulo').setValue(articulo.estatusArticulo.idEstatusArticulo);
          },
          error => console.log(error)
        );
      }
    });
  }


  getCatalogs() {
    this.familiaService.getSelectFamilia().subscribe(
      (familias: Familia[]) => {
        this.familias = familias;
      },
      error => console.log(error)
    );

    this.articuloService.getSelectEstatusArticulo().subscribe(
      (data: EstatusArticulo[]) => {
        this.catalogEstatus = data;
      }
    );
  }

  getValidations() {
    this.articuloForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
      ]),
      familia: new FormControl('', [
        Validators.required,
      ]),
      estatusArticulo: new FormControl('', [
        Validators.required,
      ]),
      precioPublico: new FormControl('', [
        Validators.required,
      ]),
      costo: new FormControl('', [
        Validators.required,
      ]),
      // materiaPrima: new FormControl('', [
      //   Validators.required,
      // ])
    })
  }

  public onValChange(val) {
    this.selectedVal = val;
    console.log(val);
  }

  updateArticle() {
    if (this.articuloForm.valid) {
      const format = 'yyyy/MM/dd';
      const myFormatedDate = this.pipe.transform(this.hoy, format);

      const refreshFamily: Familia = this.familias.find((familia: Familia) => familia.idFamilia === this.articuloForm.value.familia);
      // console.log(refreshFamily);
      const refreshEstatus: EstatusArticulo = this.catalogEstatus.find((estatus: EstatusArticulo) => estatus.idEstatusArticulo === this.articuloForm.value.estatusArticulo);
      // console.log(refreshEstatus);

      const articulo: Articulo = {
        idArticulo: parseInt(this.idArticulo),
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.articuloForm.value,
        familia: refreshFamily,
        estatusArticulo: refreshEstatus,
        materiaPrima: parseInt(this.selectedVal)
      };
      console.log(articulo);

      this.articuloService.updateArticulo(articulo).subscribe(
        (response => {
          if (response.estatus === '05') {
            this.router.navigate(['/catalogos/articulos']);
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

        const picture = {
          ...this.articulo.imagenes[0],
          idEmpleadoModifico: this.idUsuarioLogeado
        };

        console.log(picture);

        this.articuloService.deleteImagenArticulo(picture).subscribe(
          response => {
            console.log(response);
            if (response.estatus === '05') {
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getArticulo();
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

    const headers = [{ name: 'Accept', value: 'application/json'}];
    this.uploaderArchivo = new FileUploader({ url: this.rutaServer + 'catalog/uploadImageArticle', autoUpload: true, headers: headers });
    this.uploaderArchivo.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('idEmploye', this.idUsuarioLogeado);
      form.append('idArticle', this.articulo.idArticulo);
      this.loadingFile = true;
      console.log(this.loadingFile);
    };

    this.uploaderArchivo.uploadAll();
    this.uploaderArchivo.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.loadingFile = false;
      const result = JSON.parse(response);
      console.log(result);

      if (result != undefined) {
        if(result.noEstatus === 5) {
          this.useAlerts(result.mensaje, ' ', 'success-dialog');
          this.getArticulo();
        } else {
          console.log('aqui');
          if(result.status === 500) {
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
