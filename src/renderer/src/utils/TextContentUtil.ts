export function matchChapter(content: string, matchRule: string) {
  const lines = content.split('\n')
  const chapters = []
  lines.forEach((line, index) => {
    const chapter = line.match(matchRule)
    if (chapter != null) {
      chapters.push({
        text: chapter[0] + ' #' + index,
        index
      } as never)
    }
  })
  return chapters
}

export function matchDesc(content: string) {
  const lines = content.split('\n')
  debugger
  let desc = ''
  let isMatch = false
  lines.forEach((line) => {
    if (line.indexOf('简介') > -1 && !isMatch) {
      desc = line
      isMatch = true
    }
  })
  return desc
}
