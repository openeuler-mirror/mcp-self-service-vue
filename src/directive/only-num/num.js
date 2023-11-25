export default {
  bind(el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.oninput = function() {
      let val = ele.value
      val = val.replace(/[^\d]/g, '') // 清除"数字"和"."以外的字符
      ele.value = val
    }
  }
}
