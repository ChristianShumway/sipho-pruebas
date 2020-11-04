import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { MapsAPILoader, AgmInfoWindow } from '@agm/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { VehiculoService } from 'app/shared/services/vehiculo.service';
import { RepartidorService } from 'app/shared/services/repartidor.service';
import { ClienteService } from 'app/shared/services/cliente.service';
import { Vehiculo } from 'app/shared/models/vehiculo';
import { Repartidor } from 'app/shared/models/repartidor';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

import {MatTableDataSource} from '@angular/material/table';
import { Cliente } from '../../../../shared/models/cliente';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-recorrido-vendedor',
  templateUrl: './recorrido-vendedor.component.html',
  styleUrls: ['./recorrido-vendedor.component.scss']
})
export class RecorridoVendedorComponent implements OnInit {

  fechaInicio;
  pipe = new DatePipe('en-US');
  bitacoraForm: FormGroup;
  vehiculos: Vehiculo[] = [];
  latitude: number;
  longitude: number;
  zoom: number;
  icon: string;
  pin: string;
  showMarks: Repartidor[] = [];
  multipleDataCoordinates: any[] = [];
  previous = null;
  dataTable: any[] = [];
  displayedColumns: string[] = ['empleado', 'cliente', 'fecha'];
  dataSource = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  search: boolean = true;
  latActualRepartidor: number;
  lngActualRepartido: number;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private vehiculoService: VehiculoService,
    private repartidorService: RepartidorService,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.getValidations();
    this.getCatalog();
    this.fechaInicio = new Date(this.bitacoraForm.controls['date'].value);
    this.fechaInicio.setDate(this.fechaInicio.getDate());
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.search = false;
    });
    this.icon = "assets/images/mark.png";
    this.pin = "assets/images/pin.png";
  }

  private getValidations(){
    this.bitacoraForm = new FormGroup({
      date: new FormControl(new Date(), Validators.required),
      vehicles: new FormControl('', Validators.required)
    })
  }

  public onFechaInicio(event): void {
    this.fechaInicio = event.value;
  }

  private getCatalog() {
    this.vehiculoService.getVehiculosSelect().subscribe(
      (vehiculos: Vehiculo[]) => {
        // console.log(vehiculos);
        this.vehiculos = vehiculos;
      }
    );
  }
  
  private setCurrentLocation() {
    this.latitude= 21.8980987;
    this.longitude = -102.2872657;
    this.zoom = 14;
  }

  getTravels(){
    if( this.bitacoraForm.valid) {
      const format = 'yyyy-MM-dd';
      const nuevaFechaInicio = this.pipe.transform(this.fechaInicio, format);
      this.multipleDataCoordinates = [];
      this.search = true;

      const data = {
        // ...this.bitacoraForm.value,
        vehicles: [this.bitacoraForm.value.vehicles],
        date: nuevaFechaInicio
      }
    
      this.repartidorService.getLogDeliveryMan(data).subscribe(
        result => {
          this.multipleDataCoordinates = result;
          this.getMarks();
        },
        error => console.log(error)
      );
    }
  }

  getMarks() {
    this.showMarks = [];
    this.dataTable = [];
    this.search = false;
    if(this.multipleDataCoordinates[0].path.length > 0 ){
      this.zoom = 0;
      this.multipleDataCoordinates.map( data => {
        const medium = Math.round(data.path.length / 2);
        this.latitude = data.path[data.path.length - 1].location.lat;
        this.longitude = data.path[data.path.length - 1].location.lng;
        this.latActualRepartidor = data.path[data.path.length - 1].location.lat;
        this.lngActualRepartido = data.path[data.path.length - 1].location.lng;
        console.log(this.latActualRepartidor);
        console.log(this.lngActualRepartido);
        console.log(data);
        this.zoom = 20;
        data.path.map( (coordinate: Repartidor) => {
          if (coordinate.stopover === true) {
            this.showMarks = [...this.showMarks, coordinate];
            this.dataTable = [...this.dataTable,  {
              cliente: coordinate.customer,
              empleado: coordinate.employe,
              fecha: coordinate.date
            }];
          }
        });
      });
      
      // console.log(this.showMarks);
      // console.log(this.dataTable);
      this.dataSource = new MatTableDataSource(this.dataTable);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    } else {
      this.useAlerts(`No se encontró recorrido de este vehículo en esta fecha`, ' ', 'error-dialog');
      this.setCurrentLocation();
    }
  }

  markerClicked(info){
    console.log(info);
    this.previous = null;
    // this.previous = info;
    this.clienteService.getCliente(info.idCustomer).subscribe(
      (cliente: Cliente) => {
        console.log(cliente);
        let prop = 'Propietario:';
        // prop = prop.bold();
        this.previous = `${prop} ${cliente.propietario}, 
        Razón Social: ${cliente.razonSocial}, 
        Domicilio: ${cliente.calle} ${cliente.numero} ${cliente.colonia}, ${cliente.codigoPostal}, ${cliente.ciudad}.`;
      },
      error => console.log(error)
    );
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