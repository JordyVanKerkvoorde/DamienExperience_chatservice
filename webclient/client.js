const chatForm = document.getElementById('chat-form');
const socket = io();

const username = 'Jordy';
const room = 'Jordy\'s Room';

socket.emit('join room', {username, room})

socket.on('chat message', message => {
    outputMessage(message);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    socket.emit('chat message', msg)
})

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

