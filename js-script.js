let $todoList = $('.to-do-list');
let $create = $('#create');
let $input = $('#title');

async function getTodos() {
    let todos = $.ajax({
        url: 'http://localhost:3000/todos',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType: "json",
        success: function (data) {
            return JSON.stringify(data);
        }
    });
    return todos;
}

function render(dataArray) {
    let listView = '';
    $.each(dataArray, function (obj, value) {
        let status = value.completed === false ? "in-progress" : "confirmed"
        listView += ` <li class="${status}" data-id="${value.id}" data-title="${value.title}" data-complited="${value.completed}"><span>${value.title}</span><button type="submit" id="delete">delete</button></li> `
    })
    
    $todoList.html(listView)
}

async function getTodosAndRender() {
    const data = await getTodos();
    render(data);
};
getTodosAndRender()

$create.on('click',async function addTodo(e) {
    
    e.preventDefault();
      
    $.ajax({
        url: 'http://localhost:3000/todos',
        type: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        dataType: "json",
        data: JSON.stringify({
                "title": $input.val(),
                "completed": false
                }),
        success: function (data) {
            $todoList.append(`<li class="in-progress" data-title="${$input.val()}" data-complited="false" data-id="${data.id}"><span>${$input.val()}</span><button type="submit" id="delete">delete</button></li>`)
            $input.val(' ')
        }
    });

})

$todoList.on('click', 'span', async function changeTodoList() {
        let $elemId = $(this).parent().attr('data-id');
        let $elemTitle = $(this).parent().attr('data-title');
        // console.log($elemId)


        $.ajax({
            url: 'http://localhost:3000/todos/'+$elemId,
            type: 'PUT',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            data: JSON.stringify({
                        "title": $elemTitle,
                        "completed": true
                    }),
        });

        $(this).addClass('confirmed')

})


$todoList.on('click', 'button', async function deleteTodo(e) {
    
    let $elemId = $(this).parent().attr('data-id');
    console.log($elemId)
    $.ajax({
        url: 'http://localhost:3000/todos/'+$elemId,
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        type: 'DELETE'
        
     });
     $(this).parent().remove()

})