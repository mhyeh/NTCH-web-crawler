<template>
    <div>
        <label class="checkbox-container">
            <input type="checkbox" v-model="selectAll" @change="check"> All
        </label>
        <label v-for="item in list" v-bind:key="getVal(item)" class="checkbox-container">
            <input type="checkbox" :value="getVal(item)" v-model="checked" @change="check"> {{getText(item)}}
        </label>
    </div>
</template>

<script>
export default {
    props: ["list"],
    data() {
        return {
            checked: [],
            default: true,
        }
    },
    watch: {
        'list': 'init'
    },
    computed: {
        selectAll: {
            get () {
                const all = this.default || this.checked.length === this.list.length
                if (all) {
                    this.checked = []
                    this.list.forEach((select) => { this.checked.push(this.getVal(select)) })
                }
                this.default = false
                return all
            },
            set (value) {
                this.checked = []
                if (value) {
                    this.list.forEach((select) => { this.checked.push(this.getVal(select)) })
                }
            }
        }
    },
    methods: {
        init() {
            this.default = true
            this.$emit("check", { checked: this.checked, all: this.selectAll })
        },
        getVal(item) {
            if (typeof item === "string") {
                return item
            }
            return item.val
        },
        getText(item) {
            if (typeof item === "string") {
                return item
            }
            return item.text
        },
        check() {
            this.$emit("check", { checked: this.checked, all: this.selectAll })
        }
    }
}
</script>

<style scoped>
.checkbox-container {
    display: block;
    position: relative;
    padding-left: 10px;
    margin-bottom: 5px;
    cursor: pointer;
    font-size: 14px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

</style>
