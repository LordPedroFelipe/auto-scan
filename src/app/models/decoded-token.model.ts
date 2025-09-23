// src/app/models/decoded-token.model.ts
export interface DecodedTokenModel {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string | string[];
  Permission: string[];
  ShopId: string;
  ShopName: string;
  exp: number;
  iss: string;
  aud: string;
}
