import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DevolucionPedido } from 'app/shared/models/devolucion-pedido';
import { Input } from '@angular/core';
import { MatButton, MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-form-devolucion-pedido',
  templateUrl: './form-devolucion-pedido.component.html',
  styleUrls: ['./form-devolucion-pedido.component.scss']
})
export class FormDevolucionPedidoComponent implements OnInit {

  @Input() entrega: DevolucionPedido;
  @Output() saveClicked: EventEmitter<any> = new EventEmitter();
  @ViewChild('save', {static: false}) savetButton: MatButton;

  idUsuarioLogeado;
  deliveryForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getValidationsDelivery();
    this.deliveryForm.patchValue(this.entrega);
  }

  getValidationsDelivery(){
    this.deliveryForm = new FormGroup({
      cantidadDevuelta: new FormControl('', Validators.required),
      cantidadVendida: new FormControl('', Validators.required),
      cantidadPedida: new FormControl('', Validators.required)
    });
  }

  saveDelivery() {
    if(this.deliveryForm.valid) {
      this.savetButton.disabled = true;
      const cantidadDevuelta = parseInt(this.deliveryForm.value.cantidadDevuelta);
      const cantidadVendida = parseInt(this.deliveryForm.value.cantidadVendida);
      if( cantidadDevuelta > this.deliveryForm.value.cantidadPedida || cantidadVendida > this.deliveryForm.value.cantidadPedida ) {
        this.useAlerts('La cantidad vendida y/o la cantidad devuelta no puede ser mayor a la pedida', ' ', 'error-dialog');
        this.savetButton.disabled = false;
      } else {
        this.savetButton.disabled = false;
        this.saveClicked.emit(this.deliveryForm.value);
      }
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
