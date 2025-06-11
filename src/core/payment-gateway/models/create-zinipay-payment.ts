export class CreateZinipayPayment {
  customer: {
    name: string;
    email: string;
  };
  amount: number;
  metadata: Record<string, any>;
}
