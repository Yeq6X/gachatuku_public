function flexTextarea(el) {
  const dummy = el.querySelector('.FlexTextarea__dummy')
  el.querySelector('.FlexTextarea__textarea').addEventListener('input', e => {
    dummy.textContent = e.target.value + '\u200b'
  })
}
export default {
  mounted() {
    document.querySelectorAll('.FlexTextarea').forEach(flexTextarea);
  }
}