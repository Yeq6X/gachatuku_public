<template>
  <div class="make_setting">
    <div class="sub_title">
      <div>
        ガチャ設定
      </div>
    </div>
    <!---->
    <!--</--タイプ-->
    <div class="row">
      <div class="form_title col-md-3">
        <div>
          排出カード数<span class="asterisk">*</span>
        </div>
        <small class="form-text">結果画面に表示されるカードの数です</small>
      </div>
      <div class="input-form col-md-9">
        <b-form-select
        v-model.number="resultScreen.typeNum"
        :options="typeNumOptions"
        style="height:42px;padding:10px;padding-top:8px;font-size:16px;"
        ></b-form-select>
      </div>
    </div>
    <!--</--背景選択-->
    <div class="row">
      <div class="form_title col-md-3">
        <div>
          背景
        </div>
      </div>
      <div class="input-form col-md-9">
        <div class="back-select-area">
          <img class="img-fluid" :src="require('@/assets/img_icon.png')" @click.prevent="$emit('loadClick', resultScreen.back);loadImage();backType='custom'">
          <img class="img-fluid" v-for="obj of resultBackSrc[resultScreen.typeNum.toString()]" :key="obj.type" :src="obj.src" @click.prevent="loadload(obj.type)">
        </div>
      </div>
    </div>
    <!--メッセージ-->
    <div class="row">
      <div class="form_title col-md-3">
        <div>
          メッセージ
        </div>
      </div>
      <div class="input-form col-md-9">
        <div class="FlexTextarea">
          <div class="FlexTextarea__dummy" aria-hidden="true"></div>
          <textarea id="FlexTextarea" class="FlexTextarea__textarea" v-model="resultScreen.msg.text"></textarea>
        </div>
        <!-- <input class="form-control" type="text" id="result-message" v-model="resultScreen.msg.text"> -->
      </div>
    </div>
    <!--</--プレビュー-->
    <div class="row">
      <div class="form_title col-md-3">
        <div>
          プレビュー
        </div>
        <small class="form-text">位置・大きさ・色を変更できます／点線の内側がツイート時に切り取られます</small>
      </div>
      <!--結果数タイプのプレビュー 大きさcol-md-6はこっちで指定-->
      <div class="input-form col-md-9">
        <result-preview  class="col-md-8 p-0"
                            :typeNum="resultScreen.typeNum"
                            :backImgSrc="resultScreen.back.imgSrc"
                            :resultStr="resultScreen.msg.text"
        >
        </result-preview>
      </div>
    </div>
    <!--</--カードリスト-->
    <div class="row">
      <div class="form_title col-md-3">
        <div>
          カードリスト<span class="asterisk">*</span>
        </div>
        <small class="form-text">BOXに表示するカードを登録します</small>
      </div>
      <div class="input-form col-md-9">

        <div v-show="resultScreen.cardList.length != 0">
          <div class="card-area" v-for="card in resultScreen.cardList" :key="card.num">
            <button type="button" class="close mr-2 mr-sm-0" aria-label="Close" @click="deleteCard(card.num)">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="card-edit-area" @click="editClick(card)">

              <div class="card-img">
                <img class="img-fluid border border-secondary" :src="card.imgSrc" style="width:3.5em">
              </div>
              <div class="card-name-container" style="override:hidden;">
                  <span class="badge badge-card">CARD{{card.num}}</span><br>
                  {{card.name}}
              </div>

            </div>
          </div>
          <div class="length-count"><span></span><span>{{resultScreen.cardList.length+'/30'}}</span></div><!-- カード数の上限 -->
        </div>

        <div class="text-center">
          <button type="button" class="plus-btn btn btn-pink" @click="$emit('loadClick', tmpCard);$bvModal.show('add-card-modal')" :disabled="resultScreen.cardList.length >= 30">＋</button> <!-- 追加ボタン -->
        </div>

      </div>
    </div>
    <!--</--出現カード設定-->
    <div class="row" v-show="resultScreen.cardList.length != 0">
      <div class="form_title col-md-3">
        <div>
          出現率の設定
        </div>
        <small class="form-text">各BOXのカードの出やすさを設定できます</small>
      </div>
      <div class="input-form col-md-9">
        <b-form-select
        class="box-select"
        v-model.number="selectedBox"
        :options="boxNumOptions.slice(0, resultScreen.typeNum)"
        style="height:42px;padding:10px;padding-top:8px;font-size:16px;"
        ></b-form-select>

        <div class="box-rate-wrapper">
          <div class="rate-box" v-for="card in resultScreen.cardList" :key="card.num">
            <div class="badge-box">
              <span class="badge badge-card">CARD{{card.num}}</span>
            </div>
            <div class="box-img">
              <img class="img-fluid border border-secondary" :src="card.imgSrc">
            </div>
            <div class="calc-rate">
              {{(Math.round((Math.round(card.boxRate[selectedBox-1]/sumRate*100 * 100)/100 + 0.0078125)*100000000)/100000000).toString().slice(0, -5)}}% <!--有効数字２桁-->
            </div>
            <div class="rate-input">
              <input class="form-control" type="number" id="box-rate" v-model.number="card.boxRate[selectedBox-1]" min="0" max="100" step="0.01" @change="justifyRate($event, card.num)">
            </div>
          </div>
        </div>

        <div class="rate-set-btn row row-height">
          <div class="rate-btn-wrapper col-12 col-sm-4">
            <button class="btn-outline-pink btn btn-outline-dark" @click.prevent="resetRate">
              このBOXをリセット
            </button>
          </div>
          <div class="rate-btn-wrapper col-12 col-sm-4">
            <b-button class="btn-outline-pink" v-b-modal.copy-alert :disabled="resultScreen.typeNum===1">
              すべてのBOXに設定をコピー
            </b-button>
            <b-modal id="copy-alert" title="警告" cancel-title="キャンセル" @ok="copyToAllBox">
              他のすべてのBOXの設定が失われます。
            </b-modal>
          </div>
          <div class="rate-btn-wrapper col-12 col-sm-4">
            <b-dropdown id="dropdown-1" variant="info" text="ほかのBOXから設定をコピー" class="dropdown-outline-pink" :disabled="resultScreen.typeNum===1">
              <b-dropdown-item v-for="num in resultScreen.typeNum" :key="num" @click="copyFromBox(num)" :disabled="num===selectedBox">{{num}}</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
      </div>
    </div>
    <!--modal-->
    <div>
      <b-modal id="add-card-modal" hide-footer>
        <template v-slot:modal-title>
          カードを追加
        </template>
        <div class="row">
          <div class="modal-img col-2">
            <img class="img-fluid" :src="tmpCard.imgSrc? tmpCard.imgSrc: require('@/assets/img_icon.png')" style="width:3em" @click.prevent="loadImage();">
          </div>
          <div class="input-form col-10">
            <input class="form-control" type="text" id="card-name" placeholder="名前" v-model="tmpCard.name" style="top:1em">
            <div class="length-count"><span></span><span>{{tmpCard.name.length+'/30'}}</span></div>
          </div>
        </div>
        <b-button class="mt-3" block @click="addCard();$bvModal.hide('add-card-modal');" :disabled="(tmpCard.name==''||tmpCard.imgSrc==undefined)" >OK</b-button>
      </b-modal>
    </div>


    <!--modal-->
    <div>
      <b-modal id="edit-card-modal" hide-footer @hidden="editClose">
        <template v-slot:modal-title>
          カードを編集
        </template>
        <div class="row">
          <div class="modal-img col-2">
            <img class="img-fluid" :src="tmpCard.imgSrc" @click.prevent="loadImage();">
          </div>
          <div class="input-form col-10">
            <input class="form-control" type="text" id="card-name" placeholder="名前" v-model="tmpCard.name" style="top:1em">
            <div class="length-count"><span></span><span>{{tmpCard.name.length+'/30'}}</span></div>
          </div>
        </div>
        <b-button class="mt-3" block @click="editCard();$bvModal.hide('edit-card-modal');" :disabled="(tmpCard.name==''||tmpCard.imgSrc==undefined)" >OK</b-button>
      </b-modal>
    </div>
    <!--modal-->
  </div>
</template>

<script>
import $ from 'jquery'
import ResultPreview from './ResultPreview'
import makeStore from './make-store'

const resultBackSrc = {
  '1': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-01.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-01.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-01.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-01.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '2': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-02.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-02.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-02.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-02.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '3': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-03.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-03.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-03.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-03.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '4': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-04.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-04.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-04.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-04.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '5': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-05.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-05.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-05.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-05.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '6': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-06.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-06.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-06.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-06.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '8': [
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-08.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-08.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-08.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-08.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
  '10':[
    {type: 'yellow', src: require('@/assets/resultBack/ss_ye-10.jpg')},
    {type: 'pink',   src: require('@/assets/resultBack/ss_pink-10.jpg')},
    {type: 'blue',   src: require('@/assets/resultBack/ss_blue-10.jpg')},
    {type: 'green',  src: require('@/assets/resultBack/ss_green-10.jpg')},
    {type: 'coffee', src: require('@/assets/resultBack/z_coffee.jpg')},
    {type: 'spark',  src: require('@/assets/resultBack/z_spark.jpg')},
    {type: 'neko',   src: require('@/assets/resultBack/z_neko.jpg')},
  ],
};
const MAX_NAME_LENGTH = 30;

const cardPtype =  {
  num: null,
  prevNum: null,
  imgSrc: undefined,
  name: '',
  boxRate: [],
}

export default {
  name: 'app-setting',
  components: {
    ResultPreview,
  },
  data() {
    return {
      resultScreen: {
        typeNum: makeStore.state.gachaData.resultScreen.typeNum,
        msg: {
          text: makeStore.state.gachaData.resultScreen.message.text,
        },
        back: {
          imgSrc: makeStore.state.gachaData.resultScreen.back.imgSrc,
        },
        cardList: makeStore.state.gachaData.resultScreen.cardList,
      },
      typeNumOptions: [
        {value: 1, text: '1'},
        {value: 2, text: '2'},
        {value: 3, text: '3'},
        {value: 4, text: '4'},
        {value: 5, text: '5'},
        {value: 6, text: '6'},
        {value: 8, text: '8'},
        {value: 10, text: '10'},
      ],
      boxNumOptions: [
        {value: 1, text: 'BOX1'},
        {value: 2, text: 'BOX2'},
        {value: 3, text: 'BOX3'},
        {value: 4, text: 'BOX4'},
        {value: 5, text: 'BOX5'},
        {value: 6, text: 'BOX6'},
        {value: 7, text: 'BOX7'},
        {value: 8, text: 'BOX8'},
        {value: 9, text: 'BOX9'},
        {value: 10, text: 'BOX10'},
      ],
      resultBackSrc: resultBackSrc,
      backType: 'yellow',
      editingCardNum: null,
      tmpCard: null,
      selectedBox: 1,
    }
  },
  computed: {
    sumRate() {
      const cardList = this.resultScreen.cardList;
      var sum = 0;
      for (let card of cardList) {
        sum += card.boxRate[this.selectedBox-1];
      }

      // sumが0になるとき割れないから敢えて0より大きい数を入れておく
      if (sum === 0) sum = 1;
      return sum;
    },
  },
  async created() {
    this.tmpCard = Object.assign({}, cardPtype);
    this.tmpCard.boxRate = new Array(10).fill(1);

    if (makeStore.state.uid == null) {
      this.resultScreen.back.imgSrc = await this.imageToBase64(resultBackSrc[this.resultScreen.typeNum.toString()].find(item=>item.type === this.backType).src, 'image/jpeg');

      this.tmpCard.name = 'スライム';
      this.tmpCard.boxRate = new Array(10).fill(1);
      this.addCard();
      this.resultScreen.cardList[0].imgSrc = await this.imageToBase64(require('@/assets/slime.png'), 'image/jpeg');

      this.tmpCard.name = 'ミノタウロス';
      this.tmpCard.boxRate = new Array(10).fill(1);
      this.addCard();
      this.resultScreen.cardList[1].imgSrc = await this.imageToBase64(require('@/assets/minotaur.png'), 'image/jpeg');
    }
  },
  methods: {
    editClick(card) {
      this.editingCardNum = card.num;
      this.tmpCard.num = card.num;
      this.tmpCard.name = card.name;
      this.tmpCard.prevNum = card.prevNum;
      this.tmpCard.imgSrc = card.imgSrc;
      this.tmpCard.boxRate = card.boxRate.slice();

      this.$emit('loadClick', this.tmpCard);
      this.$bvModal.show('edit-card-modal');
    },
    editCard() {
      this.resultScreen.cardList[this.editingCardNum-1] = this.tmpCard;

      this.editingCardNum = null;
      // tmpCardをリセット
      this.tmpCard = Object.assign({}, cardPtype);
      this.tmpCard.boxRate = new Array(10).fill(1);
    },
    editClose() {
      // tmpCardをリセット
      this.tmpCard = Object.assign({}, cardPtype);
      this.tmpCard.boxRate = new Array(10).fill(1);
    },
    deleteCard(deleteNum) {
      const cardList = this.resultScreen.cardList;
      cardList.splice(deleteNum - 1, 1);
      let i = 1;
      for(let card of cardList) {
        card.prevNum = card.num;
        card.num = i;
        i++;
      }
    },
    addCard() {
      const cardList = this.resultScreen.cardList;
      let newCard = Object.assign({}, this.tmpCard);
      cardList.push(newCard);
      cardList[cardList.length - 1].num = cardList.length;
      cardList[cardList.length - 1].prevNum = cardList.length;

      // tmpCardをリセット
      this.tmpCard = Object.assign({}, cardPtype);
      this.tmpCard.boxRate = new Array(10).fill(1);
    },
    loadImage() {
      // 非表示のinput fileをクリックしたことにする
      $('#imgInputElm').click();
    },
    // loadBackImage() {
    //   // 非表示のinput fileをクリックしたことにする
    //   $('#backImgInputElm').click();
    // },
    resetRate() {
      const cardList = this.resultScreen.cardList;
      for(let card of cardList) {
        this.$set(card.boxRate, this.selectedBox-1, 1);
      }
    },
    justifyRate(e, cardNum) { // e 変更後 event、cardNum変更したカードの番号、↓↓
      let newVal = e.target.value;
      let justVal = 0;
      if (isNaN(newVal)) {
        justVal = 0;
      } else if (newVal < 0) {
        justVal = 0;
      } else if (newVal > 100) {
        justVal = 100;
      } else {
        justVal = Math.round(newVal*100)/100;
      }
      e.target.value = justVal;
      this.$set(this.resultScreen.cardList[cardNum-1].boxRate, this.selectedBox-1, justVal);

    },
    copyToAllBox() {
      const cardList = this.resultScreen.cardList;
      for(let card of cardList) {
        for(let i = 0; i < this.resultScreen.typeNum; ++i) {
          if (i === this.selectedBox-1) continue;
          this.$set(card.boxRate, i, card.boxRate[this.selectedBox-1]);
        }
      }
    },
    copyFromBox(num) {
      const cardList = this.resultScreen.cardList;
      for(let card of cardList) {
        this.$set(card.boxRate, this.selectedBox-1, card.boxRate[num-1]);
      }
    },
    imageToBase64(src, mime_type) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => {
          // New Canvas
          var canvas = document.createElement('canvas');
          canvas.width  = img.width;
          canvas.height = img.height;
          // Draw Image
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          // To Base64
          resolve(canvas.toDataURL(mime_type));
        }
        img.src = src;
      });
    },
    async loadload(type) {
      if (type !== 'custom') {
        let src = resultBackSrc[this.resultScreen.typeNum.toString()].find(item=>item.type === type).src;
        this.resultScreen.back.imgSrc = await this.imageToBase64(src, 'image/jpeg')

        // typeを保存して次にtypeNumを変えたときに使えるようにする
        this.backType = type;
      }
    },
  },
  watch: {
    'tmpCard.name' (to, from) {
      if (to.length > MAX_NAME_LENGTH) {
        this.tmpCard.name = from;
      }
    },
    'resultScreen.typeNum'(val) {
      // 背景も変える
      this.loadload(this.backType);
      makeStore.set_resultScreen_typeNum(val);
    },
    'resultScreen.msg.text'(val) {
      makeStore.set_resultScreen_message_text(val);
    },
    'resultScreen.back.imgSrc'(val) {
      makeStore.set_resultScreen_back_imgSrc(val);
    },
    'resultScreen.cardList'(val) {
      makeStore.set_resultScreen_cardList(val);
    },
  },
}
</script>

<style scoped>
@import '../../css/form-style.css';
@import '../../css/common.css';
@import '../../css/flex-textarea.css';

.make_setting {
  border-bottom: 1px solid #B36B7D;
}
.close {
  padding-top: 2px;
  padding-right: 4px;
  line-height: 24px;
  vertical-align: top;
  font-weight: 200;
  font-size: 32px;
}

.plus-btn {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  padding: 0px;
  line-height: 20px;
  font-size: 30px;
  text-align: center;
  vertical-align: middle;
}

.card-area {
  margin: 0px;
  margin-bottom: 4px;
  padding: 7px;
  background-color: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 3px;
}
.card-edit-area {
  cursor: pointer;
  vertical-align: top;
}
.card-img {
  display: inline-block;
  vertical-align: top;
  padding: 6px;
  width: 64px;
  height: 64px;
  /* min-width:inherit; */
}
.card-img img{
  max-width: 52px;
}
.card-name-container {
  display: inline-block;
  max-width: calc(100% - 96px);
  padding: 6px;
  color: #333333;
  font-size: 18px;
}
.box-select {
  margin-bottom: 4px;
}
.box-rate-wrapper {
  padding: 7px;
  border: 3px solid #B36B7D;
  border-radius: 3px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-y: hidden;
}
.rate-box {
  display: inline-block;
  width: 70px;
  margin: 6px;
  margin-top: 5px;
}
.badge-card {
  width: 70px;
  height: 21px;
  margin-bottom: 4px;
  vertical-align: top;
  background: #B36B7D;
  font-size: 14px;
  color: #fff;
}
.box-img {
  margin-bottom: 6px;
}
.calc-rate {
  height: 22px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #E62E5C;
}
.rate-input input {
  width: 70px;
  height: 42px;
  padding-left: 2px;
  padding-right: 2px;
}

.row-height {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.rate-set-btn {
  padding-left: 14px;
  padding-right: 14px;
}
.rate-btn-wrapper {
  padding-left: 2px;
  padding-right: 2px;
  margin-bottom: 4px;
}

.length-count {
  padding: 1px;
  display: flex;
  justify-content: space-between;
}

.btn-outline-pink {
  width: 100%;
  height: 100%;
  padding: 10px;
  font-size: 16px;
  line-height: 22px;
}

.dropdown-outline-pink {
  width: 100%;
}
.dropdown-outline-pink .btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  line-height: 22px;
  white-space: inherit !important;
}

.modal-img {
  padding: 0px;
  padding-left: 15px;
}
.modal-img img {
  width: 68px;
}
.modal-body > div > .input-form {
  padding-bottom: 0px;
}
</style>

<style>
.dropdown-outline-pink .btn {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  line-height: 22px;
  white-space: inherit !important;
}
</style>
