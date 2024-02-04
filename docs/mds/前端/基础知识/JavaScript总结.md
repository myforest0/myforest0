---
title: JavaScript总结
urlname: cglr9x
date: '2022-04-01 17:53:57'
updated: '2024-02-04 16:00:44'
description: JS事件循环JavaScript语言是一门单线程的非阻塞的脚本语言。为什么 JS 是一门单线程的语言？ 因为在浏览器中，需要对各种的DOM操作。当JS是多线程的话，如果有两个线程同时对同一个DOM进行操作，一个是在这个DOM上绑定事件，另外一个是删除该DOM，此时就会产生歧义。因此为了保证这种...
---
## JS事件循环
JavaScript语言是一门**单线程**的**非阻塞**的脚本语言。
### 为什么 JS 是一门单线程的语言？ 
因为在浏览器中，需要对各种的DOM操作。当JS是多线程的话，如果有两个线程同时对同一个DOM进行操作，一个是在这个DOM上绑定事件，另外一个是删除该DOM，此时就会产生歧义。因此为了保证这种事情不会发生，所以JS以单线程来执行代码，保证了一致性。
### JS 非阻塞应该如何理解？ 
当JS代码从上往下执行，遇到需要进行一项异步任务的时候，主线程会挂起这个任务，继续往下执行代码，然后在异步任务返回结果的时候再根据一定规则去执行。
### 非阻塞是如何实现的呢？
非阻塞需要用到事件循环（event loop） 
#### 事件循环
```javascript
// 同步任务
console.log('首次同步任务开始');

// 异步任务（宏任务）
setTimeout(() => {
  console.log('setTimeout 1');
  new Promise((resolve) => {
    console.log('Promise1');
    resolve();
  }).then(() => {
    console.log('Promise then 1');
  });
}, 1000);

// 同步任务
console.log('首次同步任务结束');

// 异步任务（微任务）
new Promise((resolve) => {
  console.log('Promise2');
  resolve();
}).then(() => {
  console.log('Promise then 2');
});
```

- 异步任务分类：宏任务（setTimeout），微任务（promise）。
- 所有同步任务都在主线程上执行，形成一个执行栈。
- 遇到异步任务放到任务表中，等事件执行完成（ajax请求完成、setTimeout设置时间到期），之后放入到任务队列。
- 当执行栈的同步任务执行完成之后，就会执行任务队列的第一个异步任务，其中把宏观任务和微观任务都执行完成后才进行下一次循环（先从微任务队列中取出微任务执行，微任务没有了再从宏任务队列中取出宏任务执行）。
## 深浅拷贝
深浅拷贝都是针对复杂类型数据才有的概念，基本类型数据不具备。
### 浅拷贝
两个引用类型指向同一个地址，改变一个，另一个也会随之改变 
```javascript
var c = { num: 18 };
var d = c;
c.num = 20;
console.log('c:', c, 'd:', d);
```
### 深拷贝 
复制后引用类型指向一个新的内存地址，两个对象改变互不影响 
```javascript
var c = { num: 18 };
var d = JSON.parse(JSON.stringify(c))
c.num = 20;
console.log('c:', c, 'd:', d);
```
### 连环问 
#### 基本类型数据的赋值是浅拷贝还是深拷贝？ 
赋值既不是深拷贝也不是浅拷贝，只是跟深拷贝是类似
#### 数组的方法：concat、slice是浅拷贝还是深拷贝？ 
```javascript
// concat、slice对一维数组来说是深拷贝，多维数组的话是浅拷贝

var a = [1, 2, 3];
var b = [4, 5];
var ab = a.concat(b);
a = [2, 3];

console.log(ab);
```
## 关键字new的作用
### 当没使用new关键字，直接调用构造函数时 
```javascript
// 构造函数内部的this指向的是window
function Student(obj) {
  this.name = obj.name;
  this.score = obj.score;
  this.grade = obj.grade;
  console.log(this);
}

var stu1 = Student({
  name: 'Jack',
  score: 88,
  grade: 3,
});
console.log(stu1); // window 并且给window添加了属性
```
### new 

1. 创建一个新的空对象
2. 将构造函数的作用域赋值给新对象(this指向新对象)
3. 执行构造函数代码（为这个新对象添加属性）
4. 返回新对象
```javascript
function Student(obj) {
  // this={};
  this.name = obj.name;
  this.score = obj.score;
  this.grade = obj.grade;
  // return this;
}
var a = new Student({ name: '1', score: '2', grade: '3' });
console.log(a);
```
## 原型链
### 原型（`prototype`） 
是function对象的一个属性，它定义了构造函数制造出的对象的公共祖先，通过该构造函数产生的对象，可以继承该原型的属性和方法，原型也是对象 。
```javascript
function Person() {}
Person.prototype.name = '大钊';
Person.prototype.a = function () {
  console.log(11);
};

var person1 = new Person();

console.log(person1.name);
person1.a();
```
#### 函数对象才有`prototype`属性。
#### `Object`和`Function`是两大基类。

- `Object.__proto__ === Function.__proto__`
- `Function.__proto__.__proto__ === Object.prototype`
### 作用 

- 构造函数实例化出来的对象可以使用公共的属性或者方法
### 原型链 

- js⾥万物皆对象，所以⼀直访问`__proto__`属性就会产⽣⼀条链条 
- 链条的尽头是null  (Object.prototype.`__proto__`) 
- 当js引擎查找对象的属性时，会先判断对象本身是否存在该属性 
- 不存在的属性就会沿着原型链往上找
```javascript
function Car() {}
Car.prototype.name = '大钊';
var car = new Car();
```
###  总结 

- 原型主要是解决继承问题
- 每个对象拥有一个原型对象，通过 `__proto__` 指针指向其原型对象，并从中继承方法和属性
- 同时原型对象也可能拥有原型，这样一层一层，最终指向 null（Object.proptotype.proto指向的是null）
- 上述的关系被称为原型链，通过原型链一个对象可以拥有定义在其他对象中的属性和方法
## 闭包
### 一个计数器，这也是一个闭包
```javascript
// 初始化计数器
var a = 0;

// 递增计数器的函数
function add() {
 a++;
 console.log(a)
}

// 调⽤三次 add()
add();
add();
add();
```
### 典型闭包使用场景
```javascript
function add() {
  var a = 0;
  return function adds() {
    a++;
    console.log(a);
  };
}

// 调⽤三次 add()
const xd = add();
xd();
xd();
xd();
```
### 总结

- 闭包是当前函数上下文引用了其他上下文中的变量，导致函数上下文不能出栈。
- 被引用的变量所在上下文在垃圾回收机制中不会被回收
- 闭包具有保护保存的作用
## **执行上下文**
JS代码被解析和执行时存在的环境（ECMAscript中定义的抽象概念）。
### 全局执行上下文 
声明在全局下的变量和函数所处的环境
### 函数执行上下文 
函数每次被调用都会创建新的执行上下文，可以存在任意数量的函数执行上下文
### `eval`函数执行上下文 
运行在eval函数中的执行上下文（用不到不做讨论）
### 生命周期
#### 创建阶段 

- 创建变量对象：初始化参数、提升函数声明和变量声明
   - 源代码 
```javascript
// 代码执行
console.log(hello);
fn();

// 函数定义
function fn() {
  console.log('你好');
}

// 变量定义
var hello = '你好世界！';
```

   - 编译后的代码 
```javascript
// 声明
function fn(){
	console.log('你好');
}
var hello

console.log(hello);
fn();

hello = '你好世界！';
```
#### 执行阶段 

- 进栈、代码自上而下执行
   - 变量赋值
   - 确定`this`指向 
#### 回收阶段 

- 执行上下文出栈，js自动执行垃圾回收机制。
## 作用域
可访问变量，对象，函数的集合。创建函数的时候就声明了它的`[[scope]]`(作用域)
### 全局作用域 
全局变量定义在函数外部，具有全局作用域。
### 函数作用域（局部作用域） 
局部变量定义在函数内部，具有局部作用域。
### 块级作用域（ES6的`let`、`const`） 
在 `{}` 中使用`ES6`的`let`、`const`方式声明，具有块级作用域。
```javascript
function A() {
  var a = 'a函数变量';

  function B() {
    var b = 'b函数变量';
  }
  B();
}

var c = '全局变量';
A();
```
#### 执行上下文和作用域有什么区别？

- 函数定义时，作用域就已经确认了，每次函数调用时与变量的访问有关， 并且每次调用都是独立的
- 而执行上下文主要是关键字`this`的值，这个是由函数运行时决定的，简单来说就是谁调用此函数，`this`就指向谁。
## `call`/`apply`/`bind`
三个方法都是改变this指向的
```javascript
const name = '张三';
const age = '18';
const obj1 = {
  name: '李四',
  fun: function (sex, hobby) {
    console.log(
      '名字:' +
        this.name + ' 年龄:' + this.age + ' 性别:' + sex + ' 爱好:' + hobby
    );
  },
};

const obj2 = {
  name: '王五',
  age: '19',
};

obj1.fun.call(obj2, '男', '敲代码');     // 名字:王五 年龄:19 性别:男 爱好:敲代码
obj1.fun.apply(obj2, ['男', '敲代码']);  // 名字:王五 年龄:19 性别:男 爱好:敲代码
obj1.fun.bind(obj2, '男', '敲代码')();   // 名字:王五 年龄:19 性别:男 爱好:敲代码
```
### 原理
整理中...
## JS回调地狱
为了实现某些逻辑会写出层层嵌套的回调函数，嵌套过多会影响代码的可读性和逻辑，当某个请求失败时难以定位问题，这情况被称为回调地狱。
```javascript
getData() {
  axios.get("./mock/data_a.json").then((res1) => {
    console.log(res1.data.code);
    axios.get("./mock/data_b.json").then((res2) => {
      console.log(res2.data.code);
      axios.get("./mock/data_c.json").then((res3) => {
        console.log(res3.data.code);
      });
    });
  });
},
```
### 通过`promise`解决
```javascript
function getData1(url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then((res1) => {
      if (res1.data.code <= 1) {
        resolve("成功");
      } else {
        reject("失败");
      }
    });
  });
}

this.getData1("./mock/data_a.json")
.then((res) => {
  console.log(res);
  return this.getData1("./mock/data_b.json");
})
.then((res) => {
  console.log(res);
  return this.getData1("./mock/data_c.json");
})
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
});
```
### `Promise.all` / `Promise.race`
```javascript
function getData1(url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then((res1) => {
      // if (res1.data.code <= 1) {
      resolve(res1.data.code);
      // } else {
      //   reject("失败");
      // }
    });
  });
}

Promise.all([
  this.getData1("./mock/data_a.json"),
  this.getData1("./mock/data_b.json"),
  this.getData1("./mock/data_c.json"),
])
.then((res) => {
  console.log(res);
})
.catch((err) => {
  console.log(err);
});
```
### `async`/`await`解决`promise`链式调用不够优雅的问题
```javascript
async getData2() {
  try {
    const res1 = await this.getData1("./mock/data_a.json");
    const res2 = await this.getData1("./mock/data_b.json");
    const res3 = await this.getData1("./mock/data_c.json");
    console.log(res1, res2, res3);
  } catch (err) {
    console.log("err:", err);
  }
}
```
### `promise`原理
整理中...
## ES6语法
### `let `/`const`

- `let`、`const `
   - `let`/`const`声明的变量只有在当前作用域有效`{}`
   - 不存在变量提升
   - 不允许重复声明
- `const `
   - 声明的常量不可以改变
   - 声明的常量必须赋值
   - 声明了一个对象，仅仅保证地址不变
1. 声明的变量不需要改变，那么使用const
2. 声明的变量需要改变，那么用let
3. 暂时性死区：在声明变量前，使用该变量
### 模板字符串````
它为JavaScript提供了简单的字符串插值（模板字面量）功能。
```javascript
let name = "小明"
let age = '18'
console.log('大家好，我是'+ name + '今年' + age);
console.log(`大家好, 我是${name}今年${age}`);
```
### 箭头函数
```javascript
function fun1(a, b) {        
  return a + b  
}
var fun2 = (a, b) => a + b;     
console.log(fun1(1, 2));       
console.log(fun2(3, 4)); 
```
### 解构赋值
#### 数组
```javascript
let [a, b, c] = [1, 2, 3];
```
#### 对象
```javascript
let {name,age} = {name:'小明',age:18}
console.log(name,age)//小明,18
```
#### 扩展运算符`...`
```javascript
console.log(...[1, 2, 3]) //1 2 3
console.log(1, ...[2, 3, 4], 5)  //1 2 3 4 5
```
## 防抖与节流
整理中...
## 设计模式
### 单例模式
```javascript
class Car {
  constructor(name) {
    this.name = name;
  }
  drive() {
    console.log('启动');
  }
}

Car.singleInstance = (function () {
  let instance;
  return function (name) {
    if (!instance) {
      instance = new Car(name);
    }
    return instance;
  };
  })();
var benchi = Car.singleInstance('benchi');
var baoma = Car.singleInstance('baoma');
```
### 工厂模式
```javascript
function createCar(name,age){
   var obj = {}
   obj.brand = name,
   obj.color = age,
   obj.sayHelllo = function(){
    console.log('你好，世界')
  }
  return obj;
}

const car1 = createCar('宝马','白色')
const car2 = createCar('奔驰','黑色')
```
### 发布订阅模式
整理中...
### 观察者模式
整理中...
## Http协议
### CS架构
客户机-服务器模式，即Client-Server(C/S)结构但是缺少通用性，系统维护、升级需要重新设计和开发，增加了维护和管理的难度。
### BS架构
B/S架构即浏览器和服务器架构模式，是WEB兴起后的一种网络架构模式WEB浏览器是客户端最主要的应用软件统一了客户端，将系统功能实现的核心部分集中到服务器上，简化了系统的开发、维护和使用。
### URL（统⼀资源定位符，获取服务器资源的一种）
标准格式: `协议://服务器IP:端⼝/路径1/路径N?key1=value1&key2=value2`

- 协议：不同的协议有不同的解析⽅式
- 服务器ip: ⽹络中存在⽆数的主机,要访问的哪⼀台, 通过公⽹ip区分
- 端⼝: ⼀台主机上运⾏着很多的进程，为了区分不同进程，⼀个端⼝对应⼀个进程，http默认的端⼝是80
- 路径: 资源N多种，为了更进⼀步区分资源所在的路径（后端接⼝，⼀般称为 “接⼝路径”，“接⼝”）
### Http超文本传输协议
即超⽂本传送协议，是Web联⽹的基础，也是⼿机PC联⽹常⽤的协议之⼀，HTTP协议是建⽴在TCP协议之上的⼀种应⽤<br />HTTP连接最显著的特点是客户端发送的每次请求都需要服务器响应请求，从建⽴连接到关闭连接的过程称为“⼀次连接”<br />HTTP请求-HTTP响应
### 响应码： 

- 2xx: 成功 200 OK，请求正常
- 3xx: 重定向
- 4xx: 客户端错误<br />404 Not Found服务器⽆法找到被请求的⻚⾯
- 5xx: 服务器错误 503 Service Unavailable，服务器挂了或者不<br />可⽤
### 发展历史

- `http0.9 -> http1.0 -> http1.1 -> http2.0`
- 优化协议，增加更多功能 
### http和https协议的主要区别

- https协议需要CA证书，费用较高；http协议不需要
- http协议是超文本传输协议，信息是明文传输的，https则是具有安全性的SSL加密传输协议
- 使用的连接方式不同，端口也不同，http协议端口是80，https协议端口是443
- http协议连接很简单，是无状态的；https协议是有SSL和 TLS协议构建的可进行加密传输、身份认证的网络协议，比http更加安全
### https优点

- https协议可认证用户和服务器，确保数据发送到正确的客户机和服务器
- https协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，要比HTTP协议安全，可防止数据在传输过程中不被窃取、改变，确保数据的完整性
- https是现行架构下最安全的解决方案，虽然不是绝对安全，但它大幅增加了中间人攻击的成本
## 超文本传输协议Http消息体拆分
### Http请求消息结构 （请求的报文）
#### 请求行 

- 请求方法
- URL地址
- 协议名
#### 请求头 

- 报文头包含若干个属性 格式为“属性名:属性值”，
- 服务端据此获取客户端的基本信息
#### 请求体 

- 请求的参数，可以是json对象，也可以是前端表单生成的`key=value&key=value`的字符串
### Http响应消息结构（响应的报文）
#### 响应行 

- 报文协议及版本、状态码
#### 响应头 

- 报文头包含若干个属性 格式为“属性名:属性值”
#### 响应正文 

- 响应报文体，我们需要的内容，多种形式比如html、json、图片、视频文件等
## Http常见响应状态码HttpCode
浏览器向服务器请求时，服务端响应的消息头里面有状态码，表示请求结果的状态。
### 分类
#### 1XX 

-  100 收到请求，需要请求者继续执行操作，比较少用 
-  101 切换请求的协议 
#### 2XX: 请求成功，常用的 200 
#### 3XX: 重定向，浏览器在拿到服务器返回的这个状态码后会自动跳转到一个新的URL地址，这个地址可以从响应的Location首部中获取；

- 好处：网站改版、域名迁移等，多个域名指向同个主站导流 
- 301：永久性跳转，比如域名过期，换个域名
- 302：临时性跳转304：数据已经在客户端缓存，不需要请求更多的数据 
#### 4XX: 客服端出错，请求包含语法错误或者无法完成请求

- 400: 请求出错，比如语法协议（比如参数错误）
- 403: 没权限访问
- 404: 找不到这个路径对应的接口或者文件
- 405: 不允许此方法进行提交，Method not allowed，比如接口一定要POST方式，而你是用了GET
#### 5XX: 服务端出错，服务器在处理请求的过程中发生了错误 

- 500: 服务器内部报错了，完成不了这次请求
- 503: 服务器宕机
## http常见请求头
http请求分为三部分：请求行，请求头， 请求体
### 请求头

- 报文头包含若干个属性 格式为“属性名:属性值”，
- 服务端据此获取客户端的基本信息
### 常见的请求头

- Accept： 浏览器支持的 MIME 媒体类型, 比如 text/html,application/json,image/webp,_/_ 等
- Accept-Encoding: 浏览器发给服务器，声明浏览器支持的编码类型，gzip, deflate
- Accept-Language: 客户端接受的语言格式，比如 zh-CN
- Connection: keep-alive，开启HTTP持久连接，复用传输通道
- Host：服务器的域名
- Origin：告诉服务器请求从哪里发起的，仅包括协议和域名CORS跨域请求中可以看到response有对应的header，Access-Control-Allow-Origin
- Referer：告诉服务器请求的原始资源的URI，其用于所有类型的请求，并且包括：协议+域名+查询参数；很多抢购服务会用这个做限制，必须通过某个入口进来才有效
- User-Agent: 服务器通过这个请求头判断用户的软件的应用类型、操作系统、软件开发商以及版本号、浏览器内核信息等；风控系统、反作弊系统、反爬虫系统等基本会采集这类信息做参考
- Cookie: 表示服务端给客户端传的http请求状态,也是多个key=value形式组合，比如登录后的令牌等
- Content-Type：HTTP请求提交的内容类型，一般只有post提交时才需要设置，浏览器把form数据封装到请求体中（key=value形式），然后发送到服务器，比如文件上传，表单提交等
## Http响应头
报文头包含若干个属性 格式为“属性名:属性值”。
### 常见的响应头

- Allow: 服务器支持哪些请求方法
- Content-Length: 响应体的字节长度
- Content-Type: 响应体的MIME类型
- Content-Encoding: 设置数据使用的编码类型
- Date: 设置消息发送的日期和时间
- Expires: 设置响应体的过期时间,一个GMT时间，表示该缓存的有效时间
- cache-control: Expires的作用一致，都是指明当前资源的有效期, 控制浏览器是否直接从浏览器缓存取数据还是重新发请求到服务器取数据,优先级高于Expires,控制粒度更细，如max-age=3600，即一个小时
- Location：表示客户端应当到哪里去获取资源，一般同时设置状态代码为3xx
- Server: 服务器名称
- Transfer-Encoding：chunked 表示输出的内容长度不能确定，静态网页一般没有，基本出现在动态网页里面
- Access-Control-Allow-Origin: 定哪些站点可以参与跨站资源共享
## 浏览器网络请求链路
常见问题：你知道浏览器输入url后经历了哪些流程？<br />整理中...
## 前端性能优化
思路：先确认前端性能影响最大的问题。
### 网络连接速度
#### CDN
#### DNS预解析
```html
<link rel="dns-prefecth" href="https://xdclass.net">
```
#### 持久连接
```
connection: keep-alive
```
### 网络请求数量
#### 文件合并（webpack）
#### 图片处理

- 雪碧图
- base64
#### 使用缓存
### 资源文件的体积
#### 压缩
#### 开启gzip
### 资源加载
#### 加载位置

- css文件放在head中
- js文件放在body结束标签前
#### 加载时机

- 异步script标签加载，设置defer、async
### webpack优化
#### 打包公共代码
#### 动态导入
#### 长缓存优化 

- chunkhash
- contenthash
## CDN内容分发网络
CDN（内容分发网络）是通过互联网互相连接的电脑网络系统，利用最靠近每位用户的服务器，更快、更可靠地将资源文件（音乐、图片、视频、应用程序）发送给用户，来提供高性能、低成本的网络内容传递给用户，提高请求的速度。
### 作用

- 将数据快速可靠的从源服务站传递到用户端
- 通过CDN，用户可以不直接从源站获取，选择一个较优的服务器获取数据，做到快速访问，减少源站负载压力
- 其他作用
   - 监控
   - 统计分析
   - 用量查询
   - 刷新预热
   - 日志分析
### 工作原理
#### 未使用CDN缓存资源

- 浏览器通过DNS对域名进行解析，得到域名对应的IP地址
- 浏览器根据得到的IP地址，向域名的服务主机发送数据请求
- 服务器向浏览器返回响应数据
#### 使用CDN缓存资源

- 用户发起域名的请求，DNS服务器将域名解析交给CDN
- CDN将负载均衡的ip地址返回给用户
- 请求地址，负载均衡设备选择一台最优的缓存服务器（边缘节点服务器）提供访问
   - 根据用户的ip地址，距离用户最近的服务器
   - 根据URL携带的内容，选择有所需内容的服务器
   - 选择负载最小的服务器
- 用户发出请求，缓存服务器返回数据
- 如果缓存服务器没有缓存用户的请求内容，则会向上一级缓存服务器请求，直到访问网站的源服务器
### 回源率（拓展知识点）
```
回源率 =（CDN没缓存 + 缓存过期 + 不可缓存的请求）/ 全部的请求
```
回源率越低代表请求的性能越好。
## 懒加载
懒加载也叫做延迟加载、按需加载，在非首屏展示的组件或者数据可以使用懒加载。
### 特点

- 减小接口请求个数，页面的渲染负担
- 提高首页的展示速度，提升用户体验
- 防止加载过多图片而影响其他资源文件的加载
### 实现
#### 通过 import() 方法引入组件
```javascript
import(./test.js).then(({fun})=>{fun()})

()=>import('./Test')
```
#### 通过监听用户的滚动事件触发来展示非首屏的图片 
### 懒加载和预加载的区别

- 懒加载也叫延迟加载，指的是在网页中延迟加载图片的时机，当用户需要访问时，再去加载，可以提高网站的首屏加载速度，提升用户的体验
- 预加载指的是将所需的资源提前请求加载到本地，这样后面在需要用到时就直接从缓存取资源，通过预加载能够减少用户的等待时间，提高用户的体验
### 非首屏的内容延时渲染实现
```javascript
// 定义一个异步的函数，当用户滑动时则不延时
const delayMS = (ms) => {
  const p = new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  // 如果用户开始滑动，则取消延期
  const onTouchPromise = new Promise((resolve) => {
    const handler = function () {
      window.removeEventListener('touchstart', handler);
      resolve();
    };
    window.addEventListener('touchstart', handler);
  });
  return Promise.race([p, onTouchPromise]);
};

// 引用

delayMS(2000).then(() => {
  console.log(333); // 控制非首屏dom节点的渲染
});
```
## 图片优化
### 如何对项目图片进行优化。
#### 图片可以使用  CDN 加载，通过CDN地址获取 
#### 图片比较小的使用webpack压缩成 base64 格式，减小项目文件体积 
```javascript
{
  test: /\.(png|gif|jpe?g)$/i,
  type: 'asset',              
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024,
    },
  },
  generator: {
    filename: 'images/[name][ext]',
  },
},
```
#### icon尽量使用svg图片和字体图片，减小项目文件体积 
## webpack优化
### webpack抽离公共文件
将多个页面重复引入的模块抽离成公共的模块，避免重复打包，减少包体积。
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
  },
},
```
## 可视化工具
### 安装
```bash
cnpm install webpack-bundle-analyzer -D
```
### 配置
```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [new BundleAnalyzerPlugin()]
}
```
