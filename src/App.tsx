import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import "./App.css";
import DOMPurify from "dompurify";

export default function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = useState<string>("");

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const dompurify = DOMPurify.sanitize(content);

  const handleDownload = ({ content }: { content: string }): void => {
    const htmlString: string = `<div style="padding:1rem;">${content}</div>`; // 에디터에서 작성된 HTML 문자열

    const blob = new Blob([htmlString], { type: "text/html" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "example.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        gap: "1px",
      }}
    >
      <Editor
        onEditorChange={handleEditorChange}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue=""
        init={{
          height: "100%",
          width: "100%",
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

          toolbar:
            "undo redo | blocks | bold italic forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | " +
            "help | table | htmldownload",
          setup: (editor) => {
            // 커스텀 버튼 추가
            editor.ui.registry.addButton("htmldownload", {
              text: "Download HTML",
              onAction: () => {
                handleDownload({ content: dompurify });
              },
            });
          },
        }}
      />

      <div
        style={{
          width: "100%",
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
