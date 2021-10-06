const express = require("express");
const morgan = require("morgan");

const app = express();
const host = "localhost";
const port = 3000;

let todoLists = require('./lib/seed-data');
const TodoList = require("./lib/todolist");

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

function sortTodoLists(lists) {
  let sortedTitles = (todoListA, todoListB) => {
    let titleA = todoListA.title.toLowerCase();
    let titleB = todoListB.title.toLowerCase();

    if (titleA < titleB) {
      return -1;
    } else if (titleA > titleB) {
      return 1;
    } else {
      return 0;
    }
  };

  let undone = lists.filter(todoList => !todoList.isDone());
  let done = lists.filter(todoList => todoList.isDone());

  undone.sort(sortedTitles);
  done.sort(sortedTitles);

  return [].concat(undone, done);
}

app.get("/", (req, res) => {
  res.redirect('/lists');
});

app.get('/lists', (req, res) => {
  res.render('lists', {
    todoLists: sortTodoLists(todoLists),
  })
});

app.get('/lists/new', (req, res) => {
  res.render('new-list');
});

app.post('/lists', (req, res) => {
  let title = req.body.todoListTitle.trim();
  todoLists.push(new TodoList(title));
  res.redirect('/lists');
});

// Listener
app.listen(port, host, () => {
  console.log(`Todos is listening on port ${port} of ${host}...`);
});