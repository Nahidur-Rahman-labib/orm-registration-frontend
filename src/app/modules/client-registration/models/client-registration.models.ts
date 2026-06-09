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
export interface ClientDetailsResponse {
    fatherName: string;
    motherName: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus?: string;
    spouseName?: string;
    nid: string;
}

export interface AddressRequest {
    addressId?: number;
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
export interface AddressResponse {
    addressId: number;
    address: string;
    addressTypeName: string;
    countryName: string;
    divisionName: string;
    districtName: string;
    thanaName: string;
    city: string;
    zipCode: string;
    mobileNo: string;
    email: string;
}

export interface AccountRequest {
    accountId?: number;
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
export interface AccountResponse {
    officeId: number;
    clAccSl: number;
    clientId: number;
    accountNo: string;
    accountTitle: string;
    accountType: string;
    accountOpenDt: string;
    effectiveDt?: string;
    expiryDt?: string;
    limitAmt: number;
    entityId: string;
}

export interface LookupResponse {
    id: number;
    name: string;
}