<template>
    <div class="layout">
        <modal name="day" adaptive scrollable height="auto">
            <day :year="year" :month="month[monthIdx]" :day="clickId + 1" :show="proc_data[clickId]"></day>
        </modal>
        <div class="month">
            <button class="ripple" @click="prev"><i class="material-icons">keyboard_arrow_left</i></button> 
            <span class="yearMonth">{{ month[monthIdx] + "   " + year }}</span> 
            <button class="ripple" @click="next"><i class="material-icons">keyboard_arrow_right</i></button>
        </div>
        <div class="calendar">
            <div v-for="w in week" v-bind:key="w" class="grid week"> {{w}} </div>
            <div v-for="i in 42" v-bind:key="i" class="grid" :class="{day: inThisMonth(i - 1), clickable: proc_data[i - firstDayOfMonth - 1] !== undefined && proc_data[i - firstDayOfMonth - 1].length > 0}" @click="show(i - firstDayOfMonth - 1)">
                <div v-if="inThisMonth(i - 1)">
                    <span class="date" :class="{today: isToday(i - firstDayOfMonth)}">{{ i - firstDayOfMonth }}</span>
                    <template v-if="proc_data[i - firstDayOfMonth - 1] !== undefined">
                        <div class="data" v-for="item in proc_data[i - firstDayOfMonth - 1].slice(0, 3)" v-bind:key="item._id">
                            <li>{{ item.title.slice(0, 8) + "..." }}</li>
                        </div>
                        <div class="data" v-if="proc_data[i - firstDayOfMonth - 1].length > 3">
                            {{ "+" + (proc_data[i - firstDayOfMonth - 1].length - 3) + " more..." }}
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../store/api"

export default {
    props: ["config"],
    data() {
        return {
            week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jal", "Aug", "Sep", "Oct", "Nov", "Dec"],
            date: new Date(),
            data: [],
            proc_data: [],
            clickId: 0
        }
    },
    watch: {
        "config.startTime": "init",
        "config.endTime": "init",
        "config.location": "init",
        "config.tags": "init",
    },
    computed: {
        monthIdx() {
            return this.date.getMonth()
        },
        year() {
            return this.date.getFullYear()
        },
        firstDayOfMonth() {
            const d = new Date(this.year, this.monthIdx, 1)
            return d.getDay()
        },
        daysInMonth() {
            return new Date(this.year, this.monthIdx + 1, 0).getDate()
        }
    },
    methods: {
        async init() {
            await this.getData(this.year, this.monthIdx)
        },
        async prev() {
            const m   = (12 + this.monthIdx - 1) % 12
            const y   = this.year - (this.monthIdx === 0 ? 1 : 0)
            this.date = new Date(y, m, 1)
            await this.getData(y, m)
        }, 
        async next() {
            const m   = (this.monthIdx + 1) % 12
            const y   = this.year + (this.monthIdx === 11 ? 1 : 0)
            this.date = new Date(y, m, 1)
            await this.getData(y, m)
        },
        inThisMonth(idx) {
            return idx >= this.firstDayOfMonth && idx - this.firstDayOfMonth < this.daysInMonth
        },
        isToday(d) {
            const now = new Date()
            return d === now.getDate() && this.monthIdx === now.getMonth() && this.year === now.getFullYear()
        },
        getDataOfDay() {
            this.proc_data = []
            for (let i = 1; i <= this.daysInMonth; i++) {
                const res = []
                this.data.forEach(d => {
                    if (i === d.day && this.monthIdx + 1 === d.month && this.year === d.year) {
                        res.push(d)
                    }
                })
                this.proc_data.push(res)
            }
        },
        show(date) {
            if (this.proc_data[date] !== undefined && this.proc_data[date].length > 0) {
                this.clickId = date
                this.$modal.show("day")
            }
        },
        async getData(year, month) {
            try {
                this.config.year  = year;
                this.config.month = month + 1;
                this.data = (await api.getData(this.config)).data.data
                this.getDataOfDay();
            } catch (e) {
                console.log(e)
            }
        }
    },
    async beforeMount() {
        await this.init()
    }
}
</script>

<style scoped>
.layout {
    margin: 2% 5% 2% 5%;
    width: 90%;
    height: 90%;
}

.month {
    height: 30px;
    margin-bottom: 20px;
}

.yearMonth {
    display: inline-block;
    width: 150px;
    font-size: 1.5em;
    margin-left: 15px;
    margin-right: 15px;
    text-align: center;
}

button {
    outline: none;
    width: 30px;
    height: 30px;
    border-radius: 15px;
    border-color: rgb(29, 181, 241);
    border-width: 1px;
    padding: 0;
}

.calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: 50px repeat(6, 1fr);
    width: 100%;
    height: 100%;
    background-color: rgb(219, 219, 219);
    grid-gap: 0;
}

.grid {
    border: 1px rgb(128, 128, 128) solid;
}

.week {
    display: grid;
    justify-self: stretch;
    align-self: stretch;
    justify-items: center;
    align-items: center;
    background-color: rgb(37, 154, 233);
    color: rgb(255, 255, 255);
}

.day {
    background-color: rgb(255, 255, 255);
}

.clickable:hover {
    cursor: pointer;
    background-color: rgba(219, 227, 255, 0.788);
}

.date {
    display: inline-block;
    margin-top: 5px;
    margin-left: 5px;
}

.today {
    color: red;
}

.data {
    color: rgb(65, 120, 236);
    margin-left: 5%;
    font-size: 12px;
    border-radius: 3px;
}
</style>
