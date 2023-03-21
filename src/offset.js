import { Lib } from './lib.js'

var SELF
export default () =>
  Promise.resolve({
    
// export default {
  
  data() { return {
    // myName: this.$options.props.name,
    AR: {}
  }},

  created() {
    SELF = this
    Lib.bus.on('NavBar:sendname', name => SELF.myName = name)
    Lib.bus.trigger('Com:created', location.hash.substring(1)); 
    SELF.f_init()
  },
  mounted() {
console.log(SELF.myName + ' mounted')

    Lib.style(SELF.$options, SELF.$el)
    Lib.bus.trigger('Com:mounted', location.hash.substring(1));
    SELF.f_onload()
  },

  methods: {
    f_init() {
      var i, j, li_current;
      const countLi = 100, countUl = 50;
      
      SELF.AR.data = { ul: [] };
    
      for(i = 0; i < countUl; i++) {
        li_current = Math.floor(Math.random() * countLi);
        
        SELF.AR.data.ul[i] = { num:i + 1, current:li_current, li:[] };

        for(j = 0; j < countLi; j++) {
          SELF.AR.data.ul[i].li[j] = j + 1;
        }
      }
// console.log(AR);
      
    },
    f_onload() {
      var i, j, li, li_current, observers = [],
          buttons = document.body.querySelectorAll('.li_buttons');
      
      // select current li
      for(i = buttons.length; i--;) {
        
        li = buttons[i].querySelectorAll('li');
        li_current = SELF.AR.data.ul[i].current;
        
        {
          let options = { threshold: [0.5] };
          observers[i] = new IntersectionObserver(SELF.f_onentry, options);
          observers[i].observe(buttons[i]);
        }
        
        for(j = li.length; j--;) {
          if(j == li_current) {
            li[j].classList.add('li_select');
          }
        }
      }
    },
    f_onentry(entries, observer) {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          setTimeout(function() {
            let rect_p = entry.target.getBoundingClientRect(),
                li_current = entry.target.querySelectorAll('li')[entry.target.querySelector('ul').dataset.current],
                rect_c = li_current.getBoundingClientRect(),
                mid_p = rect_p.left + rect_p.width / 2,
                mid_c = rect_c.left + rect_c.width / 2;
              
            if(mid_c != mid_p) {
              entry.target.scroll(entry.target.scrollLeft + mid_c - mid_p, 0);
            }
          }, 500);
        }
      });
    },
    f_ul_onclick(index) {
      var target;
      if(event && event.type == 'click') {
        target = event.target || event.srcElement;
      }
      // repeat click
      if(target.tagName != 'LI' || target.classList.contains('li_select')) {
        return;
      }
    
console.log(index, target.innerHTML); 
    },
  },

  template: `
<div id='Offset'>
  <div>
    <h1>{{ myName }}</h1>
    <p>This is {{ myName }} page</p>
  </div>
  <div v-for="ul in AR.data.ul" class='li_buttons'><ul @click="f_ul_onclick(ul.num - 1)" :data-current=ul.current>
    <li v-for="li in ul.li">{{ li }}</li>
  </ul></div>
</div>`,

  css: `
<style scoped>
  :root {
    --offset-base-scale:calc(100vw / 75);
    --offset-font-size:max(calc(15px * .7), min(calc(15px * .9), calc(var(--offset-base-scale) * .9)));
    --offset-transparent-button-background-hover:rgb(240 240 240 / 1);
    --offset-transparent-button-background-active:rgb(220 220 220 / 1);
    --offset-transparent-button-background-active1:rgb(200 200 200 / 1);
  }

  #Offset {
    font-family:Arial, Helvetica, sans-serif;
    font-size:calc(var(--offset-font-size) * 1.4);
    position:relative;
    width:100%;
  }
  .li_buttons {
    width:50%;
    font-size:1em;
    height:3.6em;
    margin:0 auto;
    padding:0;
    position:relative;
    
    overflow-x:scroll;
    scroll-behavior:smooth;
    scroll-snap-type:x mandatory;
  }
  .li_buttons::-webkit-scrollbar {
    height: .64em;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(245,245,245,1)), to(#cfcab9));
    -webkit-border-radius:.32em;
  }
  .li_buttons::-webkit-scrollbar-thumb {
    background:-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(245,245,245,1)), to(#7f7a6a));
    -webkit-border-radius:.32em;
  }
  .li_buttons ul { 
    display:flex;
    height:100%;
    margin:0;
    padding-inline-start:0;
    position: absolute;
  }
  .li_buttons li { 
    background:var(--offset-transparent-button-background-hover);
    border-radius:50%;
    cursor:pointer;
    display:inline-block;
    color:grey;
    float:left;
    margin:.2em .3em 0 .3em;
    padding:.25em;
    position:relative;
    scroll-snap-align:center;
    text-align:center;
    line-height:2em;
    height:2.5em;
    width:2.5em;
  }
  .li_buttons li:hover {
    background:var(--offset-transparent-button-background-active);    
  }
  .li_select {
    background:var(--offset-transparent-button-background-active1) !important;    
    cursor:default !important;
  }

  @media (max-width: 880px) {
    :root {
      --offset-font-size:max(calc(15px * .8), min(calc(15px * 1.3), calc(var(--offset-base-scale) * 1.3)));
    }
    .li_buttons {
      width:65%;
    }
  }
  @media (max-width: 576px) {
    .li_buttons {
      width:80%;
    }
  }
</style>
  `,
// }

})
