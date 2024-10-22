import React, { useMemo, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // CSS 임포트
import * as QuillTableUI from "quill-table-ui";

import { ImageActions } from "@xeger/quill-image-actions";
import { ImageFormats } from "@xeger/quill-image-formats";
// import DOMPurify from "dompurify";
import "quill-table-ui"; // quill table UI 모듈 추가
import "quill-table-ui/dist/index.css"; // quill table UI CSS 추가
import "./quill-custom.css"; // 커스텀 align 스타일 CSS
import DOMPurify from "dompurify";
Quill.register("modules/imageActions", ImageActions);
Quill.register("modules/imageFormats", ImageFormats);
Quill.register(
  {
    "modules/tableUI": QuillTableUI.default,
  },
  true
);

const Align = ReactQuill.Quill.import("formats/align");
Align.whitelist = ["left", "center", "right", "justify"];

const Icons = ReactQuill.Quill.import("ui/icons");
Icons.align["left"] = Icons.align[""];

const Font = Quill.import("formats/font");
const Size = Quill.import("formats/size");
Font.whitelist = ["dotum", "gullim", "batang", "NanumGothic"];
Size.whitelist = ["8", "9", "10", "11", "12", "14", "18", "24", "36"];
Quill.register(Size, true);
Quill.register(Font, true);

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
  "font",
  "size",
  "table",
];

const HtmlEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");

  // 렌더링이 발생할 때마다 모듈이 새로 생성되기 때문에 useMemo 사용
  const modules = useMemo(() => {
    return {
      imageActions: {},
      imageFormats: {},
      //툴바 설정
      toolbar: {
        table: true,
        tableUI: true,
        container: [
          //   [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [
            { align: ["left", "center", "right"] },
            { color: [] },
            { background: [] },
          ],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["bold", "italic", "underline", "strike", "blockquote"], // 굵기, 기울기, 밑줄 등 부가 tool 설정
          ["clean"],
          [{ table: true }], // 테이블 도구 추가
        ],

        // 핸들러 설정
        // handlers: {
        //     image: imageHandler, // 이미지 tool 사용에 대한 핸들러 설정
        // },
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

  //   const sanitizedHTML = DOMPurify.sanitize(content);

  //   useEffect(() => {
  //     if (quillRef.current) {
  //       const editor = quillRef.current.getEditor();
  //       editor.format("align", "center"); // 기본 정렬을 left로 설정
  //       console.log(editor);
  //       console.log("ㅎㅇㅎㅇ");
  //     }
  //   }, []);

  const sanitizeHTML = DOMPurify.sanitize(content);
  return (
    <div style={{}}>
      <ReactQuill
        value={content}
        formats={formats}
        modules={modules}
        onChange={handleChange}
      />

      <div
        style={{ padding: "12px 15px" }}
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML,
        }}
      ></div>
    </div>
  );
};

export default HtmlEditor;
