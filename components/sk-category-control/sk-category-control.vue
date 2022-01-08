<template>
	<view class="content">
		
		<scroll-view class="scroll" scroll-y="false" scroll-x="true">
			<view style="flex-direction: row;">
				<view class="item" v-for="(item,index) in values" :key="index">
					{{item}}
				</view>
			</view>
		</scroll-view>
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
	.content{
		min-height: 40px;
		width: 100%;
		background-color: #eeeeee;
	}
	.scroll{
		display: flex;
		flex-direction: row;	
		width: 375px;
		height: 40px;
		flex-direction: row;
		white-space: nowrap;
	
	}
	.item{
		display: inline-block;
		flex-wrap: nowrap;
		padding-left: 20px;
		padding-right: 20px;
	}
</style>
