import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription, Observable } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { AutenticacionService } from './../../services/autenticacion.service';
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { Empleado } from './../../models/empleado';
import { map } from "rxjs/operators";
import { environment } from './../../../../environments/environment';

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  public empleadoLlamado;
  public empleado$: Observable<Empleado>;
  public urlImagen = environment.urlImages;
  public timesStamp: any;
  
  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    private autenticacionService: AutenticacionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // this.getMenu();
    this.getEmpleadoLogeado();

    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    const currentProfile =   this.autenticacionService.currentProfileValue;
    this.navService.getMenu(currentProfile);
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
      // console.log(this.menuItems);
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === "icon"
      ).length;
    });
    this.layoutConf = this.layout.layoutConf;
  }

  
  async getEmpleadoLogeado() {
    const usuarioLogeado = await  this.autenticacionService.currentUserValue;
    this.empleadoLlamado = await this.autenticacionService.getEmpleadoLogeado(usuarioLogeado);
    this.autenticacionService.newTime$.subscribe(
      result =>  this.timesStamp = result
    );
    this.empleado$ = await this.autenticacionService.empleadoLog$
    .pipe(
      map((empleado: Empleado) => empleado)
    );
  }

  getMenu() {
    const currentProfile =   this.autenticacionService.currentProfileValue;
    this.navService.getMenuLoad(currentProfile.idPerfil).subscribe(
      (menuItem) => {
        console.log(menuItem)
        this.menuItems = menuItem;
        this.hasIconTypeMenuItem = !!this.menuItems.filter(
          item => item.type === "icon"
        ).length;
      },
      error => console.log(error)
    );
  }

  ngAfterViewInit() {
    // this.getMenu();
  }

  ngOnChanges(){
    // console.log(this. usuarioLogeado.idPerfil);
    // this.getMenu();
  }
  
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }

  toggleCollapse() {
    if (
      this.layoutConf.sidebarCompactToggle
    ) {
        this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
        this.layout.publishLayoutChange({
            // sidebarStyle: "compact",
            sidebarCompactToggle: true
          });
    }
  }

  logOut() {
    this.autenticacionService.logout();
    this.router.navigateByUrl('/login');
    this.useAlerts('Se cerro sesión con exito', ' ', 'success-dialog');
  }

  useAlerts(message, action, className) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [className]
    });
  }
}
