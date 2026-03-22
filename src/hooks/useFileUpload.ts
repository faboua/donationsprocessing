import { useState, useCallback } from "react";

export function useFileUpload(acceptedExtension: string) {
  const [files, setFiles] = useState<File[]>([]);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const filtered = Array.from(newFiles).filter((f) =>
        f.name.toLowerCase().endsWith(acceptedExtension.toLowerCase())
      );
      setFiles((prev) => [...prev, ...filtered]);
    },
    [acceptedExtension]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => {
    setFiles([]);
  }, []);

  return { files, addFiles, removeFile, clear };
}
