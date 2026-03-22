import type { ProcessingResult } from "../../types/processing";
import {
  downloadCsv,
  downloadAll,
  generateCityDonationCsv,
  generateSummaryCsv,
  generateRejectedCsv,
} from "../../services/csvGenerator";

interface ResultsPanelProps {
  results: ProcessingResult;
}

export default function ResultsPanel({ results }: ResultsPanelProps) {
  const cityKeys = Object.keys(results.cityDonations).sort();

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Montant total"
          value={`$${results.totalAmount.toLocaleString("fr-CA", { minimumFractionDigits: 2 })}`}
        />
        <StatCard
          label="Paiements traités"
          value={String(results.summary.length)}
        />
        <StatCard
          label="Lignes rejetées"
          value={String(results.rejected.length)}
        />
      </div>

      {/* Download all */}
      <button
        onClick={() => downloadAll(results)}
        className="w-full py-2 px-4 rounded-lg font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
      >
        Tout télécharger
      </button>

      {/* Individual files */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Fichiers par ville
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cityKeys.map((city) => (
            <FileCard
              key={city}
              filename={`${city}_donations.csv`}
              rowCount={results.cityDonations[city].length}
              onDownload={() =>
                downloadCsv(
                  generateCityDonationCsv(results.cityDonations[city]),
                  `${city}_donations.csv`
                )
              }
            />
          ))}
        </div>

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-4">
          Autres fichiers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FileCard
            filename="summary.csv"
            rowCount={results.summary.length}
            onDownload={() =>
              downloadCsv(generateSummaryCsv(results.summary), "summary.csv")
            }
          />
          {results.rejected.length > 0 && (
            <FileCard
              filename="rejectedinput.csv"
              rowCount={results.rejected.length}
              onDownload={() =>
                downloadCsv(
                  generateRejectedCsv(results.rejected),
                  "rejectedinput.csv"
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
      <p className="text-2xl font-bold text-primary-600">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function FileCard({
  filename,
  rowCount,
  onDownload,
}: {
  filename: string;
  rowCount: number;
  onDownload: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-gray-800">{filename}</p>
        <p className="text-xs text-gray-400">
          {rowCount} ligne{rowCount > 1 ? "s" : ""}
        </p>
      </div>
      <button
        onClick={onDownload}
        className="text-sm font-medium text-accent-blue hover:underline"
      >
        Télécharger
      </button>
    </div>
  );
}
