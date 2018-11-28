import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { GoogleLocation } from 'src/app/shared/interfaces/location';

@Component({
  selector: 'app-dump-map',
  templateUrl: './dump-map.component.html',
  styleUrls: ['./dump-map.component.scss']
})
export class DumpMapComponent implements OnInit {

  @Input() height = 100;
  @Input() width = 100;
  @Input() dumps: Dump[];
  @Input() dump: Dump;
  @Input() enableMarking = true;
  @Input() zoom = 12;

  @Output() location: EventEmitter<GoogleLocation> = new EventEmitter();

  // google map
  map: google.maps.Map;

  // info window used to show address
  infoWindow: google.maps.InfoWindow;

  // gets string address from position
  geocoder: any;

  // markers
  customMarker: google.maps.Marker;
  myPositionMarker: google.maps.Marker;
  dumpMarkers: google.maps.Marker[];

  icons = {
    MY_POSITION: '../../../../assets/my_position.png',
    DUMP_PENDING: '../../../../assets/pending.png',
    DUMP_IN_PROCESS: '../../../../assets/in_process.png',
    DUMP_RESOLVED: '../../../../assets/resolved.png'
  };

  constructor(private mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnInit() {
    // TODO: set marker based on dump.location
    if (this.dump) {
      // init map with marker
    }
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
      this.infoWindow = new google.maps.InfoWindow;
      this.map = new google.maps.Map(document.getElementById('DumpMap'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: this.zoom
      });
      this.initMap();
    });
  }

  initMap() {
    const self = this;
    if (this.enableMarking) {
      this.map.addListener('click', function (event) {
        self.clearMarker(self.customMarker);
        self.customMarker = self.createMarker(event.latLng, null, true, true);
        self.infoWindow.open(self.map, self.customMarker);
      });
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.myPositionMarker = this.createMarker(pos, this.icons.MY_POSITION, true, true);
        this.infoWindow.open(self.map, this.myPositionMarker);
        this.map.setCenter(pos);
      }, () => {
        this.handleLocationError(true, this.infoWindow);
      });
    } else {
      this.handleLocationError(false, this.infoWindow);
    }
  }

  getRegion(array) {
    return array.filter(o =>
      Object.keys(o).some(k => o[k].includes('Region') || o[k].includes('kraj')));
  }

  geocodeLatLng(pos, setInfoContent) {
    const self = this;
    this.geocoder.geocode({ 'location': pos }, function (results, status) {
      if (status === 'OK') {
        if (results[0]) {
          try {
            const region = self.getRegion(results[0].address_components)[0]['long_name'];
            const data: GoogleLocation = {
              lat: pos.lat,
              lng: pos.lng,
              region: region,
              adressName: results[0].formatted_address.toString()
            };
            self.location.emit(data);
          } catch (e) {
            console.log(e);
          }
          if (setInfoContent) {
            self.infoWindow.setContent(results[0].formatted_address);
          }
        } else {
          window.alert('No results found');
        }
      } else {
        self.clearMarker(self.customMarker);
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  handleLocationError(browserHasGeolocation, infoWindow) {
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }

  createMarker(position, icon, showAddressInfo, setInfoContent) {
    this.setInfoWindowToLoading();
    if (showAddressInfo) {
      this.geocodeLatLng(position, setInfoContent);
    }
    return new google.maps.Marker({
      position,
      map: this.map,
      icon
    });
  }

  setInfoWindowToLoading() {
    this.infoWindow.setContent('Loading...');
  }

  clearMarker(marker) {
    if (marker) {
      marker.setMap(null);
    }
  }

  getMarkerIconByStatus(status) {
    switch (status) {
      case 'In Process':
        return this.icons.DUMP_IN_PROCESS;
      case 'Resolved':
        return this.icons.DUMP_RESOLVED;
      case 'Pending':
        return this.icons.DUMP_PENDING;
    }
  }

}
