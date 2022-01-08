<template>
	<view class="schedule-content">
		<view class="date-group">
			<view class="schedule-date">{{getListDate(value.SchedulingDate)}}</view>
			<view class="schedule-week">{{getWeek(value.SchedulingDate)}}</view>
		</view>
		<button class="button-order" :disabled="getDisable(value.ListItem)" type="default" @click="orderClick()">预约</button>
		<!-- <button class="button_order"  type="default" @click="getListDate('2021-07-03')">预约</button> -->
	</view>
</template>

<script>
	export default {
		props: {
			value: {}
		},
		data() {
			return {

			}
		},
		methods: {
			orderClick:function(){
				this.$emit('orderClick')
			},
			getDisable:function(item){
				// let isCanDel=0;
				// for(var i=0;i<item.length;i++){
				// 	isCanDel+=item[i].IsCanAppoint;
				// }
				// if(isCanDel==0) return true;
				// if(isCanDel>0) return false;
				return false;
			},
			getWeek:function(d){
				let dateArray = d.split("-");
				let date = new Date(dateArray[0],parseInt(dateArray[1]-1),dateArray[2]);
				return "星期"+"日一二三四五六".charAt(date.getDay())
				// console.log("星期"+"日一二三四五六".charAt(date.getDay()))
				
			},
			getListDate:function(s){
				let today = new Date();
				let dateArray = s.split("-");
				let listDay = new Date(dateArray[0],parseInt(dateArray[1]-1),dateArray[2]);
				let tomorrow = new Date();
				tomorrow.setTime(today.getTime()+24*60*60*1000);
				if(today.getYear()==listDay.getYear()&&today.getMonth()==listDay.getMonth()&&today.getDate()==listDay.getDate()) return  "今天";
				else if(tomorrow.getYear()==listDay.getYear()&&tomorrow.getMonth()==listDay.getMonth()&&tomorrow.getDate()==listDay.getDate()) return  "明天";
				else return s;
				
			}
		}
	}
</script>

<style>
	.schedule-content {
		width: auto;
		height: 45px;
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		background-color: #ffffff;
	}

	.date-group {
		width: auto;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.schedule-date {
		color: #000000;
		font-size: 14px;
		font-weight: bold;
		width: 100px;
		height: auto;
		margin-top: auto;
		margin-bottom: auto;
		text-align: left;
		margin-left: 5px;
	}

	.schedule-week {
		color: #000000;
		font-size: 14px;
		font-weight: bold;
		width: 75px;
		height: auto;
		margin-top: auto;
		margin-bottom: auto;
		text-align: center;

	}

	.button-order {
		font-size: 14px;
		color: #FFFFFF;
		height: 35px;
		width: 75px;
		text-align: center;
		background-color: #3399FF;
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
</style>
