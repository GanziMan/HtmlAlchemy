import React, { useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // CSS 임포트

import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";

Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);

const formats = [
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
  "image",
  "align",
  "color",
  "background",
  "float",
  "height",
  "width",
];

const HtmlEditor: React.FC = () => {
  const quillRef = useRef(null);

  const quill = quillRef.current;

  const [content, setContent] = useState<string>("");

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async () => {
      if (input != null && input.files != null) {
        const file = input.files[0];
        const range = quill.selection;
      }

      try {
        // const res = await imageApi({ img: file });
        // const imgUrl = res.data.imgUrl;
        // const editor = quillRef.current.getEditor();
        // const range = editor.getSelection();
        // editor.insertEmbed(range.index, "image", imgUrl);
        // editor.setSelection(range.index + 1);
      } catch (error) {
        console.log(error);
      }
    });
  };
  // 렌더링이 발생할 때마다 모듈이 새로 생성되기 때문에 useMemo 사용
  const modules = useMemo(() => {
    return {
      imageActions: {},
      imageFormats: {},
      //툴바 설정
      toolbar: {
        container: [
          [{ header: [1, 2, false] }], // header 설정
          ["link", "image"],
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }, { color: [] }, { background: [] }], // 정렬, 글자 색, 글자 배경색 설정
          ["bold", "italic", "underline", "strike", "blockquote"], // 굵기, 기울기, 밑줄 등 부가 tool 설정
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
          [
            {
              color: [],
            },
            { background: [] },
          ],
        ],

        // 핸들러 설정
        handlers: {
          image: imageHandler, // 이미지 tool 사용에 대한 핸들러 설정
        },
        // 이미지 크기 조절
        ImageResize: {
          modules: ["Resize"],
        },
      },
    };
  }, []);
  const handleChange = (value: string) => {
    setContent(value);
  };

  console.log(content);

  return (
    <div>
      <ReactQuill
        value={content}
        formats={formats}
        modules={modules}
        onChange={handleChange}
      />
    </div>
  );
};

export default HtmlEditor;
