<template>
    <div class="container">
        <h3 class="item">Setting</h3>
        <div class="item">
            <span class="start">time</span>
            <cus-select class="ripple" :selected="value.startTime" :list="start" v-on:select="selectStartTime"></cus-select>
            <span class="middle">-</span>
            <cus-select class="ripple" :selected="value.endTime" :list="end" v-on:select="selectEndTime"></cus-select>
        </div>
        <div class="item">
            <p>location</p>
            <checkbox :list="location" v-on:check="checkLocation"></checkbox>
        </div>
        <div class="item">
            <p>tags</p>
            <checkbox :list="tags" v-on:check="checkTag"></checkbox>
        </div>
        <div></div>
    </div>
</template>

<script>
import api from "../store/api"

export default {
    data() {
        return {
            value: {
                startTime: 0,
                endTime: 23,
                location: [],
                allLocation: true,
                tags: [],
                allTag: true,
            },
            location: [
            ],
            tags: [
            ],
            isReady: false
        }
    },
    computed: {
        start() {
            const t = []
            for (let i = 0; i < 24; i++) {
                t.push({ text: i + ":00", val: i })
            }
            return t
        },
        end() {
            const t = []
            for (let i = Math.max(0, this.value.startTime); i < 24; i++) {
                t.push({ text: i + ":00", val: i })
            }
            return t
        }
    },
    methods: {
        selectStartTime(time) {
            this.value.startTime = time
            this.value.endTime   = Math.max(this.value.endTime, this.value.startTime)
            this.setting()
        },
        selectEndTime(time) {
            this.value.endTime = time
            this.setting()
        },
        checkLocation(location) {
            this.value.location    = location.checked
            this.value.allLocation = location.all
            this.setting()
        },
        checkTag(tag) {
            this.value.tags   = tag.checked
            this.value.allTag = tag.all
            this.setting()
        },
        setting() {
            if (!this.isReady) {
                setTimeout(() => {
                    this.isReady = true
                }, 1000)
            }
            if (this.isReady) {
                this.$emit("setting", this.value)
            }
        }
    },
    beforeCreate() {
        Promise.all([api.getLocation(), api.getTags()]).then(res => {
            res[0].data.location.forEach(element => this.location.push({ text: element.location, val: element.code }));
            res[1].data.tags.forEach(element => this.tags.push(element.tags))
        }).catch(err => {
            console.log(err)
        })
    }
};
</script>

<style scoped>
.container {
    display: grid;
    grid-template-rows: 16% 50px auto auto 50px;
    width: 100%;
    height: 100vh;
    background-color: rgb(235, 235, 235);
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
    z-index: 100;
    overflow: scroll;
}

.item {
    margin-left: 20px;
}

.start {
    margin-right: 10px;
}

.middle {
    margin-left: 10px;
    margin-right: 10px;
}

h3 {
    font-size: 40px;
    font-weight: lighter;
}
</style>
