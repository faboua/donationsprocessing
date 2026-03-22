import { useRef, useState, type DragEvent } from "react";

interface FileUploadZoneProps {
  label: string;
  accept: string;
  files: File[];
  onFilesAdded: (files: FileList) => void;
  onFileRemoved: (index: number) => void;
  onClear: () => void;
}

export default function FileUploadZone({
  label,
  accept,
  files,
  onFilesAdded,
  onFileRemoved,
  onClear,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  }

  function handleClick() {
    inputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(e.target.files);
      e.target.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <p className="text-gray-600 font-medium">{label}</p>
        <p className="text-sm text-gray-400 mt-1">
          Glisser-déposer ou cliquer pour parcourir
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {files.length} fichier{files.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={onClear}
              className="text-sm text-accent-red hover:underline"
            >
              Tout effacer
            </button>
          </div>
          <ul className="max-h-40 overflow-y-auto space-y-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1.5"
              >
                <span className="truncate text-gray-700">{file.name}</span>
                <button
                  onClick={() => onFileRemoved(index)}
                  className="text-gray-400 hover:text-accent-red ml-2 shrink-0"
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
