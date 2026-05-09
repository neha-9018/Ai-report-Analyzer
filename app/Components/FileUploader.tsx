import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const formatSize = (size: number) => {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(2) + " KB";
    return (size / (1024 * 1024)).toFixed(2) + " MB";
};

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: any[]) => {
            setError(null);

            if (rejectedFiles.length > 0) {
                const reason = rejectedFiles[0].errors[0];

                if (reason.code === "file-too-large") {
                    setError("File exceeds 20MB limit");
                } else if (reason.code === "file-invalid-type") {
                    setError("Only PDF files allowed");
                } else {
                    setError("Upload failed");
                }
                return;
            }

            const selectedFile = acceptedFiles[0] || null;
            setFile(selectedFile);
            onFileSelect?.(selectedFile);
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 20 * 1024 * 1024,
    });

    return (
        <div className="w-full gradient-border rounded-xl p-[2px]">
            <div
                {...getRootProps()}
                className="bg-white rounded-xl p-6 text-center cursor-pointer transition hover:bg-gray-50"
            >
                <input {...getInputProps()} />

                {file ? (
                    <div
                        className="flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <img src="/images/pdf.png" className="w-10 h-10" />
                            <div className="text-left">
                                <p className="text-sm font-medium truncate max-w-xs">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatSize(file.size)}
                                </p>
                            </div>
                        </div>

                        <button
                            className="text-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                onFileSelect?.(null);
                            }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div>
                        <img
                            src="/icons/info.svg"
                            className="w-14 mx-auto mb-3"
                        />
                        <p className="text-gray-600">
              <span className="font-semibold">
                {isDragActive ? "Drop file here" : "Click to upload"}
              </span>{" "}
                            or drag & drop
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            PDF (max 20MB)
                        </p>
                    </div>
                )}

                {error && (
                    <p className="text-red-500 text-sm mt-3">{error}</p>
                )}
            </div>
        </div>
    );
};

export default FileUploader;