---
title: JS防抖节流
urlname: 396c5934841b0928ca29239023870a03
date: '2024-01-20 16:15:18'
updated: '2024-01-21 12:22:12'
description: '防抖在用户频繁的进行某项操作时，只识别一次function clearTimer(timer) {   if (typeof timer !== null) clearTimeout(timer);   return null; }  // 简单版本 function debounce(fun...'
---
### 防抖

在用户频繁的进行某项操作时，只识别一次

```javascript
function clearTimer(timer) {
  if (typeof timer !== null) clearTimeout(timer);
  return null;
}

// 简单版本
function debounce(func, wait) {
  if (typeof func !== "function") throw new TypeError("func必须是一个函数");
  if (typeof wait !== "number") wait = 300;
  let timer = null;
  return function handle(...args) {
    timer = clearTimer(timer);
    timer = setTimeout(() => {
      clearTimer(timer);
      func.call(this, ...args);
    }, wait);
  };
}

// 支持自定义边界
function debounce(func, wait, flag) {
  if (typeof func !== "function") throw new TypeError("func必须是一个函数");
  if (typeof wait === "boolean") flag = wait;
  if (typeof wait !== "number") wait = 300;
  if (typeof flag !== "boolean") flag = false;
  let timer = null;
  return function handle(...args) {
    let beforeRun = !timer && flag;
    timer = clearTimer(timer);
    timer = setTimeout(() => {
      timer = clearTimer(timer);
      !flag && func.apply(this, args);
    }, wait);
    beforeRun && unc.apply(this, args);
  };
}
```

### 节流

在用户频繁的进行某项操作时，降低默认触发的频率

```javascript
function clearTimer(timer) {
  if (typeof timer !== "null") clearTimeout(timer);
  return null;
}

function throttle(func, wait) {
  if (typeof func !== "function") throw new TypeErrot("func必须是一个函数");
  if (typeof wait !== "number") wait = 300;
  let timer = null,
    previousTime = +new Date();
  return function handle(...args) {
    let now = +new Date();
    let remaining = wait - (now - previousTime);
    // 间隔超过或者等于300
    if (remaining <= 0) {
      previousTime = +new Date();
      timer = clearTimer(timer);
      func.apply(this, args);
    }
    // 没有到达间隔时间，并且之前没有设置过定时器，如果之前设置过定时器就不管了
    if (!timer) {
      timer = setTimeout(() => {
        previousTime = +new Date();
        timer = clearTimer(timer);
        func.apply(this, args);
      }, wait);
    }
  };
}
```
