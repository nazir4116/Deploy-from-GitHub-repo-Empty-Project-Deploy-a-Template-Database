const { customAlphabet } = require('nanoid');

const alphabet = '0123456789';
const length = parseInt(process.env.CODE_LENGTH, 10) || 6;

const generateCode = customAlphabet(alphabet, length);

module.exports = generateCode;
