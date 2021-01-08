import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatButton } from '@angular/material';
import { AutenticacionService } from '../../../../shared/services/autenticacion.service';

@Component({
  selector: 'app-modal-search-remision',
  templateUrl: './modal-search-remision.component.html',
  styleUrls: ['./modal-search-remision.component.scss']
})
export class ModalSearchRemisionComponent implements OnInit {

  searchForm: FormGroup;
  idUsuarioLogeado;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<ModalSearchRemisionComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService,
  ) { }

  ngOnInit() {
    this.idUsuarioLogeado = this.autenticacionService.currentUserValue;
    this.getValidations();
  }

  getValidations() {
    this.searchForm = new FormGroup({
      transaccion: new FormControl('', [
        Validators.required,
      ]),
      idCaja: new FormControl('1', [
        Validators.required,
      ]),
    })
  }

  searchRemision() {
    // console.log(this.searchForm.value);
    this.bottomSheetRef.dismiss(this.searchForm.value);
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
