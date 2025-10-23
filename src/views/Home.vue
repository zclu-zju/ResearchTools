<template>
  <el-row style="padding: 0 10%">
    <el-col :span="4" :offset="3">
      <el-affix :offset="120">
        <div class="category-box">
          <div class="box-title">工具分类</div>
          <div class="box-search">
            <el-input
                v-model="searchText"
                :prefix-icon="Search"
                placeholder="搜索工具..."
                clearable
                size="large"
            />
          </div>
          <div class="category-menu">
            <div class="category-menu-item"
                 :class="{'active': category===''}"
                 @click="changeCategory()"
            >
              <span class="category-menu-item-title">所有工具</span>
              <span class="category-menu-item-length">{{ data.total }}</span>
            </div>
          </div>
          <div class="category-menu-item"
               v-for="(item, ix) in categories"
               :key="item"
               :class="{'active': category===item}"
               @click="changeCategory(item)"
          >
            <span class="category-menu-item-title">{{ item }} </span>
            <span class="category-menu-item-length">{{ data.grouped[item].length }}</span>
          </div>
        </div>
      </el-affix>
    </el-col>
    <el-col :span="1"></el-col>
    <el-col :span="16">
      <el-row :gutter="0">
        <el-col :xs="24"
                :sm="24"
                :md="12"
                :lg="12"
                v-for="(item, i) in filteredList" :key="i"
                style="padding: 0 10px;"
        >
          <ItemCard :item="item"/>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script setup>
import {ref, computed, watch, onMounted} from "vue";
import {Search} from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import ItemCard from "@/components/ItemCard.vue";
import data from "/src/cards.json";

const route = useRoute();
const router = useRouter();

const searchText = ref("");
const category = ref("");

const items = ref(data.all || []);
const categories = ref(data.categories || []);

onMounted(() => {
  if (route.query.category) {
    category.value = route.query.category;
  }
});

watch(
    () => route.query.category,
    (newCat) => {
      category.value = newCat || "";
    }
);

const filteredList = computed(() => {
  const key = searchText.value.trim().toLowerCase();

  return items.value.filter((item) => {
    // 分类过滤
    const matchCategory =
        !category.value || item.category === category.value;

    const matchSearch =
        !key ||
        item.title.toLowerCase().includes(key) ||
        item.description.toLowerCase().includes(key) ||
        item.category.toLowerCase().includes(key);

    return matchCategory && matchSearch;
  });
});

const changeCategory = (category) => {
  router.push({
    name: "Home",
    query: {category: category},
  })
}
</script>


<style scoped>
.category-box {
  background-color: var(--el-bg-color);
  padding: 20px;
}

.box-title {
  font-weight: bold;
  font-size: 1.3rem;
}

.box-search {
  margin: 20px 0;
}

.category-menu-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  margin: 5px 0;
  border-radius: 5px;

  transition-duration: 0.2s;
  cursor: pointer;
}

.category-menu-item.active, .category-menu-item:hover {
  background-color: #4A90E2;
  color: var(--el-color-white);
}
</style>
