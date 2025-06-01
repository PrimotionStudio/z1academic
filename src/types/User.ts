export interface InputRegisterUser {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface UserEditInfo {
  fullName: string;
  email: string;
  phone: string;
  photo: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  loadUserFromCookie: () => Promise<void>;
  logout: () => Promise<void>;
}
