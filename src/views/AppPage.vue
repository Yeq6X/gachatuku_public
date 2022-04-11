<template>
  <div>
    <template v-if="is404">
      <Error404/>
    </template>
    <div v-else>
      <div v-if="loading" class="justify">
        loading
      </div>
      <template v-else>
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
        <div class="justify">
          <div class="app-name col-12 col-sm-9 col-md-8 col-lg-6">
            <h4>{{data.name}}</h4>
          </div>
        </div>
        <adsense v-if="$mq==='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="xxxxxxxx" ad-format="horizontal" full-width-responsive="true" style="display:block;margin-top:20px;margin-bottom:20px"></adsense>

        <div class="app_main">
          <div class="justify">
            <div v-if="data" class="col-12 col-sm-9 col-md-8 col-lg-6">
              <AppPagePlayContainer :data="data"/>
            </div>
          </div>
          <div class="justify">
            <div class="count_share col-12 col-sm-9 col-md-8 col-lg-6 pt-2">
              <div class="play_count">プレイ回数：{{data.playCount}}</div>
              <div>
                <b-dropdown variant="outline-secondary" text="その他" class="btn-tweet-sm mr-2">
                  <b-dropdown-item v-if="!isSelf" @click="showAuthor">作者を見る</b-dropdown-item>
                  <b-dropdown-item v-if="!isSelf" @click="showModal('report-modal')">報告</b-dropdown-item>
                  <b-dropdown-item v-if="isSelf" @click="toEditPage">編集</b-dropdown-item>
                  <b-dropdown-item v-if="isSelf" @click="showModal('delete-modal')">削除</b-dropdown-item>
                </b-dropdown>
                <!-- <b-button class="" variant="" @click="showModal('report-modal')">報告</b-button> -->
                <b-button class="btn-tweet btn-tweet-sm" @click="shareApp"><i class="fa-twitter"></i>共有</b-button>
              </div>
            </div>
            <div class="text-right">
            </div>
          </div>
        </div>
        <make-recommend/>
        <div class="justify">
          <div class="col-sm-9 col-md-11 col-lg-10">
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import firebase from '@/firebase'
import store from '@/store'
import AppPagePlayContainer from '@/components/AppPagePlayContainer'
import Error404 from '@/views/Error404'
import SetHead from '@/components/mixin/SetHead'
import MakeRecommend from '@/components/MakeRecommend'
import router from '@/router'

export default {
  mixins: [SetHead],
  components: {
    // PlayContainer,
    AppPagePlayContainer,
    MakeRecommend,
    Error404,
  },
  data() {
    return {
      db: null,
      data: null,
      loading: false,
      isSelf: false, // 作者自身かどうか
      is404: false,
      user: {},
    }
  },
  async created() {
    this.db = firebase.firestore();
    this.loadGachaData();
  },
  mounted() {
    this.setHead('ガチャつく');
    this.setCanonical('https://gachatuku.com/app/z5UMWsIwgoaXYxclxuyN');
  },
  methods: {
    async loadGachaData() {
      this.loading = true;

      let doc;
      try {
        doc = await this.db.collection('apps').doc(this.$route.params.id).get({source: 'cache'});
      } catch {
        doc = await this.db.collection('apps').doc(this.$route.params.id).get({source: 'server'});
      }
      if (!doc.exists) {
        this.is404 = true;
        this.loading = false;
        this.setHead("存在しないページ｜ガチャつく");
        return;
      }
      this.data = doc.data();
      // 作者かどうか
      if (this.data.user.uid === store.state.uid) this.isSelf = true;
      else this.isSelf = false;

      this.setHead(`${this.data.name}｜ガチャつく`)
      this.loading = false;
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
      const {playCount: userPlayCount, appArray, appCount, username} = this.user;

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

      router.push(`/user/${username}`);
    },
    async loadUser(userID) {
      const userRef = await this.db.collection('users').doc(userID).get();
      this.user = userRef.data();
    },
    toEditPage() {
      router.push(`/app/${this.data.uid}/edit`);
    },
  },
  watch: {
    '$route' () { // (to, from)
      this.loadGachaData();
    }
  }
}
</script>

<style scoped>
@import '../css/common.css';


.app-name {
  margin-top: 34px;
  margin-bottom: 14px;
  text-align: center;
  line-height: 1em;
  overflow-wrap: break-word;
}
.app-name h4 {
  margin: 0px;
  font-size: 26px;
  font-weight: 800;
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
.app_main {
  padding-bottom: 70px;
  border-bottom: 1pt solid #B36B7D;
}
.play_count {
  color: gray;
  /* font-size: 14px; */
}
.new_arrivals {
  padding-bottom: 30px;
  border-bottom: 1pt solid #B36B7D;
}
.gacha_container_title {
  padding-top: 20px;
  margin-bottom: -3px;
}
.gacha_container_title h2 {
  line-height: 31px;
  font-size: 22px;
  font-weight: 800;
  margin: 0px;
}
.gacha_container {
  margin-bottom: -34px;
}
.see_more {
  padding: 0 12px 0 12px;
}
.see_more a {
  font-size: 1.4em;
}


button.btn-tweet-sm {
  position: relative;
  height: 24px;
  padding: 1px 5px;
  font-size: 13px;
  font-weight: 500;
}
.btn-tweet-sm .fa-twitter {
  padding-right: 2px;
  font-size: 12px;
  line-height: 12px;
  vertical-align:-0.6px;
}
.btn-tweet.btn-modal, .btn-cancel.btn-modal {
  width: 100%;
  margin: 0px;
}

.count_share {
  display: flex;
  justify-content: space-between;
}

</style>

<style>

.btn-tweet-sm > .btn {
  position: relative;
  height: 24px;
  padding: 1px 5px !important;
  font-size: 13px;
  font-weight: 500;
}
.btn-tweet-sm .dropdown-menu.show {
  min-width: inherit;
}
.btn-tweet-sm .dropdown-menu.show li {
  min-width:inherit;
}
.btn-tweet-sm .dropdown-menu.show a {
  padding: 2px 10px;
}
</style>
