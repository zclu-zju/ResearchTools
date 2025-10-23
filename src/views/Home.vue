<template>
  <el-space style="align-items: start;" :direction="windowWidth > 780?'horizontal':'vertical'">
    <el-affix v-if="windowWidth > 780" style="width: 20rem; margin-right: 1rem;" :offset="110">
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
    <div v-else>
      <div class="category-box" style="box-shadow: 0 0 15px rgba(255,190,190,0.05)">
        <div class="box-search" style="margin-top: 0;">
          <el-input
              v-model="searchText"
              :prefix-icon="Search"
              placeholder="搜索工具..."
              clearable
              size="large"
          />
        </div>
        <el-space class="category-menu" wrap>
          <el-tag :type="category===''?'primary':'info'"
                  @click="changeCategory()"
                  class="category-menu-tag"
          >
            所有工具
          </el-tag>
          <el-tag
              :type="category===item?'primary':'info'"
              v-for="(item, ix) in categories"
              :key="item"
              @click="changeCategory(item)"
              class="category-menu-tag"
          >
            <span class="category-menu-item-title">{{ item }} </span>
          </el-tag>
        </el-space>
      </div>
    </div>
    <div style="width: 100%; display:flex; flex-wrap: wrap; "
         :style="{justifyContent: windowWidth > 780?'space-between':'space-around'}"
    >
      <ItemCard v-for="(item, i) in filteredList" :item="item"
                :style="{width: `calc(${100 / cardsColNum}% - 40px)`}"
      />
    </div>
  </el-space>
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

const windowWidth = ref(window.innerWidth);
const cardsColNum = ref(3);
const updateColNum = () => {
  if (windowWidth.value < 992) {
    cardsColNum.value = 1
  } else if (windowWidth.value < 1200) {
    cardsColNum.value = 2
  } else {
    cardsColNum.value = 3
  }
}
watch(windowWidth, () => {
  updateColNum();
})
const updateWidth = () => {
  windowWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener("resize", () => updateWidth())
  updateWidth()
  updateColNum()
})
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

.category-menu-tag {
  cursor: pointer;
}
</style>
