<template>
  <div>
    <div v-show="saving" class="save_loading">
      <div class="save_container">
        <p>読み込み中</p>
        <div class="spinner">
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
        </div>
      </div>
    </div>
    <b-modal ref="tweet-modal" size="sm" centered hide-header hide-footer>
      <p class="text-center">ツイート画面を開きますか</p>
      <b-button class="mt-3 btn-tweet btn-modal" block @click="openTweetURL">ツイート画面を開く</b-button>
      <b-button class="mt-2 btn-cancel btn-modal" variant="outline-danger" block @click="hideModal('tweet-modal')">やめる</b-button>
    </b-modal>
    <play-renderer ref="container" @changeScene="changeScene"></play-renderer>
    <div v-show="isChangeScene" class="text-center pb-3" style="border-bottom: 1px solid #d9a7b3;">
      <b-button class="btn-reload btn-pink" @click="reload">もう一度</b-button>
      <b-button class="btn-tweet" @click="saveOGP"><i class="fa-twitter"></i>ツイート</b-button>
    </div>
  </div>
</template>

<script>
import firebase from '@/firebase'
import PlayRenderer from '@/components/renderer/PlayRenderer'
import Increment from '@/components/mixin/increment'

export default {
  mixins: [Increment],
  props: {
    data: Object,
  },
  components: {
    PlayRenderer,
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
        console.log(e);
      }
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
  }
}
</script>

<style scoped>
@import '../css/common.css';

.btn-tweet {
  width: calc(50% - 3px);
  margin-left: 3px;
}
.fa-twitter {
  padding-right: 4px;
  font-size: 16px;
  line-height: 22px;
  vertical-align:-1.5px;
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
