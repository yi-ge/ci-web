/**
 * 将json按一定规律组合成父子模式
 * @param  {[type]} data                        json数据
 * @param  {Number} [maxPid=0]                  最大的儿子ID（可能不是0，最大的是几就填几，就从几开始排）
 * @param  {String} [IDString='ID']             ID的别名
 * @param  {String} [pidString='pid']           父ID的别名
 * @param  {String} [childrenString='children'] 生成的子的别名（子的数据就在这个名称下）
 * @return {[type]}                             父子JSON
 */
export const toTreeData = (data, minPid = 0, IDString = 'ID', pidString = 'pid', childrenString = 'children') => {
  let pos = {}
  let tree = []
  let n = 0

  while (data.length !== 0) {
    if (data[n][pidString] === minPid) {
      // delete data[n][pidString]
      data[n].children = []
      tree.push(data[n])
      pos[data[n][IDString]] = [tree.length - 1]
      data.splice(n, 1)
      n--
    } else {
      let posArray = pos[data[n][pidString]]
      if (posArray !== undefined) {
        let obj = tree[posArray[0]]
        for (let j = 1; j < posArray.length; j++) {
          obj = obj.children[posArray[j]]
        }
        // delete data[n][pidString]
        data[n].children = []
        obj.children.push(data[n])
        pos[data[n][IDString]] = posArray.concat([obj.children.length - 1])
        data.splice(n, 1)
        n--
      }
    }
    n++
    if (n > data.length - 1) {
      n = 0
    }
  }
  return tree
}

/**
 * 对象比较器
 * 使用方法：data.sort(compare("对象名称")) 在对象内部排序，不生成副本
 * @param  {[type]} propertyName 要排序的对象的子名称（限一级）
 * @return {[type]}              排序规则
 */
export let compare = (propertyName) => {
  return function (object1, object2) {
    var value1 = object1[propertyName]
    var value2 = object2[propertyName]
    if (value2 < value1) {
      return -1
    } else if (value2 > value1) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * 深拷贝对象、数组
 * @param  {[type]} source 原始对象或数组
 * @return {[type]}        深拷贝后的对象或数组
 */
export let deepCopy = function (o) {
  if (Array.isArray(o)) {
    var n = []
    for (var i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i])
    }
    return n
  } else if (typeof o === 'object') {
    var z = {}
    for (var m in o) {
      z[m] = deepCopy(o[m])
    }
    return z
  } else {
    return o
  }
}

/**
 * 根据含义字符串换算对应的毫秒数
 * @param  {[type]} str 字符串
 * @return {[type]}     ms
 */
let getsec = function (str) {
  if (/[s|h|d|l]/i.test(str)) {
    var str1 = str.substring(0, str.length - 1)
    var str2 = str.substring(str.length - 1, str.length)
    if (str2 === 's') {
      return str1 * 1000
    } else if (str2 === 'h') {
      return str1 * 60 * 60 * 1000
    } else if (str2 === 'd') {
      return str1 * 24 * 60 * 60 * 1000
    }
  } else {
    if (str.indexOf('l') === -1) {
      return str * 1000
    } else {
      return 30 * 24 * 60 * 60 * 1000
    }
  }
}

// 写 cookies
export let setCookie = function setCookie (name, value, time) {
  if (time) {
    let strsec = getsec(time)
    let exp = new Date()
    exp.setTime(exp.getTime() + parseInt(strsec))
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  } else {
    document.cookie = name + '=' + escape(value)
  }
}

// 读 cookies
export let getCookie = function (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

// 删 cookies
export let delCookie = function (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 获取Token
export let getToken = function () {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    return window.sessionStorage.Bearer
  } else if (window.localStorage && window.localStorage.Bearer) {
    return window.localStorage.Bearer
  } else if (window.document.cookie) {
    return getCookie('Bearer')
  }
}

// 设置Token
export let setToken = function (token, rememberTime) {
  if (window.sessionStorage) {
    window.sessionStorage.Bearer = token
  }

  if ((rememberTime && window.localStorage) || !window.sessionStorage) {
    window.localStorage.Bearer = token
  }

  if (window.document.cookie && !window.sessionStorage && !window.localStorage) {
    if (rememberTime) {
      setCookie('Bearer', token, rememberTime)
    } else {
      setCookie('Bearer', token)
    }
  }
}

// 删除Token
export let delToken = function () {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    window.sessionStorage.removeItem('Bearer')
  }

  if (window.localStorage && window.localStorage.Bearer) {
    window.localStorage.removeItem('Bearer')
  }

  if (window.document.cookie) {
    delCookie('Bearer')
  }
}
