<template>
	<div>Hello {{ msg }}!</div>
</template>

<script>
export default {
	name: "helloWorld",
	props: {
		msg: String,
	},
};
</script>

<style>
</style>