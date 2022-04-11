<template>
<!--
  使い方
  <cropper-modal :imgSrc="ソース" @crop="変数=$event"></cropper-modal>
-->
  <div>
    <input type="file" id="imgInputElm" name="image" accept="image/*" style="display:none;" @change="setCropper">

    <b-modal id="cropper-modal" @shown="shownModal" hide-footer>
      <template v-slot:modal-title>
        画像をトリミング
      </template>
      <div class="d-block text-center">
        <div id="cropper-container" class="border border-primary" style="overflow:hidden;">
          <vue-cropper v-if="showCropper"
            :ready="cropperReady"
            ref="cropper"
            :responsive="true"
            :guides="true"
            :view-mode="0"
            drag-mode="move"
            :auto-crop-area="1"
            :restore="false"
            :modal="false"
            :background="false"
            :cropBoxMovable="false"
            :cropBoxResizable="false"
            :highlight="false"
            :src="imgSrc"
            :aspect-ratio="1 / 1"
            :toggleDragModeOnDblclick="false"
            :minContainerWidth="contWidth"
            :minContainerHeight="contWidth"
          ></vue-cropper>
        </div>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('cropper-modal'); closeCropper();">OK</b-button>
    </b-modal>
    <!-- リサイズ用のCanvas -->
    <canvas id="resize-canvas" style="display:none"></canvas>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import "../../../node_modules/cropperjs/dist/cropper.css";
import $ from 'jquery'


export default {
  name: 'cropper-modal',
  components: {
    VueCropper
  },
  data() {
    return {
      imgSrc: '',
      cropImg: '',
      contWidth: 0,
      showCropper: false,

      canvas: null,
      context: null,
    }
  },
  mounted() {
    this.canvas = document.getElementById('resize-canvas');
    this.context = this.canvas.getContext('2d');
  },
  methods: {
    shownModal() {
      this.contWidth = parseInt($('#cropper-container').css('width'));
      this.showCropper = true;
      $('#cropper-container').css('height', $('#cropper-container').css('width'));
    },
    cropperReady() {
      const imgWidth = this.$refs.cropper.getImageData().naturalWidth;
      const imgHeight = this.$refs.cropper.getImageData().naturalHeight;
      var zoomVal = 1.0;

      if ( imgWidth <= imgHeight) {
        zoomVal = this.contWidth / imgWidth;
      } else {
        zoomVal = this.contWidth / imgHeight;
      }
      this.$refs.cropper.zoomTo(zoomVal);

      this.$refs.cropper.setCropBoxData({left:0, top:0, width:this.contWidth, height:this.contWidth});
    },
    setCropper(e) {
      const file = e.target.files[0];
      if (!file.type.includes('image/')) {
        alert('画像ファイルを選択してください。')
        return;
      }
      const reader = new FileReader();
      reader.onload = event => {
        this.imgSrc = event.target.result;
        this.$bvModal.show('cropper-modal');
      };
      // ここで初めて読み込み、onloadが実行
      reader.readAsDataURL(file);
    },
    closeCropper() {
      this.cropImage();
    },
    async cropImage() {
      let self = this;
      let whitedScr = await this.backToWhite(this.$refs.cropper.getCroppedCanvas().toDataURL());
      self.cropImg = whitedScr;
      self.$emit('crop', self.cropImg);
    },
    //
    //  dataURLを受け取りリサイズしてdataURLを返す
    //
    backToWhite(src) {
      return new Promise((resolve) => {
        let self = this;
        let img = new Image();
        let retBinary = null;
        let w, h;

        img.onload = function() {
          retBinary = src;
          w = img.width; h = img.height;
          self.canvas.width = w;
          self.canvas.height = h;
          self.context.fillStyle = '#FFFFFF';
          self.context.fillRect(0, 0, w, h);
          self.context.drawImage(img, 0, 0, w, h);
          retBinary = self.canvas.toDataURL('image/jpeg');

          // blobにするのはアップロードするとき
          resolve(retBinary);
        }
        img.src = src;
      });
    },

// 引数のBase64の文字列をBlob形式にする
    base64ToBlob(base64) {
      let base64Data = base64.split(',')[1], // Data URLからBase64のデータ部分のみを取得
            data = window.atob(base64Data), // base64形式の文字列をデコード
            buff = new ArrayBuffer(data.length),
            arr = new Uint8Array(buff),
            blob,
            i,
            dataLen;
      // blobの生成
      for (i = 0, dataLen = data.length; i < dataLen; i++) {
          arr[i] = data.charCodeAt(i);
      }
      blob = new Blob([arr], {type: 'image/jpeg'});
      return blob;
    }
  }
}
/** 午前中にやること
 * 作成中のLoading
 * 規約
 */
</script>