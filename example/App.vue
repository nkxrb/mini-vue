<template>
	<div>
		<h2>{{ count }}</h2>
		<button @click="plus">+1</button>
		<h3>点击历史记录</h3>
		<div>
			<span v-for="(n, i) in countList" :key="n">
				{{ i }}. 第{{ n }}次点击: {{ n }} <button @click="del(i)">删除</button>
				<br />
			</span>
		</div>
	</div>
</template>

<script>
export default {
	data: function () {
		return {
			count: 0,
			test: 1001,
			countList: [],
		};
	},
	methods: {
		plus() {
			this.count++;
			this.countList = [...this.countList, this.count];
		},
		del(i) {
			this.countList.splice(i, 1);
			this.countList = [...this.countList];
		},
		testNoReactive() {
			// 测试修改test属性，不触发重新渲染
			console.log("testNoReactive", this.test++);
		},
	},
};
</script>

<style>
</style>