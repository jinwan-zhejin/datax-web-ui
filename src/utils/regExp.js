//常用正则方法

//匹配字段名，表名
//由数字、26个英文字母或者下划线组成的字符串
export function testTableName(str){
    const reg = /^\w+$/;
    return reg.test(str);
}
