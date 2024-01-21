---
title: JS数据类型判断
urlname: xihxbg
date: '2022-03-10 10:55:27'
updated: '2024-01-21 12:22:12'
description: 'function toType(obj) {   const reg = /^\[Object (.+)\]$/   if (obj == null) return obj + ''''   return typeof obj === ''object'' || typeof obj === ''fun...'
---
```javascript
function toType(obj) {
  const reg = /^\[Object (.+)\]$/
  if (obj == null) return obj + ''
  return typeof obj === 'object' || typeof obj === 'function'
    ? reg.test(Object.prototype.toString(obj))[1].toLowerCase()
    : typeof obj
}

```
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
```javascript
function isEmptyObject(obj) {
  if (obj == null || /^(object|function)$/.test(typeof obj)) return false
  let keys = Object.getOwnPropertyNames(obj)
  if (typeof Symbol !== 'undefined')
    keys = keys.concat(Object.getOwnPropertySymbols(obj))
  return keys.length === 0
}

```
