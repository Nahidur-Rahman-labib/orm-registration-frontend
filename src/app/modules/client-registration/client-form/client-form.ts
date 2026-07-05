import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap, forkJoin } from 'rxjs';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { GenericButtonComponent } from '../../../shared/components/generic-button/generic-button.component';
import { ClientRegistrationService } from '../service/client-registration';
import { NavbarService } from '../service/navbar.service';
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
  imports: [ReactiveFormsModule, CommonModule, TextBoxComponent, DatePickerComponent, GenericButtonComponent]
})

export class ClientForm implements OnInit {

  registrationForm: FormGroup;
  loading = false;
  message = '';
  isEdit = false;
  isMarried = false;
  clientId: number | null = null;
  currentAddressId: number | null = null;
  currentAccountId: number | null = null;

  addressTypes: LookupResponse[] = [];
  countries: LookupResponse[] = [];
  divisions: LookupResponse[] = [];
  districts: LookupResponse[] = [];
  thanas: LookupResponse[] = [];
  private loadedAccountKeys: { officeId: number; clAccSl: number }[] = [];

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
    private router: Router,
    private navbar: NavbarService
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
      accounts: this.fb.array([this.buildAccountGroup()])
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
    this.navbar.setPage({
      pageTitle: this.isEdit ? 'Edit Client' : 'Client Registration',
      showActions: true
    });
    this.navbar.registerActions({
      onSave: () => this.submitForm(),
      onReset: () => this.registrationForm.reset(),
      onExit: () => this.router.navigate(['/home']),
      onView: () => this.router.navigate(['/client'])
    });
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
  ngOnDestroy(): void {
    this.navbar.clearActions();
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
  toggleMaritalStatus(): void {
    this.isMarried = !this.isMarried;
    this.registrationForm.get('details.maritalStatus')?.setValue(
      this.isMarried ? 'MARRIED' : 'SINGLE'
    );
    if (!this.isMarried) {
      this.registrationForm.get('details.spouseName')?.setValue('');
    }
  }
  private buildAccountGroup(): FormGroup {
    return this.fb.group({
      officeId: ['', [Validators.required, Validators.max(9999)]],
      clAccSl: ['', [Validators.required, Validators.max(9999)]],
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
    });
  }
  private buildAccountRequest(raw: any, clientId: number): AccountRequest {
    return {
      ...raw,
      clientId,
      officeId: raw.officeId ? Number(raw.officeId) : null,
      clAccSl: raw.clAccSl ? Number(raw.clAccSl) : null,
      limitAmt: raw.limitAmt ? Number(raw.limitAmt) : null,
      approveFlag: raw.approveFlag || null,
      recordUserId: raw.recordUserId || null,
      recordDt: raw.recordDt || null,
      entityId: raw.entityId || null,
      effectiveDt: raw.effectiveDt || null,
      expiryDt: raw.expiryDt || null,
    };
  }

  get accounts(): FormArray {
    return this.registrationForm.get('accounts') as FormArray;
  }

  addAccount(): void {
    this.accounts.push(this.buildAccountGroup());
  }

  removeAccount(index: number): void {
    if (this.accounts.length > 1) {
      this.accounts.removeAt(index);
    }
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
        this.isMarried = details.maritalStatus === 'MARRIED';
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
          this.loadedAccountKeys = accounts.map((acc: any) => ({
            officeId: Number(acc.officeId),
            clAccSl: Number(acc.clAccSl)
          }));

          this.accounts.clear();
          accounts.forEach((acc: any) => {
            const group = this.buildAccountGroup();
            group.patchValue({
              ...acc,
              accountOpenDt: this.toDateInput(acc.accountOpenDt),
              effectiveDt: this.toDateInput(acc.effectiveDt),
              expiryDt: this.toDateInput(acc.expiryDt)
            });
            this.accounts.push(group);
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
    if (this.loading) return;

    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.message = 'Please fill required fields.';
      return;
    }
    this.loading = true;
    this.navbar.setLoading(true);
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

        //known limitation can only update 1 account as account id is tracked
        switchMap(() => {
          const rawAccounts = this.registrationForm.get('accounts')?.value as any[];

          const currentKeys = rawAccounts.map(a => ({
            officeId: Number(a.officeId),
            clAccSl: Number(a.clAccSl)
          }));

          const deletedKeys = this.loadedAccountKeys.filter(
            loaded => !currentKeys.some(
              cur => cur.officeId === loaded.officeId && cur.clAccSl === loaded.clAccSl
            )
          );

          const deleteCalls = deletedKeys.map(key =>
            this.clientService.deleteAccount(this.clientId!, key.officeId, key.clAccSl)
          );

          const upsertCalls = rawAccounts.map(raw => {
            const req = this.buildAccountRequest(raw, this.clientId!);
            const officeId = Number(raw.officeId);
            const clAccSl = Number(raw.clAccSl);
            const wasLoaded = this.loadedAccountKeys.some(
              k => k.officeId === officeId && k.clAccSl === clAccSl
            );
            return wasLoaded
              ? this.clientService.updateClientAccount(this.clientId!, officeId, clAccSl, req)
              : this.clientService.addAccount(this.clientId!, req);
          });

          return forkJoin([...deleteCalls, ...upsertCalls]);
        })

        ///
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
              const rawAccounts = this.registrationForm.get('accounts')?.value as any[];
              const accountRequests = rawAccounts.map(raw => this.buildAccountRequest(raw, clientId));
              console.log('Account requests:', accountRequests); // debug log

              const accountCalls = accountRequests.map(req =>
                this.clientService.addAccount(clientId, req)
              );

              return forkJoin(accountCalls);
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
