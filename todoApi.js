const { Router } = require("express")
const TodoItem = require("./todo.model")

const router = Router()

let database = [
    new TodoItem('beat video game'),
    new TodoItem('grocery shopping'),
    new TodoItem('do homework', 'Important'),
    new TodoItem('win volleyball game', 'Important'),
]

database[0].id = 0
database[0].done = true
database[1].id = 1
database[1].date = new Date().toString()
database[2].id = 2
database[3].id = 3


router.get('/', (req, res) => {
    res.json(database)
})

router.post('/', (req, res) => {
    // req.body.name
    let newItem = new TodoItem(req.body.todossees)
    database.push(newItem)
    res.json(database)
})

// DELETE /api/todos/all
router.delete('/all', (req, res) => {
    database = []
    res.json(database)
})

// DELETE api/todos/1
router.delete('/:id', (req, res) => {
    let tempID = parseInt(req.params.id)
    for (i = 0; i < database.length; i++) {
        if (database[i].id === tempID) {
            database.splice(i, 1)
        }
    }
    res.json(database)
})

router.put('/toggle/:id', (req,res) => {
    let tempID = parseInt(req.params.id)
    for (i = 0; i < database.length; i++) {
        if (database[i].id === tempID) {
          database[i].done = !database[i].done
        }
    }
    res.json(database)
})

router.put('/date/:id', (req,res) => {
    let tempID = parseInt(req.params.id)
    let newDate = req.body.date
    for (i = 0; i < database.length; i++) {
        if (database[i].id === tempID) {
          database[i].date = newDate
        }
    }
    res.json(database)
})


/*Features:
* group items (done)
* Trash can icon for deleting single Todo (done)
* Get todos/access todos
*/

module.exports = router
