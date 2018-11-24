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
  @Input() data: Dump[];
  @Input() showGeolocation = true;

  // TODO: change type based on our needs
  @Output() location: any;

  map: any;
  infoWindow: any;
  geocoder: any;
  customMarker: any;
  myPositionMarker: any;

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
    });
  }

  getMapComponent() {
    return {'map': this.map, 'infoWindow': this.infoWindow, 'geocoder': this.geocoder};
  }

  initMap() {
    // Try HTML5 geolocation.
    const self = this;
    // click listener for creating markers
    this.map.addListener('click', function(event) {
      self.clearMarker(self.customMarker);
      self.customMarker = self.createMarker(event.latLng);
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // set marker for your position
        if (this.showGeolocation) {
            this.myPositionMarker = this.createMarker(pos);
        } else {
          this.infoWindow.setContent('Your position.');
        }
        this.infoWindow.open(this.map);
        this.map.setCenter(pos);
      }, () => {
        this.handleLocationError(true, this.infoWindow, this.map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, this.infoWindow, this.map.getCenter());
    }
  }

  geocodeLatLng(geocoder, map, infowindow, pos, createMarker) {
    const self = this;
    geocoder.geocode({'location': pos}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // set address string on your marker
          infowindow.setContent(results[0].formatted_address);
          infowindow.setPosition(pos);
        } else {
          window.alert('No results found');
        }
      } else {
        self.clearMarker(self.customMarker);
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }

  createMarker(position) {
    this.geocodeLatLng(this.geocoder, this.map, this.infoWindow, position, false);
    return new google.maps.Marker({
      position,
      map: this.map
    });
  }

  clearMarker(marker) {
    console.log('clearing');
    if (marker) {
      marker.setMap(null);
    }
  }
}
