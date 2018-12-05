import { Component, OnInit, Input, HostBinding, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { Dump } from '../../interfaces/dump';
import { GoogleLocation } from '../../interfaces/location';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})

export class GoogleMapComponent implements OnChanges, OnInit {

  @Input() height = 100;
  @Input() width = 100;
  @Input() dumps: Dump[];
  @Input() filteredDumps: Dump[];
  @Input() enableMarking = true;
  @Input() zoom = 12;

  // TODO: change type based on our needs
  @Output() location: EventEmitter<any> = new EventEmitter();

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
    this.dumpMarkers = [];
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
      this.infoWindow = new google.maps.InfoWindow;
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 48.155527, lng: 17.106345 },
        zoom: 11
      });
      this.initMap();
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.map && changes.map.currentValue !== changes.map.previousValue) {
      this.dumps = this.filteredDumps;
      this.markAllDumps();
    }
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

        if (this.dumps) {
          this.markAllDumps();
        }
      }, () => {
        this.handleLocationError(true, this.infoWindow);
      });
    } else {
      // Browser doesn't support Geolocation
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

  // creates marker, optional: sets icon, optional: shows address
  createMarker(position, icon, showAddressInfo, setInfoContent) {
    if (setInfoContent) {
      this.setInfoWindowToLoading();
    }
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

  clearAllMarkers() {
    if (this.dumpMarkers) {
      this.dumpMarkers.forEach(marker => this.clearMarker(marker));
      this.dumpMarkers.splice(0, this.dumpMarkers.length);
    }
  }

  markAllDumps() {
    this.clearAllMarkers();
    this.dumps.forEach(dump => {
      const pos = {
        lat: dump.location.latitude,
        lng: dump.location.longitude
      };
      const icon = this.getMarkerIconByStatus(dump.status);
      const newMarker = this.createMarker(pos, icon, false, false);
      this.dumpMarkers.push(newMarker);
    });
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
