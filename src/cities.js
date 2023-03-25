import { Lib } from './lib.js'

export default {
  data() { return {
    myName: this.$options.props.name,
    cities: [],
    inputValue: `Геленджик,
Домодедово,
Каунас,
Актюбинск,
Казань,
Йошкар-ола,
Липецк,
Нижний Новгород,
Орёл,
Санкт-Петербург,
Кустанай,`,
  }},
  
  mounted() {
console.log(this.myName + ' mounted')
    
    this.div = this.$el
    Lib.style(this.$options, this.div)
    Lib.bus.trigger('Com:mounted', location.hash.substring(1))
    
    if(window.attachEvent) {
      this.observe = function(element, event, handler) {
        element.attachEvent('on'+event, handler)
      }
    }
    else {
      this.observe = function(element, event, handler) {
        element.addEventListener(event, handler, false)
      }
    }
    this.init()
  },

  methods: {
    init() {
      var text = this.$refs['input']
      function resize () {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight + 'px';
      }
      
      /* 0-timeout to get the already changed text */
      function delayedResize () {
        window.setTimeout(resize, 0);
      }
      this.observe(text, 'change',  resize);
      this.observe(text, 'cut',     delayedResize);
      this.observe(text, 'paste',   delayedResize);
      this.observe(text, 'drop',    delayedResize);
      this.observe(text, 'keydown', delayedResize);
      // text.focus();
      // text.select();
      resize();
    },
    
    //
    // Игра в города
    //

    // Есть список городов. Надо определить все возможные (1й возможный вариант) 
    // построения цепочки для игры в города
    //
    // ar_cities - cities array
    // all_variants - 0 (get first variant), 1 (get all varaints)
    // return variants and count of variants
    cityGame() {
      var i, start_city, // start city
          ar_res = [], // result array
          res_count = 0, // count of variants
          all_variants = 1,
          ar_cities = this.inputValue.trim().replace(/[, ]$/, '').split(","),
          count = ar_cities.length, // cities count
          SELF = this

      SELF.cities = []
      
      // find result
      for(i = ar_cities.length; i--;) {
        ar_cities[i] = ar_cities[i].replace(/^\s+|\s+$/g, '')
      }
      for(i = 0; i < ar_cities.length; i++) {
        start_city = ar_cities[i]

        // prepare res
        ar_res = [start_city]
        // remove from src
        ar_cities.splice(i, 1)
        
        check() // check chain from start_city
        
        if(ar_res.length == count) {
           // ok
          if(!all_variants) break
        }
        
        // return to src
        ar_cities.splice(i, 0, start_city)
      }
      
      return res_count
      
      // check chain from start_city	
      function check() {
        var res = -1,
            start = ar_res.at(-1), // last city in chain
            s = start.at(-1) // last symbol in last city
        // correct symbol
        if(s == 'ь' || s == 'ъ') {
          s = start.at(-2)
        }
        s = s.toUpperCase()
        
        // for all cities from the remaining
        for(let i = 0; i < ar_cities.length; i++) {
          
          // check criteria
          if(ar_cities[i][0] == s) { // 1st symbol of the current city == last symbol of last city in chain
            
            start = ar_cities[i]
            // add to res
            ar_res.push(start)
            // remove from src
            ar_cities.splice(i, 1)
            
            if(ar_res.length < count) {
            // chain length < count of cities
              
              // next check
              res = check()
            }
            else {
              SELF.cities.push({ key: res_count, res: ar_res.slice() }) // found (full chain)
              
              res_count++
              res = 1
            }
            
            if(res == 1) {
              if(!all_variants) break // 1st found - return
            }
            
            // remove from res
            ar_res.pop() 
            // add to src
            ar_cities.splice(i, 0, start)
            
          }
        }
        
        return res
      }
    }
    
  },
  
  template: `
  <div id='my-cities-wrapper'>
    <h1>{{ myName }}</h1>
    <p>This is {{ myName.toLowerCase() }} page</p>
    <br />
    <p>Игра в города</p>
    <textarea v-model="inputValue" ref="input"></textarea>
    <div style="display:flex;justify-content:flex-end;">
      <button class='input-button'
        @click="cityGame" 
      >Start</button>
    </div>
    <p v-for="(c, index) in cities" style="text-align:justify;width:100%;">
      #{{ index + 1 }} {{ c.res.join(', ') }}
    </p>
  </div>
`,

  css: `
<style scoped>
  #my-cities-wrapper {
    padding:0rem 2rem;
  }
  #my-cities-wrapper textarea {
    background: rgb(250 250 250 / 1);
    border: 0 none white;
    margin-bottom:1rem;
    outline: none;
    overflow: hidden;
    padding: 2rem;
    width:100%;
  }
  #my-cities-wrapper .input-button {
    display:block;
    padding: 0.3rem 0.5rem;
    background-color: #e9ecef;
    border:1px solid #ced4da;
    border-radius: 0.25rem;
    cursor:pointer;
    outline:none;
    margin-bottom:2rem;
    width:20rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  #my-cities-wrapper .input-button:active {
    box-shadow:none;
  }
</style>
`
}