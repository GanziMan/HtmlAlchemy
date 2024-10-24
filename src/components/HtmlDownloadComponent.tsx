interface HtmlStringProp {
  content: string;
}
const HtmlDownloadComponent = ({ content }: HtmlStringProp) => {
  const htmlString: string = `<div style="padding:1rem;">${content}</div>`; // 에디터에서 작성된 HTML 문자열

  const handleDownload = (): void => {
    // Blob 생성 (파일 형식은 text/html로 지정)
    const blob = new Blob([htmlString], { type: "text/html" });

    // URL.createObjectURL을 사용하여 Blob URL 생성
    const url = URL.createObjectURL(blob);

    // a 태그를 생성하여 다운로드 속성 설정
    const link = document.createElement("a");
    link.href = url;
    link.download = "example.html"; // 다운로드될 파일 이름 설정
    document.body.appendChild(link);
    link.click(); // 클릭 이벤트를 트리거하여 다운로드 실행
    document.body.removeChild(link); // 링크 삭제
  };

  return (
    <div>
      <button onClick={handleDownload}>Download HTML</button>
    </div>
  );
};

export default HtmlDownloadComponent;
