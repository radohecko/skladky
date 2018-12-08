import { Component, OnInit, Input, EventEmitter, Output, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
import { Dump } from 'src/app/shared/interfaces/dump';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { GoogleLocation } from 'src/app/shared/interfaces/location';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dump-map',
  templateUrl: './dump-map.component.html',
  styleUrls: ['./dump-map.component.scss']
})
export class DumpMapComponent implements OnInit, OnChanges {

  @Input() height = 100;
  @Input() width = 100;
  @Input() dumps: Dump[];
  @Input() enableMarking = true;
  @Input() dump: Dump;
  @Input() zoom = 12;
  @Input() searchAddress: string;

  @Output() location: EventEmitter<GoogleLocation> = new EventEmitter();
  @Output() predictedLocations: EventEmitter<String[]> = new EventEmitter();

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

  // my position - Google location object
  myCurrentPosition: GoogleLocation;

  icons = {
    MY_POSITION: '../../../../assets/my_position.png',
    DUMP_PENDING: '../../../../assets/pending.png',
    DUMP_IN_PROCESS: '../../../../assets/in_process.png',
    DUMP_RESOLVED: '../../../../assets/resolved.png'
  };

  constructor(private mapsApiLoader: MapsAPILoader, private wrapper: GoogleMapsAPIWrapper, private httpClient: HttpClient) {
    this.mapsApiLoader = mapsApiLoader;
    this.wrapper = wrapper;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchAddress && changes.searchAddress.currentValue !== changes.searchAddress.previousValue) {
      this.makeApiCall(this.searchAddress, this.handlePredictionsResponse);
      this.geocodeAddress(this.searchAddress);
    }
  }

  ngOnInit() {
    let pos: { lat: number, lng: number } | null = null;
    if (this.dump) {
      pos = {
        lat: this.dump.location.latitude,
        lng: this.dump.location.longitude,
      };
    }
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder;
      this.infoWindow = new google.maps.InfoWindow;
      this.map = new google.maps.Map(document.getElementById('DumpMap'), {
        center: { lat: 48.155527, lng: 17.106345 },
        zoom: this.zoom
      });

      this.initMap(pos);
    });
  }

  initMap(dumpPosition: { lat: number, lng: number } | null = null) {
    const self = this;
    if (this.enableMarking) {
      this.map.addListener('click', function (event) {
        self.clearMarker(self.customMarker);
        const pos = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        self.customMarker = self.createMarker(pos, null, true, true);
        self.infoWindow.open(self.map, self.customMarker);
      });
    }
    if (dumpPosition) {
      self.customMarker = self.createMarker(dumpPosition, null, true, true);
      self.infoWindow.open(self.map, self.customMarker);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.myPositionMarker = this.createMarker(pos, this.icons.MY_POSITION, true, true);
          this.myPositionMarker.addListener('click', function () {
            self.geocodeLatLng(pos, true);
            self.infoWindow.open(self.map, self.myPositionMarker);
            self.clearMarker(self.customMarker);
          });
          this.infoWindow.open(self.map, this.myPositionMarker);
          this.map.setCenter(pos);
        }, () => {
          this.handleLocationError(true, this.infoWindow);
        });
      } else {
        this.handleLocationError(false, this.infoWindow);
      }
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
            console.error(e);
          }
          self.infoWindow.setContent(results[0].formatted_address);
        } else {
          window.alert('No results found');
        }
      } else {
        self.clearMarker(self.customMarker);
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  makeApiCall(address: string, responseHandler: any) {
    // this.loading = true;
    const options = {
      withCredentials: false,
    };
    const queryOptions = {
      input: address,
      key: environment.firebase.apiKey,
      types: 'address'
    };
    this.addGranularOptions(queryOptions);
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com';
    const API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete';
    const BASE_URL = corsProxyUrl + '/' + API_URL;
    const queryString = this.encodeQuery(queryOptions);
    const callUrl = BASE_URL + '/json?' + queryString;
    this.httpClient.get(callUrl, options)
      .toPromise()
      .then((response: any) => {
        this.handlePredictionsResponse(response);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  encodeQuery(data: any) {
    const ret = [];
    for (const d of Object.keys(data)) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
  }

  addGranularOptions(queryOptions: any) {
    // set predictions near your current position
    if (this.myCurrentPosition) {
      const latStr = this.myCurrentPosition.lat.toString();
      const lngStr = this.myCurrentPosition.lng.toString();
      queryOptions.location = [latStr, lngStr];
    } else { // without current position - set near bratislava
      queryOptions.location = ['48.155527', '17.106345'];
    }
    queryOptions.radius = 1;
    // queryOptions.strictbounds = true;
  }

  handlePredictionsResponse(response: any) {
    if (response && response.predictions.length > 0) {
      this.predictedLocations.emit(response.predictions);
    }
  }

  geocodeAddress(address: string) {
    const self = this;
    this.geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === 'OK') {
        const region = self.getRegion(results[0].address_components)[0]['long_name'];
        const data: GoogleLocation = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          region: region,
          adressName: results[0].formatted_address.toString()
        };
        self.initMap({ lat: data.lat, lng: data.lng });
        self.location.emit(data);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
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
