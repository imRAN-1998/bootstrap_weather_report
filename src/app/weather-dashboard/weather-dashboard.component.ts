import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, merge } from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';

import { WeatherServicesService, weatherStructure } from '../weather-services.service';

declare var $: any;

@Component({
  selector: 'app-weather-dashboard',
  templateUrl: './weather-dashboard.component.html',
  styleUrls: ['./weather-dashboard.component.css'],
})
export class WeatherDashboardComponent implements OnInit {

  @ViewChild('temp1',{static:true}) temp1 : ElementRef;
  @ViewChild('temp_min',{static:true}) temp_min : ElementRef;
  @ViewChild('temp_max',{static:true}) temp_max : ElementRef;
  @ViewChild('texty',{static:true}) texty : ElementRef;
  @ViewChild('virtual',{static : true}) virtual1 : ElementRef;
  @ViewChild('deg_virtual',{static:true}) deg_virtual1 : ElementRef;

  @ViewChild('dataTable',{static:true}) table : ElementRef;
  dataTable: any;

  constructor(private service1 : WeatherServicesService) { }

  public citiesArray ;
  public cityArray : weatherStructure[];
 
  public model: string ='';
  public states : string[]= [];
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? ''
        : this.states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  public doughnutChartLabels = ['cloudy %','non cloudy %'];
  public doughnutChartData = [20, 80];
  public doughnutChartType = 'doughnut';
  public chartColors: Array<any> = [
    {
      backgroundColor: ['#161240', '#7da1d4']
    }
]

  public temp_avg_v : number = 20;
  public temp_max_v : number = 30;
  public temp_min_v : number = 10;

  public wind_speed : string = '0';

  public createdTable : any;
  ngOnInit(): void {
    
    // this.service1.fetchWeather().subscribe(data=>{
    //   console.log(data,"weather details");
    // })
    console.log(this.table);
    this.createdTable=$(this.table.nativeElement).DataTable();
    console.log(this.virtual1,"this.virtual1");
    this.winddirection(270,this.virtual1,this.deg_virtual1);
    this.meterPerSec(1.09,this.texty);
    console.log(this.texty);
    this.increaseTemp(this.temp1,203,5);
    this.increaseTemp(this.temp_min,103,1);
    this.increaseTemp(this.temp_max,273,3);
    console.log(this.temp1);
    this.service1.fetchCities().subscribe(data=>{
      console.log(data,"cities");
      console.log(new Date(1605227822 * 1000));
      console.log(	Math.floor(new Date().getTime()/1000.0))
      this.citiesArray=data;
      this.citiesArray.forEach(dt=>{
        this.states.push(dt.city.name);
      })
      this.states.sort((a,b)=>{
        if(a > b){
          return 1;
        }else{
          return -1;
        }
      })
      // this.datatable(this.citiesArray);
    })
  }
  searchWeatherData(){
    this.doughnutChartData=[];
    this.citiesArray.forEach(data=>{
      if(data.city.name.toLowerCase().indexOf(this.model.toLowerCase()) > -1){
        this.cityArray=[];
        console.log(data);
        this.service1.fetchWeather(data.city.coord.lat,data.city.coord.lon).subscribe(weatherData=>{
          console.log(weatherData,"weather for the city");
          if(this.createdTable){
            this.createdTable.clear();
            this.createdTable.destroy();
          }
          this.cityArray.push(weatherData);
          console.log(this.table.nativeElement,"inside serachhhh");
          setTimeout(()=>{
          this.createdTable = $(this.table.nativeElement).DataTable();
          },100)
          console.log(this.table.nativeElement,"inside serachhhh 22222");
          this.winddirection(weatherData.wind.deg,this.virtual1,this.deg_virtual1);
          this.meterPerSec(weatherData.wind.speed,this.texty);
          const cloud_per = weatherData.clouds.all;
          const cloud_rem = Math.abs(100 - cloud_per);
          console.log(cloud_per,cloud_rem);
          this.doughnutChartData = [cloud_per,cloud_rem];
          this.temp_avg_v = Math.floor(weatherData.main.temp - 273);
          this.temp_min_v = Math.floor(weatherData.main.temp_min -273 - 10);
          this.temp_max_v = Math.floor(weatherData.main.temp_max - 273  + 10);
          this.increaseTemp(this.temp1,Math.floor(weatherData.main.temp - 173),10);
          this.increaseTemp(this.temp_min,Math.floor(weatherData.main.temp - 200),10);
          this.increaseTemp(this.temp_max,Math.floor(weatherData.main.temp - 140),10);
          // this.meterPerSec(1.6);
        })
      }
    })
  }
  // public pos1=0;
  // public id1;
   increaseTemp(temps,val,speed){
     console.log(temps,val);
    var pos = 0;
    var id1 = setInterval(frame, speed);
    function frame(){
      // console.log('hhh');
      if(pos >= val){
        clearInterval(id1);
      }else{
        pos++;
        temps.nativeElement.style.height=pos+'px';
      }
    }
   }
   meterPerSec(num,data){
     console.log(data.nativeElement.textContent);
    const var1 = num;
    const f_1 = Math.floor(var1);
    const val1 = var1 * 100;
    const s_1 = val1 %100;
    // console.log(f_1,s_1);
    var pos = 0;
    let i=0,j=0;
    var id1 = setInterval(frame1, 20);
    function frame1(){
      // console.log('numbs');
      if(pos > val1){
        clearInterval(id1);
      }else{
        pos++;
        let p;
        if(j>=0&&j<=9){
          p="0" + j;
        }else{
          p=j;
        }
        // console.log(i,j)
        data.nativeElement.textContent=`${i}.${p} m/s`;
        // this.wind_speed=`${i}.${j}`;
        j++;
        if(j==100){
          j=0;
          i++;
        }
      }
    }
   }

   winddirection(deg,loc_virtual,deg_v){
    let pos2=0;
    var id2 = setInterval(frame2, 1);
    function frame2(){
      // console.log('hhh');
      if(pos2 >= deg){
        clearInterval(id2);
      }else{
        loc_virtual.nativeElement.style.transform="rotate(" + pos2 + "deg)";
        deg_v.nativeElement.textContent=pos2+1;      
        pos2++;
      }
    }
   }
   public anime1 : boolean = true;
   public datatable1 : boolean = false;

   anime(){
     this.anime1 = true;
     this.datatable1 = false;
   }
   datatable(){
    //  this.dataTable.DataTable().destroy();
    this.anime1 = false;
    this.datatable1 = true;
    console.log(this.table);
    //  this.dataTable.DataTable();
   }

   viewDataTable(){
    $(document).ready(function() {
      $('#example').DataTable();
  } )
   }

}
