export default {
  methods: {
    setHead(title, description) {
      description = description | "オリジナルのガチャを作れるサイトです";
      document.title = title;
      document.querySelector("meta[property='og:title']")
        .setAttribute('content', title);
      document.querySelector("meta[property='og:description']")
        .setAttribute('content', description);
        document.querySelector("meta[name='twitter:title']")
          .setAttribute('content', title);
      document.querySelector("meta[name='twitter:description']")
        .setAttribute('content', description);
      document.querySelector("meta[name='description']")
        .setAttribute('content', description);
    },
    setCanonical(url) {
      document.querySelector("link[rel='canonical']")
        .setAttribute('href', url);
    }
  }
}