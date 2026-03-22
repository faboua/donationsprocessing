import JSZip from "jszip";
import type { ProcessingResult } from "../types/processing";

function escapeField(value: string | number | undefined): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const headerLine = headers.map(escapeField).join(",");
  const dataLines = rows.map((row) =>
    headers.map((h) => escapeField(row[h] as string | number | undefined)).join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

export function generateCityDonationCsv(
  rows: { DonationNumber: string; TransactionDate: string | undefined; PaymentAmount: string; DonationCategory: string; Description: string }[]
): string {
  return toCsv(
    ["DonationNumber", "TransactionDate", "PaymentAmount", "DonationCategory", "Description"],
    rows
  );
}

export function generateSummaryCsv(
  summary: { PaymentNumber: string; TotalPaymentAmount: number }[]
): string {
  return toCsv(["PaymentNumber", "TotalPaymentAmount"], summary);
}

export function generateRejectedCsv(
  rejected: { PaymentNumber: string; Line: string }[]
): string {
  return toCsv(["PaymentNumber", "Line"], rejected);
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadAll(results: ProcessingResult): Promise<void> {
  const zip = new JSZip();
  const donsFolder = zip.folder("dons")!;

  for (const [city, rows] of Object.entries(results.cityDonations)) {
    donsFolder.file(`${city}_donations.csv`, generateCityDonationCsv(rows));
  }

  zip.file("summary.csv", generateSummaryCsv(results.summary));

  if (results.rejected.length > 0) {
    zip.file("rejectedinput.csv", generateRejectedCsv(results.rejected));
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resultats.zip";
  link.click();
  URL.revokeObjectURL(url);
}
