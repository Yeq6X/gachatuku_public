<template>
  <div class="color-pallet">
    <div class="color-group">
      <div v-for="cs in allColors" :key="cs.id">
        <div class="color-circle-wrapper" v-for="c in cs.colors" :key="c.id">
          <div class="color-circle" :style="{background: c.str}" @click.prevent="colorPick(c.str)">
          </div>
        </div>
      </div>
    </div>
    <div class="show-toggle-btn" v-show="showToggleBtn">
      <img :src="require('@/assets/btn_palette@2x.png')" @click.prevent="$emit('toggleBack')">
    </div>
    <input class="color-form form-control" type="text" id="hashtag" @change="emitColor" v-model="color">
  </div>
</template>

<script>
export default {
  name: 'color-pallet',
  props: {
    showToggleBtn: Boolean
  },
  data() {
    return {
      allColors: [
        {
          id: 1,
          colors: [
            {id: 1, str: '#FFFFFF'},
            {id: 2, str: '#FFA2C6'},
            {id: 3, str: '#FFB380'},
            {id: 4, str: '#FFF280'},
            {id: 5, str: '#C1FF80'},
            {id: 6, str: '#80FFE2'},
            {id: 7, str: '#80DBFF'},
            {id: 8, str: '#80C8FF'},
            {id: 9, str: '#9B80FF'},
            {id: 10, str: '#E380FF'},
          ],
        },
        {
          id: 2,
          colors: [
            {id: 1, str: '#A8A8A8'},
            {id: 2, str: '#E02030'},
            {id: 3, str: '#FF6600'},
            {id: 4, str: '#FFFF00'},
            {id: 5, str: '#6DD400'},
            {id: 6, str: '#44D7B6'},
            {id: 7, str: '#32C5FF'},
            {id: 8, str: '#0091FF'},
            {id: 9, str: '#6236FF'},
            {id: 10, str: '#B620E0'},
          ],
        },
        {
          id: 3,
          colors: [
            {id: 1, str: '#545454 '},
            {id: 2, str: '#991616 '},
            {id: 3, str: '#A64200 '},
            {id: 4, str: '#878700 '},
            {id: 5, str: '#458700 '},
            {id: 6, str: '#2C8A75 '},
            {id: 7, str: '#238AB3 '},
            {id: 8, str: '#0065B3 '},
            {id: 9, str: '#4526B3 '},
            {id: 10, str: '#781594 '},
          ],
        },
        {
          id: 4,
          colors: [
            {id: 1, str: '#000000'},
            {id: 2, str: '#4D0B0B'},
            {id: 3, str: '#4D1F00'},
            {id: 4, str: '#404000'},
            {id: 5, str: '#1E3B00'},
            {id: 6, str: '#133D34'},
            {id: 7, str: '#144F66'},
            {id: 8, str: '#003A66'},
            {id: 9, str: '#271666'},
            {id: 10, str: '#3A0A47'},
          ],
        }
      ],
      color: '',
    }
  },
  methods: {
    colorPick(str) {
      this.color = str;
      this.emitColor();
    },
    emitColor() {
      this.$emit('colorClick', this.color);
    }
  },
  watch: {
    showToggleBtn() {
      this.color = '';
    }
  }
}
</script>

<style scoped>
.color-pallet {
  background: #FCDEEA;
  border: 3px solid #B36B7D;
  border-radius: 3px;
  margin-top: 4px;
  padding-left: 10px;
  padding-right: 9px;
  padding-top: 11px;
  padding-bottom: 10px;
  white-space: nowrap;
  overflow-y: hidden;
}
.color-group {
  line-height: 0px;
}
.color-circle-wrapper {
  display: inline-block;
  margin-top: 2px;
  margin-left: 2px;
  margin-right: 3px;
  margin-bottom: 1px;
}
.color-form {
  display: inline-block;
  width: 100px;
  height: 32px;
  margin-top: 12px;
}
.color-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  /* box-shadow: 0px 1px 1px 1px rgba(0,0,0,0.5); */
  filter: drop-shadow(0px 1px 1px rgba(0,0,0,0.6));
}
.show-toggle-btn {
  display: inline-block;
  margin-top: 10px;
  margin-right: 8px;
  cursor: pointer;
}
.show-toggle-btn img {
  width: 64px;
}
</style>