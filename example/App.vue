<template>
	<div>
		<!-- <hello-world :msg="msg"></hello-world> -->
		<h2>{{ title }}: {{ count }}</h2>
		<button @click="plus">+1</button><br />
		<input v-model="todo" /><button @click="addTodo">add</button><br />

		<h3>操作历史记录</h3>
		<div>
			<span>与v-for同级的子节点</span><br />
			<!-- <div v-if="count > 1003">asd</div> -->
			<span v-for="(n, i) in countList" :key="n">
				第{{ n }}次点击: {{ n }} <button @click="del(i)">删除</button>
				<br />
			</span>
		</div>
	</div>
</template>

<script>
import HelloWorld from "./HelloWorld.vue";
export default {
	components: { HelloWorld },
	data: function () {
		return {
			todo: "",
			msg: "nkxrb",
			title: "",
			count: 0,
			test: 1001,
			countList: [],
		};
	},
	mounted() {
		this.title = "计数";
		Promise.resolve().then(() => {
			this.count = 1001;
		});
	},
	watch: {
		count: function (newV, oldV) {
			this.countList.push(newV);
			console.log(this.countList);
		},
	},
	methods: {
		addTodo() {
			this.countList.push(this.todo);
		},
		plus() {
			this.count++;
		},
		del(i) {
			this.countList.splice(i, 1);
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