
module.exports = function () {
    var arr = ['12345', '23456', '34567', '45678']
    // 0123
    // Math.random()的取值范围是0---1 0能取到 1取不到的
    // 0.999999999*4  3.999999
    var index = Math.floor(Math.random() * arr.length)

    return arr[index];
}