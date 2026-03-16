import React, {use, useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

interface FileUploaderProps{
    onFileSelect?: (file: File | null) => void;
}

const FileUploader =({onFileSelect}: FileUploaderProps) => {
    const [File, setFile] = useState()
    const onDrop = useCallback(  (acceptedFiles:File[]) => {
        const File= acceptedFiles[0] || null;
        onFileSelect?.( File);
    }, [onFileSelect])
    const {getRootProps, getInputProps, isDragActive , acceptedFiles} = useDropzone({
        onDrop,
    multiple: false,
    accept: {'application/pdf':[".pdf"]},
    maxSize: 20 * 1024 * 1024,
    })

    const file = acceptedFiles[0] || null;

    return (
        <div className="w-full gradient-border">
           <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="space-y-4 cursor-pointer">
                <div className= "mx-auto w-16 h-16 flex items-center justify-center ">
                    <img src="/icons/info.svg" alt="uploader" className="size-20"/>
                </div>
                {File ? (
                    <div>

                    </div>
                ) :(
                    <div>
                       <p className="text-lg text-gray-500">
                           <span className="font-semibold">
                               click to upload
                           </span> or drag and drop
                       </p>
                        <p className="text-lg text-gray-500">PDf(max 20 MB)</p>
                    </div>
                )}
            </div>
           </div>
        </div>
    )

}
export default FileUploader