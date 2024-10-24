import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import "./App.css";
import DOMPurify from "dompurify";

import { convertToKoreanList } from "./handler/convertToKoreanList";
import { PLUGINS, TOOL_BAR } from "./config";
import { handleFileUpload } from "./handler/handleFileUpload";
import { handleDownload } from "./handler/handleDownload";

export default function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState<string>("");
  const dompurify = DOMPurify.sanitize(content);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const fileUploadMenu = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
