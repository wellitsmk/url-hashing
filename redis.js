const { createClient } = require('redis')

const client = createClient();

client.on('error', (err) => console.log('\x1b[31m%s\x1b[0m', 'Redis Client Error', err));

client.connect().then(e => console.log('\x1b[32m%s\x1b[0m', 'Redis connected'))

const get = (key) => client.get(key);
const set = (key, value) => client.set(key, value);
const expire = (key, expiresIn) => client.expireat(key, expiresIn);
const del = (keys) => client.del(keys);

module.exports = {
    client, get, set, expire, del
}

