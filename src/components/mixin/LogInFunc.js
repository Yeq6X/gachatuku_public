import firebase from '@/firebase'
import router from '../../router'

export default {
  data() {
    return {
      user: {},
    }
  },
  created() {
  },
  methods: {
    // ログイン処理
    doLogin() {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(provider);
      this.loading = true;
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut();
      router.push('/');
    },
  }
}