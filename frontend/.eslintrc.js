module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "plugin:vue/essential",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-console": 0,
        "css/css-semicolonexpected": 0,
        "css/css-ruleorselectorexpected": 0,
        "vue/no-side-effects-in-computed-properties": 0,
        "vue/no-parsing-error": 0
    }
};