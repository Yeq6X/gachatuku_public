<template>
  <div>
    <div class="top_title head-title text-center">
      <img alt="ガチャつく" :src="require('@/assets/logo_color.png')" style="width:190px"><img>
    </div>
    <make-recommend/>
    <adsense v-if="$mq==='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="xxxx" ad-format="horizontal" full-width-responsive="false" style="display:block"></adsense>
    <div class="new_arrivals mb-0">
      <div class="gacha_container_title text-center">
        <h2>
          新着
        </h2>
      </div>
      <div class="gacha_container">
        <div class="row justify">
          <div class="loading mb-4" v-if="new_arrivals.loading">
            Loading
          </div>
          <template v-else>
            <play-container v-for="data in new_arrivals.data" :data="data" :key="data.uid"/>
            <div v-if="new_arrivals.data.length%2==1" class="col-sm-9 col-md-7 col-lg-5 mb-4"></div>
          </template>
        </div>
      </div>
      <div class="justify" v-if="!new_arrivals.loading">
        <div class="col-sm-9 col-md-7 col-lg-10">
          <router-link class="see_more" to="/new_arrivals">もっと見る</router-link>
        </div>
      </div>
    </div>
    <adsense v-if="$mq==='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="xxxx" ad-format="horizontal" full-width-responsive="true" style="display:block;margin-top:30px"></adsense>
    <adsense v-if="$mq!=='sp'" ad-client="ca-pub-xxxxxxxx" ad-slot="xxxx" ad-format="horizontal" full-width-responsive="true" style="display:block;margin-top:30px"></adsense>
    <div class="ranking mb-0">
      <div class="gacha_container_title text-center">
        <h2>
          人気
        </h2>
      </div>
      <div class="gacha_container">
        <div class="row justify">
          <div class="loading mb-4" v-if="ranking.loading">
            Loading
          </div>
          <template v-else>
            <play-container v-for="data in ranking.data" :data="data" :key="data.uid"/>
            <div v-if="ranking.data.length%2==1" class="col-sm-9 col-md-7 col-lg-5 mb-4"></div>
            <div class="justify" v-if="!ranking.loading&&ranking.data.length==0" style="margin-top:40px;margin-bottom:40px">
              24時間以内にプレイされたガチャはありません。
            </div>
          </template>
        </div>
      </div>
      <div class="justify" v-if="!ranking.loading&&(ranking.data.length>0)">
        <div class="col-sm-9 col-md-7 col-lg-10">
          <router-link class="see_more" to="/ranking">もっと見る</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MakeRecommend from '@/components/MakeRecommend'
import PlayContainer from '@/components/PlayContainer'
import fetchData from '@/components/mixin/fetchData'
import GetServerTime from '@/components/mixin/getServerTime'
import SetHead from '@/components/mixin/SetHead'

import firebase from '@/firebase'

import store from '@/store'

export default {
  mixins: [fetchData, GetServerTime, SetHead],
  components: {
    MakeRecommend,
    PlayContainer,
  },
  data() {
    return {
      db: null,
      new_arrivals: {
        loading: true,
        error: null,
        data: [],
      },
      ranking: {
        loading: true,
        error: null,
        data: [],
      },
      state: store.state,
    }
  },
  async created() {
    this.db = firebase.firestore();

    // 時間取得
    const nowTime = await this.getServerTime();
    const nowHour = Number(nowTime.toString().split(' ')[4].split(':')[0]);

    await this.fetchData('new_arrivals', this.db.collection('apps').where('acceptShow', '==', 'accepted').orderBy('createDate', 'desc').limit(6));
    await this.fetchData('ranking', this.db.collection('apps').where('acceptShow', '==', 'accepted').where(`hour_${nowHour}`, '>', 0).orderBy(`hour_${nowHour}`, 'desc').orderBy('createDate', 'desc').limit(6));
  },
  mounted() {
    this.setHead('ガチャつく');
  },
  beforeDestroy() {
    this.new_arrivals.data = [];
    this.ranking.data = [];
  },
}
</script>

<style scoped>
@import '../css/common.css';

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
.btn-tweet {
  width: 291px;
  height: 38px;
  padding: 7px;
  font-weight: 500;
}
.see_more {
  padding: 0px;
}
.see_more {
  font-size: 1.2em;
}
</style>