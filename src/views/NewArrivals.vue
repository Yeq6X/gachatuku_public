<template>
  <div>
    <div class="make_title head-title text-center">
      <h2>
        新着
      </h2>
    </div>
    <div class="new_arrivals pb-5">
      <div class="gacha_container">
        <div class="row justify">
          <template v-if="new_arrivals.data">
            <play-container v-for="data in new_arrivals.data" :data="data" :key="data.uid"/>
            <div v-if="new_arrivals.data.length%2==1" class="col-sm-9 col-md-7 col-lg-5 mb-4"></div>
          </template>
        </div>
        <div class="loading text-center col-12" v-if="new_arrivals.loading">
          Loading
        </div>
        <div v-if="!isEnd && !new_arrivals.loading" class="text-center col-12">
          <a @click="loadMore(loadNum)" style="cursor:pointer">さらに読み込む</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayContainer from '@/components/PlayContainer'
import fetchData from  '@/components/mixin/fetchData'
import SetHead from '@/components/mixin/SetHead'

import firebase from '@/firebase'

export default {
  mixins: [fetchData, SetHead],
  components: {
    PlayContainer
  },
  data() {
    return {
      db: null,
      new_arrivals: {
        loading: false,
        error: null,
        data: [],
      },
      loadNum: 10,
      dateCursor: null,
      isEnd: false,
    }
  },
  async created() {
    this.db = firebase.firestore();
    await this.firstLoad(this.loadNum);
  },
  mounted() {
    this.setHead("新着ガチャ｜ガチャつく");
    this.setCanonical('https://gachatuku.com/new_arrivals');
  },
  methods: {
    async firstLoad(num) {
      await this.fetchData('new_arrivals', this.db.collection('apps').where('acceptShow', '==', 'accepted').orderBy('createDate', 'desc').limit(num));

      if (this.new_arrivals.data.length < num) {
        this.isEnd = true;
      } else {
        this.dateCursor = this.new_arrivals.data[num-1].createDate;
      }
    },
    async loadMore(num) {
      const beforeScrollPos = window.pageYOffset;

      const beforeNum = this.new_arrivals.data.length;
      await this.fetchData('new_arrivals', this.db.collection('apps').where('acceptShow', '==', 'accepted').orderBy('createDate', 'desc').startAfter(this.dateCursor).limit(num));
      const loadedNum = this.new_arrivals.data.length - beforeNum;

      scrollTo(0, beforeScrollPos);

      if (loadedNum <= num) {
        this.isEnd = true;
      } else {
        this.dateCursor = this.new_arrivals.data[this.new_arrivals.data.length-1].createDate;
      }
    },
  },
}
</script>

<style scoped>
@import '../css/common.css';
</style>