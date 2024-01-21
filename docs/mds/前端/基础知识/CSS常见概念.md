---
title: CSS常见概念
urlname: wrw545
date: '2022-04-01 16:21:09'
updated: '2024-01-21 12:22:12'
description: 'CSS选择器以及优先级样式优先级最近的祖先样式⽐其他祖先样式优先级高 直接样式⽐祖先样式优先级⾼ 选择器优先级内联样式 > id选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器组合选择符 分类 后代选择符： .a .b{} 子级选择符： .a > .b{}...'
---
## CSS选择器以及优先级
### 样式优先级

- 最近的祖先样式⽐其他祖先样式优先级高 
- `直接样式`⽐`祖先样式`优先级⾼ 
- 选择器优先级
```
内联样式 > id选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器
```

   - 组合选择符 
      - 分类 
         - 后代选择符：` .a .b{} `
         - 子级选择符：` .a > .b{} `
         - 相邻选择符：` .a + .b {} `
      - 选择符优先级
         1. 计算id选择器的个数（a）
         2. 计算类选择器、属性选择器、伪类选择器的个数（b） 
         3. 计算标签选择器、伪元素选择器的个数（c）
         - 对⽐a、b、c的个数，相等则⽐较下⼀个 
         - 若都相等，则按照“就近原则”⽐较  
-  属性后⾯加`!important` 拥有最⾼优先级，若两个样式都有此设置，则对⽐选择器优先级
## 标准的CSS盒子模型以及低版本盒子模型异同
### 盒子模型
#### 定义
由内容 `content` + 内边距 `padding` + 边框 `border` + 外边距 `margin` 构成，盒⼦的宽⾼由 `content` + `padding` + `border` 决定，但是不同的盒⼦模型的计算依据不⼀样，分为：标准盒模型（w3c）和 怪异盒模型（IE）
#### 标准盒模型
宽⾼包含 `content` + `padding` + `border`
#### 怪异盒模型
宽⾼只包含 `content`
#### 盒模型设置
```css
box-sizing: content-box // 标准盒模型
box-sizing: border-box // 怪异盒模型
```
## 块级格式化上下文
BFC：块级格式化上下文（Block Formatting Context）
### 什么是块级格式化上下文

- BFC就是块级格式化上下⽂ 
- 是页面盒模型布局中的⼀种 CSS 渲染模式，相当于⼀个独⽴的容器，里面的元素和外部的元素相互不影响
### BFC的特性

- 内部的盒⼦会按照垂直⽅向⼀个个排列 
- 同⼀个 BFC 下的相邻块级元素会发生外边距折叠，创建新的 BFC 包含其中⼀个元素可以避免（解决外边距重叠）
- 设置了 BFC 的区域不会和浮动元素重叠（解决浮动元素覆盖）
- 当 BFC 中有浮动元素时，该浮动元素的高度也会被计算其中（解决⾼度塌陷）
### 如何触发BFC

- 设置float浮动
- overflow的值是hidden、auto或者scroll，⽽不是visible
- position 的值为 absolute 或 fixed
- display 的值为 table | inline-block | flex | grid
## CSS实现三栏布局的几种方式
### 三栏布局 

- ⽅案⼀： flex布局 
- ⽅案⼆： 浮动+margin 
- ⽅案三： 浮动+BFC
## CSS的预处理器
### 什么是预处理器？ 

- 定义了专⻔的编程语言，增加了编程的特性，生成CSS⽂件
- CSS代码更加简洁、适应性更强、可读性更佳，更易于代码的维护等
### 常见的css预处理器 

- less 
- sass 
- stylus
### 区别 

- 三种预处理器的使⽤语法都基本⼀致 
- 变量、嵌套、运算符、颜⾊函数、导⼊、继承等 
- stylus的写法会特别点，⽐如：不需要加括号 
### 预处理器的能力

- 嵌套反映层级和约束
- 变量和计算减少重复代码
- extend和mixin代码片段
- 循环适用于复杂有规律的样式
- import css文件模块化
## 水平垂直居中 
### 利用flex弹性盒子 
```css
.a{
	display:flex
  justify-content:center;
  align-items:center
}
```
### 利用margin与定位
```css
.a{
	position: relative;
}

.b{
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
}
```
### 利用position定位实现
```css
.a{
	position:relative;
}
.b{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);  // 未知宽高
  margin-top:-50px;		// 已知宽高
  margin-left:-50px;	// 已知宽高
}
```
## CSS移动端的适配
### 第一步设置页面视口 
```html
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```
### 第二步配置rem单位 
#### 安装postcss-pxtorem，自动将 px 转换成 rem 单位的插件 
```bash
cnpm install postcss-pxtorem@5.1.1 -S
```
#### 安装amfe-flexible，自动检测当前设备屏幕宽度serveWidth，设置html里面的font-szie为serveWidth/10 
```bash
cnpm install amfe-flexible -S
```
####  文件配置 
```javascript
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({ rootValue: 37.5 }), // 假设设计图尺寸375
        ],
      },
    },
  },
};
```
```javascript
// main.js
import 'amfe-flexible';
```
## 剖析重绘和重排
###  重绘 

- 当元素的外观、背景、颜色等改变，浏览器会根据元素的新属性重新绘制，使元素呈现新的外观叫做重绘
###  重排 

- 当渲染树一部分或者全部因为大小或者边距而改变，需要渲染树重新计算的过程叫做重排
- 重绘不一定需要重排，重排必然导致重绘
###  避免 

- 在元素的显示隐藏上尽量用 opacity 替代 visibility（重绘）
- 元素定位时使用 transform 代替top、left（重排）
- 尽量不使用 table 布局，因为一个小的改动会造成整个 table 重新布局（重排）
- 减少直接操作DOM元素（重排）
- 为元素添加类，样式都在类中改变（重绘）
- 分离读写操作，连续写读会导致直接重绘
## 剖析flex布局
flex布局强大，能够实现多种布局方案，兼容性好，而且使用简单
### 使用方式
```css
/* 设置父元素 */
display:flex

/* 定义水平方向对齐方式 */
justify-content: flex-start | flex-end | center | space-between | space-around;

/* 定义垂直方向对齐方式 */
align-items: flex-start | flex-end | center | baseline | stretch;

/* 定义多个轴线（多行/多列）对齐方式 */
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```
```css
/* 设置子项目 */
/* flex: 1 等价于以下设置 */
flex-grow: 1; 	 /* 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大 */
flex-shrink: 1;  /* 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。*/
flex-basis: 0%;  /* 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。 */
```
### 注意事项（坑）

- 父元素设置了flex布局，默认会给每个子元素开启缩小属性（flex-shrink:1;）
- 当空间不够时，其他的元素会被挤压至隐藏
- 设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。
