---
title: JS数据类型判断
urlname: xihxbg
date: '2022-03-10 10:55:27'
updated: '2024-01-21 14:05:02'
description: '检测数据类型function toType(obj) {   const reg = /^\[Object (.+)\]$/   if (obj == null) return obj + ''''   return typeof obj === ''object'' || typeof obj ==...'
---
### 检测数据类型
```javascript
function toType(obj) {
  const reg = /^\[Object (.+)\]$/
  if (obj == null) return obj + ''
  return typeof obj === 'object' || typeof obj === 'function'
    ? reg.test(Object.prototype.toString(obj))[1].toLowerCase()
    : typeof obj
}

```
### 检测是否为标准普通对象
```javascript
function isPlainObject(obj) {
  let proto, Ctor
  if (!obj || Object.prototype.toString.call(obj) !== '[object Object]')
    return false
  proto = Object.getPrototypeOf(obj)
  if (!proto) return true
  Ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor
  return typeof Ctor === 'function' && Ctor === Object
}

```
### 检测是否为空对象
```javascript
function isEmptyObject(obj) {
  if (obj == null || /^(object|function)$/.test(typeof obj)) return false
  let keys = Object.getOwnPropertyNames(obj)
  if (typeof Symbol !== 'undefined')
    keys = keys.concat(Object.getOwnPropertySymbols(obj))
  return keys.length === 0
}

```
