import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Subscription } from 'rxjs';
import { Dump } from 'src/app/shared/interfaces/dump';
import { DumpsService } from '../dumps/services/dumps.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  
  dumpsSubscription: Subscription;
  dumps: Dump[];
  

  constructor(private dumpsService: DumpsService) { }

  private getData() {
    this.dumpsService.getDumps();
    this.dumpsSubscription = this.dumpsService.dumpsObservable$.subscribe(data => {
      this.dumps = data;
      this.showStats();
    });
    
  }


  private showStats(){
    var Resolved = this.dumps.filter(function(el){
      return el.status == "resolved";
     })

    var InProcess = this.dumps.filter(function(el){
      return el.status == "inprocess";
      })

   var ctx = document.getElementById("chart1");
   var chart1 = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Pending", "Resolved", "In Process"],
        datasets: [{
            label: 'Resolving dumps',
            data: [this.dumps.length-(Resolved.length+InProcess.length),Resolved.length,InProcess.length],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                
                
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
              
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
           
        }
    }
  }); 

  var reports_by_regions = [];
  // this.dumps.forEach(el => {
    
  // });



  var ctx = document.getElementById("chart2");
  var chart4 = new Chart(ctx, {
  type: 'radar',
  data: {
      labels: ["Bratislavský", "Trnavský","Trenčiansky","Nitriansky", "Žilinský","Banskobystrický","Prešovský","Košický"],
      datasets: [{
          label: 'Reported Dump Location Area',
          data: reports_by_regions,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
          ],
          borderColor: [
              
            'rgba(75, 192, 192, 1)',
          
          ],
          borderWidth: 1
      }]
  },
  options: {
      scales: {
        
      }
  }
  }); 
  

const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
var now = new Date();
var months = [];
for (let index = (now.getMonth()-5)%12; index <= now.getMonth(); index++) {
  months.push(monthNames[index]);
}

var reports_by_months = [];
for (let i = 0; i < months.length; i++)  {
  reports_by_months[i] = 0;
  this.dumps.forEach(el => {
    
    if (el.timestamp.toDate().getMonth()== monthNames.indexOf(months[i])){
      reports_by_months[i] += 1;
    }

  });

console.log(reports_by_months[i]);
};


      var ctx = document.getElementById("chart3");
      var chart3 = new Chart(ctx, {
      type: 'line',
      data: {
          labels: months,
          datasets: [{
              label: '# of Reports',
              data: reports_by_months,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                 
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      
                      beginAtZero:true
                  }
              }]
          }
      }
      }); 

      var ctx = document.getElementById("chart4");
  var chart2 = new Chart(ctx, {
  type: 'pie',
  data: {
     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
     datasets: [{
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
     }]
      },
    options: {
        scales: {
            
        }
    }
  }); 

     


  }


  ngOnInit() {
    
  this.getData();    


  }
}

