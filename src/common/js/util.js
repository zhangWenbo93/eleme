/**
 * 解析url参数
 * @export ?id=1245&a=b
 * @return Object{id:12345,a:b}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g; //[?&]匹配? [^?&]匹配非?和&以外的所有字符一个或多个  =匹配=
  let arr = url.match(reg);
  //["?id=1245","&a=b"]
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split("="); //截取返回字符串数组
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
}
