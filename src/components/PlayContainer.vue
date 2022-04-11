<template>
  <div class="app_container col-sm-9 col-md-7 col-lg-5 mb-4">
    <div v-show="saving" class="save_loading">
      <div class="save_container text-center">
        <p>読み込み中</p>
        <div class="justify">
          <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
          </div>
        </div>
      </div>
    </div>
    <b-modal ref="tweet-modal" size="sm" centered hide-header hide-footer>
      <p class="text-center">ツイート画面を開きますか</p>
      <b-button class="mt-3 btn-tweet btn-modal" block @click="openTweetURL">ツイート画面を開く</b-button>
      <b-button class="mt-2 btn-cancel btn-modal" variant="outline-danger" block @click="hideModal('tweet-modal')">やめる</b-button>
    </b-modal>
    <b-modal ref="author-modal" class="author-modal" centered hide-header hide-footer>
      <div class="row author-container">
        <div class="user-icon pl-3 pr-1">
          <router-link :to="`/user/${data.user.username}`"><img :src="data.user.photoURL"></router-link>
        </div>
        <div class="author">
          <p class="author-displayname"><router-link :to="`/user/${data.user.username}`">{{data.user.displayName}}</router-link></p>
          <p class="author-username"><router-link :to="`/user/${data.user.username}`">@{{data.user.username}}</router-link></p>
        </div>
      </div>
      <div class="row count-container justify pt-4">
        <div class="col-6 pl-4 pr-1">
          <p>作成したガチャ</p>
          <p>プレイされた回数</p>
        </div>
        <div class="col-6">
          <p>{{user.appCount}}</p>
          <p>{{user.playCount}}</p>
        </div>
      </div>
    </b-modal>
    <b-modal ref="report-modal" centered hide-header hide-footer>
      <h4 class="text-center">ガチャを報告</h4>
      <form action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdysvN_f6HRNE_YOqa2pLM-OaADMx20Zf0-jd4E7qsw9Vpkvw/formResponse">
        <input style="display:none;" name="entry.450568672" :value="data.uid"/>
        <!-- <label for="report-msg">内容</label> -->
        <textarea id="report-msg" class="form-control mt-3 mb-2" name="entry.500162388" placeholder="問題の内容を入力してください。"></textarea>
        <div class="text-right">
          <b-button class="btn-secondary mr-1" @click="hideModal('report-modal')">キャンセル</b-button>
          <b-button class="btn-pink" type="submit">送信</b-button>
        </div>
      </form>
    </b-modal>
      <b-modal ref="delete-modal" centered hide-header hide-footer>
        <h4 class="text-center">ガチャを削除</h4>
        <p class="text-center">削除したガチャは元に戻せません。</p>
        <div class="text-right">
          <b-button class="btn-secondary mr-1" @click="hideModal('delete-modal')">キャンセル</b-button>
          <b-button class="btn-pink" @click="deleteApp">削除</b-button>
        </div>
      </b-modal>
    <div class="app_name">
      <p class="app-name mb-0"><router-link :to="`/app/${data.uid}`">{{data.name}}</router-link></p>
    </div>
    <div class="app_content">
      <play-renderer ref="container" @changeScene="changeScene($event)"></play-renderer>
      <div v-show="isChangeScene" class="text-center">
        <b-button class="btn-reload btn-pink" @click="reload">もう一度</b-button>
        <b-button class="btn-tweet" @click="saveOGP"><i class="fa-twitter"></i>ツイート</b-button>
      </div>
    </div>
    <div class="count_share">
      <div class="play_count">プレイ回数：{{data.playCount}}</div>
      <div>
        <b-dropdown variant="outline-secondary" text="その他" class="btn-tweet-sm mr-2">
          <b-dropdown-item v-if="!isSelfPage" @click="showAuthor">作者を見る</b-dropdown-item>
          <b-dropdown-item v-if="!isSelfPage" @click="showModal('report-modal')">報告</b-dropdown-item>
          <b-dropdown-item v-if="isSelfPage" @click="toEditPage">編集</b-dropdown-item>
          <b-dropdown-item v-if="isSelfPage" @click="showModal('delete-modal')">削除</b-dropdown-item>
        </b-dropdown>
        <b-button class="btn-tweet btn-tweet-sm" @click="shareApp"><i class="fa-twitter"></i>共有</b-button>
      </div>
    </div>
    <!-- <b-button class="btn-pink" @click="$emit('delete', {appID: data.uid})">削除</b-button> -->
  </div>
</template>

<script>
import firebase from '@/firebase'
import PlayRenderer from '@/components/renderer/PlayRenderer'
import Increment from '@/components/mixin/increment'
import router from '@/router'

export default {
  name: 'play-container',
  mixins: [Increment],
  components: {
    PlayRenderer,
  },
  props: {
    data: Object,
    isSelfPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isChangeScene: false,
      resultText: null,
      OGPSrc: null,
      tweetUrl: null,
      db: null,
      storage: null,
      saving: false,
      user: {},
    }
  },
  created() {
    this.db = firebase.firestore();
    this.storage = firebase.storage();
  },
  mounted() {
    this.$refs.container.initialize(this.data.gachaData);
  },
  methods: {
    async changeScene(arg) {
      this.PVIncrement();
      this.isChangeScene=true;
      this.resultText=arg.text;
      this.OGPSrc=arg.src
    },
    reload() {
      this.isChangeScene = false;
      this.$refs.container.initialize(this.data.gachaData);
    },
    saveOGP() {
      try {
      const self = this;
      const docRef = this.db.collection('tw').doc();
      const docId = docRef.id;

      this.saving = true;

      this.storage
      .ref()
      .child(`/ogp/${docId}`)
      .putString(this.OGPSrc, 'data_url')
      .then(snapshot => {
        snapshot.ref.getDownloadURL().then(url => {
          docRef
          .set({
            name: self.data.name,
            url: url,
            uid: self.data.uid,
          }).then(()=>{
            // hashTagの長さを測る
            let hashTagLen = self.data.hashTag.length;
            for (let i = 0; i < self.data.hashTag.length; ++i) {
              if (self.data.hashTag[i].match(/[\n|!-~]+/g) != null) { // 全角じゃないとき
                hashTagLen -= 0.5;
              }
            }

            const twiLen = 121 - hashTagLen;
            let newLen = twiLen;

            // 本文
            for (let i = 0; i < newLen && i < self.resultText.length; ++i) {
              if (self.resultText[i].match(/[\n|!-~]+/g) != null) { // 全角じゃないとき
                newLen += 0.5;
              }
            }
            // ...をつける
            let shareText;
            if (self.resultText.length > newLen) {
              shareText = self.resultText.slice(0, Math.floor(newLen)) + '…';
            } else {
              shareText = self.resultText;
            }
            shareText += '\n'+self.data.hashTag;
            shareText += ' #gachatuku'

            self.tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://gachatuku.com/tw/${docId}`

            self.saving = false;

            // modalをオープンclickじゃないと開けない
            self.showModal('tweet-modal');


          });
        });
      });
      } catch (e) {
        // console.log(e);
      }
    },
    shareApp() {
      let shareText = `${this.data.hashTag.length>0? this.data.hashTag: this.data.name}
#gachatuku
`;
      this.tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=https://gachatuku.com/app/${this.data.uid}`
      this.showModal('tweet-modal');
    },
    openTweetURL() {
      window.open(this.tweetUrl, '_blank');
      this.hideModal('tweet-modal');
    },
    showModal(modalName) {
      this.$refs[modalName].show();
    },
    hideModal(modalName) {
      this.$refs[modalName].hide();
    },
    async showAuthor() {
      await this.loadUser(this.data.user.uid);
      this.showModal('author-modal');
    },
    async deleteApp() {
      // ユーザー名のかぶりがあれば前からあった方のusernameの先頭に ? で消す

      const userID = this.data.user.uid;
      const app = await this.db.collection('apps').doc(this.data.uid).get();
      const {uid: appID, playCount: appPlayCount} = app.data();
      if (Object.keys(this.user).length === 0) await this.loadUser(userID);
      const {playCount: userPlayCount, appArray, appCount, } = this.user;

      const newAppArray = appArray.filter(id => id !== appID);

      try {
        await this.db.collection('apps').doc(appID).delete();
      }
      catch(e) {
        console.log(e)
      }

      await this.db.collection('users').doc(userID).set({
        playCount: userPlayCount - appPlayCount,
        appArray: newAppArray,
        appCount: appCount - 1,
      }, {merge: true});

      router.go({path: this.$router.currentRoute.path, force: true});

    },
    async loadUser(userID) {
      const userRef = await this.db.collection('users').doc(userID).get();
      this.user = userRef.data();
    },
    toEditPage() {
      router.push(`/app/${this.data.uid}/edit`);
    },
  }
}
</script>

<style scoped>
@import '../css/common.css';

.app_container {
  padding: 23px;
}
.app_header {
  flex: 0 0 auto;
  -webkit-flex: 0 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 4px;
  padding-bottom: 4px;
}
.app_content {
  padding: 16px;
  border-radius: 0.25rem;
  border: 1px solid #d9a7b3;
}
.play_count {
  padding: 4px 16px 4px 0px;
  color: #666666;
}
.app_name {
  margin-bottom: 5px;
}
.app-name a {
  font-size: 1.2em;
  color: black;
  overflow-wrap: break-word;
}
.author-displayname {
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
}
.author-displayname a {
  font-size: 1rem;
  color: #333333;
  vertical-align: center;
}
.author-username {
  margin-bottom: 0;
  line-height: 12px;
  white-space: nowrap;
  overflow: hidden;
}
.author-username a {
  font-size: 12px;
  color: #666666;
  vertical-align: center;
}
.author-container {
  padding-bottom: 17px;
  border-bottom: 1.5px solid #CCCCCC;
}
.author-container p, .count-container p {
  font-weight: 600;
  color: #666666;
}
.author {
  width: calc(100% - 70px);
  padding-left: 10px;
}
.user-icon img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
.app_content .btn-tweet {
  width: calc(50% - 3px);
  margin-left: 3px;
}
.btn-tweet .fa-twitter {
  padding-right: 4px;
  font-size: 16px;
  line-height: 22px;
  vertical-align:-1.5px;
}
.btn-tweet-sm {
  position: relative;
  height: 24px;
  padding: 1px 5px;
  margin-top: 5px;
  font-size: 13px;
  font-weight: 500;
}
.btn-tweet-sm .fa-twitter {
  padding-right: 2px;
  font-size: 12px;
  line-height: 12px;
  vertical-align:-0.6px;
}
.fa-twitter::before {
}
.btn-reload {
  width: calc(50% - 3px);
  margin-right: 3px;
}

.btn-tweet.btn-modal, .btn-cancel.btn-modal {
  width: 100%;
  margin: 0px;
}

.count_share {
  display: flex;
  justify-content: space-between;
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