import firebase from '@/firebase'
import GetServerTime from '@/components/mixin/getServerTime'

export default {
  mixins: [GetServerTime],
  data() {
    return {
      db: null,
      increment: firebase.firestore.FieldValue.increment(1),
    }
  },
  created() {
    this.db = firebase.firestore();
  },
  methods: {
    async PVIncrement() {
      //Mon Mar 30 2020 15:53:46 GMT+0900 (日本標準時)
      const nowTime = await this.getServerTime();
      const nowHour = Number(nowTime.toString().split(' ')[4].split(':')[0]);


      await this.db.collection('apps').doc(this.data.uid)
      .set(
        {
          playCount: this.increment,
          [`hour_${nowHour}`]: this.increment,  // 現在のやつ
          [`hour_${(nowHour+1)%24}`]: this.increment,
          [`hour_${(nowHour+2)%24}`]: this.increment,
          [`hour_${(nowHour+3)%24}`]: this.increment,
          [`hour_${(nowHour+4)%24}`]: this.increment,
          [`hour_${(nowHour+5)%24}`]: this.increment,
          [`hour_${(nowHour+6)%24}`]: this.increment,
          [`hour_${(nowHour+7)%24}`]: this.increment,
          [`hour_${(nowHour+8)%24}`]: this.increment,
          [`hour_${(nowHour+9)%24}`]: this.increment,
          [`hour_${(nowHour+10)%24}`]: this.increment,
          [`hour_${(nowHour+11)%24}`]: this.increment,
          [`hour_${(nowHour+12)%24}`]: this.increment,
          [`hour_${(nowHour+13)%24}`]: this.increment,
          [`hour_${(nowHour+14)%24}`]: this.increment,
          [`hour_${(nowHour+15)%24}`]: this.increment,
          [`hour_${(nowHour+16)%24}`]: this.increment,
          [`hour_${(nowHour+17)%24}`]: this.increment,
          [`hour_${(nowHour+18)%24}`]: this.increment,
          [`hour_${(nowHour+19)%24}`]: this.increment,
          [`hour_${(nowHour+20)%24}`]: this.increment,
          [`hour_${(nowHour+21)%24}`]: this.increment,
          [`hour_${(nowHour+22)%24}`]: this.increment,
          [`hour_${(nowHour+23)%24}`]: 0,        // 次の時間をリセット
        },
        {merge: true}
      );
      await this.db.collection('users').doc(this.data.user.uid)
      .set(
        {playCount: this.increment},
        {merge: true}
      );
    },
  }
}
