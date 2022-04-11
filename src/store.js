const store = {
  state: {
    uid: null,
    username: null,
    displayName: null,
    photoURL: null,
    userState: null,
  },
  setUid(data) {
    this.state.uid = data;
  },
  clearUid() {
    this.state.uid = null;
  },
  setUsername(data) {
    this.state.username = data;
  },
  clearUsername() {
    this.state.username = null;
  },
  setDisplayName(data) {
    this.state.displayName = data;
  },
  clearDisplayName() {
    this.state.displayName = null;
  },
  setPhotoURL(data) {
    this.state.photoURL = data;
  },
  clearPhotoURL() {
    this.state.photoURL = null;
  },
  setUserState(val) {
    this.state.userState = val;
  },
}

export default store;
