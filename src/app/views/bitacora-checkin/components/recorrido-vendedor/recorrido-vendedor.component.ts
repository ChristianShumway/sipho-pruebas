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
  showMarks: Repartidor[] = [];
  multipleDataCoordinates: any[] = [];
  previous: AgmInfoWindow = null;
  dataTable: any[] = [];
  displayedColumns: string[] = ['empleado', 'cliente', 'fecha'];
  dataSource = null;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private vehiculoService: VehiculoService,
    private repartidorService: RepartidorService,
    private clienteService: ClienteService
  ) {}
  
  ngOnInit() {
    this.getValidations();
    this.getCatalog();
    this.fechaInicio = new Date(this.bitacoraForm.controls['date'].value);
    this.fechaInicio.setDate(this.fechaInicio.getDate());
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
    this.icon = "./../../../../../assets/images/mark.png";
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
        console.log(vehiculos);
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

      const data = {
        // ...this.bitacoraForm.value,
        vehicles: [this.bitacoraForm.value.vehicles],
        date: nuevaFechaInicio
      }
    
      console.log(data);
      this.repartidorService.getLogDeliveryMan(data).subscribe(
        result => {
          console.log(result);
          this.multipleDataCoordinates = result;
          this.getMarks();
        },
        error => console.log(error)
      );
    }
  }

  getMarks() {
    this.multipleDataCoordinates.map( data => {
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

    console.log(this.showMarks);
    console.log(this.dataTable);
    this.dataSource = new MatTableDataSource(this.dataTable);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  markerClicked(info ){
    console.log(info);
    this.previous = info;
  }
 
}

export class Recorrido {
  constructor(public empleado: string, public cliente: string, public fecha: string) {
  }
}
