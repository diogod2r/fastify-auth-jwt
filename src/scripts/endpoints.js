import signin from '../routes/signin.js';
import auth from '../routes/auth.js';

export default [
    { method: 'POST', url: '/signin', handler: signin },
    { method: 'GET', url: '/auth', handler: auth },
];