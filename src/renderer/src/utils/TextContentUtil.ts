import { TocModel } from '@renderer/models/entity'
import { isChineseChar } from './TypesettingUtil'

export function matchChapter(content: string, matchRule: string, matchExtendRule: string) {
  const lines = content.split('\n')
  const chapters: TocModel[] = []
  chapters.push({
    index: 0,
    text: '序 #0',
    title: '序'
  })
  lines.forEach((line, index) => {
    let chapter = line.match(matchRule)
    if (chapter == null && matchExtendRule != '') {
      chapter = line.match(matchExtendRule)
    }
    if (chapter != null) {
      let title = chapter[2]
      if (title != undefined && !isChineseChar(title[0])) {
        title = title.substring(1)
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

export function matchDesc(content: string, chapters: Array<TocModel>, fileName: string) {
  const lines = content.split('\n')
  let desc = ''
  let isMatch = false
  let firstChapterIndex = lines.length - 1
  if (chapters.length > 1) {
    firstChapterIndex = chapters[1].index
  }
  for (let index = 0; index < firstChapterIndex; index++) {
    const element = lines[index].trimStart()
    if (!isMatch && element.indexOf('简介：') > -1) {
      desc = element.replace('简介：', '')
      isMatch = true
      break
    }
  }
  // 没有简介取第一章前3行
  if (desc == '') {
    desc = lines[chapters[1].index] + lines[chapters[1].index + 1] + lines[chapters[1].index + 2]
  }
  let remark = fileName.split('作者')[0]
  if (remark.indexOf('》') > -1) {
    remark = remark.split('》')[1]
  }
  if (remark.indexOf('】') > -1) {
    remark = remark.split('】')[1]
  }
  if (remark != '') {
    desc = remark + ' ' + desc
  }
  return desc
}

export function matchTitle(fileName: string) {
  let bookTitle = fileName.split('作者')[0]
  if (bookTitle.indexOf('《') > -1) {
    bookTitle = bookTitle.split('《')[1].split('》')[0]
  }
  if (bookTitle.indexOf('【') > -1) {
    bookTitle = bookTitle.split('【')[1].split('】')[0]
  }
  return bookTitle
}

export function matchAuthor(fileName: string) {
  let author = ''
  if (fileName.indexOf('作者') > -1) {
    author = fileName.split('作者')[1].split(' ')[0].replace('：', '').replace('.txt', '')
  }
  return author
}
