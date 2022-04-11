<template>
  <div>
    <div v-if="isLoading" class="justify">
      loading
    </div>
    <div v-else>
      <template v-if="!isSelf">
        <Error404/>
      </template>
      <template v-else>
        <div class="make_title head-title text-center">
          <h2>
            ガチャを編集
          </h2>
        </div>
        <Make v-if="!isLoading"/>
      </template>
    </div>
  </div>
</template>

<script>
import firebase from '@/firebase'
import store from '@/store'
import Make from '@/components/make/Make'
import Error404 from '@/views/Error404'
import makeStore from '@/components/make/make-store'

import SetHead from '@/components/mixin/SetHead'

export default {
  components: {
    Make,
    Error404,
  },
  mixins: [SetHead],
  data() {
    return {
      db: null,
      data: null,
      isSelf: false, // 作者自身かどうか
      isLoading: true,
    }
  },
  async created() {
    this.db = firebase.firestore();
    await this.loadGachaData();
    makeStore.set_state(Object.assign({}, this.data));
    this.isLoading = false;
  },
  methods: {
    async loadGachaData() {
      let doc;
      try {
        doc = await this.db.collection('apps').doc(this.$route.params.id).get({source: 'cache'});
      } catch {
        doc = await this.db.collection('apps').doc(this.$route.params.id).get({source: 'server'});
      }
      this.data = doc.data();
      // 作者かどうか
      if (this.data.user.uid === store.state.uid) {
        this.isSelf = true;
        this.setHead("編集｜ガチャつく");
      } else {
        this.isSelf = false;
        this.setHead("存在しないページ｜ガチャつく");
      }
    },
  },
}
</script>
