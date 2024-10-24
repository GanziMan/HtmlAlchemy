import { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";

export const handleDownload = () => {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  if (editorRef.current) {
    const htmlContent = editorRef.current.getContent();
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "example.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
