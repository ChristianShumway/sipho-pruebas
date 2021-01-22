import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CuentasPorRecibirService } from 'app/shared/services/cuentas-por-recibir.service';
import { CuentaPorSaldar, DatosPagoCuentas } from 'app/shared/models/cuentas-por-recibir';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatExpansionPanel, MatDialog, MatSnackBar, MatButton } from '@angular/material';
import { PopupSaldarCuentasComponent } from '../popup-saldar-cuentas/popup-saldar-cuentas.component';
import { TipoPagos } from 'app/shared/models/tipo-pagos';
import { AutenticacionService } from 'app/shared/services/autenticacion.service';

@Component({
  selector: 'app-saldar-cuenta',
  templateUrl: './saldar-cuenta.component.html',
  styleUrls: ['./saldar-cuenta.component.scss']
})
export class SaldarCuentaComponent implements OnInit {
  public idUsuarioLogeado;
  public cuentasPorSaldar: CuentaPorSaldar[] = [];
  public respaldoCuentasPorSaldar: CuentaPorSaldar[] = [];
  public cuentasSeleccionadasPorSaldar: CuentaPorSaldar[] = [];
  public noData: boolean = false;
  public searching: boolean = true;
  public tipoPagos: TipoPagos[] = [];
  public idCliente;
  public montoTotal: number;
  public saldoTotal: number;
  @ViewChild('saldar', {static: false}) btnSaldar: MatButton;

  constructor(
    private cuentasPorRecibirService: CuentasPorRecibirService,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getData();
    this.getCatalogoTipoCuentas();
  }

  getData() {
    this.cuentasPorSaldar = [];
    this.noData = false;
    this.searching = true;
    this.montoTotal = 0;
    this.saldoTotal = 0;
    this.activatedRoute.params.pipe(
      switchMap( (data: Params) => this.cuentasPorRecibirService.getCuentasPorSaldar(data.idCliente))
    ).subscribe(
      result => {
        this.searching = false;
        if(!result.length) {
          this.noData = true;
          this.cuentasPorSaldar = [];
        } else {
          // console.log(result);
          this.noData = false;
          this.idCliente = result[0].idCliente;
          result.map( cuenta => {
            this.cuentasPorSaldar = [...this.cuentasPorSaldar, {...cuenta, selected: false, expanded: false}];
          })
          console.log(this.cuentasPorSaldar);
        }
      },
      error => console.log(error)
    );
  }

  onChange(idCuenta, event) {
    this.montoTotal = 0;
    this.saldoTotal = 0;
    this.cuentasPorSaldar.map( cuenta => {
      if(cuenta.idCuentaPorCobrar === idCuenta) {
        cuenta.selected = event.checked;
      }
      if(cuenta.selected) {
        this.montoTotal += cuenta.monto;
        this.saldoTotal += cuenta.saldo;
      }
    });
  }

  expandPannel(expanded, idCuenta) {
    expanded = !expanded;
    // console.log(expanded);
    // console.log(idCuenta);
    this.cuentasPorSaldar.map( cuenta => {
      if(cuenta.idCuentaPorCobrar === idCuenta) {
        cuenta.expanded = expanded;
      } else {
        cuenta.expanded = false;
      }
    });
    if(expanded) {
      this.searchHistory(idCuenta);
    }
  }

  searchHistory(idCuenta) {
    console.log(idCuenta)
  }

  getCatalogoTipoCuentas() {
    this.cuentasPorRecibirService.getCatalogoTipoPago().subscribe(
      tipoPago => {
        // console.log(tipoPago);
        this.tipoPagos = tipoPago;
      },
      error => console.log(error)
    );
  }

  saldarCuentas() {
    let totalCuentasSaldar = 0;
    this.cuentasSeleccionadasPorSaldar = [];
    this.respaldoCuentasPorSaldar = [];
    this.btnSaldar.disabled = true;
    this.cuentasPorSaldar.map( cuenta => {
      if (cuenta.selected) {
        totalCuentasSaldar += 1;
        this.cuentasSeleccionadasPorSaldar = [...this.cuentasSeleccionadasPorSaldar, cuenta];
      }
    });
    console.log(totalCuentasSaldar);
    if(totalCuentasSaldar <= 0) {
      this.useAlerts('Debes seleccionar al menos una cuenta por cobrar', ' ', 'error-dialog');
      this.btnSaldar.disabled = false;
    } else {
      this.respaldoCuentasPorSaldar = this.cuentasPorSaldar;
      console.log(this.cuentasSeleccionadasPorSaldar);
      this.openPopup();
    }
  }

  openPopup() {
    const dialogRef = this.dialog.open(PopupSaldarCuentasComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container-delets',
      data: this.tipoPagos
    });

    dialogRef.afterClosed().subscribe(result => {
      let saveCounts = [];
      let pay: DatosPagoCuentas = null;
      this.btnSaldar.disabled = false;
      if(result){
        console.log(result);
        this.cuentasSeleccionadasPorSaldar.map ( cuenta => {
          delete cuenta.expanded;
          delete cuenta.selected;
          saveCounts = [...saveCounts, cuenta];
        });
        pay = {
          idCliente: this.idCliente,
          idEmpleado: this.idUsuarioLogeado,
          idPago: result.tipoPago,
          abono: parseInt(result.saldo),
          cuentas: saveCounts
        };

        console.log(pay);
        this.cuentasPorRecibirService.savePay(pay).subscribe(
          response => {
            if(response.estatus === '05'){
              this.useAlerts(response.mensaje, ' ', 'success-dialog');
              this.getData();
            } else {
              this.useAlerts(response.mensaje, ' ', 'error-dialog');
              this.cuentasPorSaldar = this.respaldoCuentasPorSaldar;
            }
          },
          error => {
            console.log(error);
            this.useAlerts(error.message, ' ', 'error-dialog');
            this.cuentasPorSaldar = this.respaldoCuentasPorSaldar;
          }
        );
      }
    });
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
