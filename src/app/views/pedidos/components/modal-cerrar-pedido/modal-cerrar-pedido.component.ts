import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-cerrar-pedido',
  templateUrl: './modal-cerrar-pedido.component.html',
  styleUrls: ['./modal-cerrar-pedido.component.scss']
})
export class ModalCerrarPedidoComponent  {

  constructor(
    public dialogRef: MatDialogRef<ModalCerrarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
