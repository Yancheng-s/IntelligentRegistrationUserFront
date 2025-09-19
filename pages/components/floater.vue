<!-- floater.vue -->

<template>
  <view class="container">
    <uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
      :direction="direction" @trigger="trigger" @fabClick="fabClick" />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'

// 引用组件
const fab = ref(null)

// 响应式数据
const horizontal = ref('left')
const vertical = ref('bottom')
const direction = ref('horizontal')
const is_color_type = ref(false)

// 计算属性
const directionStr = computed(() => direction.value === 'horizontal' ? '垂直' : '水平')

// 模式配置
const pattern = ref({
  color: '#7A7E83',
  backgroundColor: '#fff',
  selectedColor: '#007AFF',
  buttonColor: '#007AFF',
  iconColor: '#fff'
})

// 内容项
const content = ref([
  {
    iconPath: '/static/image.png',
    selectedIconPath: '/static/image-active.png',
    text: '相册',
    active: false
  },
  {
    iconPath: '/static/home.png',
    selectedIconPath: '/static/home-active.png',
    text: '首页',
    active: false
  },
  {
    iconPath: '/static/star.png',
    selectedIconPath: '/static/star-active.png',
    text: '收藏',
    active: false
  }
])

// 方法
const trigger = (e) => {
  console.log(e)
  content.value[e.index].active = !e.item.active
  uni.showModal({
    title: '提示',
    content: `您${content.value[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
    success: function(res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

const fabClick = () => {
  uni.showToast({
    title: '点击了悬浮按钮',
    icon: 'none'
  })
}

const switchBtn = (hor, ver) => {
  if (hor === 0) {
    direction.value = direction.value === 'horizontal' ? 'vertical' : 'horizontal'
  } else {
    horizontal.value = hor
    vertical.value = ver
  }
}

const switchColor = () => {
  is_color_type.value = !is_color_type.value
  if (is_color_type.value) {
    pattern.value.iconColor = '#aaa'
    pattern.value.buttonColor = '#fff'
  } else {
    pattern.value.iconColor = '#fff'
    pattern.value.buttonColor = '#007AFF'
  }
}

// 返回按钮处理
onBackPress(() => {
  if (fab.value?.isShow) {
    fab.value.close()
    return true
  }
  return false
})
</script>

<style lang="scss">
.warp {
  padding: 10px;
}

.button {
  margin-bottom: 10px;
}

</style>