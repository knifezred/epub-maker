<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-card elevation="1">
          <v-row>
            <v-col :cols="3">
              <v-img
                :width="225"
                :height="300"
                aspect-ratio="1"
                cover
                :src="book.cover.length > 0 ? book.cover[0].path : coverIcon" />
            </v-col>

            <v-col :cols="5">
              <v-file-input
                v-model="txtFile"
                accept=".txt"
                label="txt文件"
                prepend-icon="mdi-file-document-outline"
                @update:model-value="loadFile" />

              <v-file-input
                v-model="book.cover"
                accept="image/*"
                label="封面"
                prepend-icon="mdi-camera" />

              <v-text-field
                v-model="setting.outputDir"
                label="生成目录"
                prepend-icon="mdi-folder-outline" />

              <v-btn
                class="text-none mb-4 mr-4"
                color="deep-purple-darken-2"
                variant="flat"
                @click="chapterEdit">
                章节编辑
              </v-btn>

              <v-btn
                class="text-none mb-4 mr-4"
                color="pink-darken-2"
                variant="flat"
                @click="doConvert">
                开始转换
              </v-btn>

              <v-btn
                class="text-none mb-4 mr-5"
                color="deep-purple-darken-2"
                variant="flat"
                @click="saveConfig">
                保存设置
              </v-btn>
            </v-col>
            <v-col :cols="4">
              <v-card>
                <v-text-field v-model="book.title" label="书名" />

                <v-text-field v-model="book.author" label="作者" />

                <v-textarea v-model="book.desc" label="简介" style="height: 124px" />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters class="mt-8">
      <v-col>
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
          <v-tab :value="1"> 章节 </v-tab>

          <v-tab :value="2"> 内容替换 </v-tab>

          <v-tab :value="3"> 书籍信息 </v-tab>

          <v-tab :value="4"> 定制样式 </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item :value="1">
            <v-container fluid>
              <v-card>
                <v-row>
                  <v-col :cols="2">
                    <v-switch
                      v-model="setting.chapterEasy"
                      label="简易规则"
                      class="ml-2"
                      @update:model-value="changeEasy" />
                  </v-col>

                  <v-col>
                    <v-select v-model="setting.chapterEasy1" :items="['第', '卷', '第卷']" />
                  </v-col>

                  <v-col>
                    <v-select
                      v-model="setting.chapterEasy2"
                      :items="['混合型数字', '纯中文数字', '阿拉伯数字']" />
                  </v-col>

                  <v-col>
                    <v-select
                      v-model="setting.chapterEasy3"
                      :items="['章', '卷', '回', '节', '集', '部', '章卷回节集部']" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col :cols="2">
                    <v-switch
                      v-model="setting.chapterRegex"
                      label="正则匹配"
                      class="ml-2"
                      @update:model-value="changeRegex" />
                  </v-col>

                  <v-col>
                    <v-text-field v-model="setting.chapterRegexMode" label="正则表达式" />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col :cols="2">
                    <v-switch v-model="setting.chapterExtend" label="附加规则" class="ml-2" />
                  </v-col>

                  <v-col>
                    <v-text-field v-model="setting.chapterExtendMode" label="正则表达式" />
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-window-item>

          <v-window-item :value="2">
            <v-container fluid>
              <v-card>
                <v-container fluid>
                  <v-textarea v-model="setting.contentReplace" label="替换规则" />
                  <v-btn
                    class="text-none mb-4 mr-4"
                    color="deep-purple-darken-2"
                    variant="flat"
                    @click="doReplaceTxt">
                    开始替换
                  </v-btn>
                </v-container>
              </v-card>
            </v-container>
          </v-window-item>

          <v-window-item :value="3">
            <v-container fluid>
              <v-card>
                <v-row>
                  <v-col> <v-text-field label="译者" /></v-col>
                  <v-col> <v-text-field label="ISBN" /></v-col>
                </v-row>
                <v-row>
                  <v-col><v-text-field label="出版社" /></v-col>
                  <v-col><v-text-field label="出版日期" /></v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field label="类别" />
                  </v-col>
                  <v-col>
                    <v-select label="语言" :items="['zh-CN', 'zh-TW', 'en-US']" />
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-window-item>

          <v-window-item :value="4">
            <v-container fluid>
              <v-card>
                <v-textarea v-model="setting.customStyle" label="css" />
                <v-radio-group v-model="setting.cssType" inline>
                  <v-radio label="略过" value="skip" />
                  <v-radio label="追加" value="append" />
                  <v-radio label="覆盖" value="cover" />
                </v-radio-group>
              </v-card>
            </v-container>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    <v-bottom-sheet v-model="sheet">
      <v-card class="text-center" height="600">
        <v-card-text>
          <v-btn variant="text" @click="sheet = !sheet"> close </v-btn>
          <v-list :items="chapters" item-title="text" item-value="index" :height="535" />
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-snackbar v-model="snackbar.show" :timeout="2000" color="deep-purple-accent-4" elevation="24">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>
<script setup lang="ts">
import { TocModel } from '@renderer/models/entity'
import { generateZip } from '@renderer/utils/GenerateUtil'
import { SnackbarModel } from '@renderer/utils/MessageTips'
import {
  matchAuthor,
  matchChapter,
  matchDesc,
  matchTitle,
  readContent
} from '@renderer/utils/TextContentUtil'
import { Ref, ref } from 'vue'
import coverIcon from '../../../../resources/icon.png'
const txtFile: Ref<File[]> | Ref<undefined> = ref(undefined)
const sheet = ref(false)
const snackbar = ref({ show: false, message: '' } as SnackbarModel)
const book = ref({
  title: '',
  author: '',
  cover: [] as File[],
  desc: ''
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
// 加载配置
loadConfig()
function changeEasy() {
  setting.value.chapterRegex = !setting.value.chapterEasy
}
function changeRegex() {
  setting.value.chapterEasy = !setting.value.chapterRegex
}
const tab = ref(null)
let matchRule = setting.value.chapterRegexMode
let txtContent = ''
let chapters: Array<TocModel> = []
function loadFile() {
  if (txtFile.value != undefined && txtFile.value[0] != undefined) {
    const fileName = txtFile.value[0].name
    readContent(txtFile.value[0]).then((res) => {
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
      cover: [],
      desc: ''
    }
  }
}

function chapterEdit() {
  if (txtContent == '') {
    snackbar.value = { show: true, message: '请先选择文件' } as SnackbarModel
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
  snackbar.value = generateZip(
    book.value.title,
    book.value.author,
    book.value.desc,
    book.value.cover[0].path,
    chapters,
    txtContent,
    setting.value.outputDir
  )
}

function doReplaceTxt() {
  if (setting.value.contentReplace.length == 0) {
    snackbar.value = { show: true, message: '请填写替换规则' } as SnackbarModel
  } else {
    // TODO test
    snackbar.value = { show: true, message: setting.value.contentReplace } as SnackbarModel
  }
}

function loadConfig() {
  const localSetting = localStorage.getItem('setting')
  if (localSetting != null) {
    setting.value = JSON.parse(localSetting)
  }
}

function saveConfig() {
  const json = JSON.stringify(setting.value)
  localStorage.setItem('setting', json)
  snackbar.value = { show: true, message: '保存成功' } as SnackbarModel
}
</script>
