import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import "./App.css";
import DOMPurify from "dompurify";
import mammoth from "mammoth";
import { convertToKoreanList } from "./handler/convertToKoreanList";
import { PLUGINS, TOOL_BAR } from "./config";

export default function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [content, setContent] = useState<string>("");

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const dompurify = DOMPurify.sanitize(content);

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
              // mammoth 라이브러리를 사용해 .docx를 HTML로 변환
              const result = await mammoth.convertToHtml({ arrayBuffer });
              const htmlContent = result.value; // 변환된 HTML 내용

              // 에디터에 변환된 HTML 내용 반영
              if (editorRef.current) {
                editorRef.current.setContent(htmlContent);
              }
            } catch (error) {
              console.error("Error converting .docx file:", error);
            }
          }
        };

        reader.readAsArrayBuffer(file); // .docx 파일을 ArrayBuffer로 읽기
      } else if (file.name.endsWith(".html")) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          const htmlContent = e.target?.result as string;

          if (editorRef.current) {
            editorRef.current.setContent(htmlContent);
          }
        };
        reader.readAsText(file!); // .docx 파일을 ArrayBuffer로 읽기
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

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        gap: "1px",
      }}
    >
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

          style_formats: [
            {
              title: "Korean Alphabet List",
              selector: "ol",
              styles: {
                classes: "korean-list", // 커스텀 클래스 적용
              },
            },
          ],
          content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
          ol.korean-list { list-style-type: korean-hangul; }
        `,

          toolbar: TOOL_BAR,

          setup: (editor) => {
            editor.ui.registry.addButton("koreanList", {
              text: "한글 리스트",
              onAction: () => {
                const content = editor.getContent();
                const modifiedContent = convertToKoreanList(content);
                editor.setContent(modifiedContent);
              },
            });

            editor.ui.registry.addButton("htmldownload", {
              text: "HTML 변환",
              onAction: () => {
                handleDownload();
              },
            });
            editor.ui.registry.addButton("fileupload", {
              text: "파일 업로드",
              onAction: () => {
                fileUploadMenu(); // 파일 선택창 열기
              },
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
      ></div>
    </div>
  );
}
