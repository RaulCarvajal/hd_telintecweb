import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
 import { Observable } from "rxjs";

import { AppConfiguration } from "read-appsettings-json";

@Injectable({
  providedIn: "root"
})
export class ImageService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = AppConfiguration.Setting().apiImages;
  }

  uploadFile(File, ticketId): Observable<any> {
    var peticion = "api/Subir/"+ ticketId;
    var json = JSON.stringify(File);
    var headers = new HttpHeaders().set("Content-Type", "application/json");
    return this._http.post(this.url + peticion, File, { headers });
  }

  getUploads(ticketId): Observable<any> {
    var peticion = "api/ImagenesSubidas/" + ticketId;
    return this._http.get(this.url + peticion);
  }
}
