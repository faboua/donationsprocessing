import FileUploadZone from "../../components/FileUploadZone/FileUploadZone";
import ProcessButton from "../../components/ProcessButton/ProcessButton";
import ResultsPanel from "../../components/ResultsPanel/ResultsPanel";
import { useFileUpload } from "../../hooks/useFileUpload";
import { useProcessing } from "../../hooks/useProcessing";

export default function Landing() {
  const transactions = useFileUpload(".csv");
  const reports = useFileUpload(".TXT");
  const { results, isProcessing, error, process } = useProcessing();

  const canProcess =
    transactions.files.length > 0 && reports.files.length > 0 && !isProcessing;

  function handleProcess() {
    process(transactions.files, reports.files);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-2xl font-semibold text-primary-700">
            Traitement des dons par paiement de factures
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* File upload zones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadZone
            label="Releves bancaires (.CSV)"
            accept=".csv"
            files={transactions.files}
            onFilesAdded={transactions.addFiles}
            onFileRemoved={transactions.removeFile}
            onClear={transactions.clear}
          />
          <FileUploadZone
            label="Rapports (.TXT)"
            accept=".TXT"
            files={reports.files}
            onFilesAdded={reports.addFiles}
            onFileRemoved={reports.removeFile}
            onClear={reports.clear}
          />
        </div>

        {/* Process button */}
        <ProcessButton
          onClick={handleProcess}
          disabled={!canProcess}
          isProcessing={isProcessing}
        />

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-accent-red/30 text-accent-red rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {results && <ResultsPanel results={results} />}
      </main>
    </div>
  );
}
