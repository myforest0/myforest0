import{_ as s,c as i,o as a,V as l}from"./chunks/framework.DKx8iHFh.js";const g=JSON.parse('{"title":"CSS常见概念","description":"CSS选择器以及优先级样式优先级最近的祖先样式⽐其他祖先样式优先级高 直接样式⽐祖先样式优先级⾼ 选择器优先级内联样式 > id选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器组合选择符 分类 后代选择符： .a .b{} 子级选择符： .a > .b{}...","frontmatter":{"title":"CSS常见概念","urlname":"wrw545","date":"2022-04-01 16:21:09","updated":"2024-02-04 15:59:53","description":"CSS选择器以及优先级样式优先级最近的祖先样式⽐其他祖先样式优先级高 直接样式⽐祖先样式优先级⾼ 选择器优先级内联样式 > id选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器组合选择符 分类 后代选择符： .a .b{} 子级选择符： .a > .b{}..."},"headers":[],"relativePath":"mds/前端/基础知识/CSS常见概念.md","filePath":"mds/前端/基础知识/CSS常见概念.md"}'),n={name:"mds/前端/基础知识/CSS常见概念.md"},h=l(`<h2 id="css选择器以及优先级" tabindex="-1">CSS选择器以及优先级 <a class="header-anchor" href="#css选择器以及优先级" aria-label="Permalink to &quot;CSS选择器以及优先级&quot;">​</a></h2><h3 id="样式优先级" tabindex="-1">样式优先级 <a class="header-anchor" href="#样式优先级" aria-label="Permalink to &quot;样式优先级&quot;">​</a></h3><ul><li>最近的祖先样式⽐其他祖先样式优先级高</li><li><code>直接样式</code>⽐<code>祖先样式</code>优先级⾼</li><li>选择器优先级</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>内联样式 &gt; id选择器 &gt; 类选择器 = 属性选择器 = 伪类选择器 &gt; 标签选择器 = 伪元素选择器</span></span></code></pre></div><ul><li>组合选择符 <ul><li>分类 <ul><li>后代选择符：<code>.a .b{}</code></li><li>子级选择符：<code>.a &gt; .b{}</code></li><li>相邻选择符：<code>.a + .b {}</code></li></ul></li><li>选择符优先级 <ol><li>计算id选择器的个数（a）</li><li>计算类选择器、属性选择器、伪类选择器的个数（b）</li><li>计算标签选择器、伪元素选择器的个数（c）</li></ol><ul><li>对⽐a、b、c的个数，相等则⽐较下⼀个</li><li>若都相等，则按照“就近原则”⽐较</li></ul></li></ul></li><li>属性后⾯加<code>!important</code> 拥有最⾼优先级，若两个样式都有此设置，则对⽐选择器优先级</li></ul><h2 id="标准的css盒子模型以及低版本盒子模型异同" tabindex="-1">标准的CSS盒子模型以及低版本盒子模型异同 <a class="header-anchor" href="#标准的css盒子模型以及低版本盒子模型异同" aria-label="Permalink to &quot;标准的CSS盒子模型以及低版本盒子模型异同&quot;">​</a></h2><h3 id="盒子模型" tabindex="-1">盒子模型 <a class="header-anchor" href="#盒子模型" aria-label="Permalink to &quot;盒子模型&quot;">​</a></h3><h4 id="定义" tabindex="-1">定义 <a class="header-anchor" href="#定义" aria-label="Permalink to &quot;定义&quot;">​</a></h4><p>由内容 <code>content</code> + 内边距 <code>padding</code> + 边框 <code>border</code> + 外边距 <code>margin</code> 构成，盒⼦的宽⾼由 <code>content</code> + <code>padding</code> + <code>border</code> 决定，但是不同的盒⼦模型的计算依据不⼀样，分为：标准盒模型（w3c）和 怪异盒模型（IE）</p><h4 id="标准盒模型" tabindex="-1">标准盒模型 <a class="header-anchor" href="#标准盒模型" aria-label="Permalink to &quot;标准盒模型&quot;">​</a></h4><p>宽⾼包含 <code>content</code> + <code>padding</code> + <code>border</code></p><h4 id="怪异盒模型" tabindex="-1">怪异盒模型 <a class="header-anchor" href="#怪异盒模型" aria-label="Permalink to &quot;怪异盒模型&quot;">​</a></h4><p>宽⾼只包含 <code>content</code></p><h4 id="盒模型设置" tabindex="-1">盒模型设置 <a class="header-anchor" href="#盒模型设置" aria-label="Permalink to &quot;盒模型设置&quot;">​</a></h4><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">box-sizing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">content-box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 标准盒模型</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">box-sizing</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">border-box</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 怪异盒模型</span></span></code></pre></div><h2 id="块级格式化上下文" tabindex="-1">块级格式化上下文 <a class="header-anchor" href="#块级格式化上下文" aria-label="Permalink to &quot;块级格式化上下文&quot;">​</a></h2><p>BFC：块级格式化上下文（Block Formatting Context）</p><h3 id="什么是块级格式化上下文" tabindex="-1">什么是块级格式化上下文 <a class="header-anchor" href="#什么是块级格式化上下文" aria-label="Permalink to &quot;什么是块级格式化上下文&quot;">​</a></h3><ul><li>BFC就是块级格式化上下⽂</li><li>是页面盒模型布局中的⼀种 CSS 渲染模式，相当于⼀个独⽴的容器，里面的元素和外部的元素相互不影响</li></ul><h3 id="bfc的特性" tabindex="-1">BFC的特性 <a class="header-anchor" href="#bfc的特性" aria-label="Permalink to &quot;BFC的特性&quot;">​</a></h3><ul><li>内部的盒⼦会按照垂直⽅向⼀个个排列</li><li>同⼀个 BFC 下的相邻块级元素会发生外边距折叠，创建新的 BFC 包含其中⼀个元素可以避免（解决外边距重叠）</li><li>设置了 BFC 的区域不会和浮动元素重叠（解决浮动元素覆盖）</li><li>当 BFC 中有浮动元素时，该浮动元素的高度也会被计算其中（解决⾼度塌陷）</li></ul><h3 id="如何触发bfc" tabindex="-1">如何触发BFC <a class="header-anchor" href="#如何触发bfc" aria-label="Permalink to &quot;如何触发BFC&quot;">​</a></h3><ul><li>设置float浮动</li><li>overflow的值是hidden、auto或者scroll，⽽不是visible</li><li>position 的值为 absolute 或 fixed</li><li>display 的值为 table | inline-block | flex | grid</li></ul><h2 id="css实现三栏布局的几种方式" tabindex="-1">CSS实现三栏布局的几种方式 <a class="header-anchor" href="#css实现三栏布局的几种方式" aria-label="Permalink to &quot;CSS实现三栏布局的几种方式&quot;">​</a></h2><h3 id="三栏布局" tabindex="-1">三栏布局 <a class="header-anchor" href="#三栏布局" aria-label="Permalink to &quot;三栏布局&quot;">​</a></h3><ul><li>⽅案⼀： flex布局</li><li>⽅案⼆： 浮动+margin</li><li>⽅案三： 浮动+BFC</li></ul><h2 id="css的预处理器" tabindex="-1">CSS的预处理器 <a class="header-anchor" href="#css的预处理器" aria-label="Permalink to &quot;CSS的预处理器&quot;">​</a></h2><h3 id="什么是预处理器" tabindex="-1">什么是预处理器？ <a class="header-anchor" href="#什么是预处理器" aria-label="Permalink to &quot;什么是预处理器？&quot;">​</a></h3><ul><li>定义了专⻔的编程语言，增加了编程的特性，生成CSS⽂件</li><li>CSS代码更加简洁、适应性更强、可读性更佳，更易于代码的维护等</li></ul><h3 id="常见的css预处理器" tabindex="-1">常见的css预处理器 <a class="header-anchor" href="#常见的css预处理器" aria-label="Permalink to &quot;常见的css预处理器&quot;">​</a></h3><ul><li>less</li><li>sass</li><li>stylus</li></ul><h3 id="区别" tabindex="-1">区别 <a class="header-anchor" href="#区别" aria-label="Permalink to &quot;区别&quot;">​</a></h3><ul><li>三种预处理器的使⽤语法都基本⼀致</li><li>变量、嵌套、运算符、颜⾊函数、导⼊、继承等</li><li>stylus的写法会特别点，⽐如：不需要加括号</li></ul><h3 id="预处理器的能力" tabindex="-1">预处理器的能力 <a class="header-anchor" href="#预处理器的能力" aria-label="Permalink to &quot;预处理器的能力&quot;">​</a></h3><ul><li>嵌套反映层级和约束</li><li>变量和计算减少重复代码</li><li>extend和mixin代码片段</li><li>循环适用于复杂有规律的样式</li><li>import css文件模块化</li></ul><h2 id="水平垂直居中" tabindex="-1">水平垂直居中 <a class="header-anchor" href="#水平垂直居中" aria-label="Permalink to &quot;水平垂直居中&quot;">​</a></h2><h3 id="利用flex弹性盒子" tabindex="-1">利用flex弹性盒子 <a class="header-anchor" href="#利用flex弹性盒子" aria-label="Permalink to &quot;利用flex弹性盒子&quot;">​</a></h3><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	display</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">flex</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  justify-content:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  align-items</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">center</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="利用margin与定位" tabindex="-1">利用margin与定位 <a class="header-anchor" href="#利用margin与定位" aria-label="Permalink to &quot;利用margin与定位&quot;">​</a></h3><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">relative</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  margin</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">auto</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  left</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  bottom</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  right</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">absolute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h3 id="利用position定位实现" tabindex="-1">利用position定位实现 <a class="header-anchor" href="#利用position定位实现" aria-label="Permalink to &quot;利用position定位实现&quot;">​</a></h3><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">	position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">relative</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">absolute</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  left</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  transform</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">translate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">-50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">-50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);  // 未知宽高</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  margin-top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">-50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;		// 已知宽高</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  margin-left</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">-50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;	// 已知宽高</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="css移动端的适配" tabindex="-1">CSS移动端的适配 <a class="header-anchor" href="#css移动端的适配" aria-label="Permalink to &quot;CSS移动端的适配&quot;">​</a></h2><h3 id="第一步设置页面视口" tabindex="-1">第一步设置页面视口 <a class="header-anchor" href="#第一步设置页面视口" aria-label="Permalink to &quot;第一步设置页面视口&quot;">​</a></h3><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">meta</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> name</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;viewport&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> content</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><h3 id="第二步配置rem单位" tabindex="-1">第二步配置rem单位 <a class="header-anchor" href="#第二步配置rem单位" aria-label="Permalink to &quot;第二步配置rem单位&quot;">​</a></h3><h4 id="安装postcss-pxtorem-自动将-px-转换成-rem-单位的插件" tabindex="-1">安装postcss-pxtorem，自动将 px 转换成 rem 单位的插件 <a class="header-anchor" href="#安装postcss-pxtorem-自动将-px-转换成-rem-单位的插件" aria-label="Permalink to &quot;安装postcss-pxtorem，自动将 px 转换成 rem 单位的插件&quot;">​</a></h4><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> postcss-pxtorem@5.1.1</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -S</span></span></code></pre></div><h4 id="安装amfe-flexible-自动检测当前设备屏幕宽度servewidth-设置html里面的font-szie为servewidth-10" tabindex="-1">安装amfe-flexible，自动检测当前设备屏幕宽度serveWidth，设置html里面的font-szie为serveWidth/10 <a class="header-anchor" href="#安装amfe-flexible-自动检测当前设备屏幕宽度servewidth-设置html里面的font-szie为servewidth-10" aria-label="Permalink to &quot;安装amfe-flexible，自动检测当前设备屏幕宽度serveWidth，设置html里面的font-szie为serveWidth/10&quot;">​</a></h4><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">cnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> amfe-flexible</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -S</span></span></code></pre></div><h4 id="文件配置" tabindex="-1">文件配置 <a class="header-anchor" href="#文件配置" aria-label="Permalink to &quot;文件配置&quot;">​</a></h4><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// vue.config.js</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  css: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    loaderOptions: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      postcss: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        plugins: [</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">          require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;postcss-pxtorem&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)({ rootValue: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">37.5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> }), </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 假设设计图尺寸375</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// main.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;amfe-flexible&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="剖析重绘和重排" tabindex="-1">剖析重绘和重排 <a class="header-anchor" href="#剖析重绘和重排" aria-label="Permalink to &quot;剖析重绘和重排&quot;">​</a></h2><h3 id="重绘" tabindex="-1">重绘 <a class="header-anchor" href="#重绘" aria-label="Permalink to &quot;重绘&quot;">​</a></h3><ul><li>当元素的外观、背景、颜色等改变，浏览器会根据元素的新属性重新绘制，使元素呈现新的外观叫做重绘</li></ul><h3 id="重排" tabindex="-1">重排 <a class="header-anchor" href="#重排" aria-label="Permalink to &quot;重排&quot;">​</a></h3><ul><li>当渲染树一部分或者全部因为大小或者边距而改变，需要渲染树重新计算的过程叫做重排</li><li>重绘不一定需要重排，重排必然导致重绘</li></ul><h3 id="避免" tabindex="-1">避免 <a class="header-anchor" href="#避免" aria-label="Permalink to &quot;避免&quot;">​</a></h3><ul><li>在元素的显示隐藏上尽量用 opacity 替代 visibility（重绘）</li><li>元素定位时使用 transform 代替top、left（重排）</li><li>尽量不使用 table 布局，因为一个小的改动会造成整个 table 重新布局（重排）</li><li>减少直接操作DOM元素（重排）</li><li>为元素添加类，样式都在类中改变（重绘）</li><li>分离读写操作，连续写读会导致直接重绘</li></ul><h2 id="剖析flex布局" tabindex="-1">剖析flex布局 <a class="header-anchor" href="#剖析flex布局" aria-label="Permalink to &quot;剖析flex布局&quot;">​</a></h2><p>flex布局强大，能够实现多种布局方案，兼容性好，而且使用简单</p><h3 id="使用方式" tabindex="-1">使用方式 <a class="header-anchor" href="#使用方式" aria-label="Permalink to &quot;使用方式&quot;">​</a></h3><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 设置父元素 */</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">display:flex</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 定义水平方向对齐方式 */</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">justify-content</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-end</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">space-between</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">space-around</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 定义垂直方向对齐方式 */</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">align-items</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-end</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | baseline | stretch;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 定义多个轴线（多行/多列）对齐方式 */</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">align-content</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-start</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-end</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">center</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">space-between</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">space-around</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> | stretch;</span></span></code></pre></div><div class="language-css vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">css</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 设置子项目 */</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* flex: 1 等价于以下设置 */</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-grow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1; 	 </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大 */</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-shrink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1;  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。*/</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">flex-basis</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 0%;  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">/* 定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。 */</span></span></code></pre></div><h3 id="注意事项-坑" tabindex="-1">注意事项（坑） <a class="header-anchor" href="#注意事项-坑" aria-label="Permalink to &quot;注意事项（坑）&quot;">​</a></h3><ul><li>父元素设置了flex布局，默认会给每个子元素开启缩小属性（flex-shrink:1;）</li><li>当空间不够时，其他的元素会被挤压至隐藏</li><li>设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。</li></ul>`,67),e=[h];function t(p,k,r,d,o,E){return a(),i("div",null,e)}const y=s(n,[["render",t]]);export{g as __pageData,y as default};
