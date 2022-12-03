/*
link to UI library:
https://semantic-ui.com/introduction/getting-started.html
Todo app!

Features:
* add things to a list (done)
* remove all items (done)
* remove a item (done)
* check off items (done)
* uncheck items (done)
* add a date to items (deadline) (done)
* group items (done)
* Trash can icon for deleting single Todo (done)
*/

let todos = []

async function onload() {
  let response = await axios.get('/api/todos')
  todos = response.data
  renderTodos()
}

onload()

// old code:

let currentTodo = document.querySelector('#todoInput')
let addTodo = document.querySelector('#todoAdder')
let ul = document.querySelector('ul')
let clearTodos = document.querySelector('#clear')

addTodo.addEventListener("click", adding)
currentTodo.addEventListener("keypress", addKeyboard )
clearTodos.addEventListener("click", clearAll)

let group = {
  'Urgent things': [],
  'Not important': [],
}

function addKeyboard (event) {
  if (event.code === 'Enter') {
    adding()
  }
}

async function adding () {

  let response = await axios.post('/api/todos', {
    todossees: currentTodo.value
  })

  todos = response.data
  renderTodos()

  todos = []
}

function createDropdownButton(todo) {

  let dropdownDiv = document.createElement('div')
  dropdownDiv.classList.add("ui", "dropdown", "simple")

  let addButton = document.createElement('button')
  addButton.classList.add("mini", "ui", "icon", "button")
  addButton.setAttribute('title', 'Group')
  
  let addIcon = document.createElement("i")
  addIcon.classList.add("plus", "square", "outline", "icon")
  addButton.appendChild(addIcon)

  dropdownDiv.appendChild(addButton)

  let menuDiv = document.createElement('div')
  menuDiv.classList.add('menu')
  dropdownDiv.appendChild(menuDiv)

  // get all the keys from group
  let groupNames = Object.keys(group)
  
  for (let groupName of groupNames) {
    let itemDiv = document.createElement('div')
    itemDiv.classList.add('item')
    itemDiv.innerHTML = groupName
    menuDiv.appendChild(itemDiv)
    itemDiv.addEventListener('click', addedToGroup)

    function addedToGroup() {
      for (let groupName of groupNames) {
        group[groupName] = group[groupName].filter(
          // keep everything that's not the current todo
          item => item.innerHTML !== todo.innerHTML
        )
      }
      group[groupName].push(todo)
      renderTodos()
    }
  }

  function removeFromGroup() {
    for (let groupName of groupNames) {
      group[groupName] = group[groupName].filter(
        item => item !== todo
      )
    }
    renderTodos()
  }
  
  let itemDiv = document.createElement('div')
  itemDiv.classList.add('item')
  itemDiv.innerHTML = 'Remove From Group'
  itemDiv.addEventListener('click', removeFromGroup)
  menuDiv.appendChild(itemDiv)

  return dropdownDiv
}


function makeTodo (todo) {
    let li = document.createElement("li")
    li.classList.add("listItem")

    async function completed (event) {
      let response = await axios.put(`/api/todos/toggle/${todo.id}`)
      todos = response.data
      renderTodos()
    }
    
    let checkbox = document.createElement("input")
    checkbox.setAttribute('type', 'checkbox')
    checkbox.addEventListener('change', completed)
    checkbox.checked = todo.done

    async function dateChange (event) {
      let body = {
        date: new Date(event.target.value)
      }
      let response = await axios.put(`/api/todos/date/${todo.id}`, body)
      todos = response.data
      renderTodos()
    }

    let date = document.createElement("input")
    date.setAttribute('type', 'date')
    date.addEventListener('change', dateChange)
    if (todo.date) {
      date.valueAsDate = new Date(todo.date)
    }
    

    li.appendChild(checkbox)
    let text = document.createElement('span')
    if (todo.done) {
      text.classList.add("completed")
    }
    text.innerHTML = todo.name
    li.appendChild(text)
    li.appendChild(date)

    async function deleteTodo() {
      let response = await axios.delete(`/api/todos/${todo.id}`)
      todos = response.data
      renderTodos()
    }

    let addtoGroup = createDropdownButton(li)
    li.appendChild(addtoGroup)
    
    let button = document.createElement("button")
    button.addEventListener('click', deleteTodo)
    button.classList.add("mini", "ui", "icon", "button")
    li.appendChild(button)
    
    let trash = document.createElement("i")
    trash.classList.add("trash", "alternate", "outline", "icon")
    button.appendChild(trash)

    

    return li
}

function renderTodos() {
  ul.innerHTML = ""
  for (let todo of todos) {
    let li = makeTodo(todo)
    ul.appendChild(li)
  }
}


function getUngroupedItems () {
  let listItems = document.querySelectorAll(".listItem")
  let savedItems = []

  for (let item of listItems) {
    let foundItem = false;
    let groupNames = Object.keys(group)
    
    for (let groupName of groupNames) {
       if (group[groupName].includes(item)) {
         foundItem = true;
         break
       }
    }

    if (!foundItem) {
      savedItems.push(item)
    }
  }
  
  return savedItems
}

async function clearAll () {
  let response = await axios.delete('/api/todos/all')
  todos = response.data
  ul.innerHTML = ""
}
