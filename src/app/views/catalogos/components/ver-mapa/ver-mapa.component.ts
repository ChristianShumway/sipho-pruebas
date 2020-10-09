import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MapsAPILoader, MouseEvent, AgmMap } from '@agm/core';

// import * as L from 'leaflet';
// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// const provider = new OpenStreetMapProvider();
// const provider = new GeoSearch.OpenStreetMapProvider;
// const searchControl = new GeoSearchControl({
//   provider: provider,
// });



@Component({
  selector: 'app-ver-mapa',
  templateUrl: './ver-mapa.component.html',
  styleUrls: ['./ver-mapa.component.scss']
})
export class VerMapaComponent implements OnInit {
  // private map;

  @ViewChild('search', {static: true})
  public searchElementRef: ElementRef;
  @ViewChild('direccion', {static: true})
  public direccion: ElementRef;
  @ViewChild(AgmMap, {static: true}) map: AgmMap;

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;



  constructor(
    private bottomSheetRef: MatBottomSheetRef<VerMapaComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private snackBar: MatSnackBar,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    // this.bottomSheetRef.dismiss();
     //load Places Autocomplete


    //  this.mapsAPILoader.load().then(() => { 
    //   this.geoCoder = new google.maps.Geocoder;
    //   this.setCurrentLocation();

    //   const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       //get the place result
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       console.log(place);
    //       //verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }

    //       for (var i = 0; i < place.address_components.length; i++) {
    //         let addressType = place.address_components[i].types[0];
    //         //if (componentForm[addressType]) {
    //         //  var val = place.address_components[i][componentForm[addressType]];
    //         //  document.getElementById(addressType).value = val;
    //         //}
    //         // for the country, get the country code (the "short name") also
    //         console.log(addressType);
    //         if (addressType == "country") {
    //           console.log(place.address_components[i].short_name);
    //           console.log(place.address_components[i].long_name);
    //         }
    //         else{
    //           console.log('---others---');
    //           console.log(place.address_components[i].short_name);
    //           console.log(place.address_components[i].long_name);
    //         }
    //       }

    //       //set latitude, longitude and zoom
    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     }); 
    //   });
    // });
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        // this.latitude =position.coords.latitude;
        // this.longitude =position.coords.longitude;
        this.defaultPos();
        this.getAddress(this.latitude, this.longitude);
        this.zoom = 20;
      }, function(objPositionError){
        switch (objPositionError.code){
          
          case objPositionError.PERMISSION_DENIED:
            this.useAlerts('No se ha permitido el acceso a la posición del usuario', ' ', 'error-dialog');
            break;

          case objPositionError.POSITION_UNAVAILABLE:
            this.useAlerts('No se ha podido acceder a la información de su posición', ' ', 'error-dialog');
            break;

          case objPositionError.TIMEOUT:
            this.useAlerts('El servicio ha tardado demasiado tiempo en responder', ' ', 'error-dialog');
            break;
          
          default:
            this.useAlerts('Error desconocido', ' ', 'error-dialog');
        }
      }, {
        timeout: 50000
      });
      
    } else { 
      this.defaultPos();
      this.useAlerts('Su navegador no soporta la API de geolocalización', ' ', 'error-dialog');
    }
    
    // this.defaultPos();
    // this.getAddress(this.latitude, this.longitude);
    // this.zoom = 20;
  }

  private defaultPos(){
    this.latitude = this.data.latitude;
    this.longitude = this.data.longitude;
  }

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
    console.log(this.latitude);
    console.log(this.longitude);
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 16;
          this.direccion.nativeElement.innerHTML = results[0].formatted_address;
          this.address = results[0].formatted_address;
          console.log(this.address);
        } else {
          this.useAlerts('Resultados no encontrados', ' ', 'error-dialog');
          
        }
      } else {
        // window.alert('Geocoder fall debido a: ' + status);
        this.useAlerts(`Geocoder falló debido a ${status}`, ' ', 'error-dialog');
      }
 
    });
  }

  obtenerUbicacionCoord(event){
    let lat;
    let lon;
    
    if(event.target.name === 'latitud'){
      lat = parseFloat(event.target.value);
      lon = this.longitude;
    } else if(event.target.name === 'longitud'){
      lat = this.latitude;
      lon = parseFloat(event.target.value);
    }

    this.latitude=lat;
    this.longitude=lon;
    this.getAddress(lat, lon);
  }

  sendLatLon() {
    this.bottomSheetRef.dismiss({latitude:this.latitude, longitude: this.longitude});
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
