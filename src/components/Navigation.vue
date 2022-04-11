<template>
  <nav id="nav-content" class="navbar sticky-top" data-nosnippet>
    <router-link to="/" class="title"><img alt="ガチャつく" :src="require('@/assets/logo_wh.png')" style="width:140px"></router-link>
    <ul class="nav justify-content-end">
      <li class="nav-item">
        <router-link to="/new_arrivals" class="col-md-3">新着</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/ranking" class="col-md-3">人気</router-link>
      </li>
      <!-- <li class="nav-item">
        <router-link to="/search" class="col-md-3">検索</router-link>
      </li> -->
      <li class="nav-item">
        <router-link to="/create" class="col-md-3">作成</router-link>
      </li>
      <li class="nav-item">
        <div v-if="state.userState=='logon'" key="logon">
          <!-- ログインを押したらuidに従ってusernameをリクエストする ./user/** を読み込んだcreateでもuser情報をリクエストする-->
          <div class="col-md-3 user-icon"><img :src="state.photoURL" @click="pushUserPage"></div>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
import store from '@/store'
import router from '@/router'
import firebase from '@/firebase'

import $ from 'jquery'

export default {
  data() {
    return {
      state: store.state,
      db: null,
    }
  },
  created() {
    this.db = firebase.firestore();
  },
  mounted() {
    this.fitNavWidth();
    $(window).resize(() => {
      this.fitNavWidth();
    });
  },
  methods: {
    fitNavWidth() {
      const padding = ( $(window).width() - parseInt($('.container .main').css('width')) ) / 2 + 'px';
      $('#nav-content').css('padding-left', padding);
      $('#nav-content').css('padding-right', padding);
    },
    async pushUserPage() {
      // username がないとき
      if (!store.state.username) {
        let doc = await this.db.collection('users').doc(store.state.uid).get({source: 'server'});

        store.setUsername(doc.data().username);
        router.push('/user/'+ store.state.username);
      } else {
        router.push('/user/'+ store.state.username);
      }
    }
  }
}
</script>

<style scoped>
#nav-content {
  width: 100%;
}
.navbar {
  background: linear-gradient(to bottom, #FFAA00, #FF1966);
}
.title {
  padding-top: 5px;
  padding-bottom: 5px;
}
.col-md-3 {
  color: white;
}
.navbar {
  padding-top: 4px;
  padding-bottom: 4px;
}
.nav-item a {
  padding-left: 11px;
  padding-right: 11px;
  line-height: 32px;
  font-weight: 500;
}
.user-icon {
  padding-right: 0px;
}
.user-icon img{
  width: 2em;
  height: 2em;
  border-radius: 50%;
  cursor: pointer;
}
</style>