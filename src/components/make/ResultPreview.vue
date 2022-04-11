<template>
  <!--呼び出す側のclass設定で決めるためにdivで囲っておるぞ-->
  <div ref="prepre">
    <div ref="preview1" class="border border-info p-0">
      <div ref="konvaContainer"></div>
    </div>
    <color-pallet v-show="showColorPalet" :showToggleBtn="true" @toggleBack="textBackOn = !textBackOn" @colorClick="asgColor($event)"></color-pallet>
  </div>
</template>

<script>
import Konva from 'konva'

import ColorPallet from '@/components/make/ColorPallet'

import makeStore from './make-store'

const numLayoutSrc = {
  '1' : require('@/assets/num_layout/num_layout/num_layout_01.png'),
  '2' : require('@/assets/num_layout/num_layout/num_layout_02.png'),
  '3' : require('@/assets/num_layout/num_layout/num_layout_03.png'),
  '4' : require('@/assets/num_layout/num_layout/num_layout_04.png'),
  '5' : require('@/assets/num_layout/num_layout/num_layout_05.png'),
  '6' : require('@/assets/num_layout/num_layout/num_layout_06.png'),
  '8' : require('@/assets/num_layout/num_layout/num_layout_08.png'),
  '10': require('@/assets/num_layout/num_layout/num_layout_10.png'),
};

const RESULT_SCREEN_WIDTH = 1200;
const RESULT_SCREEN_HEIGHT = 1200;
var gScale = 1;

// const textFont = 'mplus-1p-regular';

export default {
  name: 'result-preview',
  props: {
    typeNum: Number,
    backImgSrc: String,
    resultStr: String,
  },
  components: {
    ColorPallet,
  },
  data() {
    return {
      stage: null,
      backLayer: null,
      frontLayer: null,
      backImage: null,
      backImgObj: null,
      text: {
        group: null,
        textColor: makeStore.state.gachaData.resultScreen.message.textColor,
        backColor: makeStore.state.gachaData.resultScreen.message.backColor,
      },
      numImage: null,
      numImgObj: null,
      textBackOn: !!makeStore.state.gachaData.resultScreen.message.backOpacity,
      // textBackOn: false,
      showColorPalet: false,
      boxList: makeStore.state.gachaData.resultScreen.boxList,
    }
  },
  mounted() {
    const self = this;
    const konvaContainer = this.$refs.konvaContainer;
    this.stage = new Konva.Stage({
      container: konvaContainer,
      width: RESULT_SCREEN_WIDTH,
      height: RESULT_SCREEN_HEIGHT
    });

    // frontLayer####################################################################
    this.backLayer = new Konva.Layer();
    this.stage.add(this.backLayer);

    // background
    this.backImgObj = new Image();
    this.backImage = new Konva.Image({
      x: 0,
      y: 0,
      width: RESULT_SCREEN_WIDTH,
      height: RESULT_SCREEN_HEIGHT,
      listening: false
    });
    this.backImgObj.onload = function() {
      self.backImage.image(this);
      self.backLayer.batchDraw();
    };
    this.backImgObj.src = this.backImgSrc;
    // add the shape to the layer
    this.backLayer.add(this.backImage);

    // textGroup
    this.text.group = new Konva.Group({
      x: makeStore.state.gachaData.resultScreen.message.x,
      y: makeStore.state.gachaData.resultScreen.message.y,
      scale: makeStore.state.gachaData.resultScreen.message.scale,
      name: 'textGroup',
      draggable: true,
      dragBoundFunc: function(pos) {
        let newX, newY;
        const stageWidth = self.stage.width();
        //子要素のラベルをカウントして142掛けてスケール掛ける
        let objHeight = this.find('Label').length * 142 * gScale * this.scale().y;
        const stageHeight = self.stage.height() - objHeight/2; // 半分の大きさを引く
        console.log(this.scale())
        if (pos.x < 0) newX = 0;
        else if (pos.x > stageWidth) newX = stageWidth;
        else newX = pos.x;

        if (pos.y < 0 - objHeight/2) newY = 0 - objHeight/2; // 半分の大きさを引く
        else if (pos.y > stageHeight) newY = stageHeight;
        else newY = pos.y;

        return {x: newX, y: newY};
      }
    });
    this.backLayer.add(this.text.group);

    // 初期Label
    let label = new Konva.Label({x: 0, y: 0});
    let tag = new Konva.Tag({});
    let text = new Konva.Text({
      text: this.resultStr,
      // fontFamily: textFont,
      fontStyle: 'bold',
      fontSize: 120,
      padding: 24,
      name: 'text',
      // shadow
      shadowColor: 'black',
      shadowBlur: 1,
      shadowOffset: { x: 0, y: 2 },
      shadowOpacity: 0.3
    });
    // 背景ありかナシ化によってfillの分岐
    if(this.textBackOn === false) {
      text.fill(this.text.textColor);
      tag.opacity(0);
    } else {
      text.fill(this.text.textColor);
      tag.fill(this.text.backColor);
      tag.opacity(1);
    }
    label.add(tag);
    label.add(text);
    label.offsetX(label.width() / 2);
    this.text.group.add(label);


    // frontLayer####################################################################
    this.frontLayer = new Konva.Layer();
    this.stage.add(this.frontLayer);
    // num_layout
    this.numImgObj = new Image();
    this.numImage = new Konva.Image({
      x: 0,
      y: 0,
      image: this.numImgObj,
      width: RESULT_SCREEN_WIDTH,
      height: RESULT_SCREEN_HEIGHT,
      listening: false
    });
    this.numImgObj.onload = function() {
      self.numImage.image(this);
      self.frontLayer.batchDraw();
    };
    // add the shape to the layer
    this.frontLayer.add(this.numImage);
    this.numImgObj.src = numLayoutSrc[this.typeNum.toString()];

    var blackLineTop = new Konva.Line({
      points: [0, RESULT_SCREEN_HEIGHT*285/1200, RESULT_SCREEN_WIDTH, RESULT_SCREEN_HEIGHT*285/1200],
      stroke: 'black', strokeWidth: 2, dash: [15, 45]
    });
    var blackLineBottom = new Konva.Line({
      points: [0, RESULT_SCREEN_HEIGHT*915/1200, RESULT_SCREEN_WIDTH, RESULT_SCREEN_HEIGHT*915/1200],
      stroke: 'black', strokeWidth: 2, dash: [15, 45]
    });
    var whiteLineTop = new Konva.Line({
      points: [30, RESULT_SCREEN_HEIGHT*285/1200, RESULT_SCREEN_WIDTH, RESULT_SCREEN_HEIGHT*285/1200],
      stroke: 'white', strokeWidth: 2, dash: [15, 45]
    });
    var whiteLineBottom = new Konva.Line({
      points: [30, RESULT_SCREEN_HEIGHT*915/1200, RESULT_SCREEN_WIDTH, RESULT_SCREEN_HEIGHT*915/1200],
      stroke: 'white', strokeWidth: 2, dash: [15, 45]
    });
    this.frontLayer.add(blackLineTop);
    this.frontLayer.add(blackLineBottom);
    this.frontLayer.add(whiteLineTop);
    this.frontLayer.add(whiteLineBottom);

    // Transformer
    this.stage.on('click tap', function(e) {
      // if click on empty area - remove all transformers
      if (e.target === self.stage) {
        self.stage.find('Transformer').destroy();
        self.stage.batchDraw();
        self.showColorPalet = false
        return;
      }
      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('text')) {
        return;
      }
      self.backLayer.find('Transformer').destroy();

      var MIN_TR_WIDTH = RESULT_SCREEN_WIDTH*0.3;
      var MAX_TR_WIDTH = RESULT_SCREEN_WIDTH*1.8;

      // create new transformer
      var tr = new Konva.Transformer({
        keepRatio: true,
        rotateEnabled: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        boundBoxFunc: function(oldBoundBox, newBoundBox) {
          if (Math.abs(newBoundBox.width) > MAX_TR_WIDTH || Math.abs(newBoundBox.width) < MIN_TR_WIDTH) {
            return oldBoundBox;
          }

          return newBoundBox;
        }
      });
      self.backLayer.add(tr);
      tr.attachTo(e.target.getParent().getParent());
      self.backLayer.batchDraw();
      self.showColorPalet = true;
    });

    this.text.group.on('dragmove', function() {
      self.updateTransformation();
    });
    this.text.group.on('transformend', function() {
      self.updateTransformation();
    });



    this.fitStageIntoParentContainer();
    // adapt the stage on any window resize
    window.addEventListener('resize', this.fitStageIntoParentContainer);
    this.$refs.preview1.addEventListener('resize', this.fitStageIntoParentContainer);
  },
  methods: {
    fitStageIntoParentContainer() {
      var outerContainer = this.$refs.preview1;
      if (outerContainer) {
        // now we need to fit stage into parent
        var containerWidth = outerContainer.offsetWidth;
        // to do this we need to scale the stage
        gScale = containerWidth / RESULT_SCREEN_WIDTH;

        this.stage.width(RESULT_SCREEN_WIDTH * gScale);
        this.stage.height(RESULT_SCREEN_HEIGHT * gScale);
        this.stage.scale({ x: gScale, y: gScale });
        this.stage.draw();
      }
    },
    calcContrastColor(color) { //  https://gimp.jp.net/knowledge_colors_brightnesscontrast.htm
      const RED_COEF = 0.21;
      const GREEN_COEF = 0.72;
      const BLUE_COEF = 0.07;
      const THRESHOLD = 220;   // threshold 閾値 min 0 max 255

      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);

      let evalVal = r * RED_COEF + g * GREEN_COEF + b * BLUE_COEF;

      let retColor;
      if (evalVal < THRESHOLD) {
        retColor = 'white';
      } else {
        retColor = '#' + ('0'+Math.round(r/4).toString(16)).slice(-2) + ('0'+Math.round(g/4).toString(16)).slice(-2) + ('0'+Math.round(b/4).toString(16)).slice(-2);
      }

      return retColor;
    },
    asgColor(colorStr) {
      let labels = this.text.group.find('Label');

      // 黄色だったら黒
      let contrastColor = this.calcContrastColor(colorStr);

      for (let label of labels) {
        let text = label.find('Text');
        let tag = label.find('Tag');
        if(this.textBackOn === false) {
          makeStore.set_resultScreen_message_textColor(colorStr);
          makeStore.set_resultScreen_message_backColor(contrastColor);
          this.text.textColor = colorStr;
          this.text.backColor = contrastColor;
          text.fill(this.text.textColor);
          tag.opacity(0);
        } else {
          makeStore.set_resultScreen_message_textColor(contrastColor);
          makeStore.set_resultScreen_message_backColor(colorStr);
          this.text.textColor = contrastColor;
          this.text.backColor = colorStr;
          text.fill(this.text.textColor);
          tag.fill(this.text.backColor);
          tag.opacity(1);
        }
      }
      this.stage.batchDraw();
    },
    updateTransformation() {
      makeStore.set_resultScreen_message_x(this.text.group.x());
      makeStore.set_resultScreen_message_y(this.text.group.y());
      makeStore.set_resultScreen_message_scale(this.text.group.scale());
    }
  },
  watch: {
    typeNum() {
      this.numImgObj.src = numLayoutSrc[this.typeNum.toString()];
    },
    backImgSrc() {
      this.backImgObj.src = this.backImgSrc;
    },
    resultStr() {
      this.text.group.destroyChildren();
      this.backLayer.find('Transformer').destroy();
      this.showColorPalet = false;
      let strArr = this.resultStr.split('\n');
      let i = 0;
      for(let str of strArr) {
        if(str === '') {
          i++;
          continue;
        }
        let label = new Konva.Label({
          x: 0,
          y: 142*i
        });
        let tag = new Konva.Tag({
        });
        let text = new Konva.Text({
          text: str,
          // fontFamily: textFont,
          fontStyle: 'bold',
          fontSize: 120,
          padding: 24,
          name: 'text',
          // shadow
          shadowColor: 'black',
          shadowBlur: 1,
          shadowOffset: { x: 0, y: 2 },
          shadowOpacity: 0.3
        });
        // 背景ありかナシ化によってfillの分岐
        if(this.textBackOn === false) {
          text.fill(this.text.textColor);
          tag.opacity(0);
        } else {
          text.fill(this.text.textColor);
          tag.fill(this.text.backColor);
          tag.opacity(1);
        }

        label.add(tag);
        label.add(text);
        label.offsetX(label.width() / 2);
        this.text.group.add(label);
        i++;
      }
      this.text.group.offsetX(this.text.group.width() / 2);
      // this.kResultText.offsetY(this.kResultText.height() / 2);
      this.stage.batchDraw();
    },
    textBackOn() {
      let labels = this.text.group.find('Label');

      [this.text.textColor, this.text.backColor] = [this.text.backColor, this.text.textColor];
      for (let label of labels) {
        let text = label.find('Text');
        let tag = label.find('Tag');

        if(this.textBackOn === false) {
          // swap
          let tmp = makeStore.state.gachaData.resultScreen.message.textColor;
          makeStore.set_resultScreen_message_textColor(makeStore.state.gachaData.resultScreen.message.backColor);
          makeStore.set_resultScreen_message_backColor(tmp);

          text.fill(this.text.textColor);
          tag.opacity(0);
          makeStore.set_resultScreen_message_backOpacity(0);
        } else {
          // swap
          let tmp = makeStore.state.gachaData.resultScreen.message.textColor;
          makeStore.set_resultScreen_message_textColor(makeStore.state.gachaData.resultScreen.message.backColor);
          makeStore.set_resultScreen_message_backColor(tmp);

          text.fill(this.text.textColor);
          tag.fill(this.text.backColor);
          tag.opacity(1);
          makeStore.set_resultScreen_message_backOpacity(1);
        }
      }
      this.stage.batchDraw();
    },
    'text.textColor': val => {
      makeStore.set_resultScreen_message_textColor(val);
    },
    'text.backColor': val => {
      makeStore.set_resultScreen_message_backColor(val);
    },
  }
}
</script>

<style scoped>
/* @import url('https://fonts.googleapis.com/css2?family=Kosugi&display=swap'); */
/*
@font-face{
  font-family: 'mplus-1p-regular';
  src: url('http://mplus-webfonts.sourceforge.jp/mplus-1p-regular.eot');
  src: url('http://mplus-webfonts.sourceforge.jp/mplus-1p-regular.eot?#iefix') format('embedded-opentype'),
       url('http://mplus-webfonts.sourceforge.jp/mplus-1p-regular.woff') format('woff'),
       url('http://mplus-webfonts.sourceforge.jp/mplus-1p-regular.ttf') format('truetype');
} */
</style>