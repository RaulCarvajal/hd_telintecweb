import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfiguration } from "read-appsettings-json";
import { ITicket } from '../models/ticket.model';
import { IPlanta } from '../models/planta.model';

@Injectable({
    providedIn : 'root'
})

export class TicketService {

    private _apiUrl : string = AppConfiguration.Setting().apiendpoint;
    private _url : string = this._apiUrl + "TicketAlta"
    constructor(private http: HttpClient) {
    }

    public getPlantas() : Observable<any>    {
      return this.http.get<IPlanta[]>(this._url + "/Plantas")
             .pipe(catchError(this.handleError));
    }

    public getTikcets() : Observable<any>    {
        return this.http.get<ITicket[]>(this._url)
               .pipe(catchError(this.handleError));
    }

    public getTicketPorId(ticketId : number) : Observable<any> {
        return this.http.get<ITicket>(this._url + "/" + ticketId)
               .pipe(catchError(this.handleError));
    }

  public getTicketImage(ticketId: number): Observable<any> {
    return this.http.get<ITicket>(this._url + "/getTicketImage/" + ticketId)
      .pipe(catchError(this.handleError));
  }

    public altaTicket(ticket : any) : Observable<any> {

      let headers = new HttpHeaders();
      headers.append('Accept', 'application/json');

        return this.http.post<any>(this._url,  ticket, { headers: headers } )
                .pipe(catchError(this.handleError));
    }

    public updateTicket(ticket : any) : Observable<any> {
        return this.http.post<any>(this._url  + "/ActualizarTicket", ticket)
                .pipe(catchError(this.handleError));
    }
    public deleteTicket(ticketId: any) : Observable<any> {
        return this.http.delete<any>(this._url + "/" + ticketId)
                .pipe(catchError(this.handleError));
    }

    public cerrarTicket(ticket : any) : Observable<any> {
        return this.http.post<any>(this._url  + "/CerrarTicket",  ticket )
                .pipe(catchError(this.handleError));
    }


    public asignarResponsableTicket(ticket : any) : Observable<any> {
        return this.http.post<any>(this._url + "/AsignarResponsable",  ticket )
                .pipe(catchError(this.handleError));
    }

    public handleError(error: any | any) : any {
        return throwError(error.error || error.json() || error);
    }

}
