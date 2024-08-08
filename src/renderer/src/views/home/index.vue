<script setup lang="ts">
import { generateZip } from '@renderer/utils/GenerateUtil'
import {
  matchAuthor,
  matchChapter,
  matchDesc,
  matchTitle,
  readContent
} from '@renderer/utils/TextContentUtil'
import { ref } from 'vue'

defineOptions({
  name: 'Home'
})
const setting = ref({
  outputDir: 'F:/',
  chapterEasy: false,
  chapterEasy1: '第',
  chapterEasy2: '混合型数字',
  chapterEasy3: '章',
  chapterRegex: true,
  chapterRegexMode:
    '^\\s*([第卷\\(（][0123456789一二三四五六七八九十零〇百千万两]*[章卷回节集部）\\)])(.*)',
  chapterExtend: false,
  chapterExtendMode: '^\\s*(简介|序言|序[1-9]|序曲|后记|尾声)$',
  cssType: 'skip',
  customStyle: '',
  contentReplace: ''
})

const book = ref({
  title: '',
  author: '',
  cover: '',
  desc: ''
})
function beforeUploadImage(beforeUpload) {
  book.value.cover = beforeUpload.file.file.path
  return beforeUpload
}

function saveConfig() {
  const json = JSON.stringify(setting.value)
  localStorage.setItem('setting', json)
  window.$message?.success('保存成功')
}
// 加载配置
function loadConfig() {
  const localSetting = localStorage.getItem('setting')
  if (localSetting != null) {
    setting.value = JSON.parse(localSetting)
  }
}
loadConfig()

function changeEasy() {
  setting.value.chapterRegex = !setting.value.chapterEasy
}
function changeRegex() {
  setting.value.chapterEasy = !setting.value.chapterRegex
}
const tab = ref('')
let matchRule = setting.value.chapterRegexMode
let txtContent = ''
let chapters: Array<Dto.TocModel> = []

const txtFile = ref<File | undefined>(undefined)
function beforeUploadText(beforeUpload) {
  txtFile.value = beforeUpload.file.file
  loadFile()
  return beforeUpload
}
function loadFile() {
  if (txtFile.value != undefined && txtFile.value[0] != undefined) {
    const fileName = txtFile.value.name
    readContent(txtFile.value).then((res) => {
      txtContent = res
      chapters = matchChapter(
        txtContent,
        matchRule,
        setting.value.chapterExtend ? setting.value.chapterExtendMode : ''
      )
      book.value.title = matchTitle(fileName)
      book.value.author = matchAuthor(txtContent, chapters, fileName)
      book.value.desc = matchDesc(txtContent, chapters, fileName)
    })
  } else {
    book.value = {
      title: '',
      author: '',
      cover: '',
      desc: ''
    }
  }
}

function chapterEdit() {
  if (txtContent == '') {
    window.$message?.warning('请先选择文件')
  } else {
    if (setting.value.chapterEasy) {
      matchRule = ''
      if (setting.value.chapterEasy2 == '阿拉伯数字') {
        matchRule =
          '^\\s*([' +
          setting.value.chapterEasy1 +
          '][0123456789]*[' +
          setting.value.chapterEasy3 +
          '])(.*)'
      } else if (setting.value.chapterEasy2 == '纯中文数字') {
        matchRule =
          '^\\s*([' +
          setting.value.chapterEasy1 +
          '][一二三四五六七八九零十〇百千万两]*[' +
          setting.value.chapterEasy3 +
          '])(.*)'
      } else {
        matchRule =
          '^\\s*([' +
          setting.value.chapterEasy1 +
          '][0123456789一二三四五六七八九零十〇百千万两]*[' +
          setting.value.chapterEasy3 +
          '])(.*)'
      }
    } else {
      matchRule = setting.value.chapterRegexMode
    }
    chapters = matchChapter(
      txtContent,
      matchRule,
      setting.value.chapterExtend ? setting.value.chapterExtendMode : ''
    )
    sheet.value = true
  }
}

function doConvert() {
  generateZip(
    book.value.title,
    book.value.author,
    book.value.desc,
    book.value.cover,
    chapters,
    txtContent,
    setting.value.outputDir
  )
}

function doReplaceTxt() {
  if (setting.value.contentReplace.length == 0) {
    window.$message?.info('请填写替换规则')
  } else {
    window.$message?.info(setting.value.contentReplace)
  }
}
</script>
<template>
  <n-grid x-gap="12" :cols="5">
    <n-gi :span="2">
      <NForm ref="formRef" label-placement="left" :model="book">
        <NFormItem label="书名" path="title">
          <NInput v-model:value="book.title" />
        </NFormItem>
        <NFormItem label="作者" path="author">
          <NInput v-model:value="book.author" />
        </NFormItem>
        <NFormItem label="简介" path="desc">
          <NInput v-model:value="book.desc" type="textarea" />
        </NFormItem>
      </NForm>
    </n-gi>
    <n-gi>
      <NForm>
        <NFormItem label="封面" path="cover">
          <n-upload
            list-type="image-card"
            accept="image"
            :max="1"
            @before-upload="beforeUploadImage" />
        </NFormItem>
      </NForm>
    </n-gi>
    <n-gi :span="2">
      <NForm label-placement="left">
        <NFormItem label="生成目录" path="outputDir">
          <NInput v-model:value="setting.outputDir" />
        </NFormItem>
        <NFormItem label="TXT 文件" path="txtFile">
          <n-upload accept=".txt" :max="1" @before-upload="beforeUploadText">
            <n-upload-dragger>
              <n-text class="text-4"> 点击或者拖动文件到该区域来上传 </n-text>
            </n-upload-dragger>
          </n-upload>
        </NFormItem>
        <NFormItem path="action">
          <NFlex>
            <NButton class="ml-18" type="primary" @click="chapterEdit">章节编辑</NButton>
            <NButton type="error" @click="doConvert">开始转换</NButton>
            <NButton type="primary" @click="saveConfig">保存设置</NButton>
          </NFlex>
        </NFormItem>
      </NForm>
    </n-gi>
    <n-gi :span="5">
      <n-tabs v-model="tab" type="segment" animated class="h-52vh">
        <n-tab-pane name="chap1" tab="章节">
          <NFlex> </NFlex>
        </n-tab-pane>
        <n-tab-pane name="chap2" tab="内容替换">
          <NFlex> </NFlex>
        </n-tab-pane>
        <n-tab-pane name="chap3" tab="书籍信息">
          <NFlex> </NFlex>
        </n-tab-pane>
        <n-tab-pane name="chap4" tab="定制样式">
          <NFlex> </NFlex>
        </n-tab-pane>
      </n-tabs>
    </n-gi>
  </n-grid>
</template>

<style>
.n-upload-file--image-card-type {
  height: 21vh !important;
  width: 18vh !important;
}
</style>
