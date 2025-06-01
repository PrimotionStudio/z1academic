export interface Session {
  _id: string;
  name: string;
  isActive: boolean;
  createdAt: Date | string;
}
