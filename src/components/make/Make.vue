<template>
  <div>
    <div v-show="save_loading" class="save_loading">
      <div class="save_container">
        <p>保存中</p>
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
      </div>
    </div>
    <div>
      <div class="make_main">
        <app-profile/>
        <start-scene ref="start_scene" @loadClick="imgObjAdrs=$event"/>
        <app-setting @loadClick="imgObjAdrs=$event"/>
        <result-text-editor/>
        <div>
          <div class="sub_title">
            <div>
              公開設定
            </div>
          </div>
          <div class="text-center">
            <b-button class="btn-terms" variant="outline-secondary" size="sm" v-b-modal.terms_modal>利用規約</b-button>
          </div>
          <div class="check-wrapper">
            <b-form-checkbox
              id="checkbox-2"
              class="_check"
              v-model="acceptTerms"
              name="checkbox-2"
              value="accepted"
              unchecked-value="not_accepted"
            >
              利用規約に同意する
            </b-form-checkbox>
          </div>
          <div class="check-wrapper">
            <b-form-checkbox
              id="checkbox-1"
              class="_check"
              v-model="acceptShow"
              name="checkbox-1"
              value="accepted"
              unchecked-value="not_accepted"
            >
              新着・人気ページに表示する
            </b-form-checkbox>
          </div>
        </div>
        <div class="text-center">
          <p class="submit-warning" v-if="makeState.name==''">タイトルを入力してください</p>
          <p class="submit-warning" v-if="makeState.gachaData.resultScreen.cardList.length<1">カードを１枚以上登録してください</p>
          <p class="submit-warning" v-if="makeState.gachaData.resultMessage.messageSrc==''">結果テキストを入力してください</p>
          <p class="submit-warning" v-if="acceptTerms=='not_accepted'">利用規約を必ず読み同意してください</p>
          <button class="btn btn-pink btn-submmit" @click.prevent="exportData" :disabled="(makeState.name==''||makeState.gachaData.resultScreen.cardList.length<1||makeState.gachaData.resultMessage.messageSrc==''||acceptTerms=='not_accepted')">
            公開する
          </button>
        </div>
        <div style="height: 40px;"></div>
        <!--preview button-->
        <b-button class="sm btn-pink preview-btn" @click="showPreviewModal">プレビュー</b-button>
      </div>
      <!--modal-->
      <cropper-modal :typeNum="makeState.gachaData.resultScreen.typeNum" :isCard="imgObjAdrs.name != undefined" @crop="asgImg($event)"></cropper-modal>
      <!--modal-->
      <b-modal id="preview_modal" @shown="shownPreviewModal" hide-header>
        <play-renderer ref="preview_container"></play-renderer>
        <template v-slot:modal-footer="{hide}">
          <b-button @click.prevent="reload">もう一度</b-button>
          <b-button @click.prevent="hide">閉じる</b-button>
        </template>
      </b-modal>
      <!--modal-->
      <!--modal-->
      <b-modal id="terms_modal" size="lg" scrollable>
        <template v-slot:modal-title>
          利用規約
        </template>
        <div class="terms_content">
          <p>この規約 (以下、「本規約」といいます。)は、運営者(@Yeq6X/@gachatuku)が本サービスの利用条件を定めるものです。</p>
          <h5>１．	本規約について</h5>
          <ol>
            <li class="bullet_point">ユーザーは、本規約に従ってご利用いただきます。</li>
            <li class="bullet_point">本規約は、ユーザーと運営者との間に適用されます。</li>
            <li class="bullet_point">運営者は、予告なく本規約を変更できるものとします。</li>
          </ol>
          <h5>２．	禁止事項</h5>
          <ol>
            <li>運営者は、以下の内容を投稿することを禁じます。</li>
            <li>
              <ol>
                <li class="bullet_point">過度に性的、暴力的、または残虐な内容</li>
                <li class="bullet_point">差別的、または攻撃的な内容</li>
                <li class="bullet_point">自殺、犯罪、またはそれらを助長する内容</li>
                <li class="bullet_point">スパム、またはスパムサイトへ誘導する内容</li>
                <li class="bullet_point">他者の権利を侵害する内容</li>
                <li class="bullet_point">公序良俗に反する内容</li>
                <li class="bullet_point">特定の人に対し不快感を与える内容</li>
                <li class="bullet_point">他者のコンテンツをコピーした内容</li>
              </ol>
            </li>
          </ol>
          <h5>３．	禁止行為に対する処置</h5>
          <ol>
            <li>ユーザーの投稿コンテンツが、本規約の禁止事項に違反した場合、または、禁止事項に違反していなくても運営者が不適切と判断した場合、運営者は予告なしに、投稿コンテンツやユーザーの削除または利用停止処置を行えるものとします。</li>
          </ol>
          <h5>４．	利用料金</h5>
          <ol>
            <li>本サービスは全て無料で利用できます。ただし、本サービスを利用するための通信機器、通信にかかる費用は利用者の負担とします。</li>
          </ol>
          <h5>５．	損害賠償</h5>
          <ol>
            <li>ユーザーが本規約に違反することにより運営者に損害が発生した場合、運営者はユーザーに対し、この損害の賠償を請求することができ、利用者は、当該請求に直ちに応じなければならないものとします。</li>
          </ol>
          <h5>６．	免責事項</h5>
          <ol>
            <li class="bullet_point">運営者は、本サービスによりユーザーまたは他者が被った損害に対し、運営者に故意又は重過失が存する場合を除き一切の責任を負いません。</li>
            <li class="bullet_point">運営者は本サービス上の投稿コンテンツを監視する義務を負いません。</li>
            <li class="bullet_point">本サービスの利用者による投稿コンテンツによって他のユーザー、他者に損害が発生した場合、損害に対する責任は投稿を行った当該ユーザーにあり、運営者は自らに故意又は重過失が存する場合を除き一切の責任を負いません。</li>
            <li class="bullet_point">ユーザー同士、またはユーザーと他者との間に紛争が発生した場合、当該関係者同士で解決するものとし、運営者は二者を仲介しません。</li>
            <li class="bullet_point">運営者は、予告なしに本サービスの運営を停止または中止し、また本サイトに掲載されている情報の全部または一部を削除・変更できるものとします。</li>
          </ol>
          <p class="terms_end">以上</p>
          <p>2020年4月17日 制定</p>
        </div>
        <template v-slot:modal-footer="{hide}">
          <b-button @click.prevent="hide">閉じる</b-button>
        </template>
      </b-modal>
      <!--modal-->
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import AppProfile from '@/components/make/AppProfile'
import AppSetting from '@/components/make/AppSetting'
import ResultTextEditor from '@/components/make/ResultTextEditor'
import StartScene from '@/components/make/StartScene'
import CropperModal from '@/components/make/CropperModal'
import PlayRenderer from '@/components/renderer/PlayRenderer'
import flexTextarea from '@/components/mixin/flexTextarea'

import firebase from '../../firebase'

import store from '@/store'
import makeStore from '@/components/make/make-store'
import router from '@/router'


const MAX_WIDTH = {
  'back': 700,
  1: 463,
  2: 463,
  3: 362,
  4: 270,
  5: 216,
  6: 216,
  8: 216,
  10: 216,
}

export default {
  components: {
    AppProfile,
    AppSetting,
    ResultTextEditor,
    StartScene,
    CropperModal,
    PlayRenderer,
  },
  props: {
    isEditMode: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [flexTextarea],
  data() {
    return {
      boxImgSrc: [],
      imgObjAdrs: {},
      makeState: makeStore.state,
      state: store.state,
      db: null,
      storage: null,
      user: {},
      docId: null,

      save_loading: false,

      acceptShow: makeStore.state.acceptShow, // 新着欄に表示
      acceptTerms: 'not_accepted', // 同意しますか

      window_height: 0,
    }
  },

  async created() {

    this.db = firebase.firestore();
    this.storage = firebase.storage();

    if (this.state.userState === 'logon') {
      // usernameがまだないとき(ユーザータブに行ってないとき)
      if (!this.state.uid || !this.state.username || !this.state.displayName || !this.state.photoURL) {
        const doc = await this.db.collection('users_base').doc(this.state.uid).get({source: 'server'});

        store.setUsername(doc.data().username);
        this.user = {
          uid: doc.data().uid,
          username: doc.data().username,
          displayName: doc.data().displayName,
          photoURL: doc.data().photoURL,
        }
      } else {
        this.user = {
          uid: this.state.uid,
          username: this.state.username,
          displayName: this.state.displayName,
          photoURL: this.state.photoURL,
        }
      }
    } else if (this.state.userState === 'logoff') {
      router.push('/login');
      this.user = {
        uid: 'anonymous',
        username: 'anonymous',
        displayName: '',
        photoURL: '',
      }
    } else {
      console.error('user unknown');
    }
  },

  mounted() {
    $('.preview-btn')
    .css('right',
      ( $(window).width() - parseInt($('.container').css('width')) ) / 2 + 20 + 'px')
    .css('top', $(window).height() - 20 - 41 + 'px');

    $(window).resize(() => {
      $('.preview-btn')
      .css('right',
        ( $(window).width() - parseInt($('.container').css('width')) ) / 2 + 20 + 'px')
      .css('top', $(window).height() - 20 - 41 + 'px');
    });
    $(window).scroll(() => {
      // console.log($(window).height())
      // $('.preview-btn')
      // .css('top', $(window).height() - 20 - 41 + 'px')
    })


  },
  methods: {
    asgImg(src) {
      this.imgObjAdrs.imgSrc = src;
    },

    showPreviewModal() {
      this.$bvModal.show('preview_modal');
    },

    shownPreviewModal() {
      this.$refs.preview_container.initialize(this.makeState.gachaData);
    },

    reload() {
      this.$refs.preview_container.initialize(this.makeState.gachaData);
    },

    async exportData() {
      this.save_loading = true;
      await this.$refs.start_scene.saveOgp();
      await this.saveToFirestore();
      await this.addToUser();
      router.push(`/app/${this.docId}`);
    },

    async addToUser() {
      await this.db.collection('users').doc(this.user.uid)
      .set(
        { appCount : firebase.firestore.FieldValue.increment(1),
          appArray : firebase.firestore.FieldValue.arrayUnion(this.docId),
        },
        {merge: true},
      )
    },

    // firestore に保存する関数
    async saveToFirestore() {
      let docRef;
      if (!this.makeState.uid) { // 新規
        // 作成するdocumentを取得
        docRef = this.db.collection('apps').doc();
        this.docId = docRef.id;
      } else {
        docRef = this.db.collection('apps').doc(this.makeState.uid);
        await docRef.delete();
        this.docId = this.makeState.uid;
      }

      return new Promise(resolveAll => {
        // uid、user情報保存
        this.set_document_uid(this.docId);
        this.set_user(this.user);

        // 作成時間の保存
        this.setCreateDate();

        // saveToStorage関数によってDataURLをstrageのURLに変換する
        // 一つ一つの変換をpromiseで作り、それをpromiseAllしてすべて終わってからresolveする
        let saveData = Object.assign({}, this.makeState);

        // promise.all用の配列
        let promiseArr = [];

        // OGP
        const ogpPromise = this.saveToStorage(this.base64ToBlob(saveData.ogpSrc), 'apps/' + this.docId + '/ogp').then(url => {
          saveData.ogpSrc = url;
        })
        promiseArr.push(ogpPromise);

        // resultData
        const resultPromise = this.compressSave(saveData.gachaData.resultScreen.back.imgSrc, 'apps/' + this.docId + '/result_back', 100000, MAX_WIDTH['back']);
        promiseArr.push(resultPromise);
        resultPromise.then(url => {
          saveData.gachaData.resultScreen.back.imgSrc = url;
        });

        // cardData
        let typeNum = saveData.gachaData.resultScreen.typeNum;
        saveData.gachaData.resultScreen.cardList.forEach(card => {
          let cardPromise = this.compressSave(card.imgSrc, 'apps/' + this.docId + '/card' + card.num, 100000, MAX_WIDTH[typeNum]);
          promiseArr.push(cardPromise);
          cardPromise.then(url => {
            card.imgSrc = url;
          });
        });

        // startData
        const startPromise = this.compressSave(saveData.gachaData.startScreen.back.imgSrc, 'apps/' + this.docId + '/start_back', 100000, MAX_WIDTH['back']);
        promiseArr.push(startPromise);
        startPromise.then(url => {
          saveData.gachaData.startScreen.back.imgSrc = url;
        });


        const promiseAll = Promise.all(promiseArr);

        promiseAll.then(() => {
          docRef.set(saveData).then(() => {
            this.save_loading = false;
            // console.log('saved');
            resolveAll();

          });
        });
      });
    },

    setCreateDate() {
      makeStore.set_createDate(firebase.firestore.FieldValue.serverTimestamp());
    },

    set_document_uid(uid) {
      makeStore.set_uid(uid);
    },

    set_user(user) {
      makeStore.set_user_uid(user.uid);
      makeStore.set_user_username(user.username);
      makeStore.set_user_displayName(user.displayName);
      makeStore.set_user_photoURL(user.photoURL);
    },

    async compressSave(src, path, maxSize, maxWidth) {
      let cmpSrc, url;
      cmpSrc = await this.compressImage(src, maxSize, maxWidth, maxWidth);
      url = await this.saveToStorage(cmpSrc, path);
      return url;
    },

    saveToStorage(data, path) {
      const self = this;
      return new Promise((resolve) => {
        self.storage
        .ref()
        .child(path)
        // .putString(data, 'data_url').then(snapshot => {
        .put(data).then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            resolve(url);
          });
        }).catch(() => {
          // console.log(error);
        });
      });
    },
    compressImage(src, maxSize, maxWidth, maxHeight) {
      return new Promise((resolve) => {
        maxHeight = maxHeight | maxWidth;
        let self = this;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        let img = new Image();
        let retBinary = null;
        let retBlob = null;

        img.onload = function() {
          let w, h;
          if (img.width < maxWidth && img.height < maxHeight) { // 小さいとき
            w = img.width;
            h = img.height;
          } else {
            w = maxWidth;
            h = maxHeight;
          }
          canvas.width = w;
          canvas.height = h;
          context.drawImage(img, 0, 0, w, h);
          retBinary = canvas.toDataURL('image/jpeg');

          // 変換
          retBlob = self.base64ToBlob(retBinary);

          // サイズチェックして再変換
          if(maxSize <= retBlob['size']) {
            let capacityRatio = maxSize / retBlob['size'];
            retBinary = canvas.toDataURL('image/jpeg', capacityRatio);
            retBlob = self.base64ToBlob(retBinary);
          }

          // blobにするのはアップロードするとき
          resolve(retBlob);
        }
        img.crossOrigin = 'Anonymous';
        img.src = src;
      });
    },
    // 引数のBase64の文字列をBlob形式にする
    base64ToBlob(base64) {
      let base64Data = base64.split(',')[1], // Data URLからBase64のデータ部分のみを取得
            data = window.atob(base64Data), // base64形式の文字列をデコード
            buff = new ArrayBuffer(data.length),
            arr = new Uint8Array(buff),
            blob,
            i,
            dataLen;
      // blobの生成
      for (i = 0, dataLen = data.length; i < dataLen; i++) {
          arr[i] = data.charCodeAt(i);
      }
      blob = new Blob([arr], {type: 'image/jpeg'});
      return blob;
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
  },
  watch: {
    acceptShow(val) {
      makeStore.set_acceptShow(val);
    }
  }
}
</script>

<style scoped>
@import '../../css/common.css';

.preview-btn {
  position: fixed;
  font-size: 18px;
  font-weight: 800;
}





.submit-warning {
  margin: 0px;
  color: red;
  font-size: 14px;
}



.btn-terms {
  width: 235px;
  height: 38px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.terms_content {
  padding-left: 15px;
  padding-right: 15px;
}
.terms_content p {
  padding-left: 4px;
  padding-right: 4px;
}
.terms_end {
  text-align: right;
  padding-top: 20px;
}
.terms_content h5 {
  margin-top: 15px;
  margin-bottom: 10px;
}
.terms_content ol {
  padding-left: 1.3em;
}
.terms_content ol > li {
  position: relative;
  list-style-type: none;
}
.bullet_point::before {
  content: "・";
  position: absolute;
  left: -1em;
}



.check-wrapper {
  display: flex;
  justify-content: center;
}
._check {
  margin-bottom: 10px;
  width: 235px;
}
.btn-submmit {
  margin-top: 10px;
  width: 235px;
}





.save_loading {
  background: #000000A0;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 3000;
  justify-content: center;
	position: fixed;
	display: flex;
  align-items: center;
}
.save_container {
  color: #FFFFFF;
  font-size: 20px;
  text-align: center;
}
.spinner {
  margin-bottom: 46px;
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #FFFFFF;
  height: 100%;
  width: 20%;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0);
    -webkit-transform: scaleY(0);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>
