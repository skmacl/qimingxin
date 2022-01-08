<!-- 测评页样例专用--skma -->
<template>	
		<view class="segment-base" :style="{'background-color':background}">
			<view  v-for="(item, index) in values" :key="index" :class="[0 == index?'segment-item left' : 'segment-item right']" :style="{color:currentIndex==index?activeColor:normalColor}"
			@click="_onClick(index)">{{item}}</view>
		</view>
</template>
<script>
	export default {
			name: 'skSegmentedControl',
			props: {
				current: {
					type: Number,
					default: 0
				},
				values: {
					type: Array,
					default () {
						return []
					}
				},
				activeColor: {
					type: String,
					default: '#FFFFFF'
				},
				normalColor: {
					type: String,
					default: '#DDDDDD'
				},
				styleType: {
					type: String,
					default: 'button'
				},
				background: {
					type:String,
					default:"#3399FF"
				},
				line:{
					type:String,
					default:"rgba(0,0,0,0)"
				},
				divide:{
					type:Boolean,
					default:true
				}
			},
			data() {
				return {
					currentIndex: 0
				}
			},
			watch: {
				current(val) {
					if (val !== this.currentIndex) {
						this.currentIndex = val
					}
				}
			},
			created() {
				this.currentIndex = this.current
			},
			methods: {
				_onClick(index) {
					if (this.currentIndex !== index) {
						this.currentIndex = index
						this.$emit('clickItem', {
							currentIndex: index
						})
					}
				}
			}
		}
</script>
<style>
	.segment-base{
		display: flex;
		width: 100%;		
		/* background-color: #3399FF; */
		max-width: 100%;
	}
	.segment-item{
		font-size: 16px;		
		height: 40px;
		line-height: 40px;
		width: 50%;		
		bottom: 0;
		top: 20px;
		margin: auto;
	}
	.left{
		text-align: right;
		padding-right: 15px;
	}
	.right{
		text-align: left;
		padding-left: 15px;
	}
</style>
