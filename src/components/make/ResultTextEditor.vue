<template>
  <div class="make_result_text">
    <!--ガチャ結果テキスト-->
    <div class="sub_title">
      <div>
        結果テキスト
      </div>
    </div>
    <div>
      <!--</--ガチャ名-->
      <div class="row">
        <div class="form_title col-md-3">
          <div>
            結果テキスト<span class="asterisk">*</span>
          </div>
        </div>
        <div class="input-form col-md-9">

          <b-dropdown class="dropdown-outline-pink" id="dropdown-1" text="[BOXn]" variant="info">
            <b-dropdown-item v-for="num in makeState.gachaData.resultScreen.typeNum" :key="num" @click="insertText_BOXn(num)">[BOX{{num}}]</b-dropdown-item>
          </b-dropdown>
          <b-dropdown class="dropdown-outline-pink" id="dropdown-2" text="[CARDn]" variant="info">
            <b-dropdown-item v-for="num in makeState.gachaData.resultScreen.cardList.length" :key="num" @click="insertText_CARDn(num)">[CARD{{num}}]</b-dropdown-item>
          </b-dropdown>
          <b-dropdown class="dropdown-outline-pink" id="dropdown-3" text="[CARDn_COUNT]" variant="info">
            <b-dropdown-item v-for="num in makeState.gachaData.resultScreen.cardList.length" :key="num" @click="insertText_CARDn_COUNT(num)">[CARD{{num}}_COUNT]</b-dropdown-item>
          </b-dropdown>
          <b-dropdown class="dropdown-outline-pink" id="dropdown-4" text="関数" variant="info">
            <b-dropdown-item v-for="f in func" :key="f.id" @click="insertText_func(f.str)">{{f.str}}</b-dropdown-item>
          </b-dropdown>
          <b-dropdown class="dropdown-outline-pink" id="dropdown-5" text="比較" variant="info">
            <b-dropdown-item v-for="op in operater" :key="op.id" @click="insertText_operater(op.str)">{{op.str}}</b-dropdown-item>
          </b-dropdown>
          <b-button class="move-btn btn-outline-pink" variant="info" @click="moveCursor_left">←</b-button>
          <b-button class="move-btn btn-outline-pink" variant="info" @click="moveCursor_right">→</b-button>

          <textarea class="form-control mb-2" id="textArea" rows="6" v-model="resultText"></textarea>

          <div class="explanation">
            <b-button v-b-toggle.exp-collapse size="sm" variant="outline-secondary" class="outer-exp-toggle">変数について</b-button>
            <b-collapse id="exp-collapse" class="exp-wrapper">
              <p class="exp-title">変数について</p>
              <p class="exp-text">
                [BOX1]と入力するとBOX1に出たCARDの名前が挿入されます。<br><br>
                <!-- <p class="ex-text">example</p> -->
                [CARD1]と入力するとCARD1の名前が挿入されます。<br><br>
                <!-- <p class="ex-text">example</p> -->
                [CARD1_COUNT]と入力するとすべてのBOXに対してCARD1が出た数が挿入されます。
              </p>
                <!-- <p class="ex-text">example</p> -->
              <b-button v-b-toggle.collapse-func size="sm" class="inner-exp-toggle btn-pink col-12 col-lg-5 col-xl-4">関数について<i class="fa-chevron-down"></i></b-button>
              <b-collapse id="collapse-func">

                <b-button v-b-toggle.collapse-if size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">=IFについて<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-if" class="inner-collapse">
                  <p class="exp-text">=IF(条件式, 値１, 値２)<br>と記述し、条件式が真のとき値１、偽のとき値２が挿入されます。条件式には、=IF、=AND、=OR、=SUMも使用できます。</p>
                </b-collapse>

                <b-button v-b-toggle.collapse-sum size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">=SUMについて<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-sum" class="inner-collapse">
                  <p class="exp-text">=SUM(数値1, 数値2,・・・)<br>と記述し、すべての数値の和が挿入されます。</p>
                </b-collapse>

                <b-button v-b-toggle.collapse-and size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">=ANDについて<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-and" class="inner-collapse">
                  <p class="exp-text">=AND(条件式１, 条件式２, ・・・)<br>と記述し、すべての条件式が真のときTRUE、そうでないときFALSEが挿入されます。条件式には、=IF、=AND、=OR、=SUMも使用できます。</p>
                </b-collapse>

                <b-button v-b-toggle.collapse-or size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">=ORについて<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-or" class="inner-collapse">
                  <p class="exp-text">=OR(条件式１, 条件式２, ・・・)<br>と記述し、どれか一つの条件式が真のときTRUE、そうでないときFALSEが挿入されます。条件式には、=IF、=AND、=OR、=SUMも使用できます。</p>
                </b-collapse>

              </b-collapse>
              <b-button v-b-toggle.collapse-operator size="sm" class="inner-exp-toggle btn-pink col-12 col-lg-5 col-xl-4">条件式について<i class="fa-chevron-down"></i></b-button>
              <b-collapse id="collapse-operator">
                <div  class="inner-collapse">
                  <p class="exp-text">条件式は、関数=IF、=AND、=ORの中で使えます。</p>
                  <p class="exp-text">0, FALSEは偽、それ以外の数値、文字は真とみなされます。</p>
                </div>
                <b-button v-b-toggle.collapse-ltgt size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">&lt; &lt;= > >=について<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-ltgt" class="inner-collapse">
                  <p class="exp-text">&lt;、&lt;=、>、>=、は、数値を比較し、真のときTRUE、偽のときFALSEが挿入されます。</p>
                  <p class="eg-text">
                    例<br>
                    =IF( 1 &lt; 2 , おはよう, こんばんは)<br>
                    → =IF(TRUE, おはよう, こんばんは)<br>
                    → おはよう
                  </p>
                </b-collapse>

                <b-button v-b-toggle.collapse-eq size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">=について<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-eq" class="inner-collapse">
                  <p class="exp-text">=は、左辺と右辺の括弧内のカンマで区切られた値に対して、左辺に右辺の値が１つでも含まれるときTRUE、そうでないときFALSEが挿入されます。</p>
                  <p class="exp-text">値が1つのとき、括弧は省略できます。</p>
                  <p class="eg-text">例１<br>=IF( (1, 3, 5, 7) = (3, 4) , 鳥, カエル)<br>
                    → =IF(TRUE, 鳥, カエル)<br>
                    → 鳥<br>
                    1, 3, 5, 7に3が含まれるので条件式はTRUEになります。<br>
                    <br>
                    例２<br>
                    =IF( (1, 3, 7, 5) = (2, 4) , 鳥, カエル)<br>
                    → =IF(FALSE, 鳥, カエル)<br>
                    → カエル<br>
                    1, 3, 5, 7に2, 4は含まれないので条件式はFALSEになります。
                  </p>
                </b-collapse>

                <b-button v-b-toggle.collapse-dbeq size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">==について<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-dbeq" class="inner-collapse">
                  <p class="exp-text">==は、左辺と右辺の括弧内のカンマで区切られた値に対して、左辺が右辺の値のみによって構成されているときTRUE、そうでないときFALSEが挿入されます。</p>
                  <p class="exp-text">値が1つのとき、括弧は省略できます。</p>
                  <p class="eg-text">
                    例１<br>
                    =IF( (3, 3, 3, 3) == (3, 1) , 鳥, カエル)<br>
                    → =IF(TRUE, 鳥, カエル)<br>
                    → 鳥<br>
                    3, 3, 3, 3は3, 1によって構成されているので条件式はTRUEになります。<br>
                    <br>
                    例２<br>
                    =IF( (1, 3, 3, 2) == (3, 1) , 鳥, カエル)<br>
                    → =IF(FALSE, 鳥, カエル)<br>
                    → カエル<br>
                    1, 3, 3, 2は3, 1によって構成されていないで条件式はFALSEになります。
                  </p>
                </b-collapse>

                <b-button v-b-toggle.collapse-ampeq size="sm" class="inner-exp-toggle btn-outline-pink col-12 col-lg-5 col-xl-4">&amp;=について<i class="fa-chevron-down"></i></b-button>
                <b-collapse id="collapse-ampeq" class="inner-collapse">
                  <p class="exp-text">&amp;=は、左辺と右辺の括弧内のカンマで区切られた値に対して、左辺が右辺の値のみによって構成されており、右辺の値がすべて使われているときにTRUE、そうでなければFALSEが挿入されます。</p>
                  <p class="exp-text">値が1つのとき、括弧は省略できます。</p>
                  <p class="eg-text">
                    例１<br>
                    =IF( (3, 1, 3, 1) &amp;= (3, 1) , 鳥, カエル)<br>
                    → =IF(TRUE, 鳥, カエル)<br>
                    → 鳥<br>
                    3, 1, 3, 1は3, 1によって構成されており、3, 1がすべて使われているので条件式はTRUEになります。<br>
                    <br>
                    例２<br>
                    =IF( (3, 3, 3, 3) &amp;= (3, 1) , 鳥, カエル)<br>
                    → =IF(FALSE, 鳥, カエル)<br>
                    → カエル<br>
                    3, 3, 3, 3は3, 1によって構成されていますが3, 1のすべてが含まれないので条件式はFALSEになります。
                  </p>
                </b-collapse>

              </b-collapse>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import makeStore from './make-store'
import $ from 'jquery'

export default {
  name: 'result-text-editor',
  data() {
    return {
      resultText: makeStore.state.gachaData.resultMessage.messageSrc,
      makeState: makeStore.state,
      func: [
        {id: 1, str: '=IF(,,)'},
        {id: 2, str: '=AND(,)'},
        {id: 3, str: '=OR(,)'},
        {id: 4, str: '=SUM(,)'},
      ],

      operater: [
        {id: 1, str: '<'},
        {id: 2, str: '<='},
        {id: 3, str: '>'},
        {id: 4, str: '>='},
        {id: 5, str: '&='},
        {id: 6, str: '=='},
        {id: 7, str: '='},
      ],

    }
  },
  mounted() {
    // toggle open add class
    $('.inner-exp-toggle').on('click', function() {
        $(this).toggleClass('open');
    });
  },
  methods: {
    insertText(str) {
      var textarea = document.getElementById('textArea');

      var sentence = textarea.value;
      var len      = sentence.length;
      var pos      = textarea.selectionStart;

      var before   = sentence.substr(0, pos);
      var word     = str;
      var after    = sentence.substr(pos, len);

      var afterPos = (before + word).length;

      sentence = before + word + after;

      textarea.value = sentence;

      this.resultText = sentence;

      // 入力状態に戻す
      textarea.focus();
      textarea.setSelectionRange(afterPos, afterPos);
    },
    insertText_BOXn(num) {
      this.insertText(`[BOX${num}]`);
    },
    insertText_CARDn(num) {
      this.insertText(`[CARD${num}]`);
    },
    insertText_CARDn_COUNT(num) {
      this.insertText(`[CARD${num}_COUNT]`);
    },
    insertText_func(str) {
      this.insertText(str);
    },
    insertText_operater(str) {
      this.insertText(str);
    },


    moveCursor(val) {
      var textarea = document.getElementById('textArea');

      var sentence = textarea.value;
      var pos      = textarea.selectionStart;

      var before   = sentence.substr(0, pos);

      var afterPos = before.length + val;


      // 入力状態に戻す
      textarea.focus();
      textarea.setSelectionRange(afterPos, afterPos);
    },
    moveCursor_left() {
      this.moveCursor(-1);
    },
    moveCursor_right() {
      this.moveCursor(1);
    },
  },
  watch: {
    resultText(to, from) {
      if (from.length > 1500) {
        makeStore.set_resultMessage_messageSrc(from);
      } else {
        makeStore.set_resultMessage_messageSrc(to);
      }
    }
  }
}
</script>

<style>
@import '../../css/form-style.css';
@import '../../css/common.css';

/* デフォルトの矢印を非表示にする */
.btn.dropdown-toggle::after {
  display: none;
}
.rate-btn-wrapper .dropdown-outline-pink {
  height: 100%;
}

.make_result_text div div div div .btn.dropdown-toggle {
  margin-right: 3px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 0px;
  padding-right: 5px;
  padding-left: 5px;
}
.make_result_text div div div div .dropdown-menu.show {
  min-width:inherit;
}
.make_result_text div div div div .dropdown-menu.show li {
  min-width:inherit;
}

.make_result_text div div div .btn.move-btn {
  margin: 1px;
  padding: 0px;
  padding-right: 5px;
  padding-left: 5px;
}
</style>

<style scoped>
.make_result_text {
  border-bottom: 1px solid #B36B7D;
}
.eg-text {
}

.exp-wrapper {
  padding: 14px;
  border: 3px solid #B36B7D;
  border-radius: 3px;
  margin-bottom: 0px;
  font-size: 14px;
}
.exp-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 500;
}
.exp-wrapper > .exp-text {
  padding-bottom: 10px;
}
.outer-exp-toggle {
  margin-bottom: 4px;
  font-size: 16px;
}
.inner-exp-toggle {
  display: block;
  margin-bottom: 4px;
  height: 38px;
}
/* .inner-exp-toggle::before {
  content: "\f078";
} */
.inner-collapse {
  padding: 10px;
  padding-top: 6px;
}
.exp-text {
  margin: 0px;
}
.eg-text {
  margin: 0px;
  padding-top: 10px;
  color: #B36B7D;
  font-size: 14px;
}

/* chevron */
i.fa-chevron-down {
	position: absolute;
	top: 10px;
	right: 10px;
	left: auto;
  font-size: 18px;

  -webkit-transition: all 0.4s ease;
	-o-transition: all 0.4s ease;
	transition: all 0.4s ease;
}
.open i.fa-chevron-down {
	-webkit-transform: rotate(180deg);
	-ms-transform: rotate(180deg);
	-o-transform: rotate(180deg);
	transform: rotate(180deg);
}
</style>
