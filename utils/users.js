const { cpuUsage } = require("process");

const users = [];

// Join user to chat
function userJoin(id, username, email, room){
    const user = {id, username, email, room};
    users.push(user);
    return user;
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

function getRoomUsers(room){
    users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};