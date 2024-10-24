import mammoth from "mammoth";
import { useRef } from "react";
import { Editor as TinyMCEEditor } from "tinymce";
export const handleFileUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const editorRef = useRef<TinyMCEEditor | null>(null);
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
