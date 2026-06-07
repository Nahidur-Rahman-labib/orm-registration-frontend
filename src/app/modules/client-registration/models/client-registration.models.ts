export interface CreateClientRequest {
    clientName: string;
}

export interface GetClientResponse {
    clientId: number;
    clientName: string;
}

export interface ClientDetailsRequest {
    clientId?: number;
    fatherName?: string;
    motherName?: string;
    gender?: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    spouseName?: string;
    nid?: string;
}

export interface AddressRequest {
    clientId?: number;
    address?: string;
    addressTypeId?: number;
    countryId?: number;
    divisionId?: number;
    districtId?: number;
    thanaId?: number;
    city?: string;
    zipCode?: string;
    mobileNo?: string;
    email?: string;
}

export interface AccountRequest {
    officeId?: number;
    clAccSl?: number;
    clientId?: number;
    accountTitle?: string;
    accountOpenDt?: string;
    effectiveDt?: string;
    expiryDt?: string;
    limitAmt?: number;
    entityId?: string;
}

export interface LookupResponse {
    id: number;
    name: string;
}