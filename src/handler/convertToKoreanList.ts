export const convertToKoreanList = (content: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  const lists = doc.querySelectorAll("ol"); // <ol> 목록 선택
  lists.forEach((list) => {
    let index = 0;
    const koreanAlphabet = [
      "가",
      "나",
      "다",
      "라",
      "마",
      "바",
      "사",
      "아",
      "자",
      "차",
      "카",
      "타",
      "파",
      "하",
    ];
    list.querySelectorAll("li").forEach((li) => {
      const prefix = koreanAlphabet[index % koreanAlphabet.length]; // 한글 알파벳 반복
      li.style.listStyleType = "none"; // list-style-type을 none으로 설정하여 기본 리스트 스타일 제거
      li.innerHTML = `${prefix}. ${li.innerHTML}`; // 가. 나. 형식으로 변경
      index++;
    });
  });

  return doc.body.innerHTML;
};
