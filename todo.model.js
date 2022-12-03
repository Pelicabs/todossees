class TodoItem {
    constructor(input, group = null) {
        this.name = input
        this.date = null
        this.group = group
        this.done = false
        this.id = parseInt(Math.random()*1000000000)
    }
}

module.exports = TodoItem
