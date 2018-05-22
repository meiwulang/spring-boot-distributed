<template>
    <div class="jdyalert" style="top:0;">
        <!-- <div class="jdyalert-bg absolute"></div> -->
        <div class="jdyalert-title">
            <span class="f14 pl16">{{title}}</span>
            <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="closeAlert">
                <i class="el-message-box__close el-icon-close"></i>
            </button>
        </div>
        <div class="jdyalert-content">
            <slot></slot>
            <div class="tc ffhidden hiddens">
                <button type="button" aria-label="Close" class="el-message-box__headerbtn" @click="closeAlert">
                    <i class="el-message-box__close el-icon-close"></i>
                </button>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        title: String
    },
    methods: {
        closeAlert() {
            $('.alertbgg').remove();
            this.$emit('closeAlert');
        }
    }
}
</script>
