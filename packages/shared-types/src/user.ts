export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  confirmado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegisterDTO {
  nombre: string;
  email: string;
  password: string;
  repetir_password: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserUpdateDTO {
  nombre?: string;
  telefono?: string;
}
