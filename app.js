let ws = '';
try {
    ws = new WebSocket("wss://chat-app-model.herokuapp.com/");  
} catch (error) {
    console.log(error)
}

//ws://192.168.225.52:8080
let Username="";

if(!localStorage.getItem('usernameOfChat')){
    localStorage.setItem('usernameOfChat', '');
}
else{
    document.querySelector('.user').remove('active');
    document.querySelector('.overlay').remove('active');
}

function AddUser() {
    const name = document.querySelector('#userName').value
    
    if(name == "" || name.length<3){
        alert("Enter valid name")
    }
    else{
        const obj = {
            username:name,
            protocol:'register'
        }
        ws.send(JSON.stringify(obj));
        Username = name;
        //localStorage.setItem('usernameOfChat', '');

        document.querySelector('.user').remove('active');
        document.querySelector('.overlay').remove('active');
    }
}

try {
    ws.addEventListener('open', (chat)=>{

        if(chat.type == 'open'){
            document.querySelector('.parentoverlay').remove('active')
        }
        else{
            alert("Failed")
        }
        
    })  
} catch (error) {
    alert("Failed")
}


ws.addEventListener('message', e => {
    console.log(e.data)
    const chat = JSON.parse(e.data);
    if(chat.protocol == 'chat' && Username == chat.username){
        AppendMyMsg(chat.msg);
    }
    else if(chat.protocol == 'chat')
        AppendOtherMsg(chat)
    else if(chat.protocol=='push-notification')
        Notify_push(chat)

    let divv = document.querySelector('.chats');
    divv.scrollTop = divv.scrollHeight
})

function HandleMsg() {
    const msg = document.querySelector('#msg').value;
    const obj = {
        username:Username,
        protocol:'chat',
        msg: msg
    }
    ws.send(JSON.stringify(obj));
    document.querySelector('#msg').value="";
    let divv = document.querySelector('#msg');
    divv.focus();
}

function AppendOtherMsg(chat) {
    let elem = document.createElement('pre')
    elem.textContent = chat.msg;

    let nameOfSender = document.createElement('p')
    nameOfSender.textContent = chat.username;

    let div = document.createElement('div');
    div.setAttribute('class', 'other');
    div.appendChild(nameOfSender)
    div.appendChild(elem)

    document.querySelector('.chats').append(div)
}

function AppendMyMsg(msg) {

    let elem = document.createElement('pre')
    elem.textContent = msg

    let div = document.createElement('div');
    div.setAttribute('class', 'mine');
    div.appendChild(elem)

    document.querySelector('.chats').append(div)
}

function Notify_push(chat) {
    let elem = document.createElement('p')
    elem.textContent = chat.msg;

    let div = document.createElement('div');
    div.setAttribute('class', 'note');
    div.appendChild(elem)

    document.querySelector('.chats').append(div)
}

