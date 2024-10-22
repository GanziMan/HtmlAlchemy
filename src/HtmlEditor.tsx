import React, { useMemo, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // CSS 임포트

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "size",
  "h1",
];

const HtmlEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["link", "image"],
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],
      },
    };
  }, []);
  const handleChange = (value: string) => {
    setContent(value);
  };

  return (
    <div>
      <ReactQuill value={content} modules={modules} onChange={handleChange} />
    </div>
  );
};

export default HtmlEditor;
