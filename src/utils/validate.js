/**
 * 公共校验方法.
 */

const rules = {
  external: /^(https?:|mailto:|tel:)/, // 是否是外部链接
  number: /^[0-9]*$/, // 任意数字
  int: /^-?[1-9]\d*$/, // 整数
  int_p: /^[1-9]\d*$/, // 正整数
  int_n: /^-[1-9]\d*$/, // 负整数
  int_p0: /^[1-9]\d*|0$/, // 非负整数（正整数 + 0）
  int_n0: /^-[1-9]\d*|0$/, // 非正整数（负整数 + 0）
  folat: /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/, // 匹配浮点数
  folat_p: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/, // 匹配正浮点数
  folat_n: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/, // 匹配负浮点数
  folat_p0: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/, // 匹配非负浮点数（正浮点数 + 0）
  folat_n0: /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/, // 匹配非正浮点数（负浮点数 + 0）

  char_en_num: /^[a-zA-Z0-9]+$/, // 英文字母、数字的组合
  char_zh_en_num: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/, // 中文、英文字母、数字的组合
  char_num: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, // 中文、英文字母、数字和下划线的组合
  special_char: /[`~!@#$%^&*\+=<>?:"{}()|\\[\]·~@#￥%……&*（）——\+={}|《》“”【】‘’]/  //特殊字符
}


const int_p = (str) => {
  const testRule = rules['int_p']
  return testRule.test(str)
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const char_en_num = (str) => {
  const testRule = rules['char_en_num']
  return testRule.test(str)
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const char_num = (str) => {
  const testRule = rules['char_num']
  return testRule.test(str)
}
/**
   * @param {string} str
   * @returns {Boolean}
   */
const char_zh_en_num = (str) => {
  const testRule = rules['char_zh_en_num']
  return testRule.test(str)
}

/**
   * @param {string} str
   * @returns {Boolean}
   */
const special_char = (str) => {
  const testRule = rules['special_char']
  return testRule.test(str)
}

/**
 * @param {string} path
 * @returns {Boolean}
 * 是否是外部链接
 */
export function isExternal(path) {
  const testRule = rules['external']
  return testRule.test(path)
}

export default {
  // 校验英文、数字
  validateCharEnNum(rule, value, callback) {

    if (!char_en_num(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 校验中文、英文字母、数字和下划线
  validateCharNum(rule, value, callback) {
    if (String(value).length && !char_num(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  // 校验中文、英文字母、数字
  validateCharZhEnNum(rule, value, callback) {
    if (!value) {
      callback()
      return
    }
    if (!char_zh_en_num(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  //校验正整数
  validateInt(rule, value, callback) {
    if (!int_p(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
  //校验特殊字符
  special_char(rule, value, callback) {
    if (special_char(value)) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },
}
