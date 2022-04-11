<template>
  <div>
    <div class="terms_title head-title text-center">
      <h2>
        利用規約
      </h2>
    </div>
    <div class="justify">
      <div class="terms_content title col-md-10 col-lg-9">
        <p>この規約 (以下、「本規約」といいます。)は、運営者(<a href="https://twitter.com/Yeq6X" target="_blank">@Yeq6X</a>/<a href="https://twitter.com/gachatuku" target="_blank">@gachatuku</a>)が本サービスの利用条件を定めるものです。</p>
        <h5>１．	本規約について</h5>
        <ol>
          <li class="bullet_point">ユーザーは、本規約に従ってご利用いただきます。</li>
          <li class="bullet_point">本規約は、ユーザーと運営者との間に適用されます。</li>
          <li class="bullet_point">運営者は、予告なく本規約を変更できるものとします。</li>
        </ol>
        <h5>２．	禁止事項</h5>
        <ol>
          <li>運営者は、以下の内容を投稿することを禁じます。</li>
          <li>
            <ol>
              <li class="bullet_point">過度に性的、暴力的、または残虐な内容</li>
              <li class="bullet_point">差別的、または攻撃的な内容</li>
              <li class="bullet_point">自殺、犯罪、またはそれらを助長する内容</li>
              <li class="bullet_point">スパム、またはスパムサイトへ誘導する内容</li>
              <li class="bullet_point">他者の権利を侵害する内容</li>
              <li class="bullet_point">公序良俗に反する内容</li>
              <li class="bullet_point">特定の人に対し不快感を与える内容</li>
              <li class="bullet_point">他者のコンテンツをコピーした内容</li>
            </ol>
          </li>
        </ol>
        <h5>３．	禁止行為に対する処置</h5>
        <ol>
          <li>ユーザーの投稿コンテンツが、本規約の禁止事項に違反した場合、または、禁止事項に違反していなくても運営者が不適切と判断した場合、運営者は予告なしに、投稿コンテンツやユーザーの削除または利用停止処置を行えるものとします。</li>
        </ol>
        <h5>４．	利用料金</h5>
        <ol>
          <li>本サービスは全て無料で利用できます。ただし、本サービスを利用するための通信機器、通信にかかる費用は利用者の負担とします。</li>
        </ol>
        <h5>５．	損害賠償</h5>
        <ol>
          <li>ユーザーが本規約に違反することにより運営者に損害が発生した場合、運営者はユーザーに対し、この損害の賠償を請求することができ、利用者は、当該請求に直ちに応じなければならないものとします。</li>
        </ol>
        <h5>６．	免責事項</h5>
        <ol>
          <li class="bullet_point">運営者は、本サービスによりユーザーまたは他者が被った損害に対し、運営者に故意又は重過失が存する場合を除き一切の責任を負いません。</li>
          <li class="bullet_point">運営者は本サービス上の投稿コンテンツを監視する義務を負いません。</li>
          <li class="bullet_point">本サービスの利用者による投稿コンテンツによって他のユーザー、他者に損害が発生した場合、損害に対する責任は投稿を行った当該ユーザーにあり、運営者は自らに故意又は重過失が存する場合を除き一切の責任を負いません。</li>
          <li class="bullet_point">ユーザー同士、またはユーザーと他者との間に紛争が発生した場合、当該関係者同士で解決するものとし、運営者は二者を仲介しません。</li>
          <li class="bullet_point">運営者は、予告なしに本サービスの運営を停止または中止し、また本サイトに掲載されている情報の全部または一部を削除・変更できるものとします。</li>
        </ol>
        <p class="terms_end">以上</p>
        <p>2020年4月17日 制定</p>
      </div>
    </div>
    <div style="height: 200px;"></div>
  </div>
</template>

<script>
import SetHead from '@/components/mixin/SetHead'

export default {
  mixins: [SetHead],
  mounted() {
    this.setHead('利用規約｜ガチャつく');
    this.setCanonical('https://gachatuku.com/terms');
  }
}
</script>

<style scoped>
@import '../css/form-style.css';

.terms_content {
  padding-top: 30px;
}
.terms_content p {
  padding-left: 4px;
  padding-right: 4px;
}
.terms_end {
  text-align: right;
  padding-top: 20px;
}
.terms_content h5 {
  margin-top: 15px;
  margin-bottom: 10px;
}
.terms_content ol {
  padding-left: 1.5em;
}
.terms_content ol > li {
  position: relative;
  list-style-type: none;
}
.bullet_point::before {
  position: absolute;
  left: -1em;
  content: "・";
}
</style>