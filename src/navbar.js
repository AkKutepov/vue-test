import { Lib } from './lib.js'
import { menus } from './router.js';
import { routes } from './router.js';

export default {
  
  data() { return {
    menus: menus(),
  }},

  created() {
    // send components name
    Lib.bus.on('Com:created', path => {
      var i
      if(~(i = routes.findIndex(item => path == item.path))) {
        Lib.bus.trigger('NavBar:sendname', routes[i].name)
      }
    })
    Lib.bus.on('Com:mounted', path => this.f_highlight_current(path))

    window.addEventListener('dragstart', this.f_win_ondragstart)
  },
  destroyed() {
    window.removeEventListener('dragstart', this.f_win_ondragstart)
  },
  mounted() {
    this.div = this.$el
    Lib.style(this.$options, this.div)
    Lib.bus.on('Com:mounted', this.f_collapse_all)
  },

  methods: {
    f_menu_onclick() {
      var elem = document.querySelector('#navbarSupportedContent')
      
      elem.classList.toggle('expand');
      if(!elem.classList.contains('expand')) {
        this.f_collapse_all(elem)
      }
    },
    f_collapse_all(exclude_elem) {
      var elem = document.querySelector('#navbarSupportedContent'),
          i, elems = elem.querySelectorAll('.dropdown-menu');

      for(i = 0; i < elems.length; i++) {
        if(exclude_elem != elems[i]) {
          this.f_dropdown_onclick(null, elems[i], 1)
        }
      }
    },
    f_highlight_current(path) {
      var path_folder = path.substring(0, path.lastIndexOf('/')),
          i, elem_path, elems = this.div.querySelectorAll('.nav-link')
      
      this.f_unhightlight_all()
      //
      for(i = elems.length; i--;) {
        if(elems[i].href) {
          elem_path = elems[i].href
          elem_path = elem_path.substring(elem_path.indexOf('#') + 1)
        }
        else if(elems[i].dataset.href) {
          elem_path = elems[i].dataset.href
        }
        if(path == elem_path || path_folder == elem_path) {
          elems[i].classList.add('nav-link-active')
        }
      }
    },
    f_unhightlight_all() {
      var i, elems = this.div.querySelectorAll('.nav-link');
      for(i = elems.length; i--;) {
        elems[i].classList.remove('nav-link-active')
      }
    },
    f_dropdown_onclick(event, ul, b_collapse) {
      var target, elem;
      if(event) {
        target = event.target || event.srcElement
        elem = target.nextElementSibling
        this.f_collapse_all(elem)
      }
      
      if(ul) elem = ul;
      else {
        var target = event.target || event.srcElement;
        elem = target.nextElementSibling
      }
      if(!b_collapse) elem.classList.toggle('expand')
      else elem.classList.remove('expand')
    },
    f_win_ondragstart() {
      event.preventDefault()
    },
  },

	template: `
<div class="container-fluid">
  <nav class="navbar navbar-expand-sm navbar-light" style="background-color: #e3f2fd;">
    <a class="navbar-brand" nohref style="cursor:default;">
      <img alt="logo" src="/test/img/favicon.png" height="40" />
    </a>
    <button @click="f_menu_onclick" class="navbar-toggler" type="button">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div id="navbarSupportedContent" class="navbar-collapse">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <template v-for="obj in menus">
          <li v-if="obj.data.length" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" @click.stop="f_dropdown_onclick($event, 0)" :data-href=obj.item.path style='cursor:pointer;'> {{ obj.item.name }} </a>
            <div class="dropdown-menu">
              <ul class="dropdown-menu-inner">
                <template v-for="subitem in obj.data">
                  <div v-if="subitem.separated" class="dropdown-divider"></div>
                  <li class="dropdown-item"> <router-link :to="subitem.path" class="nav-link"> {{ subitem.name }} </router-link> </li>
                </template>
              </ul>
            </div>
          </li>
          <li v-else> <router-link :to="obj.item.path" class="nav-link"> {{ obj.item.name }} </router-link> </li>
        </template>
      </ul>
    </div>
  </nav>
  
  <div class="text-center" style="margin-top: 20px;">
    <router-view></router-view>
  </div>
</div>
  `,

  css: `
<style scoped>
  body {
    margin:0;
    padding:0;
    overflow-y:scroll;
  }
  body::-webkit-scrollbar {
    width: 12px;
  }
  body::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 10px;
  }
  body::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  }

  .container-fluid {
    padding-left: 0;
    padding-right: 0;
    max-width:1200px;
  }
  @media (min-width: 576px) {
    #navbarSupportedContent {
      max-height: 700px!important;
      overflow: visible!important;
    }
    .nav-link {
      padding: 0.5rem 1rem .4rem;
    }
  }
  
  .navbar {
    border: 1px solid #dee2e6;
    border-radius: 6px;
    user-select: none;
  }
  .navbar-brand {
    cursor: default;
    margin-right: 0.5rem;
    margin-bottom: 0.2rem;
    padding-top: 0;
    padding-bottom: 0;
  }

  .navbar > button:focus {
    outline: 1px solid var(--orange);
  }
  
  #navbarSupportedContent {
    max-height: 0;
    overflow: hidden;
    transition: max-height .75s linear;
  }
  #navbarSupportedContent.expand {
    max-height: 700px;
    transition-delay: .5s;
  }
  
  #navbarSupportedContent .dropdown-menu {
    border: none;
    display: block;
    max-height: 0;
    overflow: hidden;
    padding: 0;
    transition: max-height .75s linear, padding .25s linear .5s, margin-bottom .25s linear .5s;
  }
  #navbarSupportedContent .dropdown-menu.expand {
    max-height: 700px;
    margin-bottom: .5rem;
    transition-delay: .5s;
  }
  #navbarSupportedContent .dropdown-menu-inner {
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 0.25rem;
    padding: .5rem 0;
  }
  
  #navbarSupportedContent .dropdown-menu li:active {
    background: rgb(220 220 220 / 1);
    color: inherit;
  }
  #navbarSupportedContent .dropdown-menu a {
    color: rgb(0 0 0 / .5);
  }
  
  .mb-2 {
    margin-bottom: 0!important;
  }
  .nav-link-active {
    color: black !important;
  }
</style>
  `,
}