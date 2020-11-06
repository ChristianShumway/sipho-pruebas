import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressBar, MatButton } from '@angular/material';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';

import { AutenticacionService } from './../../../../shared/services/autenticacion.service';
import { Empleado } from '../../../../shared/models/empleado';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @ViewChild(MatProgressBar, {static: false}) progressBar: MatProgressBar;
  @ViewChild(MatButton, {static: false}) submitButton: MatButton;

  signinForm: FormGroup;
  returnUrl: string;
  existeUsuario: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private autenticacionService: AutenticacionService
  ) { 
    // redirect to home if already logged in
    // if (this.autenticacionService.currentUserValue) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl('',[ Validators.required, Validators.email]),
      contrasena: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signin() {
    this.autenticacionService.loginUser(this.signinForm.value)
    .pipe(first()) 
    .subscribe(
      (user: Empleado) => {
        console.log(user);
        if(user.email){
          if(user.cambiarContrasena === 0){
            localStorage.setItem('currentUserSession', JSON.stringify(user.idEmpleado));
            localStorage.setItem('perfilEmpleado', JSON.stringify(user.perfil));
            this.autenticacionService.isLogin(user);
            this.useAlerts('Acceso de usuario correcto', ' ', 'success-dialog');
            this.router.navigate(['/dashboard']);
            this.existeUsuario = true;
          } else if(user.cambiarContrasena === 1) {
            this.useAlerts('Tienes que cambiar tu contraseña temporal', ' ', 'warning-dialog');
            this.router.navigate(['/login/restaurar-password', user.idEmpleado]);
          }
        } else {
          this.useAlerts('Usuario no encontrado', ' ', 'error-dialog');
          this.submitButton.disabled = false;
          this.progressBar.mode = 'determinate';
        }
      },
      error => {
        console.log(error);
        this.useAlerts('Acceso de usuario incorrecto', ' ', 'error-dialog');
        this.submitButton.disabled = false;
        this.progressBar.mode = 'determinate';
      }
    )
    
    this.submitButton.disabled = true;
    this.progressBar.mode = 'indeterminate';
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
