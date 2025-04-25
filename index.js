var plusOne = function (digits) {
    let str = digits.join('')
    console.log(str, 'str')
    const num = parseInt(str) + 1
    console.log('num is', num)
    const arr = num.toString().split('').map(Number)
    return arr
};

const arr = plusOne([6, 1, 4, 5, 3, 9, 0, 1, 9, 5, 1, 8, 6, 7, 0, 5, 5, 4, 3])
console.log(arr)