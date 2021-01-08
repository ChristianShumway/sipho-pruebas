import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { ModalSearchRemisionComponent } from '../modal-search-remision/modal-search-remision.component';
import { RemisionService } from 'app/shared/services/remision.service';
import { Remision, ViewDetCuenta } from 'app/shared/models/remision';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';


@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.scss']
})
export class RemisionComponent implements OnInit {

  public dataRemision: Remision;
  public activeSearch: boolean = false;
  public dataSearching: boolean = false;
  public idUsuarioLogeado;
  public totalVenta: number;

  constructor(
    private bottomSheet: MatBottomSheet,
    private remisionService: RemisionService,
    private autenticacionService: AutenticacionService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.viewSearch();
  }

  
  viewSearch(): void {
    let sheet = this.bottomSheet.open(ModalSearchRemisionComponent, {
      data: {}
    });

    sheet.backdropClick().subscribe( () => {
      console.log('clicked');
    });  

    sheet.afterDismissed().subscribe(
      data => {
        this.activeSearch = true;
        this.dataSearching = true;
        this.dataRemision = null;
        this.totalVenta = 0;
        if(data) {
        //  console.log(data)
         this.remisionService.getRemision(data.transaccion, data.idCaja).subscribe(
           response => {
             this.dataSearching = false;
             if(response.idVenta !== 0) {
              this.dataRemision = response;
              this.dataRemision.viewDetVenta.map( article => {
                this.totalVenta += article.total;
              });
              // console.log(this.totalVenta);

             } else {
              //  this.dataRemision = null;
               this.useAlerts('No se encontro remisión con esa transacción', ' ', 'error-dialog');
             }
             console.log(this.dataRemision);
           },
           error => console.error(error)
         );
        }
      }
    )
  }

  newSearch() {
    this.viewSearch();
  }

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }

}
