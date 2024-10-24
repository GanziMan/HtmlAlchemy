import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import "./App.css";

export default function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [content, setContent] = useState<string>("");
  const log = () => {
    if (editorRef.current) {
      setContent(editorRef.current.getContent());
    }
  };
  return (
    <>
      <Editor
        onChange={(value) => console.log(value)}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        licenseKey="gpl"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
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
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help | table",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={log}>Log editor content</button>

      <div
        style={{
          width: "100%",
          border: "1px solid black",
        }}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      ></div>
    </>
  );
}
