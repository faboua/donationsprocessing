import { useState, useCallback } from "react";
import type { ProcessingResult } from "../types/processing";
import { parseTransactionFiles, parseReportFiles } from "../services/fileParser";
import { processDonations } from "../services/donationProcessor";

export function useProcessing() {
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(
    async (transactionFiles: File[], reportFiles: File[]) => {
      setIsProcessing(true);
      setError(null);
      setResults(null);

      try {
        const transactionDates = await parseTransactionFiles(transactionFiles);
        const { details, rejected } = await parseReportFiles(
          reportFiles,
          transactionDates
        );
        const result = processDonations(details, rejected);
        setResults(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return { results, isProcessing, error, process, reset };
}
