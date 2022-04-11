<template>
  <div>
    <template v-if="is404">
      <Error404/>
    </template>
    <template v-else>
      <div class="user_title head-title text-center">
        <h2 v-if="isSelf" >
          マイページ
        </h2>
        <h2 v-else>
          ユーザーページ
        </h2>
      </div>
      <div class="text-center pt-3 pb-3 mb-4" style="border-bottom: 1px solid #d9a7b3;">
        <div>
          <div class="user-icon"><img class="m-2" :src="user.photoURL"></div>
          <div class="justify">
            <p class="display_name col-12 col-sm-9 col-md-8 col-lg-6 m-2">{{user.displayName}}</p>
          </div>
          <div class="justify mb-4">
            <p class="username col-12 col-sm-9 col-md-8 col-lg-6">@{{user.username}}</p>
          </div>
          <div class="row justify">
            <div class="col-6 col-sm-4 col-md-3 col-xl-2">
              <p>
                投稿数<br>
                {{user.appCount || '0'}}
              </p>
            </div>
            <div class="col-6 col-sm-4 col-md-3 col-xl-2">
              <p>
                プレイされた回数<br>
                {{user.playCount || '0'}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="justify">
        <div class="denyShow-check" v-if="isSelf">
          <b-form-checkbox
            id="denyShow-check"
            class="_check"
            v-model="denyShow"
            name="denyShow-check"
            :value="true"
            :unchecked-value="false"
            @click.native="showModal('denyShow-modal')"
          >
            ガチャを他のユーザーから非表示にする
          </b-form-checkbox>
        </div>
      </div>
      <b-modal ref="denyShow-modal" size="sm" centered hide-header @ok="denyShow_modal_ok" @cancel="denyShow_modal_deny">
        <p v-if="denyShow === true">他のユーザーがあなたの投稿されたガチャの一覧を見れなくなります。</p>
        <p v-if="denyShow === false">他のユーザーがあなたの投稿されたガチャの一覧を見れるようになります。</p>
      </b-modal>
      <div v-if="denyShow === true && isSelf === false" class="text-center pt-3 pb-3 mb-4">
        投稿されたガチャは非表示に設定されています
      </div>
      <div v-else-if="apps.length == 0" class="text-center pt-3 pb-3 mb-4">
        投稿されたガチャはありません
      </div>
      <div v-else class="gacha_container mb-3">
        <div class="row justify">
          <play-container v-for="data in apps" :key="data.uid" :data="data" :isSelfPage="isSelf"/>
          <div v-if="apps.length%2==1" class="col-sm-9 col-md-7 col-lg-5 mb-4"></div>
        </div>
        <div v-if="!isEnd" class="text-center col-12">
          <a @click="loadApp(loadNum)" style="cursor:pointer">さらに読み込む</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import firebase from '@/firebase'
import store from '@/store'
import LogInFunc from '@/components/mixin/LogInFunc'
import Error404 from '@/views/Error404'
import PlayContainer from '@/components/PlayContainer'
import SetHead from '@/components/mixin/SetHead'

export default {
  mixins: [LogInFunc, SetHead],
  components: {
    PlayContainer,
    Error404,
  },
  data() {
    return {
      db: null,
      state: store.state,
      user: {}, //
      apps: [], // 参照先のデータを入れる配列
      isSelf: false,
      is404: false,
      docCursor: 0,
      isEnd: false,
      loadNum: 10,
      denyShow: false, // ガチャを非表示にするか
    }
  },
  created() {
    this.db = firebase.firestore();
    this.loadUser();
  },
  mounted() {
    this.setHead("ユーザーページ｜ガチャつく");
    this.setCanonical('https://gachatuku.com/user/gachatuku');
  },
  methods: {
    async loadUser() {
      const self = this;
      this.user = {};
      this.apps = [];
      this.isSelf = false;
      this.is404 = false;
      this.docCursor = 0;
      this.isEnd = false;

      // cacheからだと中身は更新されないから断念
      let snapshot = await this.db.collection('users').where('username', '==', this.$route.params.id).get({source: 'server'});

      if (!snapshot.empty) {
        snapshot.forEach( doc => { // user取得
          self.user = doc.data(); // user代入

          // uidが同じかどうか
          if (doc.data().uid === store.state.uid) {
            self.isSelf = true;
            self.setHead("マイページ｜ガチャつく");
          } else {
            self.setHead(`${self.user.displayName}さんのユーザーページ｜ガチャつく`);
          }
        });

        // denyShowが存在しなかったらthis.user.denyShow = false
        if (this.user.denyShow === undefined) this.user.denyShow = false;
        // this.denyShowにセット
        this.denyShow = this.user.denyShow;



      } else { // からの時は 404 に飛ばす
        this.is404 = true;
        this.setHead("存在しないページ｜ガチャつく");
        return;
      }
      await this.loadApp(this.loadNum);
    },
    async loadApp(num) {

      if (this.user.appArray && (this.user.denyShow === false || this.isSelf === true)) { // 配列があるとき
        const maxIndex = this.user.appArray.length - 1;


        for (let i = 0; i < num; ++i) {
          let data;
          try {
            data = await this.db.collection('apps').doc(this.user.appArray[maxIndex - this.docCursor]).get({source: 'cache'});
          } catch {
            data = await this.db.collection('apps').doc(this.user.appArray[maxIndex - this.docCursor]).get({source: 'server'});
          }
          this.apps.push(data.data());

          if (this.docCursor == maxIndex) {
            this.isEnd = true;
            break;
          }

          this.docCursor++;
        }
      }
    },
    showModal(modalName) {
      this.$refs[modalName].show();
    },
    hideModal(modalName) {
      this.$refs[modalName].hide();
    },
    async denyShow_modal_ok() {

      await this.db.collection('users').doc(store.state.uid) // ログイン時のみの動作だよ
          .set(
            {
              denyShow: this.denyShow
            },
            {merge: true}
          );

      this.hideModal('denyShow-modal')
    },
    denyShow_modal_deny() {
      this.denyShow = !this.denyShow;
      this.hideModal('denyShow-modal')
    },
  },
  watch: {
    '$route' (to) { // (to, from)
      this.loadUser(to.params.id);
    },
  }
}
</script>

<style scoped>
@import '../css/common.css';


.logout-btn {
  display: flex;
  justify-content: space-between;
}
.user-icon img {
  width: 6em;
  height: 6em;
  border-radius: 50%;
  cursor: pointer;
}
.display_name {
  font-size: 20px;
  font-weight: 500;
}
.denyShow-check {
  padding: 0px 8px;
}
</style>
