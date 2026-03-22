export interface PaymentDetail {
  TransactionDate: string | undefined;
  PaymentNumber: string;
  AccountNumber: string;
  CustomerName: string;
  ReferenceNumber: string;
  PaymentAmount: string;
  City: string;
  DonationNumber: string;
  DonationCategory: string;
  Description: string;
}

export interface SummaryData {
  PaymentNumber: string;
  TotalPaymentAmount: number;
}

export interface RejectedData {
  PaymentNumber: string;
  Line: string;
}

export interface TransactionData {
  PaymentNumber: string;
  Date: string;
}

export interface Transaction {
  "Account Number": string;
  Currency: string;
  Date: string;
  Description: string;
  Withdrawals: string;
  Deposits: string;
  Balance: string;
  Backdated: string;
}

export interface CityDonationRow {
  DonationNumber: string;
  TransactionDate: string | undefined;
  PaymentAmount: string;
  DonationCategory: string;
  Description: string;
}

export interface ProcessingResult {
  cityDonations: Record<string, CityDonationRow[]>;
  summary: SummaryData[];
  rejected: RejectedData[];
  totalAmount: number;
}
