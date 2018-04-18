/**
 *
 * 缓存存储
 * @param {any} id
 * @param {any} key
 * @param {any} val
 */
export function saveToLocal(id, key, val) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  window.localStorage._seller_ = JSON.stringify(seller);
}
/**
 *
 *
 * @export 取缓存
 * @param {any} id
 * @param {any} key
 * @param {any} def
 * @returns  val 或者 false
 */
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;
  } else {
    let val = JSON.parse(seller)[id]; //在es6里  每个变量都要定义 否则报错
    if (!val) {
      return def;
    } else {
      let ret = val[key];
      return ret || def;
    }
  }
}
