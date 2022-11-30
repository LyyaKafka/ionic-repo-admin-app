export interface User {
  uid?: string;
  username: string;
  email: string;
}

export interface Document {
  id?: string;
  title: string;
  url: string;
  kategori: string;
  visibility: boolean;
  ownerid: string; //reference for interface user
}
