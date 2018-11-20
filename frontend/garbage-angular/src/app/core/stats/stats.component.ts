import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService } from '../dumps/services/dumps.service';
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

    constructor(private dumpsService: DumpsService) { }

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
    }

    showDoughnutChart() {
        const resolved = this.dumps.filter(el => {
            return el.status === 'resolved';
        });

        const inProcess = this.dumps.filter(el => {
            return el.status === 'inprocess';
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
        const reportsByRegions = [];
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
            console.log(reportsByMonths[i]);
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
