<!-- 滑块验证 -->
<template>
  <div
    class="mask"
    :style="{ zIndex: props.zIndex, display: props.show ? 'block' : 'none' }"
    @click.self="clickMask"
  >
    <div
      class="slideValidate"
      :style="{ width: `${props.width}px`, height: `${props.height}px` }"
      v-loading="!state.showPiecce"
    >
      <div
        class="container"
        :style="{
          width: `${props.width}px`,
          height: `${props.height - 50}px`,
        }"
      >
        <img
          v-if="state.backgroundImgUrl"
          :src="state.backgroundImgUrl"
          alt=""
          @load="loadSucess"
          @error="loadError"
        />
        <div
          class="gap"
          v-show="state.showPiecce"
          :style="{
            position: 'absolute',
            left: state.gapPosition[0] + 'px',
            top: state.gapPosition[1] + 'px',
          }"
        ></div>
        <div
          class="fill"
          v-show="state.showPiecce"
          :style="{
            position: 'absolute',
            left: state.slideLeft + 'px',
            top: state.gapPosition[1] + 'px',
            'background-image': `url(${state.backgroundImgUrl})`,
            'background-position': `-${state.gapPosition[0]}px -${state.gapPosition[1]}px`,
          }"
        ></div>
      </div>
      <div class="bar">
        <span>向右滑动填充拼图</span>
        <div
          class="text"
          :style="{
            width: state.slideLeft + 'px',
            backgroundColor: state.slideBg,
          }"
        >
          {{ state.handleText }}
        </div>
        <div
          class="slide"
          :style="{
            left: state.slideLeft + 'px',
            top: 0,
          }"
          @mousedown="move"
          @mouseup="mouseup"
        >
          <el-icon style="z-index: -1"><Right /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, watch } from "vue";
import { Right } from "@element-plus/icons";
//生成范围随机数
const random = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};
const props = defineProps({
  width: {
    type: Number,
    default: 600,
  },
  height: {
    type: Number,
    default: 400,
  },
  zIndex: {
    type: Number,
    default: 999,
  },
  show: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["success", "fail", "close"]);

const state = reactive({
  showPiecce: true, //是否显示缺块和填块 是否展示loading
  backgroundImgUrl: new URL(
    `../assets/img/img${random(0, 10)}.jpeg`,
    import.meta.url
  ).href, //填充的图片url
  gapPosition: [0, 0], //缺块的定位坐标
  slideLeft: 0, //滑动的距离
  handleText: "", //滑动条反馈文案
  slideBg: "#409EFF", //滑动条反馈颜色
});
//图片加载完成
const loadSucess = () => {
  state.showPiecce = true;
  state.gapPosition = [
    random(props.width / 2, props.width - 60),
    random(10, props.height - 110),
  ];
};
//图片加载失败
const loadError = () => {
  setTimeout(() => {
    state.backgroundImgUrl = new URL(
      `../assets/img/img${random(0, 10)}.jpeg`,
      import.meta.url
    ).href;
  }, 500);
};
//刷新
const refresh = () => {
  state.showPiecce = false;
  state.backgroundImgUrl = new URL(
    `../assets/img/img${random(0, 10)}.jpeg`,
    import.meta.url
  ).href;
  state.gapPosition = [0, 0];
  state.slideLeft = 0;
  state.handleText = "";
  state.slideBg = "#409EFF";
};
//暴露方法，便于在父组件中手动刷新
defineExpose({
  refresh,
});
const move = (e) => {
  state.handleText = "";
  let odiv = e.target; //获取目标元素
  //算出鼠标相对元素的位置
  let disX = e.clientX - odiv.offsetLeft;
  document.onmousemove = (e) => {
    let left = e.clientX - disX;
    if (left > 0 && left < props.width - 50) {
      state.slideLeft = e.clientX - disX;
    }
  };
};
const mouseup = () => {
  document.onmousemove = null;
  //校验是否滑动正确 误差在5px范围内即表示成功
  let isOk = Math.abs(state.slideLeft - state.gapPosition[0]) < 5;
  if (isOk) {
    state.handleText = "验证通过";
    state.slideBg = "#67C23A";
    setTimeout(() => {
      emits("success");
    }, 1000);
  } else {
    state.handleText = "验证失败";
    state.slideBg = "#F56C6C";
    emits("fail");
    setTimeout(() => {
      refresh();
    }, 1000);
  }
};
const clickMask = () => {
  emits("close");
};
watch(
  () => props.show,
  (val) => {
    val && refresh();
  }
);
</script>
<style scoped lang="less">
.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.3);

  .slideValidate {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .container {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      position: relative;
      background-color: #fff;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
        z-index: 2;
      }
      .gap {
        width: 50px;
        height: 50px;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 3;
        box-shadow: 0 0 10px #000;
      }
      .fill {
        width: 50px;
        height: 50px;
        position: absolute;
        z-index: 4;
        box-shadow: 0 0 10px #000;
      }
    }
    .bar {
      width: 100%;
      height: 50px;
      position: relative;
      background-color: #f7f9fa;
      text-align: center;
      line-height: 50px;
      .slide {
        width: 50px;
        height: 50px;
        position: absolute;
        background-color: #fff;
        cursor: ew-resize;
        text-align: center;
        line-height: 50px;
        color: #333;
        border: 1px solid #e1e1e1;
        z-index: 3;
      }
      .text {
        position: absolute;
        left: 0;
        top: 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
        overflow: hidden;
        z-index: 2;
      }
    }
  }
}
</style>
