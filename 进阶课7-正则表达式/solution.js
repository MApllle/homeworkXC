//匹配富文本中的<h1>标签，并给该标签添加一个样式<h1 class=“tag”>
let str = "<h1>hello test</h1><h2>hello test</h2>";
let reg = /<h1>(.*?)<\/h1>/g;
let result = str.replace(reg, '<h1 class="tag">$1</h1>');
console.log(result);


//let str = "select * from XXX where field_name1=$param.paramName and field_name2=$global._ID";
//将如上sql语句中的$param.paramName和$global._ID参数替换为vicent 和 11
let str2 = "select * from XXX where field_name1=$param.paramName and field_name2=$global._ID";
let regg1 = /\$param\.paramName/g;
let regg2 = /\$global\._ID/g;
let result2 = str2.replace(regg1, "vicent").replace(regg2, "11");
console.log(result2);

//谈谈Regexp.exec()和matchAll()的区别
/*
1. exec是RegExp类的方法,和matchAll是String类的方法
2. exec在字符串中执行一次正则表达式匹配，并返回匹配结果。如果找到匹配项，它将返回一个结果数组，
    其中第一个元素是匹配到的字符串，之后的元素是捕获组中的匹配内容。如果没有找到匹配项，它将返回 null。
    在没有设置g修饰符时，Regexp.exec()总是会将正则表达式的 lastIndex 重置为 0。
    当正则表达式设置 g 标志位时，可以多次执行 exec 方法来查找同一个字符串中的成功匹配。在这种情况下，将会在每次调用 exec 方法时会更新 lastIndex 属性。
3. matchAll是字符串对象的方法。它执行一个全局正则表达式匹配，并返回一个迭代器(需要使用扩展运算符（[...iterable]）或循环来将迭代器转换为数组或逐个处理匹配项)，
    如果正则表达式没有设置全局（g）标志，会触发异常。
4. 简单来说，exec用于单次匹配并返回结果，如果想要匹配全部结果，需要借助循环实现，
    matchAll则可以一次返回所有匹配的结果，方便处理多个匹配项。
*/
