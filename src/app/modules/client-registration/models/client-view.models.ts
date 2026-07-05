export interface ClientView {
    clientId: number;
    clientName: string;
    approveFlag?: number;
    recordUserId?: string;
    recordDt?: string;

    details?: ClientDetailsView | null;
    addresses?: AddressView[];
    accounts?: AccountView[];
}

export interface ClientDetailsView {
    clientDetailsId?: number;

    fatherName?: string;
    motherName?: string;
    nid?: string;
    dateOfBirth?: string;
    maritalStatus: string;
    spouseName: string;
}

export interface AddressView {
    addressId?: number;
    mobileNo?: string;
    email?: string;
    addressTypeId?: number;
    addressTypeName?: string;
    addressLine?: string;
    countryName?: string;
    divisionName?: string;
    districtName?: string;
    thanaName?: string;
}

export interface AccountView {
    officeId: number;
    clAccSl: number;
    accountNo: string;
    clientId: number;
    accountTitle: string;
    accountOpenDt: string; // ISO string from backend
    effectiveDt: string;
    expiryDt: string;
    limitAmt: number;
    entityId: string;
    accountType: string;
}