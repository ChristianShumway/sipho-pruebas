import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RutaService } from 'app/shared/services/ruta.service';
import { Ruta } from 'app/shared/models/ruta';
import { Arqueo } from 'app/shared/models/arqueo';
import { MatButton } from '@angular/material';
import { ArqueoService } from 'app/shared/services/arqueo.service';

@Component({
  selector: 'app-arqueo',
  templateUrl: './arqueo.component.html',
  styleUrls: ['./arqueo.component.scss']
})
export class ArqueoComponent implements OnInit {
  @ViewChild('searchRoute', {static: false}) submitButtonRoute: MatButton;
  idUsuarioLogeado;
  searchRouteForm: FormGroup;
  rutas: Ruta[] = [];
  idRutaSeleccionada;
  searchNowRoute: boolean = false;
  dataArqueo: Arqueo;

  constructor(
    private autenticacionService: AutenticacionService,
    private snackBar: MatSnackBar,
    private rutaService: RutaService,
    private arqueoService: ArqueoService
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidationsRoute();
    this.getRutas();
  }

  getValidationsRoute(){
    this.searchRouteForm = new FormGroup({
      idRuta: new FormControl('', Validators.required)
    })
  }

  getRutas() {
    this.rutaService.getSelectRutaByEmploye(this.idUsuarioLogeado).subscribe(
      (rutas: Ruta[]) => {
        this.rutas = rutas;
        console.log(this.rutas);
        this.idRutaSeleccionada = rutas[0].idRuta;
        // this.searchReportRouteForm.get('idRuta').setValue(this.idRutaSeleccionada);
      },
      error => console.log(error)
    );

    
  }

  searchArqueo() {
    this.searchNowRoute = true;
    this.submitButtonRoute.disabled = true;
    this.dataArqueo = null;
    if(this.searchRouteForm.value) {
      console.log(this.searchRouteForm.value);
      this.arqueoService.getArqueo(this.searchRouteForm.value.idRuta).subscribe(
        response => {
          console.log(response);
          this.dataArqueo = response;
          this.submitButtonRoute.disabled = false;
          this.searchNowRoute = false;
        },
        error => {
          console.error(error);
          this.useAlerts(error.message, ' ', 'error-dialog');
          this.submitButtonRoute.disabled =false;
          this.searchNowRoute = false;
        }
      );
    }
  }

  useAlerts(message, action, className){
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
