import axois from "axios"
import config from "./config.json"

const client = axois.create(config)

export default {
    getData: (constrain) => {
        return client.post("/data/", constrain)
    },
    getLocation: () => {
        return client.get("/data/location")
    },
    getTags: () => {
        return client.get("/data/tags")
    },
    crawling: () => {
        return client.get("/crawler")
    }
}