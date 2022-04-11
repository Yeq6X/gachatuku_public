import firebase from '@/firebase'

export default {
  methods: {
    getServerTime() {
      return new Promise((resolve) => {
        // ダミーのコレクションにサーバー時刻を書き込む
        const ref = firebase
        .firestore()
        .collection('dummy_for_time_get') // 任意のダミーコレクション名
        .doc('time');
        ref.set({
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          // 書き込みが終わったらデータを取得して返す
          ref.onSnapshot(snapshot => {
            const timestamp = snapshot.data().timestamp;
            if (timestamp) {
              resolve(timestamp.toDate());
            }
          })
        });
      });
    }
  }
}