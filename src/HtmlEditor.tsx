import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import DOMPurify from "dompurify";
import mammoth from "mammoth";
import { PLUGINS, TOOL_BAR } from "./config";

const tableStyle = `
<style>
  table, th, td {
    border: 1px solid #e0e0e0;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    text-align: left;
  }
</style>
`;

export default function HtmlEditor() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState<string>("");
  const dompurify = DOMPurify.sanitize(content + tableStyle);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      if (file.name.endsWith(".docx")) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (arrayBuffer) {
            try {
              const result = await mammoth.convertToHtml({ arrayBuffer });
              const htmlContent = result.value;

              if (editorRef.current) {
                editorRef.current.setContent(htmlContent);
              }
            } catch (error) {
              console.error("Error converting .docx file:", error);
            }
          }
        };

        reader.readAsArrayBuffer(file);
      } else if (file.name.endsWith(".html")) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const htmlContent = e.target?.result as string;

          if (editorRef.current) {
            editorRef.current.setContent(htmlContent);
          }
        };
        reader.readAsText(file);
      } else {
        alert(".docx, .html 파일만 업로드해주세요.");
      }
    }
  };

  const fileUploadMenu = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      let htmlContent = editorRef.current.getContent();
      htmlContent = tableStyle + htmlContent;

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

  return (
    <div style={{ display: "flex", height: "100%", gap: "1px" }}>
      <input
        ref={fileInputRef}
        style={{ display: "none" }}
        type="file"
        accept=".docx, .html"
        onChange={handleFileUpload}
      />

      <Editor
        onEditorChange={handleEditorChange}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue=""
        init={{
          height: "100%",
          width: "50%",
          menubar: false,
          plugins: PLUGINS,
          toolbar: TOOL_BAR,
          setup: (editor) => {
            editor.ui.registry.addButton("htmldownload", {
              text: "HTML 변환",
              onAction: handleDownload,
            });
            editor.ui.registry.addButton("fileupload", {
              text: "파일 업로드",
              onAction: fileUploadMenu,
            });
            editor.ui.registry.addButton("customNumList", {
              text: "한글 리스트",
              onAction: () =>
                editor.execCommand("InsertOrderedList", false, {
                  "list-style-type": "hangul",
                }),
            });
          },
        }}
      />

      <div
        style={{
          width: "50%",
          border: "2px solid #eee",
          borderRadius: "10px",
          padding: "1rem",
          overflow: "scroll",
        }}
        dangerouslySetInnerHTML={{
          __html: dompurify,
        }}
      />
    </div>
  );
}
