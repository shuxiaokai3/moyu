/*
    创建者：shuxiaokai
    创建时间：2020-11-25 17:32
    模块名称：数据统计
    备注：xxxx
*/
<template>
    <div class="statistics">
        <!-- <img :src="require('@/assets/imgs/logo.png')" width="150px" height="150px" alt="logo图片" class="logo"> -->
        <div class="f-base">
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
        };
    },
    created() {
    },
    methods: {
        //=====================================获取远程数据==================================//

        //=====================================前后端交互====================================//

        //=====================================组件间交互====================================//

        //=====================================其他操作=====================================//

    },
};
</script>

<style lang="scss">
.statistics {
    height: calc(100% - #{size(40)});
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
        margin-top: 5vh;
    }
}
</style>
