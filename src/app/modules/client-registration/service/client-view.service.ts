import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ClientView, ClientDetailsView, AddressView, AccountView } from '../models/client-view.models';

@Injectable({
  providedIn: 'root'
})
export class ClientViewService {

  private baseUrl = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) { }

  getAllClientsWithFullInfo(): Observable<ClientView[]> {
    return this.http.get<ClientView[]>(this.baseUrl).pipe(
      switchMap(clients => {
        if (!clients || clients.length === 0) return of([]);

        const requests = clients.map(client =>
          forkJoin({
            details: this.getClientDetails(client.clientId).pipe(catchError(() => of(null))),
            addresses: this.getClientAddresses(client.clientId).pipe(catchError(() => of([]))),
            accounts: this.getClientAccounts(client.clientId).pipe(catchError(() => of([])))
          }).pipe(
            map(extra => ({ ...client, ...extra }))
          )
        );

        return forkJoin(requests).pipe(catchError(() => of([])));
      })
    );
  }

  private getClientDetails(clientId: number): Observable<ClientDetailsView | null> {
    return this.http
      .get<ClientDetailsView>(`${this.baseUrl}/${clientId}/details`)
      .pipe(catchError(() => of(null)));
  }

  private getClientAddresses(clientId: number): Observable<AddressView[]> {
    return this.http
      .get<AddressView[]>(`${this.baseUrl}/${clientId}/addresses`)
      .pipe(catchError(() => of([])));
  }

  private getClientAccounts(clientId: number): Observable<AccountView[]> {
    return this.http
      .get<AccountView[]>(`${this.baseUrl}/${clientId}/accounts`)
      .pipe(catchError(() => of([])));
  }
}