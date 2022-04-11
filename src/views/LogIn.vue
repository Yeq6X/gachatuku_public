<template>
  <div>
    <template v-if="!state.userState">
      <h4 class="border-bottom pt-3 pb-3 mb-4">
        読み込み中
      </h4>
    </template>
    <template v-else>
      <div class="login_title head-title text-center">
        <h2>
          ログイン
        </h2>
      </div>
      <div class="justify">
        <div class="col-sm-9 col-md-11 col-lg-10 p-0">
          <div class="login_content">
            <h4>ログインするとできること</h4>
            <p>
              Twitter認証をしてログインすると、オリジナルガチャを作って投稿できるようになります。<br>
              ガチャを公開する際に、トップページや新着・人気ページに表示されないように設定することも可能です。
            </p>
            <h4>安心してご利用ください</h4>
            <p>
              このサイトへのTwitter認証は、読み取り専用です。勝手にTwitterでツイート・RT・フォローなどをすることはありませんのでご安心ください。<br>
            </p>
          </div>
          <div class="text-center">
            <!-- 未ログイン時にはログインボタンを表示 -->
            <b-button class="btn-tweet" @click="doLogin">Twitterでログインする</b-button>
          </div>
          <div class="text-center">
            <b-button class="btn-terms" variant="outline-secondary" @click="pushTerms">利用規約</b-button>
          </div>
          <div class="text-center">
            <b-button class="btn-terms" variant="outline-secondary" @click="pushPrivacy">プライバシーポリシー</b-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import firebase from '@/firebase'
import LogInFunc from '@/components/mixin/LogInFunc'
import router from '@/router'
import store from '@/store'
import SetHead from '@/components/mixin/SetHead'

export default {
  mixins: [LogInFunc, SetHead],
  data() {
    return {
      db: null,
      state: store.state,
    }
  },
  async created() {
    const self = this;
    this.db = firebase.firestore();

    // 認証から帰ってきたとき
    await firebase.auth().getRedirectResult().then( async credential => { // ログイン後じゃなければnullが帰る
      if (credential.user) {

        // 格納する変数
        let uid = null;
        let username = null;
        let displayName = null;
        let photoURL = null;


        if (credential.user) {
          uid = credential.user.uid;
          username = credential.additionalUserInfo.profile.screen_name;
          displayName = credential.additionalUserInfo.profile.name;
          photoURL = credential.additionalUserInfo.profile.profile_image_url_https.replace('_normal', ''); // 画質変更

          const snapshot = await self.db.collection('users_base').where('username', '==', credential.additionalUserInfo.username).get({source: 'server'});
          if (!snapshot.empty) {

            // snapshot.size が２はありえない 先客は１人
            snapshot.forEach( doc => {

              // 今回のと違うuidで同じユーザー名のかぶり ****** このときユーザー名変更
              if (doc.data().uid != credential.user.uid) {

                // ユーザー名のかぶりがあれば前からあった方のusernameの先頭に ? で消す
                var addPrefix = firebase.functions().httpsCallable('addPrefix');
                addPrefix({userID: doc.id});
                // ここもデータ変更 そうしないとゲームからリンクに飛んだ時にバッティングする

              } else { // 前のログインの時の自分
                // if (photoURLとかdisplayNameが同じか)で更新

              }
            });
          } else {
            // 新規ユーザーじゃないとき---使われてないユーザー名に変えたとき
            if (!credential.additionalUserInfo.isNewUser) {
              // ガチャのユーザーデータ変更
            }
            // else 新規ユーザーのときは何も変える必要もなくデータ作成
            // console.log(uid, username, displayName, photoURL);
          }

          // store.js に保存
          store.setUid(uid);// App.vueと被ってるけど一応
          store.setUsername(username);
          store.setDisplayName(displayName);
          store.setPhotoURL(photoURL);

          // ユーザーを上書き
          self.db.collection('users_base').doc(credential.user.uid)
          .set(
            {
              uid,
              username,
              displayName,
              photoURL,
            },
            {merge: true}
          );

          // ユーザー情報を最新に更新
          const user = firebase.auth().currentUser;
          user.updateProfile({
            displayName,
            photoURL,
          }).then(function() {
            // Update successful.
          }).catch(function() {
            // console.log(error);
            // An error happened.
          });

          // ページ遷移
          self.loading = false;
          // redirect がない時は直接/loginに行った時だからTopに戻る
          if (!self.$route.query.redirect) {
            router.replace('/');
          } else {
            router.replace(self.$route.query.redirect);
          }
        }
      } else {
      // このページに迷い込んだときにすでにlogonであれば遷移する
      if (store.state.userState === 'logon') {
        self.loading = false;
        if (!self.$route.query.redirect) {
          router.replace('/');
        }
        router.replace(self.$route.query.redirect);
      }
      }
    }).catch(() => {
      // console.log(err);
    });

  },
  mounted() {
    this.setHead('ログイン｜ガチャつく');
    this.setCanonical('https://gachatuku.com/login');
  },
  methods: {
    pushTerms() {
      router.push('/terms');
    },
    pushPrivacy() {
      router.push('/privacy');
    },
  },
  watch: {
  },
}
</script>

<style scoped>
@import '../css/common.css';


.btn-tweet {
  width: 291px;
  height: 38px;
  padding: 7px;
  margin-bottom: 30px;
  font-weight: 500;
}
.login_content {
  padding-left: 5px;
  padding-right: 5px;
  margin-top: 30px;
}
.login_content h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 800;
}
.login_content p {
  margin-bottom: 20px;
  font-size: 14px;
}

.btn-terms {
  width: 230px;
  height: 30px;
  margin-bottom: 10px;
  padding: 2px;
}
</style>