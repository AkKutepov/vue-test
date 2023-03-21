import { Lib } from './lib.js'

var SELF
export default {
  props: {
    // name: String,
  },
  data() { return {
    myName: this.$options.props.name,
    weatherdata: null
  }},
  
  created() {
    SELF = this
  },
  mounted() {
console.log(this.myName + ' mounted')
    
    this.div = this.$el
    Lib.style(this.$options, this.div)
    Lib.bus.trigger('Com:mounted', location.hash.substring(1));
    
  },

  methods: {
  },
  
  template: `
  <div>
    <h1>{{ myName }}</h1>
    <p>This is {{ myName.toLowerCase() }} page</p>
  </div>
`,

  css: `
<style scoped>
`
}