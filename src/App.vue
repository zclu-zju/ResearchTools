<script setup>
import {RouterView, useRouter} from 'vue-router'
import {ref, watch, onMounted} from "vue";
import SwitchDarkButton from "@/components/SwitchDarkButton.vue";

const isDark = ref(false);
const router = useRouter();
const switchBtnClassName = ref("switch-btn-dark");

watch(isDark, () => {
  switchBtnClassName.value = isDark.value ? 'switch-btn-white' : 'switch-btn-dark'

  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }

  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
})

onMounted(() => {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') {
    isDark.value = true
  }
})

</script>

<template>
  <el-container class="layout-container dark">
    <el-header class="layout-header" height="60px">
      <div class="layout-header__inner">
        <div class="layout-header__left"></div>
        <el-space :size="30" class="layout-header__right">
          <el-link href="https://zcluu.github.io/#/" target="_blank">
            About Me
          </el-link>
          <el-link href="mailto:zclu@zju.edu.cn">
            Contact Me
          </el-link>
          <SwitchDarkButton/>
        </el-space>
      </div>
    </el-header>

    <el-main class="layout-main">
      <el-scrollbar>
        <router-view/>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 20px);
  overflow: hidden;
}

.layout-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
}

/* Header 内部内容 */
.layout-header__inner {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0 40px;
}

.layout-header__left {
  flex: 1;
}

.layout-main {
  flex: 1;
  margin-top: 60px;
  padding: 24px 40px;
  background-color: #fafafa;
}

.dark .layout-main {
  background-color: var(--el-bg-dark);
}
</style>
