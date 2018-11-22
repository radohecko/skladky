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

  constructor(private mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnInit() {
    this.mapsApiLoader.load().then(() => {
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
        this.infoWindow.setContent('Location found.');
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
