import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';;

export interface weatherStructure{
  base : string;
  clouds : {
    all : number
  };
  cod : number;
  coord : {
    lat : number,
    lon : number
  };
  dt : number;
  id :  number;
  main : {
    feels_like : number,
    humidity : number,
    pressure :number,
    temp : number,
    temp_max : number,
    temp_min : number
  };
  name : string;
  sys : {
    country : string,
    id : number,
    sunrise : number,
    sunset : number,
    type : number
  };
  timezone : number;
  visibility : number;
  weather:{
    description : string,
    icon :string,
    id : number,
    main : string
  }[];
  wind : {
    deg : number,
    speed : number
  }
}


@Injectable({
  providedIn: 'root'
})
export class WeatherServicesService {

  constructor(private http1 : HttpClient) { }

  fetchWeather(lat:any , lon : any){
    return this.http1.get<weatherStructure>('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=437ba892570999809dc9c6390fc0e648').pipe((res)=>{
      console.log(res,"weather response");
      return res;
    })
    // e18703f023fd0ce048bfe8e2229b5170
  } 
  fetchCities(){
    return this.http1.get('https://gist.githubusercontent.com/imRAN-1998/6fbceb7a6a6e797208e9dd28b98d694e/raw/d45aad89f1020b7b11de959ec25e99e439ffdd3e/gistfile1.txt')
  }
}
