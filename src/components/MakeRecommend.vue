<template>
  <div class="make_recommend head-title">
    <div class="justify">
      <div class="title col-sm-9 col-md-11 col-lg-10">
        <h4>このサイトについて</h4>
        <p>
          ガチャつくは、オリジナルのガチャをつくれるサイトです。<br>
          テンプレートや自作の画像を組み合わせて、簡単にガチャをつくれるよ！早速つくってみよう！<br>
        </p>
      </div>
    </div>
    <div class="justify">
      <b-button class="btn-pink" @click="makeLink">ガチャをつくる</b-button>
    </div>
  </div>
</template>

<script>
import router from '@/router'

export default {
  methods: {
    makeLink() {
      router.push('/make');
    }
  }
}
</script>

<style scoped>
@import '../css/common.css';

.make_recommend {
  padding-left: 5px;
  padding-right: 5px;
}
.make_recommend > div > .title {
  padding: 0px;
}
.make_recommend > div > .title > h4 {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 800;
}
.make_recommend > div > .title > p {
  font-size: 14px;
}
.btn-pink {
  width: 180px;
}
</style>