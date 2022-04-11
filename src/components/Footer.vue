<template>
  <div class="footer">
    <div class="footer_link">
      <ul>
        <li>
          <router-link class="link" to="/">トップ</router-link>
        </li>
        <li>
          <router-link class="link" to="/new_arrivals">新着</router-link>
        </li>
        <li>
          <router-link class="link" to="/ranking">人気</router-link>
        </li>
        <li>
          <router-link class="link" to="/create">作成</router-link>
        </li>
        <li>
          <div v-if="state.userState=='logon'" key="logon">
            <a class="link" @click="doLogout">ログアウト</a>

          </div>
          <div v-else key="logoff">
            <router-link class="link" to="/login">ログイン</router-link>
          </div>
        </li>
      </ul>
    </div>
    <div class="address">
      <p>お問い合わせ <a href="https://twitter.com/gachatuku" target="_blank">@gachatuku</a></p>
    </div>
    <div class="terms">
      <p><router-link class="link" to="/terms">利用規約</router-link> / <router-link class="link" to="/privacy">プライバシーポリシー</router-link></p>
    </div>
    <div class="copyright">
      <p>Copyright © 2020 ガチャつく All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import LogInFunc from '@/components/mixin/LogInFunc'
// / 運営 <a href="https://twitter.com/Yeq6X" target="_blank">@Yeq6X</a> / 協力 <a href="https://twitter.com/toyo_3po" target="_blank">@toyo_3po</a>
export default {
  mixins: [LogInFunc],
  data() {
    return {
      state: store.state,
    }
  },
}
</script>

<style scoped>
.footer {
  background: #661529;
  padding-top: 14px;
  padding-top: 10px;
  padding-left: 15px;
  padding-right: 15px;
  height: 115px;
}
.footer_link {
  padding-bottom: 12px;
}
ul {
  display: flex;
  display: -webkit-flex;
  max-width: 400px;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  padding: 0px;
  margin: 0 auto;
  list-style: none;
}
.link {
  color: #FFFFFFCC;
}
.link:hover {
  color: #FFFFFFCC;
  cursor: pointer;
  text-decoration:underline;
}
.terms {
  color: #FFFFFFCC;
  font-size: 12px;
  text-align: center;
}
.terms p {
  margin: 0px;
  padding-bottom: 2px;
}
.address {
  color: #FFFFFFCC;
  font-size: 12px;
  text-align: center;
}
.address p {
  margin: 0px;
  padding-bottom: 2px;
}
.address a {
  color: #FFFFFFCC;
  font-size: 12px;
}
.address a:hover {
  color: #FFFFFFCC;
  cursor: pointer;
  text-decoration:underline;
}
.copyright {
  color: #FFFFFFCC;
  font-size: 12px;
  text-align: center;
}
.copyright p {
  margin: 0px;
  padding-bottom: 11px;
}
</style>