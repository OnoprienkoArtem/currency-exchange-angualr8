import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class AppService {
  constructor(public http: HttpClient) {}

  // http://resources.finance.ua/ru/public/currency-cash.json

  getData() {
    return this.http.get(`assets/data.json`);
  }
}
