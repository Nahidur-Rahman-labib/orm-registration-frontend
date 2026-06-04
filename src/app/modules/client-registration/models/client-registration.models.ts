export interface ClientRequest {
    clientName: string;
    fatherName?: string;
    motherName?: string;
    dateOfBirth?: string;
    gender?: string;
    mobileNo?: string;
    email?: string;
}

export interface ClientResponse {
    clientId: number;
    clientName: string;
}

export interface AddressRequest {
    clientId?: number;
    addressTypeId?: number;
    countryId?: number;
    divisionId?: number;
    districtId?: number;
    thanaId?: number;
    zipCode?: string;
    mobileNo?: string;
    email?: string;
    fullAddress?: string;
}

export interface AccountRequest {
    clientId?: number;
    officeId?: number;
    clAccSl?: number;
    accountNo?: string;
    accountTitle?: string;
    accountType?: string;
}