<template>
  <div>
    <div class="make_title head-title text-center">
      <h2>
        ガチャをつくる
      </h2>
    </div>
    <Make/>
  </div>
</template>

<script>
import Make from '@/components/make/Make'
import makeStore from '@/components/make/make-store'

import SetHead from '@/components/mixin/SetHead'

export default {
  components: {
    Make
  },
  mixins: [SetHead],
  async created() {
    // makeStore初期化
    makeStore.init_state();
  }
}
</script>
