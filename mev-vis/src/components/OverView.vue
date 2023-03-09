<template>
  	ForceOne:
	<br />

	<div class="svgSizer">
		<div class="svg-container">

		</div>
	</div>
</template>

<script setup>

</script>

<style scoped>
.svgSizer {
	width: 400px;
	height: 400px;
	margin: 0 auto;
	border: thin solid pink;

	resize: both;
	overflow: auto; /* needed for resize to work */
}
.svg-container {
	display: inline-block;
	position: relative;
	width: 100%;
	height: 100%;
	/* padding-bottom: 100%; */
	vertical-align: middle;
	overflow: hidden;
}
.svg-container > svg {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	width: 100%;
	height: 100%;
}

</style>