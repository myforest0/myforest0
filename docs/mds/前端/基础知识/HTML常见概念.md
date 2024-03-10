---
title: HTML常见概念
urlname: mri1c6
date: '2022-04-01 11:33:15'
updated: '2024-02-04 15:58:58'
description: src和href的区别srcsrc用于替换当前元素，href用于在当前文档和引用资源之间确立联系。src是source的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求src资源时会将其指向的资源下载并应用到文档内，例如js脚本，img图片和frame等元素。<sc...
---
## src和href的区别
### src
`src`用于替换当前元素，`href`用于在当前文档和引用资源之间确立联系。<br />`src`是`source`的缩写，指向外部资源的位置，指向的内容将会嵌入到文档中当前标签所在位置；在请求`src`资源时会将其指向的资源下载并应用到文档内，例如js脚本，`img`图片和`frame`等元素。
```html
<script src ="js.js"></script>
```
当浏览器解析到该元素时，会暂停其他资源的下载和处理，直到将该资源加载、编译、执行完毕，图片和框架等元素也如此，类似于将所指向资源嵌入当前标签内。这也是为什么将js脚本放在底部而不是头部。
### href
`href`是`Hypertext Reference`的缩写，指向网络资源所在位置，建立和当前元素（锚点）或当前文档（链接）之间的链接，如果我们在文档中添加
```html
<link href="common.css" rel="stylesheet"/>
```
那么浏览器会识别该文档为css文件，就会并行下载资源并且不会停止对当前文档的处理。这也是为什么建议使用`link`方式来加载`css`，而不是使用`@import`方式。
## link标签和script标签的引⽤位置
常见问题： 为什么引⽤CSS的link标签放在头部，引⽤JS的script标签放在body结束标签之前？  
### link标签放在head标签中 

- ⽤户访问⽹站时，代码是从上往下解析的，正常展示⻚⾯内容的样式，提⾼⽤户体验 
- 放在 html 结构底部时，加载⻚⾯会出现 html 结构混乱的情况 
### script标签放在body结束标签之前

- JS脚本在下载和执⾏期间会阻⽌ html 解析 
- 把 script 标签放在底部，保证 html和css ⾸先完成解析之后再加载 JS 脚本 
- script 标签加上 defer 属性时，可以放在 head 标签中 （async）  
```html
<script defer ></script>
```
## 提高网站搜索权重
SEO优化、HTML语义化
### SEO优化

-  设置⽹站的 title 标题标签，如：  
```html
<title>在这里写入标题</title>
```

-  设置⽹站的 description 描述标签，如：  
```html
<meta name="Description" content="小程序提供了一个简单、高效的应用开发框架和丰富的组件及API，帮助开发者在微信中开发具有原生 APP 体验的服务。" />
```

-  设置⽹站的 keywords 关键词标签，如：  
```html
<meta name="keywords" content="Shilin的备忘录,html&#x2F;css&#x2F;JavaScript,前端工程师,Vue,React,Node.js">
```
### HTML语义化

- 使⽤正确的标签引⽤正确的内容 
- 增强可读性，结构更加清晰，便于对浏览器、搜索引擎解析 
- 搜索引擎的爬⾍也依赖于 HTML 标记来确定上下⽂和各个关键字的权重，利于 SEO 
```
header、footer、a、p、ul、ol、li、h1、h2、h3...  
```
## 设置移动端视口大小
常见问题：如何在不同移动设备的屏幕下正常展示网页的内容？
### viewport
#### 定义
手机浏览器会把页面放⼊到⼀个虚拟的视⼝（viewpoint）中，但 viewport ⼜不局限于浏览器可视区域的大小，它可能比浏览器的可视区域大，也可能比浏览器的可视区域小。通常这个虚拟的视口（viewport）比屏幕宽，会把网页挤到⼀个很小的窗口。
#### 使用
```html
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no" />
```
#### 属性
| 属性 | 描述 |
| --- | --- |
| width | 设置viewport的宽度 |
| height | 设置viewport的高度 |
| initial-scale | 设置页面的初始缩放值 |
| minimum-scale | 允许用户的最⼩缩放值  |
| maximum-scale | 允许用户的最⼤缩放值  |
| user-scalable | 是否允许用户进行缩放，no 代表不允许，yes代表允许 |

## DOM、BOM的区别与使用
### DOM
#### 定义 

- DOM就是⽂档对象模型，是⼀个抽象的概念 
- 定义了访问和操作HTML⽂档的⽅法和属性  
#### 使用

- 查找节点  
```javascript
document.getElementById("xd")
```

- 改变元素
```javascript
document.getElementById("xd").innerHTML = '<h1>xdclass.net</h1>';
```

- 创建元素
```javascript
document.createElement('h1')
```
### BOM
#### 定义

- BOM就是浏览器对象模型 
- 内置对象定义操作浏览器的⽅法  
#### 使用

- window
```javascript
window.alert('你好，世界')
```

- screen 
```javascript
console.log(window.screen.width)
```

- location
```javascript
window.location.href
```

- localStorage 
```javascript
window.localStorage.setItem(key, value)
```

- history
```javascript
window.history.go(1)
```
