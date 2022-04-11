<template>
  <div id="app">
    <!-- <div class="page_loading" v-show="pageLoading || state.userState == null">
      <img :src="require('@/assets/loading.gif')">
    </div> -->
    <!-- <iframe class="wordCascade" src="https://river.tango-gacha.com/"></iframe> -->
    <template v-if="state.userState != null">
    <Navigation/>
    <div class="container p-mt-5 p-ms-5 p-mr-5 pb-md-0">
      <div class="main">
        <adsense v-if="$mq!=='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="3144491759" ad-format="horizontal" data-full-width-responsive="false" full-width-responsive="false" style="display:block"></adsense>
        <router-view/>
        <adsense v-if="$mq==='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="3144491759" ad-format="horizontal" full-width-responsive="true" style="display:block;margin-top:30px"></adsense>
        <adsense v-if="$mq!=='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="3144491759" ad-format="horizontal" full-width-responsive="true" style="display:block;margin-top:30px"></adsense>
      </div>
      <div class="push"></div>
    </div>
    <Footer/>
    </template>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import firebase from '@/firebase';
import store from '@/store'

export default {
  components: {
    Navigation,
    Footer,
  },
  data() {
    return {
      state: store.state,
      pageLoading: true,
    }
  },
  async created() {
    // ボタンのフォーカスを消す
    document.addEventListener('click', function() { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } });


    setTimeout(() => {
      this.pageLoading = false;
    }, 2000);


    firebase.firestore().enablePersistence({ synchronizeTabs: true })
    firebase.auth().onAuthStateChanged(user => {
      this.user = user ? user : {}
      if (user) {
        store.setUid(user.uid);
        store.setDisplayName(user.displayName);
        store.setPhotoURL(user.photoURL);
        store.setUserState('logon');
      } else {
        store.clearUid();
        store.clearUsername();
        store.clearDisplayName();
        store.clearPhotoURL();
        store.setUserState('logoff');
      }
    })
  },
  // 読み込まれないから
  watch: {}
}
</script>

<style>
/* Font */
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1p:wght@400;500;800&display=swap');
/* icomoon twitter chevron font */
@font-face {
  font-family: 'icomoon';
  src:  url('./assets/fonts/icomoon.eot?514wmj');
  src:  url('./assets/fonts/icomoon.eot?514wmj#iefix') format('embedded-opentype'),
    url('./assets/fonts/icomoon.ttf?514wmj') format('truetype'),
    url('./assets/fonts/icomoon.woff?514wmj') format('woff'),
    url('./assets/fonts/icomoon.svg?514wmj#icomoon') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="fa-"], [class*=" fa-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoon' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fa-twitter:before {
  content: "\e901";
}
.fa-chevron-down:before {
  content: "\e900";
}

html, body, #app {
  touch-action: manipulation;
  height: 100%;
  margin: 0px;
}
.page_loading img {
  pointer-events: none;
}
.container {
  background-color: #FCF7F9;
  min-height: 100%;
  margin-bottom: -82px
}
#app {
  font-family: 'M PLUS 1p', sans-serif;
  color: #333333;
  /* font-family: 'Kosugi', sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page_loading {
  background: #FDFDFD;
  width: 100%;
  height: 100%;
  z-index: 3000;
  justify-content: center;
	position: fixed;
	display: flex;
  align-items: center;
}
.page_loading img {
  width: 150px;
}

.push {
  height: 115px;
}

.wordCascade {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
