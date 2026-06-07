import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { Subject } from 'rxjs';
import {
  AccountRequest,
  AddressRequest,
  ClientDetailsRequest,
  CreateClientRequest,
  GetClientResponse,
  LookupResponse
} from '../models/client-registration.models';

@Injectable({
  providedIn: 'root'
})
export class ClientRegistrationService {
  private clientUpdated = new Subject<void>();         // <-- Add this
  clientUpdated$ = this.clientUpdated.asObservable();

  private readonly clientUrl = 'http://localhost:8080/api/clients';
  private readonly lookupUrl = 'http://localhost:8080/api/lookup';

  constructor(private http: HttpClient) { }

  createClient(request: CreateClientRequest): Observable<GetClientResponse> {
    return this.http.post<GetClientResponse>(this.clientUrl, request);
  }

  saveClientDetails(clientId: number, request: ClientDetailsRequest): Observable<any> {
    return this.http.post(`${this.clientUrl}/${clientId}/details`, request);
  }

  getAllClients(): Observable<GetClientResponse[]> {
    return this.http.get<GetClientResponse[]>(this.clientUrl);
  }

  deleteClient(clientId: number) {
    return this.http.delete(`${this.clientUrl}/${clientId}`);
  }

  addAddress(clientId: number, request: AddressRequest): Observable<any> {
    return this.http.post(`${this.clientUrl}/${clientId}/addresses`, request);
  }

  addAccount(clientId: number, request: AccountRequest): Observable<any> {
    return this.http.post(`${this.clientUrl}/${clientId}/accounts`, request);
  }

  getAddressTypes(): Observable<LookupResponse[]> {
    return this.http.get<LookupResponse[]>(`${this.lookupUrl}/address-types`);
  }

  getCountries(): Observable<LookupResponse[]> {
    return this.http.get<LookupResponse[]>(`${this.lookupUrl}/countries`);
  }

  getDivisions(countryId: number): Observable<LookupResponse[]> {
    return this.http.get<LookupResponse[]>(`${this.lookupUrl}/divisions/${countryId}`);
  }

  getDistricts(divisionId: number): Observable<LookupResponse[]> {
    return this.http.get<LookupResponse[]>(`${this.lookupUrl}/districts/${divisionId}`);
  }

  getThanas(districtId: number): Observable<LookupResponse[]> {
    return this.http.get<LookupResponse[]>(`${this.lookupUrl}/thanas/${districtId}`);
  }

  // ---------------- GET METHODS FOR EDIT PAGE ----------------
  getClientById(clientId: number) {
    return this.http.get<GetClientResponse>(`${this.clientUrl}/${clientId}`);
  }
  updateClient(clientId: number, request: CreateClientRequest) {
    return this.http.put<GetClientResponse>(`${this.clientUrl}/${clientId}`, request)
      .pipe(tap(() => this.clientUpdated.next())); // notify subscribers
  }


  getClientDetails(clientId: number) {
    return this.http.get<ClientDetailsRequest>(`${this.clientUrl}/${clientId}/details`);
  }


  updateClientDetails(clientId: number, request: ClientDetailsRequest) {
    return this.http.put<ClientDetailsRequest>(`${this.clientUrl}/${clientId}/details`, request)
      .pipe(tap(() => this.clientUpdated.next())); // notify subscribers
  }

  getClientAddresses(clientId: number): Observable<AddressRequest[]> {
    return this.http.get<AddressRequest[]>(`${this.clientUrl}/${clientId}/addresses`);
  }
  updateClientAddress(clientId: number, addressId: number, request: AddressRequest) {
    return this.http.put<AddressRequest>(`${this.clientUrl}/${clientId}/addresses/${addressId}`, request)
      .pipe(tap(() => this.clientUpdated.next())); // notify subscribers
  }

  getClientAccounts(clientId: number): Observable<AccountRequest[]> {
    return this.http.get<AccountRequest[]>(`${this.clientUrl}/${clientId}/accounts`);
  }

  updateClientAccount(clientId: number, accountId: number, request: AccountRequest) {
    return this.http.put<AccountRequest>(`${this.clientUrl}/${clientId}/accounts/${accountId}`, request)
      .pipe(tap(() => this.clientUpdated.next())); // notify subscribers
  }
}