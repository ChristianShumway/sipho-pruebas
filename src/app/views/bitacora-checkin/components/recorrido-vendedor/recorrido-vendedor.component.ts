import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';

declare var google;

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

interface WayPoint {
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
  idCoustomer?: number;
}

@Component({
  selector: 'app-recorrido-vendedor',
  templateUrl: './recorrido-vendedor.component.html',
  styleUrls: ['./recorrido-vendedor.component.scss']
})
export class RecorridoVendedorComponent implements OnInit, AfterViewInit {

  @ViewChild("mapa", {static: false}) public mapaId: ElementRef;
  @ViewChild("indicators", {static: false}) public indicators: ElementRef;
  map: any;
  
  rendererOptions = {
    map: this.map,
    suppressMarkers : true
  }

  directionsService = new google.maps.DirectionsService(); //controlar o calcular la ruta optima
  directionsDisplay = new google.maps.DirectionsRenderer(this.rendererOptions); //pintar la ruta optima

  origin = {lat: 21.8980987, lng: -102.2872657};
  destination = {lat: 21.8883246, lng: -102.2526027};

  wayPoints: WayPoint[] = [
    {
      location: { lat: 21.8883246, lng: -102.2526027 }, // Jardín Botánico
      stopover: true,
    },
    {
      location: { lat: 21.8954565, lng: -102.2630688 }, // Parque la 93
      stopover: true,
    },
    {
      location: { lat: 21.8886726, lng: -102.2810349}, // Maloka
      stopover: true,
    },
  ];
  
  markers: Marker[] = [
    {
      position: {
        lat: 4.658383846282959,
        lng: -74.09394073486328,
      },
      title: 'Parque Simón Bolivar'
    },
    {
      position: {
        lat: 4.667945861816406,
        lng: -74.09964752197266,
      },
      title: 'Jardín Botánico'
    },
    {
      position: {
        lat: 4.676802158355713,
        lng: -74.04825592041016,
      },
      title: 'Parque la 93'
    },
    {
      position: {
        lat: 4.6554284,
        lng: -74.1094989,
      },
      title: 'Maloka'
    },
  ];

  icons = {
    start: new google.maps.MarkerImage(
     // URL
     'assets/images/mark-home.png',
     // (width,height)
     new google.maps.Size( 44, 32 ),
     // The origin point (x,y)
     new google.maps.Point( 0, 0 ),
     // The anchor point (x,y)
     new google.maps.Point( 22, 32 )
    ),
    markCoustomer: new google.maps.MarkerImage(
     // URL
     'assets/images/mark.png',
     new google.maps.Size( 44, 32 ),
     new google.maps.Point( 0, 0 ),
     new google.maps.Point( 22, 32 )
    )
  };
  
  constructor() { }

  ngOnInit() {
    // this.loadMap();
  }
  
  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapEle = this.mapaId.nativeElement;
    const indicatorsEle = this.indicators.nativeElement;
    
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 12,
      gestureHandling: "cooperative",
    });

    this.directionsDisplay.setMap(this.map);
    // this.directionsDisplay.setPanel(indicatorsEle);
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.calculateRoute();
      // this.renderMarkers();
    });
  }

  private calculateRoute() {
    // queremos calcular una ruta
    this.directionsService.route({
      origin: this.origin,
      destination: this.origin,
      waypoints: this.wayPoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        this.directionsDisplay.setDirections(response);
        const legs = response.routes[0].legs;
        legs.map( (leg, index) => {
          if(index > 0) {
            this.makeMarker( leg.start_location, this.icons.markCoustomer, "cliente" );
          } else {
            this.makeMarker( leg.start_location, this.icons.start, "Panaderia el Horno" );            
          }
        } )
      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }

  makeMarker( position, icon, title ) {
    new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
    });
  }

  renderMarkers() {
    this.markers.forEach(marker => {
      this.addMarker(marker);
    });
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      // title:` ${marker.title} - aqui`
    });
  }

 

}
