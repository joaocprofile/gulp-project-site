/*
* Cool Calc 
*/

const Calc = {
    _result: 0,
    get result() {
        return this._result
    },
    clear(){
        this._result = 0
        return this
    },
    log(){
        console.log(`Result of operation:  ${this._result}`)
    },
    sum(value1, value2 = 0){
        const lSum = value1 + value2
        this._result += lSum
        return this
    },
    sub(value1, value2){
        const lSum = value1 - value2
        this._result += lSum
        return this
    },
    pow(value1, value2){
        const lPow = value2 ** value2
        this._result += lPower
        return this
    }
}