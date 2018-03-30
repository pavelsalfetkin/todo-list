// получим доступ к DOM-элементам
const todoForm = document.getElementById('todo-form'); // форма
const addInput = document.getElementById('add-input'); // поле где будет название задачи
const todoList = document.getElementById('todo-list'); // список задачь
const headButton = document.getElementById('head-button'); // кнопка edit в шапке темы
const noteCount = document.getElementById('note-count'); // счетчик заметок
const todoItems = document.querySelectorAll('.todo-item'); // список всех задачь <li>
const listName = document.getElementById('list-name'); // название списка


// добавить новую заметку
const addTodoItem = (event) => {
	event.preventDefault(); // изменит стандартное поведение формы и остановит отправку данных на сервер
	if (addInput.value === '') return alert('Введите текст новой заметки!'); // проверка на пустое поле
	const todoItem = createTodoItem(addInput.value); // создадим новый элемент передав значение в функцию
	todoList.appendChild(todoItem);
	addInput.value = '';
};


// создаст объект заметки для хранилища
const createNoteObject = (id, title, state) => {
	let noteObject = new Object();
	noteObject.id = id;
	noteObject.note = title;
	noteObject.state = state;
	return noteObject;
};


// создаст id для ключа заметки
const createNoteId = () => {
	let noteId = new Date();
	const noteIdTime = noteId.getTime();
	return noteIdTime;
};


// создает новую заметку
const createTodoItem = (title) => {

	const noteIdTime = createNoteId();
	
	const createTodoItemObject = () => {
		const checkbox = document.createElement('input'); // создадим элемент <input>
		checkbox.type = 'checkbox'; // присвоим ему значение type = "checkbox"
		checkbox.className = 'checkbox'; // присвоим class = "checkbox"
		checkbox.setAttribute('title', 'Изменить статус');

		const label = document.createElement('label');
		label.innerText = title;
		label.className = 'title';
		label.setAttribute('id', noteIdTime);

		const editInput = document.createElement('input');
		editInput.type = 'text';
		editInput.className = 'textfield';

		const editButton = document.createElement('button');
		editButton.innerText = '/';
		editButton.className = 'edit';
		editButton.setAttribute('title', 'Изменить');

		const deleteButton = document.createElement('button');
		deleteButton.innerText = '×';
		deleteButton.className = 'delete';
		deleteButton.setAttribute('title', 'Удалить');

		const listItem = document.createElement('li');
		listItem.className = 'todo-item';

		listItem.appendChild(checkbox);
		listItem.appendChild(label);
		listItem.appendChild(editInput);
		listItem.appendChild(editButton);
		listItem.appendChild(deleteButton);

		listenEvents(listItem);
		
		// сохраняем заметку в хранилище
		localStorage.setItem(noteIdTime, JSON.stringify(createNoteObject(noteIdTime, title, checkbox.checked)));
		// console.log(localStorage.getItem(noteIdTime));

		return listItem;
	};

	return createTodoItemObject(title);
};


// добавить прослушку событий для всех <li> на функциональные кнопки: чекбокс, изменить, удалить
const listenEvents = (todoItem) => {
	const checkbox = todoItem.querySelector('.checkbox');
	const editButton = todoItem.querySelector('button.edit');
	const deleteButton = todoItem.querySelector('button.delete');

	checkbox.addEventListener('change', toggleTodoItem);
	editButton.addEventListener('click', editTodoItem);
	deleteButton.addEventListener('click', deleteTodoItem);
};


// чекбокс, остледит с какого чекбокса пришло событие
const toggleTodoItem = (checkboxDetected) => {
	const listItem = checkboxDetected.target.parentNode; // найдет нужный <li>
	const title = listItem.querySelector('.title');
	listItem.classList.toggle('completed'); // добавит к нужному <li> ксасс "completed"

	let checkboxState = listItem.querySelector('.checkbox').checked;
	
	// хранилище
	let noteId = listItem.querySelector('.title').id;
	let parseNote = JSON.parse(localStorage.getItem(noteId));
	checkboxState ? parseNote.state = checkboxState : parseNote.state = checkboxState;
	localStorage.setItem(noteId, JSON.stringify(createNoteObject(noteId, title.innerText, checkboxState)));
	// console.log(`id: ${noteId} add state: ${checkboxState}`);
};


// изменит текст заметки
const editTodoItem = (editDetected) => {
	const listItem = editDetected.target.parentNode;
	const title = listItem.querySelector('.title');
	const editInput = listItem.querySelector('.textfield');
	const isEditing = listItem.classList.contains('editing');
	let checkboxState = listItem.querySelector('.checkbox').checked;

	if (isEditing) {
		title.innerText = editInput.value;
		editDetected.target.innerText = '/';

		// хранилище
		let noteId = listItem.querySelector('.title').id;
		let parseNote = JSON.parse(localStorage.getItem(noteId));
		localStorage.setItem(noteId, JSON.stringify(createNoteObject(noteId, title.innerText, checkboxState)));
		// console.log(`id: ${noteId} edited`);
	} else {
		editInput.value = title.innerText;
		editDetected.target.innerText = 'ok';
	}

	listItem.classList.toggle('editing');
};


// удалит заметку <li> из списка <ul>
const deleteTodoItem = (deleteDetected) => {
	const listItem = deleteDetected.target.parentNode;
	todoList.removeChild(listItem);
	
	// хранилище
	let noteId = listItem.querySelector('.title').id;
	localStorage.removeItem(noteId);
	// console.log(`id: ${noteId} removed`);
};


// альтернативная запись - аналог this
// const deleteTodoItem = ({ target }) => {
// 	const listItem = target.parentNode;
// 	todoList.removeChild(listItem);
// };


// изменит текст заголовка списка дел
// const headTopic = (editDetected) => {
// 	const listItem = editDetected.target.parentNode; // получаем доступ к родителю
// 	const title = listItem.querySelector('.header_center_head_title'); // лэйбл
// 	const editInput = listItem.querySelector('.header_center_head_textfield'); // инпут
// 	const isEditing = listItem.classList.contains('editing'); // проверка есть ли у элемента класс

// 	if (isEditing) {
// 		title.innerText = editInput.value;
// 		editDetected.target.innerText = '/';
// 		// хранилище
// 		localStorage.setItem(topId, title.innerText);
// 	} else {
// 		editInput.value = title.innerText;
// 		editDetected.target.innerText = 'ok';
// 	}

// 	listItem.classList.toggle('editing'); // присвоит класс editing
// };


// считает кол-во заметок <li>
const noteCountFunction = () => noteCount.innerText = todoList.childElementCount;


// вытаскиваем заметки из хранилища
const loadLocalStorage = () => {

	const createTodoItemObject = (title, id, state) => {
		const checkbox = document.createElement('input'); // создадим элемент <input>
		checkbox.type = 'checkbox'; // присвоим ему значение type = "checkbox"
		checkbox.className = 'checkbox'; // присвоим class = "checkbox"
		checkbox.checked = state; // установит состояние
		checkbox.setAttribute('title', 'Изменить статус');

		const label = document.createElement('label');
		label.innerText = title;
		label.className = 'title';
		label.setAttribute('id', id);

		const editInput = document.createElement('input');
		editInput.type = 'text';
		editInput.className = 'textfield';

		const editButton = document.createElement('button');
		editButton.innerText = '/';
		editButton.className = 'edit';
		editButton.setAttribute('title', 'Изменить');

		const deleteButton = document.createElement('button');
		deleteButton.innerText = '×';
		deleteButton.className = 'delete';
		deleteButton.setAttribute('title', 'Удалить');

		const listItem = document.createElement('li');
		listItem.className = 'todo-item';

		listItem.appendChild(checkbox);
		listItem.appendChild(label);
		listItem.appendChild(editInput);
		listItem.appendChild(editButton);
		listItem.appendChild(deleteButton);

		listenEvents(listItem);
	
		state ? listItem.classList.toggle('completed') : '';

		return listItem;
	};

	if (localStorage.length !== 0) {
		console.log('Storage Not Empty');
		for (var count = 0; count < localStorage.length; count++) {
			todoList.appendChild(createTodoItemObject( JSON.parse(localStorage.getItem(localStorage.key(count))).note, localStorage.key(count), JSON.parse(localStorage.getItem(localStorage.key(count))).state ));
			addInput.value = '';
		}
	} else {
		console.log('Storage Empty');
	}
};


// самовызывающаяся анонимная функция
(() => {
	todoForm.addEventListener('submit', addTodoItem); // ловим событие от формы - submit и добавляем новую заметку
	todoItems.forEach(item => listenEvents(item)); // слушать события от каждого <li>
	// headButton.addEventListener('click', headTopic); // ловит события из шапки заметок
	loadLocalStorage(); // загрузит заметки из хранилища
	setInterval(noteCountFunction, 1000); // запустит счетчик заметок
})();