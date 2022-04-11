<template>
  <div>
    <button @click="save">ok</button>
    {{url}}
  </div>
</template>

<script>
import firebase from '../firebase'

export default {
  data() {
    return {
      db: null,
      path: '@/assets/favicon.png',
      url: '',
    }
  },
  methods: {
    save() {
      firebase.storage()
        .ref()
        .child('meta/favicon.png')
        // .putString(data, 'data_url').then(snapshot => {
        .put(require(this.path)).then(snapshot => {
          snapshot.ref.getDownloadURL().then(url => {
            this.url = url;
          });
        })
    }
  }
}
</script>