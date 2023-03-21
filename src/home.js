import { Lib } from './lib.js'

var SELF, OBJ = { com:{} }
export default {
  props: {
    // name: String,
  },
  data() { return {
    myName: this.$options.props.name,
  }},
  
  created() {
    SELF = this
  },
  mounted() {
console.log(this.myName + ' mounted')
    
    this.div = this.$el
    Lib.bus.trigger('Com:mounted', location.hash.substring(1));
  },

  methods: {
  },
  
  template: `
  <div>
    <h1>{{ myName }}</h1>
    <p>This is {{ myName.toLowerCase() }} page</p>
  </div>
  <com-weather my-name="Weather com"></com-weather>
`,

  css: `
<style scoped>
`
}