---
extend: '@vue/cli-service/generator/template/src/components/HelloWorld.vue'
replace:
  - !!js/regexp /<\/div>([\s\S]*?)<\/template>/
  - !!js/regexp /<script>[^]*?<\/script>/
---

<%# REPLACE %>
    <div style="display: flex; align-items: center; justify-content: center; margin: 10px;">
      <input type="button" style="margin: 10px; padding: 5px 10px; background-color: #BDBDBD; color: #212121;" value="click to test $log method" @click="handler">
    </div>
    <div>{{ response }}</div>
  </div>
</template>
<%# END_REPLACE %>

<%# REPLACE %>
<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: () => ({
    response: ''
  }),
  mounted() {
    this.$google.script.run
      .withSuccessHandler((response) => {
        this.response = response;
      })
      .sampleFunction();
  },
  methods: {
    handler() {
      if (this.$devMode) {
        console.log('clicked the testing $log method button');
        console.log('it should log a message to the Stackdriver Logger console');
      } else {
        console.log(`Only works in development mode`);
      }
      this.$log('testing $log method');
    }
  }
}
</script>
<%# END_REPLACE %>
