const crypto = require('crypto');

module.exports.sha = function(password, key = "happy-lucky"){
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(password);
    const passwordHmac = hmac.digest('hex');
    return passwordHmac;
}