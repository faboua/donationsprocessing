import Papa from "papaparse";
import type { PaymentDetail, RejectedData, Transaction } from "../types/processing";
import { CITY_MAP } from "../constants/cityMap";

function isValidAccountNumber(accountNumber: string): boolean {
  if (accountNumber.length <= 8) return false;

  const city = accountNumber.substring(0, 3);
  const donationNumber = accountNumber.substring(3, 8);
  const donationCategory = accountNumber.substring(8);

  return (
    /^[a-zA-Z]+$/.test(city) &&
    /^[0-9]+$/.test(donationNumber) &&
    /^[a-zA-Z]+$/.test(donationCategory)
  );
}

function isDateLike(str: string): boolean {
  return /^\d{2}\/\d{2}\/\d{2}/.test(str);
}

export async function parseTransactionFiles(
  files: File[]
): Promise<Map<string, string>> {
  const dateMap = new Map<string, string>();

  for (const file of files) {
    const text = await file.text();
    const result = Papa.parse<Transaction>(text, {
      header: true,
      skipEmptyLines: true,
    });

    for (const row of result.data) {
      if (row.Description) {
        if (
          row.Description.includes("EDI#") ||
          row.Description.includes("BPY#")
        ) {
          const paymentNumber = row.Description.substring(4).trim();
          const date = row.Date.replaceAll("/", "-");
          dateMap.set(paymentNumber, date);
        }
      }
    }
  }

  return dateMap;
}

export async function parseReportFiles(
  files: File[],
  transactionDates: Map<string, string>
): Promise<{ details: PaymentDetail[]; rejected: RejectedData[] }> {
  const paymentDetails: PaymentDetail[] = [];
  const rejectedData: RejectedData[] = [];
  const seenPaymentNumbers = new Map<string, string>();

  for (const file of files) {
    const text = await file.text();
    const lines = text.split("\n");

    let paymentNumber = "";
    let skipLines = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.includes("PAYMENT DATE")) {
        const candidate = trimmedLine.substring(14, 30).trim();

        if (seenPaymentNumbers.has(candidate)) {
          const firstFile = seenPaymentNumbers.get(candidate);
          if (firstFile !== file.name) {
            skipLines = true;
          } else {
            skipLines = false;
          }
        } else {
          paymentNumber = candidate;
          seenPaymentNumbers.set(paymentNumber, file.name);
          skipLines = false;
        }
      } else if (!skipLines) {
        const accountNumber = trimmedLine.substring(9, 27).trim();

        if (isValidAccountNumber(accountNumber)) {
          const customerName = trimmedLine.substring(26, 52).trim();
          const referenceNumber = trimmedLine.substring(52, 58).trim();
          const paymentAmount = trimmedLine.substring(64).trim();

          const city = accountNumber.substring(0, 3).toUpperCase();
          const donationNumber = accountNumber.substring(3, 8);
          const donationCategory = accountNumber.substring(8).toUpperCase();

          paymentDetails.push({
            TransactionDate: transactionDates.get(paymentNumber),
            PaymentNumber: paymentNumber,
            AccountNumber: accountNumber,
            CustomerName: customerName,
            ReferenceNumber: referenceNumber,
            PaymentAmount: paymentAmount,
            City: city,
            DonationNumber: donationNumber,
            DonationCategory: donationCategory,
            Description: CITY_MAP[city] ?? "",
          });
        } else if (isDateLike(trimmedLine.substring(0, 8))) {
          rejectedData.push({
            PaymentNumber: paymentNumber,
            Line: trimmedLine,
          });
        }
      }
    }
  }

  return { details: paymentDetails, rejected: rejectedData };
}
