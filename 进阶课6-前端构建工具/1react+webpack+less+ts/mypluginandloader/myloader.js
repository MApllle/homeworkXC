// 注意：同步和异步都不能用箭头函数方式，因为会改变this指向为undefined
module.exports = function (source) {
    const content = source.replace("ATESTLOADERSTRING", "this is a test loader string.");
    return content;
}
