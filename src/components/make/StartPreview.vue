<template>
  <!--呼び出す側のclass設定で決めるためにdivで囲っておるぞ-->
  <div>
    <div ref="preview1" class="border border-info p-0">
      <div ref="konvaContainer"></div>
    </div>
    <div v-show="showColorPalet">
      <color-pallet :showToggleBtn="showToggleBtn" @toggleBack="textBackOn = !textBackOn" @colorClick="asgColor($event)"></color-pallet>
    </div>
  </div>
</template>

<script>
import Konva from 'konva'
import ColorPallet from './ColorPallet'

import makeStore from './make-store'

const stageWidth = 1000;
const stageHeight = 1000;
let gScale = 1;

// const textFont = 'Kosugi';

export default {
  name: 'start-preview',
  // 結果数num、
  // 背景{backgroundIMage, x, y, width, height}
  ///////// タイトルの文字{resultText}, x, y, width, height}
  ///////// ボタンの画像{buttonImage, x, y, width, height}
  // BOXの配列
  // 詰めるかどうか
  components: {
    ColorPallet
  },
  props: {
    backImgSrc: String,
    startStr: String,
    btnStr: String,
    saveFlag: Boolean,
  },
  data() {
    return {
      stage: null,
      frontLayer: null,
      backLayer: null,
      backImage: null,
      backImgObj: null,
      text: {
        group: null,
        textColor: makeStore.state.gachaData.startScreen.message.textColor,
        backColor: makeStore.state.gachaData.startScreen.message.backColor,
      },
      btn: {
        group: null,
        label: null,
        tag: null,
        text: null,
        textColor: makeStore.state.gachaData.startScreen.btn.textColor,
        backColor: makeStore.state.gachaData.startScreen.btn.backColor,
      },
      showColorPalet: false,
      showToggleBtn: false,
      selectedGroup: null,
      textBackOn: !!makeStore.state.gachaData.startScreen.message.backOpacity,
    }
  },
  mounted() {
    const self = this;
    const konvaContainer = this.$refs.konvaContainer;
    this.stage = new Konva.Stage({
      container: konvaContainer,
      width: stageWidth,
      height: stageHeight
    });

    this.backLayer = new Konva.Layer();
    this.stage.add(this.backLayer);
    this.frontLayer = new Konva.Layer();
    this.stage.add(this.frontLayer);

    // background
    this.backImgObj = new Image();
    this.backImgObj.crossOrigin = 'Anonymous';
    this.backImage = new Konva.Image({
      x: 0,
      y: 0,
      width: stageWidth,
      height: stageHeight,
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
      x: makeStore.state.gachaData.startScreen.message.x,
      y: makeStore.state.gachaData.startScreen.message.y,
      scale: makeStore.state.gachaData.startScreen.message.scale,
      name: 'textGroup',
      draggable: true,
      dragBoundFunc: function(pos) {
        let newX, newY;
        const stageWidth = self.stage.width();
        //子要素のラベルをカウントして142掛けてスケール掛ける
        let objHeight = this.find('Label').length * 142 * gScale * this.scale().y;
        const stageHeight = self.stage.height() - objHeight/2; // 半分の大きさを引く

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
    {
      // 初期Label
      let label = new Konva.Label({x: 0, y: 0});
      let tag = new Konva.Tag({});
      let text = new Konva.Text({
        text: this.startStr,
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
    }

    // button
    this.btn.group = new Konva.Group({
      x: makeStore.state.gachaData.startScreen.btn.x,
      y: makeStore.state.gachaData.startScreen.btn.y,
      scale: makeStore.state.gachaData.startScreen.btn.scale,
      name: 'btnGroup',
      draggable: true,
      dragBoundFunc: function(pos) {
        let newX, newY;
        const stageWidth = self.stage.width();
        //子要素のラベルをカウントして142掛けてスケール掛ける
        const stageHeight = self.stage.height(); // 半分の大きさを引く

        if (pos.x < 0) newX = 0;
        else if (pos.x > stageWidth) newX = stageWidth;
        else newX = pos.x;

        if (pos.y < 0) newY = 0; // 半分の大きさを引く
        else if (pos.y > stageHeight) newY = stageHeight;
        else newY = pos.y;

        return {x: newX, y: newY};
      },
    });
    this.frontLayer.add(this.btn.group);
    // Label
    this.btn.label = new Konva.Label({x: 0, y: 0});
    this.btn.tag = new Konva.Tag({
      fill: this.btn.backColor,
      cornerRadius: 25
    });
    this.btn.text = new Konva.Text({
      text: this.btnStr,
      // fontFamily: textFont,
      fontStyle: 'bold',
      fontSize: 70,
      padding: 40,
      fill: this.btn.textColor,
      name: 'text',
      // shadow
      shadowColor: 'black',
      shadowBlur: 1,
      shadowOffset: { x: 0, y: 2 },
      shadowOpacity: 0.3
    });
    this.btn.label.add(this.btn.tag);
    this.btn.label.add(this.btn.text);
    this.btn.label.offsetX(this.btn.label.width() / 2);
    this.btn.label.offsetY(this.btn.label.height() / 2);
    this.btn.group.add(this.btn.label);

    var blackLineTop = new Konva.Line({
      points: [0, stageHeight*285/1200, stageWidth, stageHeight*285/1200],
      stroke: 'black', strokeWidth: 2, dash: [15, 45]
    });
    var blackLineBottom = new Konva.Line({
      points: [0, stageHeight*915/1200, stageWidth, stageHeight*915/1200],
      stroke: 'black', strokeWidth: 2, dash: [15, 45]
    });
    var whiteLineTop = new Konva.Line({
      points: [30, stageHeight*285/1200, stageWidth, stageHeight*285/1200],
      stroke: 'white', strokeWidth: 2, dash: [15, 45]
    });
    var whiteLineBottom = new Konva.Line({
      points: [30, stageHeight*915/1200, stageWidth, stageHeight*915/1200],
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
        self.toggle();
        return;
      }
      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('text')) {
        return;
      }
      // remove old transformers
      // TODO: we can skip it if current rect is already selected
      self.stage.find('Transformer').destroy();

      var MIN_TR_WIDTH = stageWidth*0.3;
      var MAX_TR_WIDTH = stageWidth*1.8;
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
      tr.attachTo(e.target.getParent().getParent());
      self.selectedGroup = e.target.getParent().getParent(); // color のため
      if(self.selectedGroup.hasName('textGroup')) {
        self.backLayer.add(tr);
      }
      if(self.selectedGroup.hasName('btnGroup')) {
        self.frontLayer.add(tr);
      }
      self.stage.batchDraw();
      self.showColorPalet = true;
      self.toggle();
    });

    this.text.group.on('dragmove', function() {
      self.updateTransformation();
    });
    this.btn.group.on('dragmove', function() {
      self.updateTransformation();
    });
    this.text.group.on('transformend', function() {
      self.updateTransformation();
    });
    this.btn.group.on('transformend', function() {
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
        gScale = containerWidth / stageWidth;

        this.stage.width(stageWidth * gScale);
        this.stage.height(stageHeight * gScale);
        this.stage.scale({ x: gScale, y: gScale });
        this.stage.draw();
      }
    },
    calcContrastColor(color) { //  https://gimp.jp.net/knowledge_colors_brightnesscontrast.htm
      const RED_COEF = 0.21;
      const GREEN_COEF = 0.72;
      const BLUE_COEF = 0.07;
      const THRESHOLD = 208;   // threshold 閾値 min 0 max 255

      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      const evalVal = r * RED_COEF + g * GREEN_COEF + b * BLUE_COEF;

      let retColor;
      if (evalVal < THRESHOLD) {
        retColor = 'white';
      } else {
        retColor = '#' + ('0'+Math.round(r/4).toString(16)).slice(-2) + ('0'+Math.round(g/4).toString(16)).slice(-2) + ('0'+Math.round(b/4).toString(16)).slice(-2);
      }

      return retColor;
    },
    asgColor(colorStr) {

      // 黄色だったら黒
      let contrastColor = this.calcContrastColor(colorStr);

      if(this.selectedGroup.hasName('textGroup')) {
        let labels = this.text.group.find('Label');

        for (let label of labels) {
          let text = label.find('Text');
          let tag = label.find('Tag');
          if(this.textBackOn === false) {
            makeStore.set_startScreen_message_textColor(colorStr);
            makeStore.set_startScreen_message_backColor(contrastColor);
            this.text.textColor = colorStr;
            this.text.backColor = contrastColor;
            text.fill(this.text.textColor);
            tag.opacity(0);
          } else {
            makeStore.set_startScreen_message_textColor(contrastColor);
            makeStore.set_startScreen_message_backColor(colorStr);
            this.text.textColor = contrastColor;
            this.text.backColor = colorStr;
            text.fill(this.text.textColor);
            tag.fill(this.text.backColor);
            tag.opacity(1);
          }
        }
        this.stage.batchDraw();
      }
      if(this.selectedGroup.hasName('btnGroup')) {
        makeStore.set_startScreen_btn_textColor(contrastColor);
        makeStore.set_startScreen_btn_backColor(colorStr);
        this.btn.textColor = contrastColor,
        this.btn.backColor = colorStr;
        this.btn.text.fill(this.btn.textColor);
        this.btn.tag.fill(this.btn.backColor);
        this.stage.batchDraw();
      }
    },
    toggle() {
      if(this.selectedGroup) {
        if(this.selectedGroup.hasName('textGroup')) {
          this.showToggleBtn = true;
        }
        if(this.selectedGroup.hasName('btnGroup')) {
          this.showToggleBtn = false;
        }
      }
    },
    updateTransformation() {
      makeStore.set_startScreen_message_x(this.text.group.x());
      makeStore.set_startScreen_message_y(this.text.group.y());
      makeStore.set_startScreen_message_scale(this.text.group.scale());
      makeStore.set_startScreen_btn_x(this.btn.group.x());
      makeStore.set_startScreen_btn_y(this.btn.group.y());
      makeStore.set_startScreen_btn_scale(this.btn.group.scale());
    },
    createOGP(src) {
      return new Promise( resolve => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = 1200/2; canvas.height = 630/2;
        let img = new Image();
        img.onload = function() {
          ctx.drawImage(img, 0, -285/2, 1200/2, 1200/2);
          resolve(canvas.toDataURL('image/jpeg'));
        }
        img.src = src;
      });
    },
    async saveOgp() {
      this.stage.find('Line').destroy();
      this.stage.find('Transformer').destroy();
      this.stage.batchDraw();
      const ogpSrc = await this.createOGP(this.stage.toDataURL());
      makeStore.set_ogpSrc(ogpSrc);
    }
  },
  watch: {
    backImgSrc() {
      this.backImgObj.src = this.backImgSrc;
    },
    startStr() {
      this.text.group.destroyChildren();
      this.stage.find('Transformer').destroy();
      this.showColorPalet = false;
      let strArr = this.startStr.split('\n');
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
      this.stage.batchDraw();
    },
    btnStr() {
      this.stage.find('Transformer').destroy();
      this.showColorPalet = false;
      this.btn.text.text(this.btnStr);
      this.btn.label.offsetX(this.btn.label.width() / 2);
      this.stage.batchDraw();
    },
    //タイトル\nあｓｄふぁｓ\nkdkafj;l\nsjdkjljｓ\nkdkafj;l\nsjdkjlj
    textBackOn() {
      let labels = this.text.group.find('Label');

      [this.text.textColor, this.text.backColor] = [this.text.backColor, this.text.textColor];

      for (let label of labels) {
        let text = label.find('Text');
        let tag = label.find('Tag');
        if(this.textBackOn === false) {
          // swap
          let tmp = makeStore.state.gachaData.startScreen.message.textColor;
          makeStore.set_startScreen_message_textColor(makeStore.state.gachaData.startScreen.message.backColor);
          makeStore.set_startScreen_message_backColor(tmp);

          text.fill(this.text.textColor);
          tag.opacity(0);
          makeStore.set_startScreen_message_backOpacity(0);
        } else {
          // swap
          let tmp = makeStore.state.gachaData.startScreen.message.textColor;
          makeStore.set_startScreen_message_textColor(makeStore.state.gachaData.startScreen.message.backColor);
          makeStore.set_startScreen_message_backColor(tmp);

          text.fill(this.text.textColor);
          tag.fill(this.text.backColor);
          tag.opacity(1);
          makeStore.set_startScreen_message_backOpacity(1);
        }
      }
      this.stage.batchDraw();
    },
  }
}
</script>