<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'
import { marked } from 'marked'
import hljs from 'highlight.js'

import { useAppStore, useUserStore } from '@/store'

marked.setOptions({
  // highlight(code: string, lang: string) {
  //   const language = hljs.getLanguage(lang) ? lang : 'plaintext'
  //   return hljs.highlight(code, { language }).value
  // },
})

const anthropic = new Anthropic({
  apiKey: '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', // defaults to process.env["ANTHROPIC_API_KEY"]
})

const axiosInstance = axios.create({
  baseURL: '/v1',
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': anthropic.apiKey,
    'anthropic-version': '2023-06-01',
  },
  timeout: 10000000,
})

const data = {
  max_tokens: 1024,
  model: 'claude-3-opus-20240229',
  messages: [] as { role: string, content: string }[],
}

const drawer = ref(false)
const messageList = ref<{ role: string, content: string }[]>([])
const messageInput = ref('')

onMounted(async () => {
  messageList.value.push({
    role: 'assistant',
    content: '你好,我是小助手,请问有什么可以帮助您的?',
  })
})

function clearMessage() {
  messageList.value = []
  data.messages = []
}

function renderMessage(message: { role: string, content: string }) {
  const html = marked.parse(message.content)
  const avatar = message.role === 'user' ? useUserStore().avatar : useAppStore().avatar
  return `<div class="chat-item ${message.role === 'user' ? 'chat-item-user' : ''}">
            <img src="${avatar}" alt="${message.role}" class="chat-avatar" />
            <span class="chat-sender">${message.role}</span>
            <div class="chat-item-content">${html}</div>
          </div>`
}

async function sendMessage() {
  if (!messageInput.value)
    return

  if (messageInput.value) {
    messageList.value.push({
      role: 'user',
      content: messageInput.value,
    })
    data.messages.push({
      role: 'user',
      content: messageInput.value,
    })
    messageInput.value = ''
    axiosInstance.post('/messages', data).then((res) => {
      messageList.value.push({
        role: 'assistant',
        content: res.data.content[0].text,
      })
      data.messages.push({
        role: 'assistant',
        content: res.data.content[0].text,
      })
      hljs.highlightAll()
    }).catch((err) => {
      console.error(err)
    })
  }
}
</script>

<!-- 其余代码保持不变 -->

<template>
  <el-button round type="success" style="margin-left: 16px" @click="drawer = true">
    <el-icon size="large" style="margin-right: 4px">
      <ChatLineRound />
    </el-icon>
    向我提问
  </el-button>
  <el-drawer v-model="drawer" title="Chat" :with-header="true" size="40%" :modal="true" :lock-scroll="false" :append-to-body="true">
    <div class="chat-box">
      <div class="chat-content">
        <div
          v-for="message of messageList"
          :key="message.content"
          v-html="renderMessage(message)"
        />
      </div>
      <div class="chat-input" style="padding: 8px 5px; justify-content: center;">
        <el-input
          v-model="messageInput"
          maxlength="1000"
          size="large"
          placeholder="请输入问题"
          style="width: 240px; margin: 0 8px;"
          :autosize="{ minRows: 1, maxRows: 4 }"
          type="textarea"
          @keydown.enter="sendMessage"
        >
          <template #prefix>
            <i class="el-icon-chat" />
          </template>
        </el-input>
        <el-button type="primary" size="medium" @click="sendMessage">
          发送
        </el-button>
        <el-button type="primary" size="medium" @click="clearMessage">
          清空聊天记录
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style>
.chat-box {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.chat-item {
  display: flex;
  margin-bottom: 8px;
}

.chat-item-user {
  justify-content: flex-end;
}

.chat-sender {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-right: 8px; /* 对于用户消息 */
  margin-left: 8px; /* 对于机器人消息 */
}

.chat-item-content {
  padding: 8px 16px;
  border-radius: 12px;
  background-color: #f0f0f0;
  max-width: 70%;
  line-height: 1.5;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.chat-item-user .chat-item-content {
  background-color: #e6f7ff; /* 用户消息的颜色 */
}

.chat-input {
  display: flex;
  align-items: center;
}

.chat-input .el-input {
  width: 100%;
}

.chat-avatar {
  width: 32px; /* 调整头像尺寸 */
  height: 32px;
  border-radius: 50%; /* 设置为圆形 */
  margin-right: 8px; /* 对于用户消息 */
  margin-left: 8px;  /* 对于机器人消息 */
  vertical-align: middle; /* 垂直居中 */
}
</style>
