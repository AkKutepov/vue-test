import { Lib } from './lib.js'

export default {
  data() { return {
    myName: this.$options.props.name,
    dS: { isEnabled: 0, processId: 0 },
    dT: [],
  }},
  
  mounted() {
    this.setStyle(this.$options, this.$el)
    this.$refs["timerInput"].select();
    Lib.bus.trigger('Com:mounted', location.hash.substring(1))
  },

  methods: {

    timerOnInput() {
      var s0 = event.target.value, s1 = '', match
      
      if((match = /60(:00)?|[0-5]?[0-9](:[0-5]0)?/.exec(s0)) != null) {
        s1 = match[0]
      }
      // allow/not add timer
      this.dS.isEnabled = (!!s0 && s0 == s1 && !!s1.replace(/[:0]+/, ''))
    },
    
    addTimer () {
      if(!this.dS.isEnabled) return // not allow add timer
      
      // set new timer
      var ar = this.$refs["timerInput"].value.split(':'), // [min, sec]
          now = new Date(), // current date, time
          ar_T = { // new timer array set
            stop: now.getTime() + ar[0] * 60000 + (ar[1] ? ar[1] * 1000 : 0), // stop time (msec)
            m: ar[0], // min
            s: ar[1] ? ar[1] : '', // sec
            ms: '', // msec
            stopTime: '', // stop time viewing (' - 00:00:00')
          }
      
      this.dT.push(ar_T) // add new timer
      this.$refs["timerInput"].select() // focus, select to inputbox
      if(this.dS.processId == 0) this.startTimers() // start all timers if idle
    },
    
    // pad "0" from left
    pad(val, len = 2) {
      return new Array(len - ('' + val).length + 1).join('0') + val;
    },
    
    // start all timers
    startTimers() {
      var diff, // remaining time of the current timer
          now, // current time
          activeCount, // count of active timers
          pad = this.pad // formating
      
      this.dS.processId = setInterval(() => {
        now = new Date()
        activeCount = this.dT.length

        this.dT.map(timer => {
          diff = new Date(timer.stop - now.getTime())
          
          if(diff > 0) {
          // active
            Object.assign(timer, { m: pad(diff.getMinutes()), s: pad(diff.getSeconds()), ms: pad(diff.getMilliseconds(), 3) })
          }
          else {
          // deactive
            if(!timer.stopTime) {
            // stop moment
              Object.assign(timer, { ms: '000', stopTime: ' - ' + pad(now.getHours()) + ':' + 
                pad(now.getMinutes()) + ':' + pad(now.getSeconds()) })
            }
            
            if(--activeCount == 0) { clearInterval(this.dS.processId); this.dS.processId = 0 } // idle mode
          }
        })
      }, 10)
    },
    
    setStyle(com, elem) {
      var renderer = document.createElement('template')
      renderer.innerHTML = com.css
      elem.appendChild(renderer.content)
    },

  },
  
  template: `
  <div id="my-timer-wrapper">
    <h1>{{ myName }}</h1>
    <p>This is {{ myName.toLowerCase() }} page</p>
    <br />
    <div class="input-container">
      <div>Add timer (0 - 60min):</div>
      <div class="input-group">
        <input type="text" class="form-control" value="00:00" ref="timerInput"
          @keydown.enter="addTimer"
          @input="timerOnInput"
        >
        <div :class="{ 'input-group-append': 1, 'input-group-append-enabled': dS.isEnabled }" 
          @click="addTimer"
          >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 24 24">
              <path d="M20 4V10.5C20 14.09 17.09 17 13.5 17H7.83L10.92 20.09L9.5 21.5L4 16L9.5 10.5L10.91 11.91L7.83 15H13.5C16 15 18 13 18 10.5V4H20Z" />
            </svg>
          </span>
        </div>
      </div>
      
      <div v-for="(t, index) in dT">
        #{{ index + 1 }} - {{ t.m + ":" + t.s }}.{{ t.ms }}{{ t.stopTime }}
      </div>
    </div>
  </div>
`,

  css: `
<style scoped>
  #my-timer-wrapper {
    margin-left:2rem;
  }
  #my-timer-wrapper .input-container {
    margin-top:2rem;
    text-align:left;
    max-width:14rem;
  }
  #my-timer-wrapper .input-group {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    flex-wrap: nowrap;
    margin-top:.2rem;
    margin-bottom:1rem;
  }  
  #my-timer-wrapper .form-control {
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    width: 1%;
    margin-bottom: 0;

    display: block;
    padding: 0.2rem 0.5rem;
    font-size: .875rem;
    line-height: 1.5;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    width: 100%;
    z-index:3;
  }
  #my-timer-wrapper .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: 0;
  }
  #my-timer-wrapper .input-group-append {
    padding: 0.3rem 0.5rem 0 0.5rem;
    background-color: #e9ecef;
    border:1px solid #ced4da;
    border-radius: 0.25rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    cursor:pointer;
    opacity: .3;
    pointer-events: none;
    margin-left: -1px;
  }
  #my-timer-wrapper .input-group-append-enabled {
    opacity: 1;
    pointer-events: auto;
  }
</style>
`
}
