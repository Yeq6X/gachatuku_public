<template>
  <div>
    <div class="privacy_title head-title text-center">
      <h2>
        プライバシーポリシー
      </h2>
    </div>
    <div class="justify">
      <div class="privacy_content title col-md-10 col-lg-9">
        <p>運営者(<a href="https://twitter.com/Yeq6X" target="_blank">@Yeq6X</a>/<a href="https://twitter.com/gachatuku" target="_blank">@gachatuku</a>)は、以下に示すプライバシーポリシー(以下、「本プライバシーポリシー」といいます。)に、本サービスにおいて扱うユーザーの個人情報の範囲、取得方法、利用目的等を定め、適切に取り扱います。</p>
        <h5>１．	情報の範囲</h5>
        <ol>
          <li>本サービスで使用するユーザーの個人情報は次の情報です。</li>
          <li>
            <ol>
              <li class="bullet_point">Twitterアカウントの名前、ユーザー名、プロフィール画像等(パスワードは含まれません)</li>
            </ol>
          </li>
          <li>また、後述する連携サービスがサービス向上のためにCookieを通じて一部の情報を収集することがあります。ただし収集される情報には、ユーザー名やメールアドレスなど個人を特定するものは一切含まれません。</li>
        </ol>
        <h5>２．	情報の取得方法</h5>
        <ol>
          <li>本サービスでは、主に次の2つの方法によってユーザーの情報を取得することがあります。</li>
            <ol>
              <li class="bullet_point">Twitter APIによる取得</li>
              <li>本サービスのユーザーの新規登録およびログイン時に、Twitter APIによって提供されるアカウント情報(名前、ユーザー名、プロフィール画像等)(パスワードは含まれません)を取得します。</li>
              <li class="bullet_point">Cookie(クッキー)</li>
              <li>本サービスでは、次に記載する提携サービスや、今後本サービスの発展を目的に提携するサービスのためにCookieを利用して情報を収集することがあります。ユーザーはブラウザの設定によりCookieを無効化できますが、本サービスの一部を利用できなくなる場合がありますので、あらかじめご了承ください。</li>
              <li>
                <ol>
                  <li class="bullet_point">Google アナリティクス(アクセス解析サービス)</li>
                </ol>
              </li>
            </ol>
        </ol>

        <h5>３．	情報の利用方法および目的</h5>
        <ol>
          <li>上記の方法により取得したTwitterアカウントの名前、ユーザー名、プロフィール画像は、本サービスのユーザーページ、投稿コンテンツに掲載されます。これらの情報は、他のユーザーの目にも触れますが、もちろん、鍵のかけられたTwitterアカウントの許可されているユーザーのみが見られる情報は含まれません。また、提携サービスがCookieにより取得した情報は、提携先において、本サービスのサービス向上やマーケティングに役立てられます。ただし、これらの情報により個人を特定されることはありません。運営者は、法律の適用を受ける場合や法的強制力のある請求以外には、いかなる個人情報も、ユーザー本人の許可無く第三者に開示いたしません。</li>
        </ol>
        <h5>４．	継続的改善</h5>
        <ol>
          <li>運営者は、個人情報の取り扱いに関する運用状況を適宜見直し、継続的な改善に努め、必要に応じて、本プライバシーポリシーを変更することがあります。</li>
        </ol>
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
    this.setHead('プライバシーポリシー｜ガチャつく');
    this.setCanonical('https://gachatuku.com/privacy');
  }
}
</script>

<style scoped>
@import '../css/form-style.css';

.privacy_content {
  padding-top: 30px;
}
.privacy_content p {
  padding-left: 4px;
  padding-right: 4px;
}
.privacy_end {
  text-align: right;
  padding-top: 20px;
}
.privacy_content h5 {
  margin-top: 15px;
  margin-bottom: 10px;
}
.privacy_content ol {
  padding-left: 1.5em;
}
.privacy_content ol > li {
  position: relative;
  list-style-type: none;
}
.bullet_point::before {
  position: absolute;
  left: -1em;
  content: "・";
}
</style>