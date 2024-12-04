import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = '/api'

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http:HttpClient) { }

  createDriver(driver: any) {
    return this.http.post(API_URL + '/drivers/add', driver, httpOptions);
  }

  getDrivers() {
    return this.http.get(API_URL + '/drivers');
  }

  deleteDriver(id: string) {
    console.log(id)
    return this.http.delete(API_URL + '/drivers/delete/' + id);
  }

  updateDriver(id: string, driver_licence: string, driver_department: string) {
    let body = { id, driver_licence, driver_department };
    return this.http.put(API_URL + '/drivers/update/', body, httpOptions);
  }

  createPackage(thePackage: any) {
    return this.http.post(API_URL + '/packages/add', thePackage, httpOptions);
  }

  getPackages() {
    return this.http.get(API_URL + '/packages');
  }

  deletePackage(id: string) {
    return this.http.delete(API_URL + '/packages/delete/' + id);
  }

  updatePackage(id: string, package_destination: string) {
    let body = { id, package_destination };
    return this.http.put(API_URL + '/packages/update/', body, httpOptions);
  }

  getStatistics() {
    return this.http.get(API_URL + '/stats');
  }
}
