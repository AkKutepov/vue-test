export const Lib = new function() {
  var SELF
  
  const SYMBOLS = {
    LF: String.fromCharCode(10),
    CR: String.fromCharCode(13),
    CRLF: String.fromCharCode(10) + String.fromCharCode(13),
    TAB: String.fromCharCode(9),
    EQUAL: '=',
    HIDDEN: ' ', // hidden symbol
  }

  const OBJECTS = {
    BIGNUMBER: 5500000000,
    UNDEF: undefined,
    FUNC: 'function',
  }

  function isset(val) {
    return typeof val !== 'undefined'
  }

  function trsort(_sort,_compare){if(_sort==null)_sort=0;_sort=_sort>0?1:(_sort<0?-1:0);if(_compare==null)_compare=0;_compare=_compare>0?1:(_compare<0?-1:0);var _ar_key=[],_ar_val=[],_index=-1;var f_cmp=(_compare==-1?function(int1,int2){return(int1>int2?1:(int1<int2?-1:0))}:function(str1,str2){if(_compare==1){str2=str2.toLowerCase()}return(str1>str2?1:(str1<str2?-1:0))});return{find:function(key_search){if(key_search==null)key_search=(_compare==-1?0:'');var res=false,i=0,i_first=0,i_harf=0,i_last=_ar_key.length-1,res_cmp,key_search_copy;if(_compare==-1)key_search_copy=key_search;else{if(_compare==1){key_search_copy=(key_search+'').toLowerCase()}else key_search_copy=key_search+''}if(_ar_key.length){if(_sort){while(true){i_harf=Math.floor(i_first+(i_last-i_first)/2);res_cmp=f_cmp(key_search_copy,_ar_key[i_harf]);if(res_cmp==0){_index=i_harf;res=true;i_first=++i_harf;if(i_first>i_last)break}else if(res_cmp==_sort){i_first=++i_harf;if(i_first>i_last)break}else{i_last=i_harf;if(i_first==i_last)break}}}else{for(i=0;i<_ar_key.length;i++){if(f_cmp(key_search_copy,_ar_key[i])==0){_index=i;res=true;break}}}}if(!res)_index=(_sort?i_first:i);return res},add:function(new_key,new_val,before){if(new_key==null)new_key=(_compare==-1?0:'');if(new_val==null)new_val=null;if(before!==undefined){if(before>=0&&before<=_ar_key.length){if(_compare==-1)_ar_key.splice(before,0,new_key);else _ar_key.splice(before,0,new_key+'');_ar_val.splice(before,0,new_val);_index=before}else{throw new Error('Error add before')}return}if(_sort){if(this.find(new_key))_index++;if(_compare==-1)_ar_key.splice(_index,0,new_key);else _ar_key.splice(_index,0,new_key+'');_ar_val.splice(_index,0,new_val)}else{_index=_ar_key.length;if(_compare==-1)_ar_key[_index]=new_key;else _ar_key[_index]=new_key+'';_ar_val[_index]=new_val}},rem:(index)=>{var res_key=null,res_val=null;if(index!=null);else index=_index;if(index>=0&&index<_ar_key.length){res_key=_ar_key.splice(index,1)[0];res_val=_ar_val.splice(index,1)[0];_index=-1}else{throw new Error('Error rem index')}return{key:res_key,val:res_val}},clear:()=>{_ar_key=[],_ar_val=[],_index=-1},get k(){return _ar_key},get v(){return _ar_val},get i(){return _index},get k1(){return _ar_key[_index]},get v1(){return _ar_val[_index]},get param(){return{sort:_sort,compare:_compare}}}};
  
  function reactelem(ar) {
    var res = ''
      
    if(Array.isArray(ar)) {
      if(ar.length <= 2 || ar[2] === null || typeof ar[2] === 'string' || typeof ar[2] === 'number' || typeof ar[2] === 'bigint') {
        res = React.createElement.apply(this, ar)
      }
      else {
        res = React.createElement.apply(this, ar.map((item, i) => { 
          if(i > 1) return SELF.reactelem(item)  
          return item
        }))
      }
    }
    return res
  }

  // converting text (TAB separated) to a named array
  // in:
  //     str_expression - text
  //     sep - rows separator
  //     sep_inrow - data separator
  function str2array(str_expression, sep, sep_inrow) {
    sep = sep || SYMBOLS.LF
    sep_inrow = sep_inrow || SYMBOLS.TAB

    var i, j, 
      ar = str_expression.split(sep), // разбить на строки
      ar_res = []; 
      
    for(i = 0; i < ar.length; i++) {
      ar[i] = ar[i].split(sep_inrow); // разбить на элементы
      //
      if(i) {
      // data
        ar_res[i - 1] = {}; // создать пустой объект (empty named array)
        //
        for(j = 0; j < ar[0].length; j++) {
          ar_res[i - 1][ar[0][j]] = ar[i][j];
        }
      }
    } 
    return ar_res;
  }
  // converting text (= separated) to a named H array
  // in:
  //     str_expression - text
  //     sep - rows separator
  //     sep_inrow - data separator
  function str2harray(str_expression, sep, sep_inrow) {
    sep = sep || SYMBOLS.LF
    sep_inrow = sep_inrow || SYMBOLS.EQUAL

    var i, 
      ar = str_expression.trim().split(sep), // разбить на строки
      ar_res = []; 

    for(i = 0; i < ar.length; i++) {
      ar[i] = ar[i].trim().split(sep_inrow) // разбить на элементы
      //
      if(ar[i].length > 1) {
        ar[i][1] = ar[i].slice(1).join(sep_inrow) // данные вместе с разделителями
        if(i == 0) ar_res[0] = {} // создать пустой объект
        ar_res[0][ar[i][0].trim()] = ar[i][1].trim() // data
      }
    }
    return ar_res;
  }
  // converting named D array to a text (TAB separated)
  // in:
  //     ar_source - D array
  //     sep - rows separator
  //     sep_inrow - data separator
  function array2str(ar_source, sep, sep_inrow) {
    sep = sep || SYMBOLS.LF
    sep_inrow = sep_inrow || SYMBOLS.TAB

    var i, j, k = 0, key, ar, ar_row = []
    
    for(i = 0; i < ar_source.length; i++) {
      if(i == 0) { 
        j = 0; ar = [];
        // header
        for(key in  ar_source[i]) {
          ar[j++] = key.toUpperCase()
        }
        ar_row[k++] = ar.join(sep_inrow)
      }
      
      j = 0; ar = [];
      for(key in  ar_source[i]) {
        ar[j++] = ar_source[i][key]
      }
      ar_row[k++] = ar.join(sep_inrow)
    }
    return ar_row.join(sep)
  }

  // trim text
  // in:
  //     str_expression - text
  //     symbs - symbols to trim
  //     type - -1: left, 0: all, 1: right
  function trim(str_expression, symbs = '', type = 0) {
    var j_start = 0, j_end = str_expression.length - 1
      
    while(type <= 0 && j_start <= j_end) {
      if(~symbs.indexOf(str_expression.substring(j_start, j_start + 1))) j_start++
      else break
    }
    while(type >= 0 && j_start <= j_end) {
      if(~symbs.indexOf(str_expression.substring(j_end, j_end + 1))) j_end--
      else break
    }
    
    return str_expression.substring(j_start, j_end + 1)
  }
  
  function com(props) {
    var unic = makeid(5), ugroup
    
    // init store
    if(!SELF.store) SELF.store = {}
    
    if(!SELF.store.unics) SELF.store.unics = new trsort(1)
    // add to store
    SELF.store.unics.add(props.name, unic)
    
    if(!SELF.store.ugroups) SELF.store.ugroups = new trsort(1)
    if(SELF.store.ugroups.find(props.name)) {
    // found  
      ugroup = SELF.store.ugroups.v1
    }
    else {
    // new

      ugroup = makeid(5)
      // add to store
      SELF.store.ugroups.add(props.name, ugroup)
      
      // prepare css
      var css = getstyle(props.css).inner
      css = css.replace(/\^ugroup\^/g, ugroup)
      // add style to head
      addhead('style', ugroup, css)
    }
    
    // add to com unic, ugroup
    props = { ...props, ...{ unic, ugroup }}

    // prepare template
    props.template = props.template
      .replace(/\^unic\^/g, unic)
      .replace(/\^ugroup\^/g, ugroup)

    return props
  }

  function getstyle(css) {
    var o = { outer: '', inner: '' }, cssnew

    if(isset(css)) {
      if(cssnew = css.replace(new RegExp('^ ' + SELF.SYMB.CRLF), '').replace(new RegExp(SELF.SYMB.CRLF + ' $'), '')) {
        cssnew = cssnew.match(/<style[^>]*>([^<]*)<\/style>/)
        if(Array.isArray(cssnew)) {
          o.outer = cssnew[0]
          o.inner = o.outer.replace(/<\/?style[^>]*>/g, '') // remove tags
       
          o.inner = removeCssComments(o.inner) // remove css comments
          o.inner = removeSpaces(o.inner) // remove spaces
          o.inner = o.inner.replace(new RegExp('^' + SELF.SYMB.TAB), '').replace(new RegExp(SELF.SYMB.TAB + '$'), '') // trim tabs
  // console.log(o.inner)        
        }
      }
    }
    return o
  }
  
  function removeCssComments(css){
    var res = css.replace(/\/\*[\s\S]*?\*\//mg, '')
    return res
  }
  function removeSpaces(str){
    var res = str.replace(/\s{2,}/g, ' ')
    res = res.replace(/(?:\r\n|\r|\n)/g, '')
    res = res.replace('@CHARSET "UTF-8";', '')
    res = res.replace(', ', ',')
    return res
  }

  function addhead(tag, libid, content) {
    var scr = document.head.querySelector('#' + libid)
    if(scr);
    else if(content && content.length) {
      scr = document.createElement(tag)
      scr.id = libid
      scr.textContent = content
      document.head.appendChild(scr)
    }
  }

  function trstyle(com, elem, scoped) {
    var renderer = document.createElement('template'),
        scr = document.createElement('style')
    
    if(scoped) scr.setAttribute('scoped', '')
    scr.textContent = getstyle(com.css).inner
    renderer.content.appendChild(scr)
    if(elem) elem.appendChild(renderer.content)
  }
  
  class trevent{
      constructor(){
        this.events = {}
      }

      on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || []
        if(!~this.events[eventName].findIndex((item) => item === fn)) {
          this.events[eventName].push(fn)
        }
      }

      off(eventName, fn) {
        var i
        if(this.events[eventName]) {
          if(~(i = this.events[eventName].findIndex((item) => item === fn))) {
            this.events[eventName].splice(i, 1)
          }
        }
      }

      trigger(eventName, data) {
        if(this.events[eventName]) {
          this.events[eventName].forEach(function(fn) {
            fn(data)
          })
        }
      }
  }
  
  // generate random id
  function makeid(length, source) {
    const characters_1st = 'abcdefghijklmnopqrstuvwxyz',
          characters = 'abcdefghijklmnopqrstuvwxyz0123456789',
          characters_len = characters.length
    var source_1st, source_len

    if(source) {
      source_1st = source
      source_len = source.length
    }
    else {
      source_1st = characters_1st
      source = characters
      source_len = characters_len
    }
    
    var res = ''
    res = source_1st.charAt(Math.floor(Math.random() * source_1st.length))
    for(var i = 0; i < length - 1; i++) {
      res += source.charAt(Math.floor(Math.random() * source_len))
    }
    return res
  }

  // n-level menu
  const menus = (routes, priv = '') => {
    var i = 0, count = 0
  
    function getlevel(rootpath, menu, level = 0) {
      var j = 0, current_priv
      
      while(routes.length) {
        if(count++ > 500) break // circle defense
    
        if(!(i < routes.length)) return menu
        
        if('priv' in routes[i]) {
          current_priv = routes[i].priv
        }
        else current_priv = ""

        if(current_priv != priv || !('label' in routes[i])) {
        // skip menu
          i++
        }
        else {
        // to menu

          menu[j] = { ...routes[i] }
          
          if(routes[i].path && routes[i].label) {

            if(!rootpath) rootpath = routes[i].path.substring(1)

            if('component' in routes[i] || 'components' in routes[i]) {
            // item
              menu[j].to = menu[j].path

              if(++i < routes.length) {
                if(level && routes[i].path.substring(1, rootpath.length + 1) != rootpath) {
                // exit from submenu
                  return menu
                }
              }
            }
            else {
            // dropdown
      
              // new submenu  
              var submenu = []
              menu[j].items = getlevel(routes[i++].path.substring(1), submenu, level + 1)
            }
          }
          else i++
          
          j++
        }
      }
    }
  
    var ar = []
    // return { menu: getlevel("", ar), routes }
    return getlevel("", ar)
  }

  async function fetchReq(url, data, method = 'POST') {
    try {
      const res = await fetch(url, { 
        method: method,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: method == 'POST' ? JSON.stringify(data) : null,    
      })
      return res.json()
    }
    catch(error) { console.log(error) }
  }

  async function fetchRequest(url, data, method = 'POST') {
    try {
      const res = await fetch(url, { 
        method: method,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: method == 'POST' ? JSON.stringify(data) : null,    
      })
      return res.json()
    }
    catch(error) { fetchError(error) }
  }
  function fetchError(error) {
    if(typeof error.json === "function") {
      error.json()
      .then(jsonError => {
        console.log("Json error from API")
        console.log(jsonError)
      })
      .catch(genericError => {
        console.log("Generic error from API")
        console.log(error.statusText)
      });
    } 
    else {
      console.log("Fetch error")
      console.log(error)
    }
  }

  async function asyncCom(path, self, libName, comName, readyName) {
    try {
      var res = await import(/* webpackIgnore: true */ path) // Webpack Magic Comments - disables import for webpack 
      
      if(libName) res = res.default[libName]
      else res = res.default
      if(comName) self.$options.components[comName] = res
      if(readyName) self[readyName] = 1

      return res
    }
    catch(error) { console.log(error) }
  }

  const concatInt = (a, b, exponent = 10) => {
    return BigInt(a * Math.pow(10, exponent) + b)
  }
  const deconcatInt = (c, exponent = 10) => {
    var a = Math.floor(Number(c / BigInt(Math.pow(10, exponent)))),
        b = Number(c - BigInt(a * Math.pow(10, exponent)))
    return { a, b }
  }
    
  // Calculate the md5 hash of a string
  const md5 = (d) => { 
    function M(d) {
      for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
      return f;
    };
    function X(d) {
      for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
      for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
      return _;
    };
    function V(d) {
      for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
      return _;
    };
    function Y(d, _) {
      d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
      for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        var h = m,
          t = f,
          g = r,
          e = i;
        
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e);
      }
      return Array(m, f, r, i);
    };
    function md5_cmn(d, _, m, f, r, i) {
      return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
    };
    function md5_ff(d, _, m, f, r, i, n) {
      return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
    };
    function md5_gg(d, _, m, f, r, i, n) {
      return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
    };
    function md5_hh(d, _, m, f, r, i, n) {
      return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
    };
    function md5_ii(d, _, m, f, r, i, n) {
      return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
    };
    function safe_add(d, _) {
      var m = (65535 & d) + (65535 & _);
      return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m;
    };
    function bit_rol(d, _) {
      return d << _ | d >>> 32 - _;
    };
    
    d = unescape(encodeURIComponent(d));
    var result = M(V(Y(X(d), 8 * d.length)));
    
    return result.toLowerCase();
  }

  // Calculate the sha1 hash of a string
  const sha1 = (str) => {
    //
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://crestidg.com)
  
    var rotate_left = function(n,s) {

      var t4 = ( n<<s ) | (n>>>(32-s));
      return t4;

    };

    var lsb_hex = function(val) {
      var str='';
      var i;
      var vh;
      var vl;

      for( i=0; i<=6; i+=2 ) {
        vh = (val>>>(i*4+4))&0x0f;
        vl = (val>>>(i*4))&0x0f;
        str += vh.toString(16) + vl.toString(16);
      }
      return str;
    };

    var cvt_hex = function(val) {
      var str='';
      var i;
      var v;

      for( i=7; i>=0; i-- ) {
        v = (val>>>(i*4))&0x0f;
        str += v.toString(16);
      }
      return str;
    };
    
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    
    str = utf8_encode(str);
    var str_len = str.length;
    var word_array = new Array();
    for( i=0; i<str_len-3; i+=4 ) {
      j = str.charCodeAt(i)<<24 | str.charCodeAt(i+1)<<16 |
      str.charCodeAt(i+2)<<8 | str.charCodeAt(i+3);
      word_array.push( j );
    }

    switch( str_len % 4 ) {
      case 0:
        i = 0x080000000;
      break;
      case 1:
        i = str.charCodeAt(str_len-1)<<24 | 0x0800000;
      break;
      case 2:
        i = str.charCodeAt(str_len-2)<<24 | str.charCodeAt(str_len-1)<<16 | 0x08000;
      break;
      case 3:
        i = str.charCodeAt(str_len-3)<<24 | str.charCodeAt(str_len-2)<<16 | str.charCodeAt(str_len-1)<<8  | 0x80;
      break;
    }

    word_array.push( i );

    while( (word_array.length % 16) != 14 ) word_array.push( 0 );

    word_array.push( str_len>>>29 );

    word_array.push( (str_len<<3)&0x0ffffffff );
    
    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
      for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
      for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);

      A = H0;
      B = H1;
      C = H2;
      D = H3;
      E = H4;

      for( i= 0; i<=19; i++ ) {
        temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }

      for( i=20; i<=39; i++ ) {
        temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }
    
      for( i=40; i<=59; i++ ) {
        temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }

      for( i=60; i<=79; i++ ) {
        temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
        E = D;
        D = C;
        C = rotate_left(B,30);
        B = A;
        A = temp;
      }
    
      H0 = (H0 + A) & 0x0ffffffff;
      H1 = (H1 + B) & 0x0ffffffff;
      H2 = (H2 + C) & 0x0ffffffff;
      H3 = (H3 + D) & 0x0ffffffff;
      H4 = (H4 + E) & 0x0ffffffff;
    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
  };

  function utf8_encode(str_data) { // Encodes an ISO-8859-1 string to UTF-8
    //
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // 2019-11-24 Andrei Kutepov ak_1968@inbox.ru
      
    str_data = str_data + '';
    str_data = str_data.replace(/\r\n/g,'\n');
    var i = 0;
    var ar = [];

    for (var n = 0; n < str_data.length; n++) {
      var c = str_data.charCodeAt(n);
      
      if (c < 128) {
        ar[i++] = String.fromCharCode(c);
      } else if((c > 127) && (c < 2048)) {
        ar[i++] = String.fromCharCode((c >> 6) | 192);
        ar[i++] = String.fromCharCode((c & 63) | 128);
      } else {
        ar[i++] = String.fromCharCode((c >> 12) | 224);
        ar[i++] = String.fromCharCode(((c >> 6) & 63) | 128);
        ar[i++] = String.fromCharCode((c & 63) | 128);
      }
    } 
    return ar.join('');
  }

  // clone object
  function cloneObj(obj) {
    // Handle the 3 simple types, and null or undefined
    if(null == obj || "object" != typeof obj) return obj;
    
    var copy;
    
    // Handle Date
    if(obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if(obj instanceof Array) {
      copy = [];
      for(var i = 0, len = obj.length; i < len; i++) {
        copy[i] = cloneObj(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if(obj instanceof Object) {
      copy = {};
      for(var attr in obj) {
        if(obj.hasOwnProperty(attr)) copy[attr] = cloneObj(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  
  return SELF = {
    array2str,
    asyncCom,
    bus: new trevent(), // singleton
    cloneObj,
    com,
    concatInt,
    deconcatInt,
    fetchReq,
    fetchRequest,
    isset,
    makeid,
    md5,
    menus,
    OBJ:OBJECTS,
    reactelem,
    sha1,
    sort: trsort,
    store: new function(){}, // singleton
    str2array,
    str2harray,
    style: trstyle,
    SYMB: SYMBOLS,
    trim,
  }

}
