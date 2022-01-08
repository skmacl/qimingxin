<template>
	<view class="image-code-content">
		 <view class="canvas-img-code"><canvas :style="{ width: width + 'px', height: height + 'px' }" canvas-id="imgcanvas" @tap="refresh"></canvas></view>
	</view>
</template>

<script>
	export default{
		props:{
			width:120,
			height:30
		},
		data(){
			return{
				wid:120,
				hei:30
			}
		},
		mounted() {
			let _this = this
			if(this.width > 0){
				this.wid = this.width
			}
			if(this.height > 0){
				this.hei = this.height
			}
			setTimeout(function() {
				_this.initImageCode()
			}, 1000);
		},
		methods:{
			initImageCode() {
			           let context = uni.createCanvasContext('imgcanvas', this),
			               w = this.wid,
			               h = this.hei;
			           context.setFillStyle('white');
			           context.setLineWidth(5);
			           context.fillRect(0, 0, w, h);
			           let pool = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'S', 'Y', 'Z', '2', '3', '4', '5', '6', '7', '8', '9'],
			               str = '';
			           for (let i = 0; i < 4; i++) {
			               let c = pool[this.rn(0, pool.length - 1)]; 
			               let deg = this.rn(-20, 20); 
			               context.setFontSize(18);
			               context.setTextBaseline('top');
			               context.setFillStyle(this.rc(80, 150));
			               context.save();
			               context.translate(30 * i + 15, parseInt(h / 1.5));
			               context.rotate((deg * Math.PI) / 180);
			               context.fillText(c, -15 + 5, -15);
			               context.restore();
			               str += c;
			           }
			           // uni.setStorage({
			           //     key: 'imgcode',
			           //     data: str.toLowerCase()
			           // });
					   this.$emit("codeClick",{
						   codeStr:str.toLocaleLowerCase()
					   })
			           for (let i = 0; i < 40; i++) {
			               context.beginPath();
			               context.arc(this.rn(0, w), this.rn(0, h), 1, 0, 2 * Math.PI);
			               context.closePath();
			               context.setFillStyle(this.rc(150, 200));
			               context.fill();
			           }
			           context.draw();
			       },
			       rc(min, max) {
			           let r = this.rn(min, max);
			           let g = this.rn(min, max);
			           let b = this.rn(min, max);
			           return 'rgb(' + r + ',' + g + ',' + b + ')';
			       },
			       rn(max, min) {
			           return parseInt(Math.random() * (max - min)) + min;
			       },
			       refresh() {
			           this.initImageCode();
			       }
		}
	}
</script>

<style>
	.image-code-content{
		width: 100%;
		height: 30px;
	}
</style>
