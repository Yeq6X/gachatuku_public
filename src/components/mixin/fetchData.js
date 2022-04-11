export default {
  methods: {
    async fetchData(objName, query) {
      let self = this;
      this[objName].loading = true;
      // 読み込み
      let snapShot = await query.get();

      // let tmp = [];
      snapShot.forEach(doc => {
        self[objName].data.push(doc.data());

      });

      this[objName].loading = false;
    },
  },
}