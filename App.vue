<!-- App.vue -->

<template>

</template>
<script>

	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		
	}
	uni.onTabBarMidButtonTap(() => {
	  uni.navigateTo({
	    url: '/pages/index/chat', // 跳转到指定页面
	    success: function() {
	      console.log('跳转成功');
	    },
	    fail: function() {
	      console.log('跳转失败');
	    }
	  });
	});
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-plus/index.scss";
</style>
