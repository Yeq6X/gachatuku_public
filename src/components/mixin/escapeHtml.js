export default {
  methods: {
    escapeHtml(str) {
      if (!str) return;
      return str.replace(/[<>&"'`]/g, (match) => {
        const escape = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          "'": '&#39;',
          '`': '&#x60;'
        };
        return escape[match];
      });
    },
  }
}