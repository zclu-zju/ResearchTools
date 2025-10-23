<template>

  <div class="item-card">
    <div class="item-card__header">
      <el-space size="large">
        <div class="item-card__title">{{ item.title }}</div>
        <el-tag round>{{ item.category }}</el-tag>
      </el-space>
    </div>
    <div class="item-card__body">
      <el-scrollbar max-height="2.8rem">
        {{ item.description }}
      </el-scrollbar>
    </div>
    <div class="item-card__footer">
      <el-link :href="item.url" target="_blank" rel="noopener noreferrer">
        <el-button type="primary" size="default" @click="">
          <template #icon>
            <el-icon>
              <Position/>
            </el-icon>
          </template>
          <template #default>Visit</template>
        </el-button>
      </el-link>
    </div>
  </div>
</template>

<script setup>
import {Position} from "@element-plus/icons-vue"

defineProps({
  item: {type: Object, required: true}
});

</script>

<style scoped>
.item-card {
  margin: 16px 0;
  padding: 20px 15px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(150, 150, 150, 0.5);
}

.item-card__header {
  font-size: 105%;
  font-weight: bold;
}

.item-card__body {
  margin: 10px 0 20px;
  font-size: 95%;
  color: #525252;
}

.item-card__footer {
  display: flex;
  justify-content: space-between;
}
</style>
