import { Component, OnInit, Input, HostBinding, Output } from '@angular/core';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { Dump } from '../../interfaces/dump';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  @Input() height = 100;
  @Input() width = 100;
  @Input() showGeolocation = true;
  @Input() dumps: Dump[];
  @Input() enableMarking = true;

  // TODO: change type based on our needs
  @Output() location: any;

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

  constructor(private mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnInit() {
    console.log('shared googlemap init');
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
      this.infoWindow = new google.maps.InfoWindow;
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 12
      });
      this.initMap();
      console.log('google-map dumps:', this.dumps);
    });
  }

  initMap() {
    // Try HTML5 geolocation.
    const self = this;
    // click listener for creating markers (disabled in dumps-map)
    if (this.enableMarking) {
      this.map.addListener('click', function(event) {
        self.clearMarker(self.customMarker);
        self.customMarker = self.createMarker(event.latLng, true);
        self.infoWindow.open(self.map, self.customMarker);
        console.log(self.customMarker);
      });
    }
    // show all dumps on map
    if (this.dumps) {
      this.markAllDumps();
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // set marker for your position
        if (this.showGeolocation) {
            this.myPositionMarker = this.createMarker(pos, true);
            this.infoWindow.open(self.map, this.myPositionMarker);
        }
        this.map.setCenter(pos);
      }, () => {
        this.handleLocationError(true, this.infoWindow);
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, this.infoWindow);
    }
  }

  geocodeLatLng(pos) {
    const self = this;
    this.geocoder.geocode({'location': pos}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // set address string on your marker
          self.infoWindow.setContent(results[0].formatted_address);
        } else {
          window.alert('No results found');
        }
      } else {
        self.clearMarker(self.customMarker);
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  handleLocationError(browserHasGeolocation, infoWindow) {
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }

  // creates marker and optionally shows address
  createMarker(position, showAddressInfo) {
    this.setInfoWindowToLoading();
    if (showAddressInfo) {
      this.geocodeLatLng(position);
    }
    return new google.maps.Marker({
      position,
      map: this.map,
    });
  }

  setInfoWindowToLoading() {
    this.infoWindow.setContent('Loading...');
  }

  clearMarker(marker) {
    console.log('clearing');
    if (marker) {
      marker.setMap(null);
    }
  }

  markAllDumps() {
    this.dumps.forEach(dump => console.log(dump.location));
    this.dumps.forEach(dump => {
      const pos = {
        lat: dump.location.latitude,
        lng: dump.location.longitude
      };
      this.createMarker(pos, false);
    });
    console.log('marking all dumps!');
  }

}
