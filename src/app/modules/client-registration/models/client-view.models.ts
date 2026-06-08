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
    mobileNo?: string;
    email?: string;
    fatherName?: string;
    motherName?: string;
    nid?: string;
    dob?: string;
}

export interface AddressView {
    addressId?: number;
    addressTypeId?: number;
    addressTypeName?: string;
    addressLine?: string;
    countryName?: string;
    divisionName?: string;
    districtName?: string;
    thanaName?: string;
}

export interface AccountView {
    officeId?: number;
    clAccSl?: number;
    accountNo?: string;
    accountTitle?: string;
    accountType?: string;
    limitAmt?: number;
    accountOpenDt?: string;
}