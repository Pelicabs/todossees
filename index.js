const express = require("express")
const api = require("./todoAPI")

const app = express()
app.use(express.static('client'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/todos", api)

// req = request, res = response
app.get('/', (req, res) => {
    res.sendFile('client/index.html', { root: __dirname })
})

app.listen(3000, () => {
    console.log('server started on port 3000')
})

 