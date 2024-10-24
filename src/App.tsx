import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import "./App.css";
import DOMPurify from "dompurify";
import mammoth from "mammoth";

export default function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = useState<string>("");

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const dompurify = DOMPurify.sanitize(content);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file && file.name.endsWith(".docx")) {
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
    } else {
      alert("Please upload a valid .docx file.");
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
      <input type="file" accept="*" onChange={handleFileUpload} />

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
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "preview",
            "help",
            "wordcount",
          ],

          style_formats: [
            {
              title: "Korean Alphabet List",
              selector: "ol",
              styles: {
                listStyleType: "'\\1100 '", // Unicode for '가'를 이용한 커스텀 목록 스타일
              },
            },
          ],
          content_style: `
          body { font-family:Helvetica,Arial,sans-serif; font-size:14px }
          ol.korean-list { list-style-type: korean-hangul; }
        `,
          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | " +
            "help | table | htmldownload",
          setup: (editor) => {
            editor.ui.registry.addButton("htmldownload", {
              text: "HTML 변환",
              onAction: () => {
                handleDownload();
              },
            });
            editor.ui.registry.addButton("fileupload", {
              text: "파일 업로드",
              onAction: () => {
                // handleDownload({ content: dompurify });
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
        }}
        dangerouslySetInnerHTML={{
          __html: dompurify,
        }}
      ></div>
    </div>
  );
}
