export interface Fee {
  _id: string;
  label: string;
  amount: number;
  createdAt: Date & string;
  updatedAt: Date & String;
}
export interface InputFee {
  label: string;
  amount: number;
}
