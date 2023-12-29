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
                src="../../static/imgs/t2.webp"
              ></v-img>
            </v-col>
            <v-col :cols="4">
              <v-card>
                <v-text-field v-model="book.title" label="书名"></v-text-field>
                <v-text-field v-model="book.author" label="作者"></v-text-field>
                <v-textarea v-model="book.desc" label="简介"></v-textarea>
              </v-card>
            </v-col>
            <v-col :cols="5">
              <v-file-input
                v-model="txtFile"
                accept=".txt"
                label="txt文件"
                prepend-icon="mdi-file-document-outline"
                @update:model-value="loadFile"
              ></v-file-input>
              <v-text-field
                v-model="outputDir"
                label="生成目录"
                prepend-icon="mdi-folder-outline"
              ></v-text-field>
              <v-btn
                class="text-none mb-4 mr-4"
                color="blue-darken-2"
                size="x-large"
                variant="flat"
                @click="doConvert"
              >
                开始转换
              </v-btn>
              <v-btn class="text-none mb-4" color="blue-darken-2" size="x-large" variant="flat">
                编辑txt文件
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-8">
      <v-col>
        <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
          <v-tab :value="1">章节</v-tab>
          <v-tab :value="2">版式</v-tab>
          <v-tab :value="3">书籍信息</v-tab>
          <v-tab :value="4">定制样式</v-tab>
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
                      @update:model-value="changeEasy"
                    ></v-switch>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="setting.chapterEasy1"
                      :items="['第', '卷', '[第卷]']"
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="setting.chapterEasy2"
                      :items="['混合型数字', '纯中文数字', '纯英文数字']"
                    ></v-select>
                  </v-col>
                  <v-col>
                    <v-select
                      v-model="setting.chapterEasy3"
                      :items="['章', '卷', '回', '节', '集', '部', '[章卷回节集部]']"
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col :cols="2"
                    ><v-switch
                      v-model="setting.chapterRegex"
                      label="正则匹配"
                      class="ml-2"
                      @update:model-value="changeRegex"
                    ></v-switch
                  ></v-col>
                  <v-col>
                    <v-text-field
                      v-model="setting.chapterRegexMode"
                      label="正则表达式"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col></v-col>
                  <v-col></v-col>
                  <v-col>
                    <v-btn class="text-none mb-4 mr-5" color="grey-darken-3" variant="flat">
                      保存
                    </v-btn>
                    <v-btn class="text-none mb-4" color="indigo-darken-2" variant="flat">
                      章节编辑
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-window-item>
          <v-window-item :value="2">
            <v-container fluid>
              <v-card>
                <v-text-field v-model="book.title" label="书名"></v-text-field>
                <v-text-field v-model="book.author" label="作者"></v-text-field>
              </v-card>
            </v-container>
          </v-window-item>
          <v-window-item :value="3">
            <v-container fluid>
              <v-card>
                <v-row>
                  <v-col> <v-text-field label="译者"></v-text-field></v-col>
                  <v-col> <v-text-field label="ISBN"></v-text-field></v-col>
                </v-row>
                <v-row>
                  <v-col><v-text-field label="出版社"></v-text-field></v-col>
                  <v-col><v-text-field label="出版日期"></v-text-field></v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field label="类别"></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select label="语言" :items="['zh-CN', 'zh-TW', 'en-US']"></v-select>
                  </v-col>
                </v-row>
              </v-card>
            </v-container>
          </v-window-item>
          <v-window-item :value="4">
            <v-container fluid>
              <v-card>
                <v-textarea label="css"></v-textarea>
                <v-radio-group v-model="setting.cssType" inline>
                  <v-radio label="略过" value="css1"></v-radio>
                  <v-radio label="追加" value="css2"></v-radio>
                  <v-radio label="覆盖" value="css3"></v-radio>
                </v-radio-group>
                <v-checkbox v-model="setting.autoSaveCss" label="自动保存CSS"></v-checkbox>
              </v-card>
            </v-container>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
    <v-row>
      <v-col> info </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const txtFile = ref(undefined)
const outputDir = ref('./')
const book = ref({
  title: '',
  author: '',
  desc: ''
})
const setting = ref({
  autoSaveCss: true,
  cssType: 'css1',
  chapterEasy: true,
  chapterEasy1: '第',
  chapterEasy2: '混合型数字',
  chapterEasy3: '章',
  chapterRegex: false,
  chapterRegexMode: '^\\s*[第卷][0123456789一二三四五六七八九零〇百千万两]*[章卷回节集部].*'
})
function changeEasy() {
  setting.value.chapterRegex = !setting.value.chapterEasy
}
function changeRegex() {
  setting.value.chapterEasy = !setting.value.chapterRegex
}
const tab = ref(null)
function loadFile() {
  let fileName = txtFile.value[0].name
  let bookTitle = fileName
  if (fileName.indexOf('作者') > -1) {
    book.value.author = fileName
      .split('作者')[1]
      .split(' ')[0]
      .replace(':', '')
      .replace('：', '')
      .replace('.txt', '')
    bookTitle = fileName.split('作者')[0]
  }
  if (fileName.indexOf('《') > -1) {
    bookTitle = fileName.split('《')[1].split('》')[0]
  }
  if (fileName.indexOf('【') > -1) {
    bookTitle = fileName.split('【')[1].split('】')[0]
  }
  if (fileName.indexOf('[') > -1) {
    bookTitle = fileName.split('[')[1].split(']')[0]
  }
  bookTitle = bookTitle.replace('.txt', '')
  book.value.title = bookTitle
  console.log('info' + txtFile.value)
}
function doConvert() {
  console.log('convert')
}
</script>
