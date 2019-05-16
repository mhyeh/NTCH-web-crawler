<template>
    <select class="ripple" :value="selected" @change="select($event)">
        <option v-for="item in list" v-bind:key="item.val" :value="item.val">{{item.text}}</option>
    </select>
</template>

<script>
export default {
    props: ["selected", "list"],
    methods: {
        select(event) {
            this.$emit("select", Number(event.target.value))
        }
    }
}
</script>

<style scoped>
select {
    width: 30%;
    height: 40px;
    font-size: 0.9em;
    color: rgb(255, 255, 255);
    background-color: rgb(33, 97, 192);
    outline: none;
}
</style>
