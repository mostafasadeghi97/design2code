import { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { Cloud } from "lucide-react";
import { fileToDataURL } from "@/lib/utils";

type FileWithPreview = {
  preview: string;
} & File;



interface Props {
  setReferenceImages: (referenceImages: string[]) => void;
}

function UploadDoprzone({ setReferenceImages }: Props) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024, // 8MB
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptedFiles) => {
      // Set up the preview thumbnail images
      setFiles(
        acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ) as FileWithPreview[]
      );

      // Convert images to data URLs and set the prompt images state
      Promise.all(acceptedFiles.map((file) => fileToDataURL(file)))
        .then((dataUrls) => {
          console.log("dataUrls", dataUrls);
          setReferenceImages(dataUrls.map((dataUrl) => dataUrl as string));
        })
        .catch((error) => {
          toast.error("Error reading files" + error);
          console.error("Error reading files:", error);
        });
    },
    onDropRejected: (rejectedFiles) => {
      toast.error(rejectedFiles[0].errors[0].message);
    },
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const style = useMemo(
    () => ({
      flex: 1,
      minHeight: "400px",
      // if settings.openapikey is null then disable this input
      display: "flex",
    }),
    []
  );

  return (
    <section className="container">
      <p className="text-lg text-zinc-700 text-center mb-4">
        Make sure you set your openai key in settings dialog in the left
        sidebar.
      </p>
      <div {...getRootProps({ style: style as any })}>
        <div className="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
          {/* // if settings.openapikey is null then disable this input */}
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {/* if setting */}
            <Cloud className="h-6 w-6 text-zinc-500 mb-2" />

            <p className="mb-2 text-sm text-zinc-700">
              <span className="font-semibold text-s">Click to upload</span> or{" "}
              <span className="font-semibold text-s">
                {" "}
                drag & drop an image
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UploadDoprzone;
