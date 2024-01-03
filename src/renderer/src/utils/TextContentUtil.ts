import { TocModel } from '@renderer/models/entity'

export function matchChapter(content: string, matchRule: string) {
  const lines = content.split('\n')
  const chapters: TocModel[] = []
  chapters.push({
    index: 0,
    text: '序 #0',
    title: '序'
  })
  lines.forEach((line, index) => {
    const chapter = line.match(matchRule)
    if (chapter != null) {
      let title = chapter[2]
      if (title != undefined) {
        if (
          title[0] == ' ' ||
          title[0] == '、' ||
          title[0] == '：' ||
          title[0] == '，' ||
          title[0] == '；' ||
          title[0] == ':' ||
          title[0] == ',' ||
          title[0] == ';'
        ) {
          title = title.substring(1)
        }
      }
      chapters.push({
        text: chapter[1] + ' ' + title + ' #' + index,
        title: chapter[1] + ' ' + title,
        index
      } as TocModel)
    }
  })
  return chapters
}

export function matchDesc(content: string) {
  const lines = content.split('\n')
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
