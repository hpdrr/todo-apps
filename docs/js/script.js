
const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';


document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    // Mencegah behaviour event submit yg merefresh halaman saat di tekan
    event.preventDefault();

    // Memanggil fungsi addTodo
    addTodo();
  });

  // Menambah daftar Todo
  function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timeStamp = document.getElementById('date').value;

    const generateID = generateId();
    const todoObject = generateTodoObject(generateID, textTodo, timeStamp, false);
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  // Untuk menghasilkan id
  function generateId() {
    return +new Date();
  }

  // Untuk menghasilkan objek Todo
  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted
    }
  }

  //  Untuk menampilkan yang harus dilakukan
  function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimeStamp = document.createElement('p');
    textTimeStamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimeStamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    if (todoObject.isCompleted) {
      const undoButton = document.createElement('button');
      undoButton.classList.add('undo-button');

      undoButton.addEventListener('click', () => {
        undoTaskFromCompleted(todoObject.id);
      });

      const trashButton = document.createElement('button');
      trashButton.classList.add('trash-button');

      trashButton.addEventListener('click', () => {
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');

      checkButton.addEventListener('click', () => {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    return container;
  }

  //  Untuk memindahkan itemyang sudah selesai
  function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }

    return null;
  }

  // Untuk menghapus item dari yang sudah selesai
  function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  // Untuk batal menyelesaikan tugas
  function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }

    return -1;
  }

  // Untuk memasukkan input ke dalam web storage
  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  // Untuk mengecek dukungan web storage 
  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser yang Anda gunakan tidak mendukung web storage');
      return false;
    } else {
      return true;
    }
  }

  // Untuk menampilkan data dari storage
  function loadDataFormStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const todo of data) {
        todos.push(todo);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // Event handler
  document.addEventListener(RENDER_EVENT, () => {
    const unCompletedTODOList = document.getElementById('todos');
    unCompletedTODOList.innerHTML = '';

    const CompletedTODOList = document.getElementById('completed-todos');
    CompletedTODOList.innerHTML = '';

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) {
        unCompletedTODOList.append(todoElement);
      } else {
        CompletedTODOList.append(todoElement);
      }
    }
  });

  if (isStorageExist()) {
    loadDataFormStorage();
  }
});
