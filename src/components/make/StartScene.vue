<template>
  <div class="make_start">
    <!--スタート画面-->
    <div class="sub_title">
      <div>
        スタート画面設定
      </div>
    </div>
    <div>
      <!--</--背景選択-->
      <div class="row">
        <div class="form_title col-md-3">
          <div>
            背景<span class="asterisk">*</span>
          </div>
        </div>
        <div class="input-form col-md-9">
          <div class="back-select-area">
            <img class="img-fluid" :src="require('@/assets/img_icon.png')" @click.prevent="$emit('loadClick', startScreen.back);loadImage();">
            <img class="img-fluid" :src="require('@/assets/startBack/ss_ye_00a.jpg')"   @click.prevent="loadload(require('@/assets/startBack/ss_ye_00a.jpg'))">
            <img class="img-fluid" :src="require('@/assets/startBack/ss_pink_00a.jpg')" @click.prevent="loadload(require('@/assets/startBack/ss_pink_00a.jpg'))">
            <img class="img-fluid" :src="require('@/assets/startBack/ss_blue-00.jpg')"  @click.prevent="loadload(require('@/assets/startBack/ss_blue-00.jpg'))">
            <img class="img-fluid" :src="require('@/assets/startBack/ss_green-00.jpg')" @click.prevent="loadload(require('@/assets/startBack/ss_green-00.jpg'))">
            <img class="img-fluid" :src="require('@/assets/startBack/ss_spark.jpg')"    @click.prevent="loadload(require('@/assets/startBack/ss_spark.jpg'))">
            <img class="img-fluid" :src="require('@/assets/startBack/ss_neko.jpg')"     @click.prevent="loadload(require('@/assets/startBack/ss_neko.jpg'))">
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
            <textarea id="FlexTextarea" class="form-control FlexTextarea__textarea" v-model="startScreen.msg.text"></textarea>
          </div>
          <!-- <input class="form-control" type="text" id="start-message" v-model="startScreen.msg.text"> -->
        </div>
      </div>
      <!--</--ボタン選択-->
      <div class="row">
        <div class="form_title col-md-3">
          <div>
            ボタン
          </div>
          <small class="form-text">ボタンに表示されるテキストです</small>
        </div>
        <div class="input-form col-md-9">
          <input class="form-control" type="text" id="btn-text" v-model="startScreen.btn.text">
        </div>
      </div>
      <!--</--配置preview-->
      <div class="row">
        <div class="form_title col-md-3">
          <div>
            プレビュー
          </div>
          <small class="form-text">位置・大きさ・色を変更できます／点線の内側がツイート時に切り取られます</small>
        </div>
        <!--プレビュー 大きさcol-md-6はこっちで指定-->
        <div class="input-form col-md-9">
          <start-preview  class="col-md-8 p-0"
                          ref="start_preview"
                          :backImgSrc="startScreen.back.imgSrc"
                          :startStr="startScreen.msg.text"
                          :btnStr="startScreen.btn.text"
          ></start-preview>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import StartPreview from '@/components/make/StartPreview'

import makeStore from './make-store'

export default {
  name: 'start-scene',
  components: {
    StartPreview,
  },
  props: {
  },
  data() {
    return {
      startScreen: {
        msg: {
          text: makeStore.state.gachaData.startScreen.message.text,
        },
        back: {
          imgSrc: makeStore.state.gachaData.startScreen.back.imgSrc,
        },
        btn: {
          text: makeStore.state.gachaData.startScreen.btn.text,
        },
      },
    }
  },
  async created() {
    if (makeStore.state.gachaData.startScreen.back.imgSrc === '') {
      this.startScreen.back.imgSrc = await this.imageToBase64(require('@/assets/startBack/ss_ye_00a.jpg'), 'image/jpeg');
    }
  },
  methods: {
    loadImage() {
      // 非表示のinput fileをクリックしたことにする
      $('#imgInputElm').click();
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
    async loadload(src) {
      this.startScreen.back.imgSrc = await this.imageToBase64(src, 'image/jpeg')
    },
    async saveOgp() {
      await this.$refs.start_preview.saveOgp();
    },
  },
  watch: {
    'startScreen.msg.text': val => {
      makeStore.set_startScreen_message_text(val);
    },
    'startScreen.back.imgSrc': val => {
      makeStore.set_startScreen_back_imgSrc(val);
    },
    'startScreen.btn.text': val => {
      makeStore.set_startScreen_btn_text(val);
    },
  },
}
</script>

<style scoped>
@import '../../css/form-style.css';
@import '../../css/flex-textarea.css';

.make_start {
  border-bottom: 1px solid #B36B7D;
}
</style>