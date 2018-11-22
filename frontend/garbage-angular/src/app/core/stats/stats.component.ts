declare const google: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Observer } from 'rxjs';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService } from '../dumps/services/dumps.service';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Chart } from 'chart.js';
import { unsubscribe } from 'src/app/shared/utils/subscription.util';



@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, OnDestroy {

    dumpsSubscription: Subscription;
    dumps: Dump[];
    geocoder: any;
    regionsSubscription: Subscription;
    regionsObservable$: Observable<number[]>;


    constructor(public mapsApiLoader: MapsAPILoader, private dumpsService: DumpsService, private wrapper: GoogleMapsAPIWrapper) {
        this.mapsApiLoader = mapsApiLoader;
        this.wrapper = wrapper;
        this.mapsApiLoader.load().then(() => {
            this.geocoder = new google.maps.Geocoder();
        });
    }

    ngOnInit() {
        this.dumpsService.getDumps();
        this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
            this.dumps = data;
            this.showDoughnutChart();
            this.regionsObservable$ = this.geocode();
            this.regionsSubscription = this.regionsObservable$.subscribe(loc_array => {
                this.showRadarChart(loc_array);
            });
            this.showLineChart();
            this.showPieChart();
        });
    }

    ngOnDestroy() {
        unsubscribe(this.dumpsSubscription);
        unsubscribe(this.regionsSubscription);
    }

    geocode(): Observable<number[]> {
        let region;
        const reportsByRegions = [0, 0, 0, 0, 0, 0, 0, 0];
        const regions = ['Bratislavský kraj', 'Trnavský kraj',
            'Trenčiansky kraj', 'Nitriansky kraj', 'Žilinský kraj', 'Banskobystrický kraj', 'Prešovský kraj', 'Košický kraj'];


        return Observable.create((observer: Observer<number[]>) => {
            // Invokes geocode method of Google Maps API geocoding.
            this.dumps.forEach(async element => {
                const loc = new google.maps.LatLng(element.location.latitude, element.location.longitude);
                this.geocoder.geocode({ location: loc }, (
                    (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[0]) {
                                if (results[0]['address_components']) {
                                    if (results[0]['address_components'][3]) {
                                        region = results[0]['address_components'][3]['long_name'];
                                        console.log(region);
                                        if (region && regions.indexOf(region) !== -1) {
                                            reportsByRegions[regions.indexOf(region)] += 1;
                                        }
                                    }
                                }
                            }
                            if (this.dumps.indexOf(element) === this.dumps.length - 1) {
                                observer.next(reportsByRegions);
                                observer.complete();
                            }
                        }
                    }
                )
                );
            });
        });
    }


    showDoughnutChart() {
        const resolved = this.dumps.filter(el => {
            return el.status === 'Resolved';
        });

        const inProcess = this.dumps.filter(el => {
            return el.status === 'In Process';
        });

        const ctx = document.getElementById('chart1');
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Resolved', 'In Process'],
                datasets: [
                    {
                        label: 'Resolving dumps',
                        data: [this.dumps.length - (resolved.length + inProcess.length), resolved.length, inProcess.length],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {

                }
            }
        });
    }

    showRadarChart(reportsByRegions) {
        const ctx = document.getElementById('chart2');
        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Bratislavský', 'Trnavský', 'Trenčiansky', 'Nitriansky', 'Žilinský', 'Banskobystrický', 'Prešovský', 'Košický'],
                datasets: [
                    {
                        label: 'Reported Dump Location Area',
                        data: reportsByRegions,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {}
            }
        });
    }

    showLineChart() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const now = new Date();
        const months = [];
        for (let index = (now.getMonth() - 5) % 12; index <= now.getMonth(); index++) {
            months.push(monthNames[index]);
        }

        const reportsByMonths = [];
        for (let i = 0; i < months.length; i++) {
            reportsByMonths[i] = 0;
            this.dumps.forEach(el => {
                if (el.timestamp.toDate().getMonth() === monthNames.indexOf(months[i])) {
                    reportsByMonths[i] += 1;
                }
            });

        }

        const ctx = document.getElementById('chart3');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: '# of Reports',
                        data: reportsByMonths,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            }
        });

    }

    showPieChart() {
        const ctx = document.getElementById('chart4');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {}
            }
        });
    }
}
