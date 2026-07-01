import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap, forkJoin } from 'rxjs';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { ClientRegistrationService } from '../service/client-registration';
import {
  CreateClientRequest,
  ClientDetailsRequest,
  AddressRequest,
  AccountRequest,
  LookupResponse
} from '../models/client-registration.models';
import { TextBoxComponent } from '../../../shared/components/text-box/text-box.component';

type PanelKey = 'client' | 'details' | 'address' | 'account';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.html',
  styleUrls: ['./client-form.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TextBoxComponent, DatePickerComponent]
})

export class ClientForm implements OnInit {

  registrationForm: FormGroup;
  loading = false;
  message = '';
  isEdit = false;
  clientId: number | null = null;
  currentAddressId: number | null = null;
  currentAccountId: number | null = null;

  addressTypes: LookupResponse[] = [];
  countries: LookupResponse[] = [];
  divisions: LookupResponse[] = [];
  districts: LookupResponse[] = [];
  thanas: LookupResponse[] = [];

  // Tracks which accordion panels are expanded. All open by default,
  // matching the form's original always-visible layout.
  panelState: Record<PanelKey, boolean> = {
    client: true,
    details: true,
    address: true,
    account: true
  };

  readonly today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  constructor(
    private fb: FormBuilder,
    private clientService: ClientRegistrationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      client: this.fb.group({
        clientName: ['', [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z\s]+$/)
        ]]
      }),
      details: this.fb.group({
        fatherName: ['', [Validators.required, Validators.minLength(2)]],
        motherName: ['', [Validators.required, Validators.minLength(2)]],
        gender: [''],
        dateOfBirth: ['', [Validators.required]],
        maritalStatus: [''],
        spouseName: [''],
        nid: ['', [Validators.required, Validators.pattern('\\d{5,20}')]]
      }),
      address: this.fb.group({
        address: [''], addressTypeId: [''], countryId: [''], divisionId: [''],
        districtId: [''], thanaId: [''], city: [''], zipCode: [''], mobileNo: [''], email: ['']
      }),
      account: this.fb.group({
        officeId: ['', Validators.required],
        clAccSl: ['', Validators.required],
        accountNo: ['', Validators.required],
        accountTitle: ['', Validators.required],
        accountType: ['', Validators.required],
        accountOpenDt: ['', Validators.required],
        effectiveDt: [''],
        expiryDt: [''],
        limitAmt: ['', Validators.required],
        entityId: [''],
        approveFlag: [''],
        recordUserId: [''],
        recordDt: ['']
      })
    });
  }
  // Add this helper method to your component
  private toDateInput(value: any): string {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // → "YYYY-MM-DD"
  }

  ngOnInit(): void {
    this.loadLookups();

    this.route.paramMap.subscribe((params: ParamMap) => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.clientId = +idParam;
        this.loadClientData(this.clientId);
      }
    });
  }

  // Expands or collapses one accordion panel. Bound to each panel-header's
  // click/keyboard handler in the template.
  togglePanel(section: PanelKey): void {
    this.panelState[section] = !this.panelState[section];
  }

  loadLookups(): void {
    this.clientService.getAddressTypes().subscribe(res => this.addressTypes = res);
    this.clientService.getCountries().subscribe(res => this.countries = res);
  }

  loadClientData(clientId: number) {
    this.loading = true;

    forkJoin({
      client: this.clientService.getClientById(clientId),
      details: this.clientService.getClientDetails(clientId),
      addresses: this.clientService.getClientAddresses(clientId),
      accounts: this.clientService.getClientAccounts(clientId)
    }).subscribe({
      next: ({ client, details, addresses, accounts }) => {
        this.registrationForm.get('client')?.patchValue({ clientName: client.clientName });
        this.registrationForm.get('details')?.patchValue({
          ...details,
          dateOfBirth: this.toDateInput(details.dateOfBirth)
        });
        if (addresses.length > 0) {
          this.currentAddressId = addresses[0].addressId ?? null; // <-- fix addressId
          this.registrationForm.get('address')?.patchValue(addresses[0]);
        }

        if (accounts.length > 0) {
          this.currentAccountId = accounts[0].accountId ?? null;
          this.registrationForm.get('account')?.patchValue({
            ...accounts[0],
            accountOpenDt: this.toDateInput(accounts[0].accountOpenDt),
            effectiveDt: this.toDateInput(accounts[0].effectiveDt),
            expiryDt: this.toDateInput(accounts[0].expiryDt)
          });
        }
        this.loading = false;
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  onCountryChange(): void {
    const countryId = Number(this.registrationForm.get('address.countryId')?.value);
    this.divisions = []; this.districts = []; this.thanas = [];
    this.registrationForm.patchValue({ address: { divisionId: '', districtId: '', thanaId: '' } });
    if (!countryId) return;
    this.clientService.getDivisions(countryId).subscribe(res => this.divisions = res);
  }

  onDivisionChange(): void {
    const divisionId = Number(this.registrationForm.get('address.divisionId')?.value);
    this.districts = []; this.thanas = [];
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
      // UPDATE FLOW
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
          return this.currentAddressId != null
            ? this.clientService.updateClientAddress(this.clientId!, this.currentAddressId, addressRequest)
            : this.clientService.addAddress(this.clientId!, addressRequest);
        }),
        switchMap(() => {
          const accountRequest: AccountRequest = {
            ...this.registrationForm.get('account')?.value,
            clientId: this.clientId!
          };
          return this.currentAccountId != null
            ? this.clientService.updateClientAccount(this.clientId!, this.currentAccountId, accountRequest)
            : this.clientService.addAccount(this.clientId!, accountRequest);
        })
      ).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Client updated successfully.';
          this.router.navigate(['/client']).then(() => window.location.reload());
        },
        error: err => {
          this.loading = false;
          this.message = 'Update failed.';
          console.error(err);
        }
      });
    } else {
      // ---------- CREATE FLOW ----------
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
        error: err => {
          this.loading = false;
          this.message = 'Save failed.';
          console.error(err);
        }
      });
    }
  }
}
