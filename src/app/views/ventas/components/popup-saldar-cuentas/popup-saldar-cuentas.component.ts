import {Component, OnInit, Inject, ViewChild, OnChanges, AfterViewChecked} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TipoPagos } from 'app/shared/models/tipo-pagos';
import { MatButton, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-popup-saldar-cuentas',
  templateUrl: './popup-saldar-cuentas.component.html',
  styleUrls: ['./popup-saldar-cuentas.component.scss']
})
export class PopupSaldarCuentasComponent implements OnInit, AfterViewChecked {
  public saldoACobrar: number = 0;
  public tiposPago: TipoPagos[] = [];
  public tipoPago: TipoPagos;
  @ViewChild('save', {static: true}) btnSave: MatButton ;

  constructor(
    public dialogRef: MatDialogRef<PopupSaldarCuentasComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar
  ) {}

  saveData(): void {
    this.btnSave.disabled = true;
    if(this.saldoACobrar <= 0 || !this.tipoPago) {
      this.btnSave.disabled = false;
      this.useAlerts('Debes llenar la información solicitada', ' ', 'error-dialog');
    } else {
      this.btnSave.disabled = false;
      this.dialogRef.close({tipoPago: this.tipoPago.idPago, saldo: this.saldoACobrar});
    }
  }

  ngOnInit() {
    this.tiposPago = this.data;
    this.btnSave.disabled = true;
  }

  ngAfterViewChecked() {
    if(this.saldoACobrar > 0 && this.tipoPago) {
      this.btnSave.disabled = false;
    } else {
      this.btnSave.disabled = true;
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
