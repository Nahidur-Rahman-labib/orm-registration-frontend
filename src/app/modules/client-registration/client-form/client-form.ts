import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ClientRegistrationService } from '../service/client-registration';
import {
  CreateClientRequest,
  ClientDetailsRequest,
  AddressRequest,
  AccountRequest,
  LookupResponse
} from '../models/client-registration.models';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm implements OnInit {

  registrationForm: FormGroup;
  loading = false;
  message = '';
  isEdit = false;        // <<--- Track if we are in edit mode
  clientId: number | null = null; // <<--- Store clientId for edit

  addressTypes: LookupResponse[] = [];
  countries: LookupResponse[] = [];
  divisions: LookupResponse[] = [];
  districts: LookupResponse[] = [];
  thanas: LookupResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientRegistrationService,
    private route: ActivatedRoute,  // <<--- add this
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      client: this.fb.group({
        clientName: ['', Validators.required]
      }),
      details: this.fb.group({
        fatherName: [''],
        motherName: [''],
        gender: [''],
        dateOfBirth: [''],
        maritalStatus: [''],
        spouseName: [''],
        nid: ['']
      }),
      address: this.fb.group({
        address: [''],
        addressTypeId: [''],
        countryId: [''],
        divisionId: [''],
        districtId: [''],
        thanaId: [''],
        city: [''],
        zipCode: [''],
        mobileNo: [''],
        email: ['']
      }),
      account: this.fb.group({
        officeId: [''],
        clAccSl: [''],
        accountNo: [''],         // <--- MUST exist
        accountTitle: [''],
        accountType: [''],       // <--- MUST exist
        accountOpenDt: [''],
        effectiveDt: [''],
        expiryDt: [''],
        limitAmt: [''],
        entityId: ['']
      })
    });
  }

  ngOnInit(): void {
    this.loadLookups();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.clientId = +idParam;
        this.loadClientData(this.clientId);
      }
    });
  }
  loadClientData(clientId: number): void { // <<--- Insert this method
    this.loading = true;
    this.clientService.getClientById(clientId).subscribe({
      next: (client) => {
        this.registrationForm.get('client')?.patchValue({ clientName: client.clientName });

        // load details
        this.clientService.getClientDetails(clientId).subscribe(details => {
          this.registrationForm.get('details')?.patchValue(details);
        });

        // load address
        this.clientService.getClientAddresses(clientId).subscribe(addresses => {
          if (addresses.length > 0) {
            this.registrationForm.get('address')?.patchValue(addresses[0]);
          }
        });

        // load account
        this.clientService.getClientAccounts(clientId).subscribe(accounts => {
          if (accounts.length > 0) {
            this.registrationForm.get('account')?.patchValue(accounts[0]);
          }
        });

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load client', err);
      }
    });
  }

  loadLookups(): void {
    this.clientService.getAddressTypes().subscribe(res => this.addressTypes = res);
    this.clientService.getCountries().subscribe(res => this.countries = res);
  }

  onCountryChange(): void {
    const countryId = Number(this.registrationForm.get('address.countryId')?.value);
    this.divisions = [];
    this.districts = [];
    this.thanas = [];
    this.registrationForm.patchValue({ address: { divisionId: '', districtId: '', thanaId: '' } });
    if (!countryId) return;
    this.clientService.getDivisions(countryId).subscribe(res => this.divisions = res);
  }

  onDivisionChange(): void {
    const divisionId = Number(this.registrationForm.get('address.divisionId')?.value);
    this.districts = [];
    this.thanas = [];
    this.registrationForm.patchValue({ address: { districtId: '', thanaId: '' } });
    if (!divisionId) return;
    this.clientService.getDistricts(divisionId).subscribe(res => this.districts = res);
  }

  onDistrictChange(): void {
    const districtId = Number(this.registrationForm.get('address.districtId')?.value);
    this.thanas = [];
    this.registrationForm.patchValue({ address: { thanaId: '' } });
    if (!districtId) return;
    this.clientService.getThanas(districtId).subscribe(res => this.thanas = res);
  }

  submitForm(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.message = 'Please fill required fields.';
      return;
    }

    this.loading = true;
    this.message = '';

    const clientRequest: CreateClientRequest = this.registrationForm.get('client')?.value;
    if (this.isEdit && this.clientId) {
      // <<--- call update API instead of create
      this.clientService.updateClient(this.clientId, clientRequest).pipe(
        switchMap(() => {
          const detailsRequest: ClientDetailsRequest = {
            ...this.registrationForm.get('details')?.value,
            clientId: this.clientId!
          };
          return this.clientService.updateClientDetails(this.clientId!, detailsRequest);
        }),
        switchMap(() => {
          const addressRequest: AddressRequest = {
            ...this.registrationForm.get('address')?.value,
            clientId: this.clientId!
          };
          return this.clientService.updateClientAddress(this.clientId!, addressRequest);
        }),
        switchMap(() => {
          const accountRequest: AccountRequest = {
            ...this.registrationForm.get('account')?.value,
            clientId: this.clientId!
          };
          return this.clientService.updateClientAccount(this.clientId!, accountRequest);
        })
      ).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Client updated successfully.';
        },
        error: (err) => {
          this.loading = false;
          this.message = 'Update failed.';
          console.error(err);
        }
      });
    } else {
      // <<--- Keep your existing create flow here
      this.clientService.createClient(clientRequest).pipe(
        switchMap(clientResponse => {
          const clientId = clientResponse.clientId;
          const detailsRequest: ClientDetailsRequest = {
            ...this.registrationForm.get('details')?.value,
            clientId
          };
          return this.clientService.saveClientDetails(clientId, detailsRequest).pipe(
            switchMap(() => {
              const addressRequest: AddressRequest = {
                ...this.registrationForm.get('address')?.value,
                clientId
              };
              return this.clientService.addAddress(clientId, addressRequest);
            }),
            switchMap(() => {
              const accountRequest: AccountRequest = {
                ...this.registrationForm.get('account')?.value,
                clientId
              };
              return this.clientService.addAccount(clientId, accountRequest);
            })
          );
        })
      ).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Client registration saved successfully.';
          this.registrationForm.reset();
        },
        error: (err) => {
          this.loading = false;
          this.message = 'Save failed. Check console and backend logs.';
          console.error(err);
        }
      });
    }
  }
}