import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Empleado } from 'app/shared/models/empleado';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadoService } from 'app/shared/services/empleado.service';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { DatePipe } from '@angular/common';
import { PerfilesService } from 'app/shared/services/perfiles.service';
import { Perfil } from 'app/shared/models/perfil';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  // public uploader: FileUploader = new FileUploader({ url: 'upload_url' });
  // public hasBaseDropZoneOver: boolean = false;

  empleadoForm: FormGroup;
  idEmpleado;
  idUsuarioLogeado;
  empleado: Empleado;
  hoy = new Date();
  pipe = new DatePipe('en-US');
  perfiles: Perfil[] = [];
  fechaIngreso;
  public uploaderProfile: FileUploader = new FileUploader({ url: '' });
  public hasBaseDropZoneOver: boolean = false;
  rutaImg: string;
  rutaServe: string;
  loadingFile = false;

  linkPicture: string = '';
  timeStamp: any;
  
  constructor(
    private snackBar: MatSnackBar,
    private empleadoService: EmpleadoService,
    private autenticacionService: AutenticacionService,
    private perfilesService: PerfilesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.rutaServe =environment.apiURL;
    this.rutaImg = environment.urlImages;
    this.getEmpleado();
    this.getValidations();
    this.getCatalogs();
    this.initUploadImae();
  }
  
  getEmpleado() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.empleadoService.getEmpleado(this.idUsuarioLogeado).subscribe(
      (empleado: Empleado) => {
        console.log(empleado);
        this.empleado = empleado;
        let fechaString = empleado.fechaIngreso;
        this.fechaIngreso = new Date(fechaString);
        this.fechaIngreso.setDate(this.fechaIngreso.getDate()+1);
        this.empleadoForm.patchValue(empleado);
        this.empleadoForm.get('perfil').setValue(empleado.perfil.idPerfil);
        this.setLinkPicture(empleado.imagen);
      },
      error => console.log(error)
    );    
  }

  getCatalogs() {
    this.perfilesService.getSelectPerfil().subscribe(
      (perfiles) => {
        // console.log(perfiles);
        this.perfiles = perfiles;
      },
      error => console.log(error)
    );
  }

  getValidations() {
    this.empleadoForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
      ]),
      apellidoPaterno: new FormControl('', [
        Validators.required,
      ]),
      apellidoMaterno: new FormControl('', [
        Validators.required,
      ]),
      direccion: new FormControl('', [
        Validators.required,
      ]),
      telefono: new FormControl('', [
        Validators.required,
      ]),
      nss: new FormControl('', [
        Validators.required,
      ]),
      gafete: new FormControl(''),
      perfil: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      fechaIngreso: new FormControl(this.fechaIngreso),
    })
  }

  public onFechaIngreso(event): void {
    this.fechaIngreso = event.value;
  }

  
  initUploadImae(){
    const headers = [{name: 'Accept', value: 'application/json'}];
    this.uploaderProfile = new FileUploader({ url: this.rutaServe+'/catalog/uploadImageEmploye' , autoUpload: true, headers: headers});
    this.uploaderProfile.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('idEmploye' , this.empleado.idEmpleado);
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
            // debugger;
            this.autenticacionService.getEmpleadoLogeado(result.response.idEmpleado);
            this.useAlerts(result.mensaje, ' ', 'success-dialog');
            // location.reload();
            // window.location.reload(); 
            // this.autenticacionService.logout();
            // this.router.navigateByUrl('/login');
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

  updateEmploye() {
    if (this.empleadoForm.valid) {
      const format = 'yyyy-MM-dd';
      const myFormatedFechaIngreso = this.pipe.transform(this.fechaIngreso, format);

      const refreshProfile: Perfil = this.perfiles.find( (perfil: Perfil) => perfil.idPerfil === this.empleadoForm.value.perfil );

      const empleado: Empleado = {
        idEmpleado: this.empleado.idEmpleado,
        idEmpleadoModifico: this.idUsuarioLogeado,
        ...this.empleadoForm.value,
        perfil: refreshProfile,
        fechaIngreso: myFormatedFechaIngreso
      };
      console.log(empleado);

      this.empleadoService.updateEmpleado(empleado).subscribe(
        (response => {
          // console.log(response);
          if (response.estatus === '05') {
            // this.router.navigate(['/catalogos/empleados']);
            this.useAlerts(response.mensaje, ' ', 'success-dialog');
            this.autenticacionService.getEmpleadoLogeado(this.idUsuarioLogeado);
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

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }



}
