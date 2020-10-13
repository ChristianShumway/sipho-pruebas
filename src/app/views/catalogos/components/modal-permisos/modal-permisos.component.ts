import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthorizedProfile } from './../../../../shared/models/authorized-profile';

@Component({
  selector: 'app-modal-permisos',
  templateUrl: './modal-permisos.component.html',
  styleUrls: ['./modal-permisos.component.scss']
})
export class ModalPermisosComponent implements OnInit {

  authorizedProfileList: AuthorizedProfile[] = [];
  authorizedProfileListSelected: AuthorizedProfile[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalPermisosComponent>,
    @Inject(MAT_DIALOG_DATA) public profiles) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(){
    this.authorizedProfileList =this.profiles;
  }

  onProfileChange(list){
    this.authorizedProfileListSelected = list.selectedOptions.selected.map(item => item.value);
  }


}
