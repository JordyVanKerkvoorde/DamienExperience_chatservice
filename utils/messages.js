const moment = require('moment');

function formatMessage(user, text) {
    return {
        sender: {
            name: user.username,
            email: user.email
        },
        time: moment().format('HH:mm'),
        text,
    }
}

module.exports = formatMessage;