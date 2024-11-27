interface Todo {
    id: number;
    title: string;
    image: string;
    completed: boolean;
  }
  

  const elForm = document.querySelector<HTMLFormElement>(".todo-form")!;
  const elList = document.querySelector<HTMLUListElement>(".todo-list")!;
  const elAllBtn = document.querySelector<HTMLButtonElement>(".all-btn")!;
  const elCompletedBtn = document.querySelector<HTMLButtonElement>(".completed-btn")!;
  const elUncompletedBtn = document.querySelector<HTMLButtonElement>(".uncompleted-btn")!;
  

  let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || "[]");
  let filter: 'all' | 'completed' | 'uncompleted' = 'all';
  
  renderTodos(todos);
  

  elForm.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
  
    const form = e.currentTarget as HTMLFormElement;
    const inputValue = form.userTodo.value; 
    const imageFile = (form.todoImage as HTMLInputElement).files?.[0];
  
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageUrl = event.target?.result as string;
        addTodo(inputValue, imageUrl);
      };
      reader.readAsDataURL(imageFile);
    } else {
      addTodo(inputValue, "");
    }
  
    form.reset();
    saveTodos();
    const imagePreviewDiv = document.getElementById('imagePreview')!;
    imagePreviewDiv.classList.add('hidden');
  });
  
  // Add part
  function addTodo(title: string, imageUrl: string) {
    const data: Todo = {
      id: todos.length + 1,
      title,
      image: imageUrl,
      completed: false,
    };
    todos.push(data);
    saveTodos();
    renderTodos(todos);
  }
  

  function renderTodos(arr: Todo[]) {
    elList.innerHTML = "";
  
    const filteredTodos = arr.filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'uncompleted') return !todo.completed;
      return true;
    });
  
    filteredTodos.forEach((item, index) => {
      const elItem = document.createElement("li");
      elItem.className = `flex items-center justify-between bg-slate-300 p-2 rounded-md`;
  
      elItem.innerHTML = `
        <div class="flex items-center justify-between gap-[8px]">
          <img src="${item.image}" class="max-w-[100px] mt-2 rounded-md">
          <span>${index + 1}.</span>
          <strong>${item.title}</strong>
          <input type="checkbox" ${item.completed ? "checked" : ""} onclick="handleToggleComplete(${item.id})">
          <span class="text-[10px] ${item.completed ? "line-through opacity-[50%] cursor-not-allowed" : ""}">Complete</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="handleUpdateTodo(${item.id})" class="bg-blue-500 text-white font-semibold p-2 inline-block rounded-md">Update</button>
          <button onclick="handleDeleteTodo(${item.id})" class="bg-red-500 text-white font-semibold p-2 inline-block rounded-md">Delete</button>
        </div>
      `;
      elList.appendChild(elItem);
    });
  
    elAllBtn.lastElementChild!.textContent = arr.length.toString();
    elCompletedBtn.lastElementChild!.textContent = arr.filter(item => item.completed).length.toString();
    elUncompletedBtn.lastElementChild!.textContent = arr.filter(item => !item.completed).length.toString();
  
    saveTodos();
  }
  

  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  
  // Delete part
  function handleDeleteTodo(id: number) {
    todos = todos.filter(item => item.id !== id);
    saveTodos();
    renderTodos(todos);
  }
  

  function handleUncompletedClickBtn() {
    filter = 'uncompleted';
    renderTodos(todos);
  }
  
  function handleCompletedClickBtn() {
    filter = 'completed';
    renderTodos(todos);
  }
  
  function handleAllClickBtn() {
    filter = 'all';
    renderTodos(todos);
  }
  
  // Update part
  function handleUpdateTodo(id: number) {
    const findObj = todos.find(item => item.id === id);
    if (!findObj) return;
    
    const elNewValue = prompt("Update your todo:", findObj.title);
    if (elNewValue) {
      findObj.title = elNewValue;
      saveTodos();
      renderTodos(todos);
    }
  }
  

  function handleToggleComplete(id: number) {
    const findObj = todos.find(item => item.id === id);
    if (findObj) {
      findObj.completed = !findObj.completed;
      saveTodos();
      renderTodos(todos);
    }
  }
  
  // Delete all
  function handleDeleteAllClickBtn() {
    if (confirm("Hammasini o'chirishingizga aminmisiz?")) {
      todos = [];
      saveTodos();
      renderTodos(todos);
    }
  }
  
  // Image part
  function showImagePreview(event: Event) {
    const imageInput = event.target as HTMLInputElement;
    const imagePreviewDiv = document.getElementById('imagePreview')!;
    const selectedImage = document.getElementById('selectedImage') as HTMLImageElement;
  
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        selectedImage.src = e.target?.result as string;
        imagePreviewDiv.classList.remove('hidden');
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      imagePreviewDiv.classList.add('hidden');
    }
  }