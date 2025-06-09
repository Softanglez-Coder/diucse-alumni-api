export class CreateZinipayPayment {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  host: string;
  amount: number;
}
