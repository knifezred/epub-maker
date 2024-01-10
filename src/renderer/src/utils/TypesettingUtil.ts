export function TransformChapterNumber(chapter: string) {
  return chapter
}
// 修改分隔符
export function TransformChapterDelimiter(chapter: string) {
  return chapter
}

export function isChineseChar(char) {
  // 判断是否位于基本汉字区或扩展A区
  const unicode = char.charCodeAt(0)
  return (unicode >= 0x4e00 && unicode <= 0x9fff) || (unicode >= 0x3400 && unicode <= 0x4dbf)
}
