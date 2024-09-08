"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import fetchImage from "@/lib/fetchImage";

export default function TryOnButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      // Reset result image when a new file is dropped
      setResultImage(null);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Reset result image when a new file is selected
      setResultImage(null);
    }
  };

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    console.log("handleSubmit");
    event.preventDefault();
    // let newfile =
    // "https://assets.weforum.org/sf_account/image/79VahTYKJ3wz-OlZIDHInTN-HuxMTL2awujG0fOsDnk.jpg";
    // file to string so i can pass it to fetchImage
    const reader = new FileReader();
    reader.readAsDataURL(file as Blob);
    let file64 = "";
    reader.onloadend = function () {
      file64 = reader.result as string;
    };

    if (file) {
      const response = await fetchImage(file64);
      if (response.success) {
        setResultImage(response.data);
      } else {
        setResultImage("/no-result.avif");
      }
    }
  };

  return (
    // <form
    //   // action={handleSubmit}
    //   onSubmit={handleSubmit}
    // >
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="lg">
          Try on
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white sm:max-w-[425px] bg-primary text-primary-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload an image</AlertDialogTitle>
          <AlertDialogDescription>
            Drag and drop an image file or click to select a file.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <p className="font-medium">{file.name}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResultImage(null);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag and drop your image here, or click to select a file
                </p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
              aria-label="File input"
              name="image"
            />
          </div>
          <div className="flex justify-center">
            {resultImage ? (
              <Image
                src={resultImage}
                alt="Result"
                width={300}
                height={300}
                className="rounded-lg"
              />
            ) : (
              <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center ">
                <p className="text-gray-400">Result will appear here</p>
              </div>
            )}
          </div>
        </div>
        <AlertDialogFooter className="sm:justify-between">
          <AlertDialogCancel>Close</AlertDialogCancel>
          <Button
            disabled={!file}
            variant="outline"
            size="lg"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    // </form>
  );
}
