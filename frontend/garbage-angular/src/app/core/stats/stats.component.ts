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
            this.showRadarChart();
            this.showLineChart();
            this.showPieChart();
        });
    }

    ngOnDestroy() {
        unsubscribe(this.dumpsSubscription);
        unsubscribe(this.regionsSubscription);
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

    showRadarChart() {
        const regions = ['Bratislavský kraj', 'Trnavský kraj',
            'Trenčiansky kraj', 'Nitriansky kraj', 'Žilinský kraj', 'Banskobystrický kraj', 'Prešovský kraj', 'Košický kraj'];
        const EngRegions = ['Bratislava Region', 'Trnava Region', 'Trenčín Region', 'Nitra Region',
            'Žilina Region', 'Banská Bystrica Region', 'Prešov Region', 'Košice Region'];
        const reportsByRegions = new Map();
        regions.forEach(reg => {
            reportsByRegions.set(reg, 0);
        });
        this.dumps.forEach(dump => {

            if (reportsByRegions.has(dump.region)) {

                reportsByRegions.set(dump.region, reportsByRegions.get(dump.region) + 1);

            } else if (EngRegions.indexOf(dump.region) > -1) {
                reportsByRegions.set(regions[EngRegions.indexOf(dump.region)],
                    reportsByRegions.get(regions[EngRegions.indexOf(dump.region)]) + 1);
            }
        });
        const keys = Array.from(reportsByRegions.keys());
        const vals = Array.from(reportsByRegions.values());
        const ctx = document.getElementById('chart2');
        const chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: regions,
                datasets: [
                    {
                        label: 'Reported Dump Location Area',
                        data: vals,
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

    generateColors(size) {

        const colors = ['rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'];
        const borders = ['rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'];
        if (size > 6) {
            for (let i = 6; i < size; i++) {
                const r = Math.floor(Math.random() * (256));
                const g = Math.floor(Math.random() * (256));
                const b = Math.floor(Math.random() * (256));
                if (!(this.getColor(r, g, b, 0.2) in colors)) {
                    colors.push(this.getColor(r, g, b, 0.2));
                    borders.push(this.getColor(r, g, b, 1));
                }
            }
        }

        return [colors, borders];
    }

    getColor(r, g, b, alpha) {
        return 'rgba(' + r + ',' + g + ', ' + b + ', ' + alpha + ')';
    }



    showPieChart() {
        const materialCounts = new Map();
        this.dumps.forEach(el => {
            el.materials.forEach(material => {
                if (material) {
                    if (materialCounts.has(material)) {
                        materialCounts.set(material, materialCounts.get(material) + 1);
                    } else {
                        materialCounts.set(material, 1);
                    }
                }
            });

        });

        const sorted = new Map(Array.from(materialCounts.entries()).sort((a, b) => b[1] - a[1]));

        let keys = Array.from(sorted.keys());
        let vals = Array.from(sorted.values());
        if (keys.length > 10) {
            keys = keys.slice(0, 10);
            vals = vals.slice(0, 10);
        }


        const [colors, borders] = this.generateColors(materialCounts.size);
        const ctx = document.getElementById('chart4');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: keys,
                datasets: [
                    {
                        data: vals,
                        backgroundColor: colors,
                        borderColor: borders,
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
