---
extend: '@vue/cli-service/generator/template/src/components/HelloWorld.vue'
replace:
  - !!js/regexp /<\/div>([\s\S]*?)<\/template>/
  - !!js/regexp /<script>[^]*?<\/script>/
---

<%# REPLACE %>
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
        this.response = response.mode
      })
      .sampleFunction()
  }
}
</script>
<%# END_REPLACE %>
