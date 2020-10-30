import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MapsAPILoader, AgmInfoWindow } from '@agm/core';

// declare var google;

// interface Marker {
//   position: {
//     lat: number,
//     lng: number,
//   };
//   title: string;
// }

interface Coordinate {
  location: {
    lat: number,
    lng: number,
  };
  stopover: boolean;
  coustomer: string;
}

@Component({
  selector: 'app-recorrido-vendedor',
  templateUrl: './recorrido-vendedor.component.html',
  styleUrls: ['./recorrido-vendedor.component.scss']
})
export class RecorridoVendedorComponent implements OnInit, AfterViewInit {

  showMarks = [];
  
  latitude: number;
  longitude: number;
  zoom: number;
  icon;
  previous: AgmInfoWindow = null;
  multipleDataCoordinates: any[] = [];

  dataCoordinates: Coordinate[] = [
    {
      location: { lat:21.8883246, lng:-102.2526027},
      stopover: true,
      coustomer: 'direcion 1'
    },
    {
      location: { lat:21.8954565, lng:-102.2630688},
      stopover: false,
      coustomer: 'direcion 2'
    },
    {
      location: { lat:21.8886726, lng:-102.2810349},
      stopover: false,
      coustomer: 'direcion 3'
    },
    {
      location: { lat:21.8794157, lng: -102.300542},
      stopover: true,
      coustomer: 'direcion 1'
    },
    {
      location: { lat:21.8776983, lng:-102.2966796},
      stopover: false,
      coustomer: 'direcion 1'
    },
    {
      location: { lat:21.8532776, lng:-102.2727224},
      stopover: true,
      coustomer: 'direcion 1'
    },
    {
      location: { lat:21.8563518, lng:-102.2619972},
      stopover: false,
      coustomer: 'direcion 1'
    },
    {
      location: { lat:21.8683988, lng:-102.2674488},
      stopover: true,
      coustomer: 'direcion 1'
    }
  ];

  dataCoordinates2: Coordinate[] = [
    {
      location: { lat:21.8735218, lng:-102.2804503},
      stopover: true,
      coustomer: 'direcion 1'
    },
    {
      location: { lat:21.8950816, lng:-102.3235301},
      stopover: true,
      coustomer: 'direcion 2'
    },
    {
      location: { lat:21.8928343, lng:-102.3186324},
      stopover: false,
      coustomer: 'direcion 3'
    },
    {
      location: { lat:21.8996034, lng:-102.3118032},
      stopover: true,
      coustomer: 'direcion 4'
    }
  ];
  
 
  constructor(
    private mapsAPILoader: MapsAPILoader,

  ) {}
  
  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });

    this.icon = "./../../../../../assets/images/mark.png";

    this.multipleDataCoordinates = [
      {
        path: this.dataCoordinates,
        color: 'red'
      },
      {
        path: this.dataCoordinates2,
        color: 'blue'
      }
    ];
  }
  
  ngAfterViewInit() {
    // this.loadMap();
  }
  
  private setCurrentLocation() {
    this.latitude= 21.8980987;
    this.longitude = -102.2872657;
    this.zoom = 14;
    this.getMarks();
    
  }

  getMarks() {
    this.multipleDataCoordinates.map( data => {
      data.path.map( (coordinate: Coordinate) => {
        if (coordinate.stopover === true) {
          this.showMarks = [...this.showMarks, coordinate];
        }
        // console.log(this.showMarks);
      });
    });
  }


  showInfo(info) {
    console.log(info);
    if (this.previous) {
      this.previous.close();
  }
  this.previous = info;
  }

  markerClicked(info ){
    console.log(info);
    this.previous = info;
  }
 

}
