import type {
  PaymentDetail,
  RejectedData,
  SummaryData,
  CityDonationRow,
  ProcessingResult,
} from "../types/processing";

export function processDonations(
  details: PaymentDetail[],
  rejected: RejectedData[]
): ProcessingResult {
  // Group by city
  const cityDonations: Record<string, CityDonationRow[]> = {};

  for (const detail of details) {
    if (!cityDonations[detail.City]) {
      cityDonations[detail.City] = [];
    }
    cityDonations[detail.City].push({
      DonationNumber: detail.DonationNumber,
      TransactionDate: detail.TransactionDate,
      PaymentAmount: detail.PaymentAmount,
      DonationCategory: detail.DonationCategory,
      Description: detail.Description,
    });
  }

  // Sort each city's records by TransactionDate ascending (undated last)
  for (const city of Object.keys(cityDonations)) {
    cityDonations[city].sort((a, b) => {
      if (!a.TransactionDate) return 1;
      if (!b.TransactionDate) return -1;
      return a.TransactionDate.localeCompare(b.TransactionDate);
    });
  }

  // Build summary
  const summaryMap = new Map<string, number>();
  for (const detail of details) {
    const current = summaryMap.get(detail.PaymentNumber) ?? 0;
    summaryMap.set(detail.PaymentNumber, current + Number(detail.PaymentAmount));
  }

  const summary: SummaryData[] = Array.from(summaryMap.entries())
    .map(([PaymentNumber, TotalPaymentAmount]) => ({
      PaymentNumber,
      TotalPaymentAmount,
    }))
    .sort((a, b) => a.PaymentNumber.localeCompare(b.PaymentNumber));

  const totalAmount = summary.reduce((sum, s) => sum + s.TotalPaymentAmount, 0);

  return { cityDonations, summary, rejected, totalAmount };
}
