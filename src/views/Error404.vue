<template>
  <div>
    <h3 class="border-bottom pt-3 pb-3 mb-4">
      404 Not Found<br>該当するページが見つかりませんでした。
    </h3>
  </div>
</template>

<script>
import SetHead from '@/components/mixin/SetHead'

export default {
  mixins: [SetHead],
  mounted() {
    this.setHead('存在しないページ｜ガチャつく');
  }
}
</script>
