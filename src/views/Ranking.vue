<template>
  <div>
    <div class="make_title head-title text-center">
      <h2>
        人気
      </h2>
    </div>
    <div class="ranking pb-5">
      <div class="gacha_container">
        <div class="row justify">
          <template v-if="ranking.data">
            <play-container v-for="data in ranking.data" :data="data" :key="data.uid"/>
            <div v-if="ranking.data.length%2==1" class="col-sm-9 col-md-7 col-lg-5 mb-4"></div>
            <div class="justify" v-if="!ranking.loading&&ranking.data.length==0" style="margin-top:40px;margin-bottom:40px">
              24時間以内にプレイされたガチャはありません。
            </div>
          </template>
        </div>
        <div class="loading text-center col-12" v-if="ranking.loading">
          Loading
        </div>
        <div v-if="!isEnd && !ranking.loading" class="text-center col-12">
          <a @click="loadMore(loadNum)" style="cursor:pointer">さらに読み込む</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayContainer from '@/components/PlayContainer'
import fetchData from  '@/components/mixin/fetchData'
import GetServerTime from '@/components/mixin/getServerTime'
import SetHead from '@/components/mixin/SetHead'

import firebase from '@/firebase'

export default {
  mixins: [fetchData, GetServerTime, SetHead],
  components: {
    PlayContainer
  },
  data() {
    return {
      db: null,
      ranking: {
        loading: true,
        error: null,
        data: [],
      },
      nowHour: null,
      loadNum: 10,
      rankCursor: null,
      dateCursor: null,
      isEnd: false,
    }
  },
  async created() {
    this.db = firebase.firestore();

    // 時間取得
    const nowTime = await this.getServerTime();
    this.nowHour = Number(nowTime.toString().split(' ')[4].split(':')[0]);

    await this.firstLoad(this.loadNum);
  },
  mounted() {
    this.setHead("人気ガチャ｜ガチャつく");
    this.setCanonical('https://gachatuku.com/ranking');
  },
  methods: {
    async firstLoad(num) {
      await this.fetchData('ranking', this.db.collection('apps').where('acceptShow', '==', 'accepted').where(`hour_${this.nowHour}`, '>', 0).orderBy(`hour_${this.nowHour}`, 'desc').orderBy('createDate', 'desc').limit(num));

      if (this.ranking.data.length < num) {
        this.isEnd = true;
      } else {
        this.rankCursor = this.ranking.data[num-1][`hour_${this.nowHour}`];
        this.dateCursor = this.ranking.data[num-1].createDate;
      }
    },
    async loadMore(num) {
      const beforeScrollPos = window.pageYOffset;

      const beforeNum = this.ranking.data.length;
      await this.fetchData('ranking', this.db.collection('apps').where('acceptShow', '==', 'accepted').where(`hour_${this.nowHour}`, '>', 0).orderBy(`hour_${this.nowHour}`, 'desc').orderBy('createDate', 'desc').startAfter(this.rankCursor, this.dateCursor).limit(num));
      const loadedNum = this.ranking.data.length - beforeNum;

      scrollTo(0, beforeScrollPos);

      if (loadedNum <= num) {
        this.isEnd = true;
      } else {
        this.rankCursor = this.ranking.data[num-1][`hour_${this.nowHour}`];
        this.dateCursor = this.ranking.data[this.ranking.data.length-1].createDate;
      }
    },
  },
}
</script>

<style scoped>
@import '../css/common.css';

.title {
  border-bottom: solid 2px;
  border-bottom-color: cadetblue;
}
</style>