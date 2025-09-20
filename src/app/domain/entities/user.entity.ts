export interface User {
  id: number;
  name: string;
  identification: string;
  email: string;
  password: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  identification: string;
  email: string;
  password: string;
}
