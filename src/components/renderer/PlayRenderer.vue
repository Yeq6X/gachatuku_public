<template>
  <div>
    <div ref="resultKonvaContainer" style="display:none"></div>

    <div ref="play_renderer" class="p-0">
      <div v-show="loading" class="gacha_loading">
        <div class="sk-cube-grid">
          <div class="sk-cube sk-cube1"></div>
          <div class="sk-cube sk-cube2"></div>
          <div class="sk-cube sk-cube3"></div>
          <div class="sk-cube sk-cube4"></div>
          <div class="sk-cube sk-cube5"></div>
          <div class="sk-cube sk-cube6"></div>
          <div class="sk-cube sk-cube7"></div>
          <div class="sk-cube sk-cube8"></div>
          <div class="sk-cube sk-cube9"></div>
        </div>
      </div>
      <div v-show="!loading && !theEndImgSrc" ref="startKonvaContainer"></div>
      <img v-if="theEndImgSrc && !loading" :src="theEndImgSrc" style="width:100%">
    </div>
    <div class="pt-2 pb-2" v-show="theEndImgSrc">
      <pre v-html="result.text" class="m-0"></pre>
    </div>
  </div>
</template>

<script>
import Konva from 'konva'
import Converter from '@/components/mixin/converter.js'
import EscapeHtml from '@/components/mixin/escapeHtml.js'

// スタート画面と結果画面で画面の大きさが違う 結果画面はそのままOGPにしたいから1200x1200
const START_SCREEN_WIDTH = 1000;
const START_SCREEN_HEIGHT = 1000;

let gScale = 1;

const RESULT_SCREEN_WIDTH = 600;
const RESULT_SCREEN_HEIGHT = 600;


// 効いてるのかわからないけど解像度アップ
// Konva.pixelRatio = 2;


export default {
  name: 'play-renderer',
  mixins: [Converter, EscapeHtml], // 文章変換
  data() {
    return {
      data: null, // gachaData
      start: {
        stage: null,
        layer: null,
        group: null,
        backImgObj: null, // new Image()
        backImage: null, // new Konva.Image()
        btn: {
          label: null,
          tag: null,
          text: null,
        },
        message: {
          group: null, // 複数行あるかもしれないからgroupで
        },
      },

      result: {
        stage: null,
        layer: null,
        group: null,
        backImgObj: null, // new Image()
        backImage: null, // new Konva.Image()
        boxList: [], //
        message: {
          group: null, // 複数行あるかもしれないからgroupで
        },
        rawText: null, // 変換したそのままのtext
        text: null, // <br>に変換後
      },
      loadCnt: 0, // 背景とかBOXとか全部読み込んだかどうか判定するためのカウンタ

      loading: false,

      // 結果用にtodataURLした画像を表示する
      theEndImgSrc: null, // 1200x1200
      OGPSrc: null, // OGP画像
      frameImg: new Image(),

    }
  },
  computed: {
    sumRate() {
      let retArr = [];
      const cardList = this.data.resultScreen.cardList;
      for (let i = 0; i < this.data.resultScreen.typeNum; ++i) {
        let sum = 0;
        for (let card of cardList) {
          sum += card.boxRate[i];
        }
        retArr.push(sum);
      }
      return retArr;
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fitStageIntoParentContainer);
    this.destroyStart();
  },
  mounted() {
    this.frameImg.src = require('@/assets/frame.png');
  },
  methods: {
    initialize(_data) {
      // 初期化
      this.theEndImgSrc = null; // これがないとリロード時にv-showがfalseになる
      this.loadCnt = 0; // リロード用
      this.loading = true;
      this.data = _data;
      this.result.text = '';

      this.startSetup();

      // resize
      window.addEventListener('resize', this.fitStageIntoParentContainer);



      this.onButtonClick();

    },

    startSetup() {
      // const self = this;
      // Start----------------------------------------------------------------
      const startKonvaContainer = this.$refs.startKonvaContainer;

      this.start.stage = new Konva.Stage({
        container: startKonvaContainer,
        width: START_SCREEN_WIDTH,
        height: START_SCREEN_HEIGHT
      });
      this.start.stage.container(startKonvaContainer);
      this.start.layer = new Konva.Layer();
      this.start.stage.add(this.start.layer);

      this.start.group = new Konva.Group({});
      this.start.layer.add(this.start.group);

      this.startBackSetup();

      this.startMsgSetup();

      this.startBtnSetup();
    },

    startBackSetup() {
      const self = this;

      // back
      this.start.backImgObj = new Image();
      this.start.backImage = new Konva.Image({
        x: 0, y: 0,
        width: START_SCREEN_WIDTH, height: START_SCREEN_HEIGHT,
        listening: false,
      });

      this.start.backImgObj.onload = function() {
        self.start.backImage.image(this);
        self.loading = false;
        self.fitStageIntoParentContainer();
      };

      this.start.group.add(this.start.backImage);
      this.start.backImgObj.src = this.data.startScreen.back.imgSrc;


    },

    startMsgSetup() {
      // const self = this;
      // message
      this.start.message.group = new Konva.Group({
        x: this.data.startScreen.message.x,
        y: this.data.startScreen.message.y,
        name: 'startMessage',
        draggable: false,
        listening: false,
      })

      // 分ける
      let strArr1 = this.data.startScreen.message.text.split('\n');
      let i = 0;

      for(let str of strArr1) {
        if(str === '') {
          i++;
          continue;
        }
        let label = new Konva.Label( { x: 0, y: 142 * i} );

        let tag   = new Konva.Tag  ( { fill: this.data.startScreen.message.backColor,} );

        tag.opacity(this.data.startScreen.message.backOpacity);

        let text = new Konva.Text({
          text: str,
          // fontFamily: textFont,
          fontStyle: 'bold',
          fontSize: 120,
          padding: 24,
          fill: this.data.startScreen.message.textColor,
          name: 'text',
          // shadow
          shadowColor: 'black',
          shadowBlur: 1,
          shadowOffset: { x: 0, y: 2 },
          shadowOpacity: 0.3
        });

        label.add(tag);
        label.add(text);
        label.offsetX(label.width() / 2);
        this.start.message.group.add(label);

        i++;
      }

      // スケール変更
      this.start.message.group.scale(this.data.startScreen.message.scale);
      this.start.group.add(this.start.message.group);
    },

    startBtnSetup() {
      const self = this;

      // Button
      // Labelが最上位
      this.start.btn.label = new Konva.Label({
        x: this.data.startScreen.btn.x,
        y: this.data.startScreen.btn.y,
        scale: this.data.startScreen.btn.scale,
        name: 'startButton',
      });
      // Tag
      this.start.btn.tag = new Konva.Tag({
        fill: this.data.startScreen.btn.backColor,
        cornerRadius: 25
      });
      // Text
      this.start.btn.text = new Konva.Text({
        text: this.data.startScreen.btn.text,
        // fontFamily: textFont,
        fontStyle: 'bold',
        fontSize: 70,
        padding: 40,
        fill: this.data.startScreen.btn.textColor,
        name: 'text',
        // shadow
        shadowColor: 'black',
        shadowBlur: 1,
        shadowOffset: { x: 0, y: 2 },
        shadowOpacity: 0.3
      });
      // Add
      this.start.btn.label.add(this.start.btn.tag);
      this.start.btn.label.add(this.start.btn.text);
      this.start.btn.label.offsetX(this.start.btn.label.width() / 2);
      this.start.btn.label.offsetY(this.start.btn.label.height() / 2);



      // 色のセットアップ
      const onColor = this.calcOnColor(this.data.startScreen.btn.backColor);

      this.start.btn.label.on('mouseenter touchstart', function() {
        self.start.stage.container().style.cursor = 'pointer';        //  ボタンに乗せたときのカーソル
        self.start.btn.tag.fill(onColor);        // ボタンの色を変える
        self.start.stage.draw();
      });
      this.start.btn.label.on('mouseleave touchend', function() {
        self.start.stage.container().style.cursor = 'default';        //  カーソルを戻す
        self.start.btn.tag.fill(self.data.startScreen.btn.backColor);      // ボタンの色を戻す
        self.start.stage.draw();
      });
      // mobile
      this.start.stage.on('touchmove', function() {
        const {x, y} = self.start.stage.getPointerPosition();
        const btn = { x: self.start.btn.label.x()*gScale,
                      y: self.start.btn.label.y()*gScale,
                      width: self.start.btn.label.width()*self.data.startScreen.btn.scale.x*gScale,
                      height: self.start.btn.label.height()*self.data.startScreen.btn.scale.y*gScale};
        if (   x < btn.x - btn.width/2
            || x > btn.x + btn.width/2
            || x < 0
            || x > self.start.stage.width()
            || y < btn.y - btn.height/2
            || y > btn.y + btn.height/2
            || y < 0
            || y > self.start.stage.height())
        {
          self.start.btn.tag.fill(self.data.startScreen.btn.backColor);      // ボタンの色を戻す
          self.start.stage.draw();
        }
        else
        {
          self.start.btn.tag.fill(onColor);      // ボタンの色を変える
          self.start.stage.draw();
        }
      });

      this.start.group.add(this.start.btn.label);

    },

    calcOnColor(color) { //  https://gimp.jp.net/knowledge_colors_brightnesscontrast.htm
      const RED_COEF = 0.21;
      const GREEN_COEF = 0.72;
      const BLUE_COEF = 0.07;
      const THRESHOLD = 127;   // threshold 閾値 min 0 max 255

      let r = parseInt(color.slice(1, 3), 16);
      let g = parseInt(color.slice(3, 5), 16);
      let b = parseInt(color.slice(5, 7), 16);

      let evalVal = r * RED_COEF + g * GREEN_COEF + b * BLUE_COEF;

      let retColor;
      if (evalVal < THRESHOLD) {
        retColor = '#' + ('0'+(Math.round(r+32)<=255?Math.round(r+32):255).toString(16)).slice(-2)
                       + ('0'+(Math.round(g+32)<=255?Math.round(g+32):255).toString(16)).slice(-2)
                       + ('0'+(Math.round(b+32)<=255?Math.round(b+32):255).toString(16)).slice(-2);
      } else {
        retColor = '#' + ('0'+(Math.round(r-32)>=0?Math.round(r-32):0).toString(16)).slice(-2)
                       + ('0'+(Math.round(g-32)>=0?Math.round(g-32):0).toString(16)).slice(-2)
                       + ('0'+(Math.round(b-32)>=0?Math.round(b-32):0).toString(16)).slice(-2);
      }

      return retColor;
    },

    resultSetup() {
      // const self = this;

      // Result----------------------------------------------------------------
      const resultKonvaContainer = this.$refs.resultKonvaContainer;

      this.result.stage = new Konva.Stage({
        container: resultKonvaContainer,
        width: RESULT_SCREEN_WIDTH,
        height: RESULT_SCREEN_HEIGHT
      });

      this.result.layer = new Konva.Layer();
      this.result.stage.add(this.result.layer);

      this.result.group = new Konva.Group();
      this.result.layer.add(this.result.group);

      this.resultBackSetup();

      // this.resultMsgSetup(); はtextを変換するからlottery後に初期化

      // boxListを初期化
      this.result.boxList = new Array(this.data.resultScreen.typeNum);
      this.result.boxList.fill({
        cardNum: null,
        name: null,
        imgSrc: null,
        imgObj: null,
        image: null
      })
    },

    resultBackSetup() {
      const self = this;

      // back
      this.result.backImgObj = new Image();
      this.result.backImage = new Konva.Image({
        x: 0, y: 0,
        width: RESULT_SCREEN_WIDTH, height: RESULT_SCREEN_HEIGHT,
        listening: false
      });

      this.result.backImgObj.onload = function() {
        self.result.backImage.image(this);
        self.loadCnt++;
        if (self.loadCnt == self.data.resultScreen.typeNum + 1) { //背景分 + 1
          // Change Layer
          self.changeScene();
        }
      };

      this.result.group.add(this.result.backImage);
      this.result.backImgObj.crossOrigin = 'Anonymous';
      // 読み込みはclick後

    },

    resultMsgSetup() {
      // const self = this;

      // message
      this.result.message.group = new Konva.Group({
        x: this.data.resultScreen.message.x/1200*RESULT_SCREEN_WIDTH,
        y: this.data.resultScreen.message.y/1200*RESULT_SCREEN_HEIGHT,
        name: 'resultMessage',
        draggable: false,
        listening: false,
      })

      // textを変換
      let conMsg = this.convert(this.data.resultScreen.message.text).data;
      // 分ける
      let strArr2 = conMsg.split('\n');
      let j = 0;
      for(let str of strArr2) {
        if(str === '') {
          j++;
          continue;
        }

        let label = new Konva.Label( { x:   0,   y:   142/1200*RESULT_SCREEN_HEIGHT * j   } );

        let tag   = new Konva.Tag  ( { fill:   this.data.resultScreen.message.backColor   } );

        tag.opacity(this.data.resultScreen.message.backOpacity);

        let text = new Konva.Text({
          text: str,
          // fontFamily: textFont,
          fontStyle: 'bold',
          fontSize: 120/1200*RESULT_SCREEN_HEIGHT,
          padding: 24/1200*RESULT_SCREEN_HEIGHT,
          fill: this.data.resultScreen.message.textColor,
          name: 'text',
          // shadow
          shadowColor: 'black',
          shadowBlur: 1,
          shadowOffset: { x: 0, y: 2 },
          shadowOpacity: 0.3
        });

        label.add(tag);
        label.add(text);
        label.offsetX(label.width() / 2);
        this.result.message.group.add(label);
        j++;
      }
      this.result.message.group.scale(this.data.resultScreen.message.scale);
      this.result.group.add(this.result.message.group);



    },

    onButtonClick() {
      const self = this;

      this.start.btn.label.on('mouseup touchend', function() {
        self.loading = true;
        self.destroyStart();

        self.resultSetup(); // boxList初期化

        self.lottery();
        // Result------box

        // メッセージ初期化
        self.resultMsgSetup();

        // box分ループ
        for (let i = 0; i < self.data.resultScreen.typeNum; ++i) {
          self.result.boxList[i].imgObj = new Image();
          self.result.boxList[i].imgObj.crossOrigin = 'Anonymous';
          self.result.boxList[i].image = new Konva.Image({
            x: self.data.resultScreen.boxList[i].x/1200*RESULT_SCREEN_WIDTH,
            y: self.data.resultScreen.boxList[i].y/1200*RESULT_SCREEN_HEIGHT,
            width: self.data.resultScreen.boxList[i].width/1200*RESULT_SCREEN_WIDTH,
            height: self.data.resultScreen.boxList[i].height/1200*RESULT_SCREEN_HEIGHT,
            listening: false
          });
          self.result.boxList[i].imgObj.onload = function() {
            self.result.boxList[i].image.image(this);
            self.loadCnt++;
            if (self.loadCnt == self.data.resultScreen.typeNum + 1) { //背景分 + 1
              // Change Layer
              self.changeScene();
            }
          };
          // BOX
          self.result.boxList[i].imgObj.src = self.result.boxList[i].imgSrc;
          self.result.group.add(self.result.boxList[i].image);
        }
        // 背景
        self.result.backImgObj.src = self.data.resultScreen.back.imgSrc;


      });
    },

    fitStageIntoParentContainer() {
      var outerContainer = this.$refs.play_renderer;
      if (outerContainer) {
        var containerWidth = outerContainer.offsetWidth - 3; // border * 2 を引く
        gScale = containerWidth / START_SCREEN_WIDTH;

        this.start.stage.width(START_SCREEN_WIDTH * gScale);
        this.start.stage.height(START_SCREEN_HEIGHT * gScale);
        this.start.stage.scale({ x: gScale, y: gScale });

        if (this.loading == false) {
          this.start.stage.draw();
        }
      }
    },

    async changeScene() {
      const self = this;

      this.result.rawText = this.convert(this.data.resultMessage.messageSrc).data;
      this.result.text = this.escapeHtml(this.result.rawText);

      this.result.stage.draw();
      this.theEndImgSrc = this.result.stage.toDataURL();

      this.loading = false;
      this.destroyResult();

      await this.createOGP().then(src => self.OGPSrc = src);

      this.$emit('changeScene', {text: this.result.rawText ,src: this.OGPSrc});

    },

    destroyStart() {
      this.start.backImage.destroy();
      this.start.message.group.destroyChildren();
      this.start.message.group.destroy();
      this.start.btn.label.destroy();
      this.start.btn.tag.destroy();
      this.start.btn.text.destroy();
      this.start.group.destroy();
      this.start.layer.destroy();
      this.start.stage.destroy();
    },
    destroyResult() {
      this.result.backImage.destroy();
      this.result.message.group.destroyChildren();
      this.result.message.group.destroy();
      this.result.group.destroyChildren();
      this.result.group.destroy();
      this.result.layer.destroy();
      this.result.stage.destroy();
    },

    lottery() {
      const sumArr = this.sumRate;
      const cardList = this.data.resultScreen.cardList;
      for (let i = 0; i < this.data.resultScreen.typeNum; ++i) {
        let rate = sumArr[i];
        const rand = Math.random() * sumArr[i];
        for(let j = 0; j < cardList.length; ++j) {
          rate -= cardList[j].boxRate[i];
          if (rate < rand) {
            this.result.boxList[i] = ({cardNum: cardList[j].num, name: cardList[j].name, imgSrc: cardList[j].imgSrc});
            break;
          }
        }
      }
    },

    createOGP() {
      let self = this;
      return new Promise( resolve => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = 1200; canvas.height = 630;
        let img = new Image();
        img.onload = function() {
          ctx.drawImage(img, 0, -285, 1200, 1200);
          ctx.drawImage(self.frameImg, 0, 0, 1200, 630);
          resolve(canvas.toDataURL('image/jpeg'));
        }
        img.src = self.theEndImgSrc;
      });
    },
  },
  watch: {
  }
}
</script>

<style scoped>
pre {
  /* Mozilla */
  white-space: -moz-pre-wrap;
  /* Opera 4-6 */
  white-space: -pre-wrap;
  /* Opera 7 */
  white-space: -o-pre-wrap;
  /* CSS3 */
  white-space: pre-wrap;
  /* IE 5.5+ */
  word-wrap: break-word;

  font-family: 'M PLUS 1p', sans-serif;
}
.gacha_loading {
  background: #333;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.gacha_loading::before {
  content: "";
  display: block;
  padding-top: 100%;
}
.sk-cube-grid {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 16%;
  height: 16%;
  margin: 42%;
}

.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: #FFF;
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
          animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}
.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
          animation-delay: 0.4s; }
.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }
.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s; }
.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
          animation-delay: 0s; }
.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s; }
.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s; }

@-webkit-keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
  }
}

@keyframes sk-cubeGridScaleDelay {
  0%, 70%, 100% {
    -webkit-transform: scale3D(1, 1, 1);
            transform: scale3D(1, 1, 1);
  } 35% {
    -webkit-transform: scale3D(0, 0, 1);
            transform: scale3D(0, 0, 1);
  }
}
</style>
