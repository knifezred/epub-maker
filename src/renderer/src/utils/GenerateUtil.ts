import { TocModel } from '@renderer/models/entity'
import { SnackbarModel } from './MessageTips'
export function generateZip(
  bookName: string,
  author: string,
  desc: string,
  cover: string,
  toc: TocModel[],
  text: string,
  outPut: string
) {
  const uid = generateRandomUid(10)
  try {
    const zipFiles: Array<ZipFile> = []
    // 创建一个新的ZIP文件
    // 添加文件到ZIP中
    zipFiles.push({
      fileName: 'META-INF/container.xml',
      fileContent: window.api.readFileSync(
        window.api.getAbsolutePath('resources/template/META-INF/container.xml'),
        'utf-8'
      ),
      encode: 'utf8'
    })
    zipFiles.push({
      fileName: 'mimetype',
      fileContent: window.api.readFileSync(
        window.api.getAbsolutePath('resources/template/mimetype'),
        'utf-8'
      ),
      encode: 'utf8'
    })
    // 样式
    zipFiles.push({
      fileName: 'OEBPS/style.css',
      fileContent: window.api.readFileSync(
        window.api.getAbsolutePath('resources/template/OEBPS/style.css'),
        'utf-8'
      ),
      encode: 'utf8'
    })
    // 封面
    let coverHtml = window.api.readFileSync(
      window.api.getAbsolutePath('resources/template/OEBPS/cover.html'),
      'utf8'
    )
    coverHtml = coverHtml.replace('$bookName$', bookName)
    zipFiles.push({
      fileName: 'OEBPS/cover.html',
      fileContent: coverHtml,
      encode: 'utf8'
    })
    zipFiles.push({
      fileName: 'OEBPS/cover.jpg',
      fileContent: window.api.readFileSync(cover, 'binary'),
      encode: 'binary'
    })
    // 目录制作
    let navMap = ''
    let bookToc = ''
    let contentManifest = ''
    let contentSpine = ''
    const textArray = text.split('\n')
    for (let index = 0; index < toc.length; index++) {
      const item = toc[index]
      // toc.ncx
      navMap +=
        '<navPoint id="chapter' +
        index +
        '" playOrder="' +
        (index + 3) +
        '">' +
        '<navLabel><text>' +
        item.title +
        '</text></navLabel>' +
        '<content src="chapter' +
        index +
        '.html" />' +
        '</navPoint>'
      // book-toc.html
      bookToc += '<dt class="tocl2"><a href="chapter' + index + '.html">' + item.title + '</a></dt>'
      // content.opf
      contentManifest +=
        '<item id="chapter' +
        index +
        '" href="chapter' +
        index +
        '.html" media-type="application/xhtml+xml" />'
      contentSpine += '<itemref idref="chapter' + index + '" linear="yes" />'
      // 追加章节内容
      let chapterHtml = window.api.readFileSync(
        window.api.getAbsolutePath('resources/template/OEBPS/chapter.html'),
        'utf8'
      )

      let chapterContent = ''
      if (index == toc.length - 1) {
        for (let p = item.index; p < textArray.length - 1; p++) {
          const element = textArray[p + 1]
          chapterContent += '<p>' + element + '</p>'
        }
      } else {
        for (let p = item.index; p < toc[index + 1].index - 1; p++) {
          const element = textArray[p + 1]
          chapterContent += '<p>' + element + '</p>'
        }
      }
      chapterHtml = chapterHtml.replace('$title$', item.title)
      chapterHtml = chapterHtml.replace('$title$', item.title)
      chapterHtml = chapterHtml.replace('$content$', chapterContent)
      zipFiles.push({
        fileName: 'OEBPS/chapter' + index + '.html',
        fileContent: chapterHtml,
        encode: 'utf8'
      })
    }
    let contentOpf = window.api.readFileSync(
      window.api.getAbsolutePath('resources/template/OEBPS/content.opf'),
      'utf8'
    )
    contentOpf = contentOpf.replace('$manifest$', contentManifest)
    contentOpf = contentOpf.replace('$spine$', contentSpine)
    contentOpf = contentOpf.replace('$bookName$', bookName)
    contentOpf = contentOpf.replace('$author$', author)
    contentOpf = contentOpf.replace('$desc$', desc)
    contentOpf = contentOpf.replace('$uid$', uid)
    contentOpf = contentOpf.replace('$year$', new Date().getFullYear())
    zipFiles.push({
      fileName: 'OEBPS/content.opf',
      fileContent: contentOpf,
      encode: 'utf8'
    })
    let bookTocHtml = window.api.readFileSync(
      window.api.getAbsolutePath('resources/template/OEBPS/book-toc.html'),
      'utf8'
    )

    bookTocHtml = bookTocHtml.replace('$toc$', bookToc)
    zipFiles.push({
      fileName: 'OEBPS/book-toc.html',
      fileContent: bookTocHtml,
      encode: 'utf8'
    })
    let tocNcx = window.api.readFileSync(
      window.api.getAbsolutePath('resources/template/OEBPS/toc.ncx'),
      'utf8'
    )

    tocNcx = tocNcx.replace('$bookName$', bookName)
    tocNcx = tocNcx.replace('$author$', author)
    tocNcx = tocNcx.replace('$navMap$', navMap)
    tocNcx = tocNcx.replace('$uid$', uid)
    zipFiles.push({
      fileName: 'OEBPS/toc.ncx',
      fileContent: tocNcx,
      encode: 'utf8'
    })
    // 保存文件到磁盘
    window.api.createZip(zipFiles, outPut + '/' + bookName + '-' + author + '.epub')
  } catch (error) {
    return { show: true, message: error } as SnackbarModel
  }
  return { show: true, message: '转换成功' } as SnackbarModel
}
// 生成随机uid
function generateRandomUid(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let uid = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    uid += characters[randomIndex]
  }
  return uid
}
