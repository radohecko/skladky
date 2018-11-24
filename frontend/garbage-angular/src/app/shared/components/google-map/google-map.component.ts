import { Component, OnInit, Input, HostBinding, Output } from '@angular/core';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  @Input() height = 100;
  @Input() width = 100;

  // TODO: change type based on our needs
  @Output() location: any;

  map: any;
  infoWindow: any;
  geocoder: any;

  constructor(private mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnInit() {
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

  initMap() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.infoWindow.setPosition(pos);
        this.geocodeLatLng(this.geocoder, this.map, this.infoWindow, pos);
        this.infoWindow.setContent('Your position.');
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

  geocodeLatLng(geocoder, map, infowindow, pos) {
    geocoder.geocode({'location': pos}, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          map.setZoom(11);
          const marker = new google.maps.Marker({
            position: pos,
            map: map
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(this.map);
  }

  /**
   *  TODO: Add custom marker into map with readeble location title check link
   * link - https://developers.google.com/maps/documentation/javascript/geocoding#ReverseGeocoding
   * */
  customMarker() { }

}
