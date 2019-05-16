<template>
    <div class="layout">
        <h3>{{day + " " + " " + month + " " + year}}</h3>
        <hr>
        <div v-for="item in resort" v-bind:key="item._id">
            <div class="grid" @click="click(item.url)">
                <div class="time">{{ getDate(item.date) }}</div>
                <div class="title">{{ item.title }}</div>
                <div class="location">{{ item.location }}</div>
                <div class="tags"> 
                    <span v-for="tag in item.tag" v-bind:key="tag">{{ tag }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["year", "month", "day", "show"],
    computed: {
        resort() {
            return this.show.sort((a, b) => {
                a = new Date(a.date)
                b = new Date(b.date)
                if (+a > +b) {
                    return 1
                } else if (+a < +b) {
                    return -1
                } else {
                    return 0
                }
            })
        }
    },
    methods: {
        padding(num) {
            if (num < 10) {
                return num + "0"
            }
            return num
        },
        getDate(date) {
            const d = new Date(date)
            return this.padding(d.getHours()) + ":" + this.padding(d.getMinutes())
        },
        click(url) {
            window.open(url)
        }
    }
}
</script>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: 20% 80%;
    grid-template-rows: auto 30px 40px;
    grid-template-areas:
        "time title"
        "time location"
        "time tags";
    width: 95%;
    padding-right: 10px;
    margin: 10px;
    background-color: rgb(30, 103, 212);
    color: rgb(255, 255, 255);
    border-radius: 5px;
    cursor: pointer;
}

.time {
    padding-left: 20px;
    padding-top: 8px;
    grid-area: time;
    font-size: 1.5em;
}

.title {
    grid-area: title;
    padding-top: 8px;
}

.location {
    grid-area: location;
    font-size: 0.9em;
}

.tags {
    grid-area: tags;
}

span {
    display: inline-block;
    font-size: 0.8em;
    margin-right: 10px;
    height: 20px;
    background-color: rgb(255, 255, 255);
    color: rgb(0, 0, 0);
    padding-top: 2px;
    padding-left:7px;
    padding-right:7px;
    text-align: center;
    border-radius: 10px;
}
</style>
