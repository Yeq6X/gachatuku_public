<template>
  <div class="make_profile">
    <div class="sub_title">
      <div>
        基本情報
      </div>
    </div>
    <!--</--ガチャ名-->
    <div class="row">
      <div class="form_title col-md-3">
        <div>
          ガチャタイトル<span class="asterisk">*</span>
        </div>
      </div>
      <div class="input-form col-md-9">
        <div class="input-group">
          <input class="form-control" :class="{'is-valid':isTitleAvailable, 'is-invalid':!isTitleAvailable}" type="text" id="app-name" v-model="nameBuf">
        </div>
        <div v-show="isTitleAvailable" class="valid-message"><div class="space-between"><span class="title-form-msg">{{titleFormMsg}}</span><span class="count-text">{{nameBuf.length+'/30'}}</span></div></div>
        <div v-show="!isTitleAvailable" class="invalid-message"><div class="space-between"><span class="title-form-msg">{{titleFormMsg}}</span><span class="count-text">{{nameBuf.length+'/30'}}</span></div></div>
        <b-form-checkbox
          id="checkbox-hashtag"
          class="_check"
          v-model="onHashtag"
          name="checkbox-hashtag"
          :value='true'
          :unchecked-value='false'
        >
          ツイート時にガチャタイトルをハッシュタグにする(ハッシュタグにする事で多くの人にプレイされやすくなります)
        </b-form-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import firebase from '@/firebase'
import store from '@/store'
import makeStore from '@/components/make/make-store'

const MAX_TITLE_LENGTH = 30;
const MAX_AUTHORNAME_LENGTH = 15;

export default {
  name: 'app-profile',
  data() {
    return {
      state: store.state,
      makeState: makeStore.state,
      nameBuf: makeStore.state.name,
      formattedTitle: '',
      authorName: '',
      isTitleAvailable: false,
      titleFormMsg: 'タイトルを入力してください',
      onHashtag: makeStore.state.hashTag === ''? false: true,
      db: null,
    }
  },
  created() {
    this.db = firebase.firestore();
    this.judgeTitle();
  },
  mounted() {
    $('#app-name').
    focusout(() => {
      this.judgeTitle();
    })
    .keypress(e => {
      if(e.which == 13) {
        this.judgeTitle();
      }
    });
  },
  methods: {
    judgeTitle() {

      this.formattedTitle = this.nameBuf.replace(/^\s+|\s+$/g,'').replace(/ +/g,' ');

      if (this.nameBuf != '') {
        this.db.collection('apps').where('name', '==', this.formattedTitle)
        .get({source: 'server'}).then(snap => {
          if (snap.empty || snap.docs[0].data().uid == makeStore.state.uid) { // 見つからないから使われてない
            this.titleFormMsg = `タイトル「${this.formattedTitle}」は使用できます`
            this.isTitleAvailable = true;
            makeStore.set_name(this.formattedTitle);

            // Hashtag
            if (this.onHashtag) makeStore.set_hashTag('#'+this.formattedTitle);
          } else {
            this.titleFormMsg = `タイトル「${this.formattedTitle}」は既に登録されています`;
            this.isTitleAvailable = false;
            makeStore.set_name('');

            // Hashtag
            if (this.onHashtag) makeStore.set_hashTag('');
          }
        });
      } else {
        this.titleFormMsg = 'タイトルを入力してください';
        this.isTitleAvailable = false;
        makeStore.set_name('');

        // Hashtag
        if (this.onHashtag) makeStore.set_hashTag('');
      }
    }
  },
  watch: {
    nameBuf(to, from) {
      if (to.length > MAX_TITLE_LENGTH) {
        this.nameBuf = from;
      }
    },
    authorName(to, from) {
      if (to.length > MAX_AUTHORNAME_LENGTH) {
        this.authorName = from;
      }
    },
    onHashtag(val) {
      if (val) {
        makeStore.set_hashTag('#'+this.formattedTitle);
      } else {
        makeStore.set_hashTag('');
      }
    }
  }
}
</script>

<style scoped>
@import '../../css/form-style.css';

.make_profile {
  border-bottom: 1px solid #B36B7D;
}
.form-control.is-valid, .form-control.is-invalid {
  position: relative;
  background-image: none !important;
  padding-right: 10px;
}
.hash-icon.is-valid {
  color: #28a745;
  border: 1px solid #28a745;
}
.hash-icon.is-invalid {
  color: #dc3545;
  border: 1px solid #dc3545;
}
.valid-message div, .invalid-message div {
}
.space-between {
  display: flex;
  justify-content: space-between;
}
.count-text {
  font-size: 75%;
  margin-right: 2px;
}
.valid-message, .invalid-message {
  margin-bottom: 8px;
}
.valid-message {
  color: #28a745;
}
.invalid-message {
  color: #dc3545;
}
.title-form-msg {
  font-size: 75%;
  width: 90%;
  overflow-wrap: anywhere;
}
.input-form div label {
  font-size: 16px;
}

</style>
