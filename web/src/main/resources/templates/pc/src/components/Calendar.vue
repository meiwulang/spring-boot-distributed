<template>
  <div class="jdycalendar">
     <div :id="id"></div>
  </div>
</template>

<script>
import Vue from 'vue';
import $ from 'jquery';
import '../assets/calendar/kalendae.css';
import Kalendae from 'kalendae'

export default {
    model: {
      prop: 'value',
      event: 'change'
    },
    props:{
        value:String,
        id:String
    },
    methods:{
      creatCalendar() {
        var div = this.id;
        var k = new Kalendae(div, {
          months:1,
          mode:'multiple',
          selected:[new Date()]
        });
        var that = this;
        k.subscribe('change', function (date) {
          that.$emit("change", this.getSelected());
        });
      }
    },
    mounted() {
      this.creatCalendar();
    }
}
</script>
