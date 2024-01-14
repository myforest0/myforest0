---
urlname: redis
title: 分布式缓存Redis6.X+高可用集群笔记
updated: '2024-01-15 01:40:04'
date: '2024-01-13 18:05:05'
status: 已发布
catalog:
  - 后端
  - 缓存
---
# 分布式缓存Redis6.X+高可用集群笔记
## 目的：解决高并发下性能问题
### 队列：Rabbitmq、Kafka
### 缓存
- 分布式缓存：Redis、Memcached

- 本地缓存：Mybatis、Redis本地单机服务

## 简介
### 属于Nosql的一种
- Nosql
	- 是一种非关系型数据库管理系统
		- 不使用SQL作为查询语言
		- 不需要固定的表格模式：键值对、列存储、文档存储、图形数据库
		- 产品：Redis、Memcached、Mongodb、Hbase
	
### 是一个开源的由C语言编写的存储数据库，支持网络，支持基于内存、分布式、可选持久化。并且它提供了多种语言的API，比如Java、JavaScript、Python都可以使用Redis
### Redis是内存中的数据结构存储系统，它可以被用作数据库、缓存、消息中间件，支持字符串（strings）、散列（hashes）、列表（lists）、集合（sets）、有序集合（sorted sets）等
## 安装
### 源码编译安装
- 源码安装Redis-上传到Linux服务(先安装升级gcc再编译)
	- #安装gcc
	yum install -y gcc-c++ autoconf automake
	
#centos7 默认的 gcc 默认是4.8.5,版本小于 5.3 无法编 译,需要先安装gcc新版才能编译
gcc -v

#升级新版gcc，配置永久生效
yum -y install centos-release-scl
yum -y install devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils

scl enable devtoolset-9 bash

echo "source /opt/rh/devtoolset-9/enable">>/etc/profile

#编译redis
cd redis
make

#安装到指定目录
mkdir -p /usr/local/redis

make PREFIX=/usr/local/redis install
- 注意：安装编译redis6需要升级gcc，默认自带的gcc版本比较老

### Docker安装
- 安装docker：yum install docker-io -y
运行docker：systemctl start docker

- 拉取redis镜像并运行redis：docker runn -itd --name redis -p 6379:6379 redis --requirepass 123456

## 核心配置
### 格式：key value
### daemonize yes 配置后台运行， 默认no
### bind 绑定指定IP访问，0.0.0.0为不限制，可配置多个用空格隔开，防止黑客等恶意IP访问
### port
### requirepass
### dbfilename 配置redis持久化文件名称
### dir 配置redis持久化文件存储地址
### save 配置redis持久化机制
## key命名规范
### 目的：方便管理+易读
### 不要过长，因为key本身也占空间
### 冒号分割，不要有特殊字符（空格、引号、转义符）。冒号分割优点：在可视化工具中可以以层级的方式展示，方便维护和查看
### 例如：业务名:表名:ID
user:sign:1
## 常见数据结构+指令
### 通用命令
- exists
	- 判断key是否存在
	
- del
	- 删除key及对应的value
	
- type
	- 判断key类型
	
- ttl
	- 查看key存活时间
	
### String 结构
- 介绍
	- 存储字符串类型的key-value
	
- 应用场景
	- 验证码
		- 计数器、发号器
		- 订单重复提交令牌
		- 热点商品卡片（序列化json对象存储）
		- 分布式锁
	
- 常用命令
	- set/get
		- 设置和获取key的值
			- mget/mset
		- 批量设置或获取多个key的值
			- MGET key [key ...]
			- MSET key value [key value ...]
			- incr
		- 对key对应的值进行加1操作，并返回新的值
			- incr key
			- incrby
		- 将key对应的数字加increment，如果key不存在，则在操作之前，key会被置为0，如果值不是数字会报错，并且操作不生效
			- incrby key increment
			- setex
		- 设置 key 对应的字符串 value，并且设置key在给定的 seconds时间之后超时过期，原子操作
			- SETEX key seconds value
			- setnx
		- 设置 key 对应的字符串 value，如果 key 不存在等同于 set 命令，如果存在则什么也不做，是set if  not exists 的简写。
			- SETNX key value
			- getset
		- 设置 key 的值，并返回 key 的旧值
			- GETSET key value
		
- 注意
	- 值的长度不能超过 512MB
		- key 的命名规范，不要过长，冒号分割，业务名:表名:ID
	
### List 结构
- 介绍
	- 字符串列表，按照插入顺序排序（先进先出队列）
		- 双向链表，插入和删除时间复杂度O(1) 快，查找为O(n) 慢
	
- 应用场景
	- 简单队列
		- 最新评论列表
		- 非实时排行榜：定时计算榜单，如手机日销榜单
	
- 常用命令
	- lpush
		- 将一个或多个值插入到列表的头部
			- LPUSH key value1 [value2 ...]
			- rpop
		- 移除并获取列表最后一个元素
			- RPOP key
			- llen
		- 获取列表长度
			- LLEN key
			- lrange
		- 获取key对应的list的指定下标范围的元素，其中0表示列表的第一个元素，1表示列表的第二个元素，-1表示获取所有的元素(lrange key 0 -1)
			- LRANGE key start stop
			- rpush
		- 在key对应的list的尾部添加一个或多个元素
			- RPUSH key value [value ...]
			- lpop
		- 从key对应的list头部删除一个元素，并返回该元素
			- LPOP key
			- brpop
		- 移除并获取列表的最后一个元素，如果列表没有该元素会阻塞列表直到等待超时或发现可弹出元素为止
			- BRPOP key [key ...] timeout
			- lrem
		- 移除元素，可以指定移除个数和值
			- LREM key count value
		
- 注意
	- 通常添加一个元素到列表的头部(左边)或尾部(右边)
		- 存储的都是字符串类型
		- 支持分页操作，高并发项目中，第一页数据都是来源list，第二页和更多信息则是通过数据库加载
		- 一个列表最多可以包含232-1个元素（4294967295，每个列表不超过40亿个元素）
	
### Hash 结构
- 介绍
	- 是一个string类型的field和value的映射表，hash特别适合用于存储对象
		- 格式: key -> { "field": value }
	
- 应用场景
	- 购物车
		- cart:用户ID  ->  {"商品ID": {}, ...}
			- 用户个人信息
		- user:id -> {"name": "xxx", ...}
			- 商品详情
		- product:id -> {...}
		
- 常用命令
	- hset
		- 设置key指定的哈希集中指定字段的值
			- HSET key field value
			- hget
		- 返回key指定的哈希集中该字段所关联的值
			- HGET key field
			- hgetall
		- 返回key指定的哈希集中所有的字段和值
			- HGETALL key
			- hdel
		- 从key指定的哈希集中移除指定的域
			- HDEL key field [field ...]
			- hexists
		- 返回hash里面field是否存在
			- HEXISTS key field
			- hincrby
		- 增加key指定的哈希集中指定字段的数值，如果是-1，则是递减
			- HINCRBY key field increment
			- hmset
		- 设置key指定的哈希集中一个或多个字段的值
			- HMSET key field value [field value ...]
			- hmget
		- 返回key指定的哈希集中一个或多个字段的值
			- HMGET key field [field ...]
		
- 注意
	- 每个hash可以存储232 - 1 键值对 (40多亿)
	
### Set 结构
- 介绍
	- 将一个或多个成员元素加入到集合中，已经存在于集合的成员元素将被忽略
	
- 应用场景
	- 去重
		- 社交应用关注、粉丝、共同好友
		- 统计网站的PV、UV、IP
		- 大数据里面的用户画像标签集合
	
- 常用命令
	- sadd
		- 添加一个或多个指定的member元素到集合的key中，指定的一个或多个元素member如果已经存在则忽略
			- SADD key member [member ...]
			- scard
		- 返回集合存储的key的基数(集合元素的数量)
			- SCARD key
			- sdiff
		- 返回的集合元素是第一个key的集合与后面所有key的集合的差集
			- SDIFF key [key ...]
			- sinter
		- 返回指定所有的集合的成员的交集
			- SINTER key [key ...]
			- sismember
		- 返回成员member是否是存储的集合key的成员
			- SISMEMBER key member
			- srem
		- 在key集合中移除一个或多个指定的元素，如果指定的元素不存在则忽略
			- SREM key member [member ...]
			- sunion
		- 返回给定的多个集合的并集中的所有成员
			- SUNION key [key ...]
			- smembers
		- 返回key集合中的所有的元素
			- SMEMBERS key
		
- 注意
	- 集合是通过哈希表实现的
	
### Sorted Set 结构
- 介绍
	- 与Set结构区别是它是有序的
		- 用于将一个或多个成员元素及其分数值加入到有序集当中
		- 如果某个成员已经是有序集的成员，那么更新这个成员的分数值，分数值可以是整数值或双精度浮点数
		- 有序集合可以看做是在Set集合的基础上为集合中的每个元素维护了一个顺序值：score，它允许集合中的元素按照score进行排序
	
- 应用场景
	- 实时排行榜：商品热销榜、体育类应用热门球队、积分榜，利用score计算
		- 优先级队列、队列
		- 朋友圈 文章点赞-取消，逻辑：用户只能点赞或取消，统计一篇文章被点赞了多少次，可以直接取里面有多少个成员
	
- 常用命令
	- zadd
		- 向有序集合添加一个或多个成员，或者更新已存在成员的分数
			- ZADD key score member [score member ...]
			- zcard
		- 获取有序集合的成员数
			- ZCARD key
			- zcount
		- 计算在有序集合中指定区间分数的成员数
			- ZCOUNT key min max
			- zincrby
		- 有序集合中对指定成员的分数加上增量increment
			- ZINCRBY key increment member
			- zrange
		- 通过索引区间返回有序集合指定区间内的成员，成员的位置按分数值递增（从小到大）来排序
			- ZRANGE key start stop [WHITSCORES]
			- zrevrange
		- 通过索引区间返回有序集合指定区间内的成员，成员的位置按分数值递减（从大到小）来排序
			- ZREVRANGE key start stop [WHITSCORES]
			- zrevrank
		- 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序
			- ZREVRANK key member
			- zrank
		- 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序
			- ZRANK key member
			- zrem
		- 移除有序集合中的一个或多个成员
			- ZREM key member [member ...]
			- zscore
		- 返回有序集中，成员的分数值
			- ZSCORE key member
		
- 注意
	- 底层使用了Ziplist压缩列表和“跳跃表”两种存储结构
		- 跳跃表
		
1. 采用分层建立联系

1. 性能堪比红黑树
	- 如果重复添加相同的数据，score值被反复覆盖，保留最后一次修改的结果
	
## 使用客户端连接Redis
### 客户端：Redis自带客户端 redis-cli 、可视化工具、语言客户端
### Java语言客户端
- jedis
	- 使用阻塞的I/O，方法调用同步
	Jedis 是直连模式，在多个线程间共享一个 Jedis 实 例时是线程不安全的，需要使用连接池
	
- lettuce
	- 高级Redis客户端，支持异步，用于线程安全同步
		- SpringBoot新版(2.x)使用这个
		
### 在SpringBoot整合Redis
- SpringData介绍
	- SpringDataRedis是专⻔操作redis的依赖
		- 支持操作mysql/redis/elasticseatch
	
- 
	1. 添加依赖 spring-boot-starter-data-redis
	
1. 配置redis连接信息
	```plaintext
	<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-redis</artifactId>
	
	</dependency>
	
	
	```
- 注意
	- Springboot2后默认使用Lettuce作为访问redis的客户端
		- 旧版本lettuce存在堆外内存溢出的bug， 5.3版本修复了这个bug
		- 解决方式
			- 升级版本
				- 换jedis
			
- SpringDataRedis配置RedisTemplate
	- RedisTemplate介绍
		- ValueOperations: 简单K-V操作
			- ListOperations: list类型的数据操作
			- ZSetOperations: zset类型数据操作
			- SetOperations: set类型数据操作
			- HashOperations: 针对map类型的数据操作
			- RedisTemplate和StringRedisTemplate的区别
		- StringRedisTemplate继承RedisTemplate
			- 两者的数据是不共通的(默认的序列化机制导致key不一样)，redisTemplate设置的key-value，stringTemplate用相同的key获取结果为null
			- StringRedisTemplate默认采用的是String的序列化策略
				- RedisTemplate默认采用的是JDK的序列化策略，会将数据先序列化成字节数组然后在存入Redis数据库
				- 总结
			- 当redis数据库里面本来操作的是字符串数据的时候，那使用StringRedisTemplate即可
				- 数据是复杂的对象类型，那么使用RedisTemplate是更好的选择
				- RedisTemplate自定义序列化配置
		- 
		
- RedisTemplate的序列和反序列化机制
	- 什么是序列化
		- 把对象转换为字节序列的过程称为对象的序列化。
			- 把字节序列恢复为对象的过程称为对象的反序列化。
			- 对象的序列化主要有两种用途
		- 把对象的字节序列永久地保存到硬盘上，通常存放在一个文件中
			- 在网络上传送对象的字节序列。
			- Redis为什么要序列化
		- 性能可以提高，不同的序列化方式性能不一样
			- 可视化工具更好查看
			- 采用默认的jdk方式会乱码(POJO类需要实现 Serializable接口)
				- 采用JSON方式则不用，且可视化工具更好查看
				- 自定义redis序列化
		- JdkSerializationRedisSerializer
			- POJO对象的存取场景，使用JDK本身序列化机制
				- 默认机制 ObjectInputStream/ObjectOutputStream进行序列化操作
				- StringRedisSerializer
			- Key或者value为字符串
				- Jackson2JsonRedisSerializer
			- 利用jackson-json工具，将pojo实例序列化成json格式存储
				- GenericFastJsonRedisSerializer
			- 另一种javabean与json之间的转换，同时也需要指定Class类型
			
- Jedis+Lettuce客户端连接池配置和客户端切换
	- 基于SpringDataRedis可以快速替换底层实现
		- Lettuce连接池介绍(添加连接池)
		- 添加连接池依赖
			```plaintext
			<dependency>
			
			<groupId>org.apache.commons</groupId>
			<artifactId>commons-pool2</artifactId>
			
			</dependency>
			
			
			```	```plaintext
	  - 添加连接池配置
	
	  	- # 连接池最大连接数(使用负值表示没有限制) spring.redis.lettuce.pool.max-active = 10
	```
# 连接池中的最大空闲连接 spring.redis.lettuce.pool.max-idle = 10
# 连接池中的最小空闲连接 spring.redis.lettuce.pool.min-idle = 0
# 连接池最大阻塞等待时间(使用负值表示没有限制) spring.redis.lettuce.pool.max-wait= -1ms
# 指定客户端
spring.redis.client-type = lettuce
```plaintext
- Jedis连接池介绍(可以不排除lettuce依赖包)

	- 在springboot整合包依赖中排除lettuce(可以不排除lettuce，可以同时有两个实现)

		- <dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
  <exclusions>
    <exclusion>
      <groupId>io.lettuce</groupId>
      <artifactId>lettuce-core</artifactId>
    </exclusion>
  </exclusions>
  </dependency>
```

```plaintext
	- 添加Jedis依赖

		- <!--不用指定版本号，本身spring-data-redis里面有-->
```
```plaintext
<dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
    </dependency>
<dependency>
```
```plaintext
	- 添加连接池依赖

		- <!--不用指定版本号，本身spring-data-redis里面有-->
        
        <dependency>
      <groupId>redis.clients</groupId>
      <artifactId>jedis</artifactId>
</dependency>

<dependency>
    <groupId>org.apache.commons</groupId>
      <artifactId>commons-pool2</artifactId>
      <version>2.6.1</version>
</dependency>


```
## 分布式缓存实战
### String数据结构最佳案例
- 注册登录发送手机验证码之前添加图形验证码防止恶意调用
	- 背景
		- 注册-登录-修改密码一般需要发送验证码，但是容易被攻击恶意调用
			- 短信轰炸机就是利用这一点批︎量、循环给手机无限发送各种网站的注册验证码短信
			- 给公司带来经济损失
			- 目的
		- 添加图形验证码避免短信额度浪费
			- 防止黑客或其他恶意调用
			- 解决方案
		- 添加图形验证码
			- 业务流程
				- 用户进入登陆/注册页面，请求后端获取图形验证码
					- 后端拿到用户指纹(浏览器标识+IP)和验证码，以key为: user:captch:用户标识，value为: 验证码_时间戳 的格式存到redis中
					- 用户获取手机号验证码，向后端请求传递图形验证码和手机号码，后端判断前端传过来的图形验证码和redis中存储的是否一致，并且在规定的时间内(比如60秒)，如都不满足则不请求短信服务，也不返回验证码给前端
					- 添加单IP请求限制
			- 限制号码发送（一般短信提供商会做）
			- 攻防永远是有的，只过加大了攻击者的成本，ROI划不过来自然就放弃了
	
- 高并发下热点数据缓存
	- 热点数据
		- 经常会被查询，但是不经常被修改或者删除的数据
			- 例如：首页、详情页
			- 实现逻辑
		- 检查缓存是否有
			- 缓存不存在则查询数据库
			- 查询结果放在缓存，设置过期时间
			- 下次访问则命中缓存
			- 注意点
		- 缓存击穿
			- 缓存穿透
			- 缓存雪崩
			- 缓存和数据库数据一致性
			- 压力测试验证
		- 常见工具
			- LoadRunner
				- 性能稳定，压测结果及细粒度大，可以自定义脚本进行压测，但是太过于重大，功能比较繁多
					- Apache AB(单接口压测最方便)
				- 模拟多线程并发请求，ab命令对发出负载的计算机要求很低，既不会占用很多CPU，也不会占用太多的内存， 但却会给目标服务器造成巨大的负载, 简单DDOS攻击等
					- Webbench
				- webbench首先fork出多个子进程，每个子进程都循环 做web访问测试。子进程把访问的结果通过pipe告诉父 进程，父进程做最终的统计结果。
					- Jmeter
				- 开源免费，功能强大，在互联网公司普遍使用
					- 本地安装
					- 要求
						- 需要安装JDK8 以上
							- 建议安装JDK环境，虽然JRE也可以，但是压测https需要JDK里面的keytool工具
						- 快速下载: [https://jmeter.apache.org/download_jmeter.cgi](https://jmeter.apache.org/download_jmeter.cgi)
						- 文档地址: [http://jmeter.apache.org/usermanual/get-started.html](http://jmeter.apache.org/usermanual/get-started.html)
						- 本地解压后目录
					- bin: 核心可执行文件，包含配置
					jmeter.bat: windows启动文件(window系统一定要配置显示文件拓展名)
					jmeter: mac或者linux启动文件
					jmeter-server: mac或者Liunx分布式压测使用的 启动文件
					jmeter-server.bat: window分布式压测使用的 启动文件
					jmeter.properties: 核心配置文件 extras:插件拓展的包
					lib: 核心的依赖包
						- 注意: 线上一定是运行linux启动文件
						- Jmeter语言版本中英文切换
					- 控制台修改 menu -> options -> choose language，这个设置是临时的，重启后需要重新设置，如需永久生效需改配置文件
						- 配置文件修改(永久生效)
						- bin目录 -> jmeter.properties
							- 默认 #language=en，改为 language=zh_CN
							- 压测基本配置：新建测试计划
					- 新建线程组：编辑 -> 添加 -> 线程(用户) -> 线程组
						- 
							- 新建取样器：编辑 -> 添加 -> 取样器 -> HTTP请求
						- 
							- 新建监听器-察看结果树: 编辑  -> 添加 -> 监听器 -> 察看结果树
						- 
							- 新建监听器-聚合报告：编辑  -> 添加 -> 监听器 -> 聚合报告
						- 
							```plaintext
						  - QPS：(Query Per Second): 每秒请求数,就是说服务器在一秒的时间内处理了多少个请求
						```	```plaintext
						  - lable: sampler的名称
						```
Samples: 一共发出去多少请求,例如10个用户，循环10 次，则是 100
Average: 平均响应时间
Median: 中位数，也就是 50% 用户的响应时间
90% Line : 90% 用户的响应不会超过该时间 (90% of the samples took no more than this time. The remaining samples at least as long as this)
95% Line : 95% 用户的响应不会超过该时间
99% Line : 99% 用户的响应不会超过该时间
min : 最小响应时间
max : 最大响应时间
Error%: 错误的请求的数量/请求的总数
Throughput: 吞吐量——默认情况下表示每秒完成的请求数 (Request per Second) 可类比为qps、tps
KB/Sec: 每秒接收数据量
### List数据结构最佳案例
- 热销视频榜单
	- 需求
		- 某在线教育官网需要一个视频学习榜单，每天更新一次需要支持人工运营替换榜单位置
			- 整体流程
		- 
			- 企业中流程
		- 定时任务计算昨天最多人学习的视频
			- 晚上12点到1点更新到榜单上
			- 预留一个接口，支持人工运营
			- 类似场景
		- 京东: 热销手机榜单、电脑榜单等
			- 百度: 搜索热榜
			- 为啥不是实时计算，真正高并发下项目，都是预先计算好结果，然后直接返回数据，且存储结构最简单
	
### Hash数据结构最佳案例
- 背景
	- 电商购物⻋实现，支持买多件商品，每个商品可以买不同数量
		- 需要支持高性能处理
	
- 购物⻋常⻅实现方式
	- 存储到数据库
		- 性能存在瓶颈
			- 前端本地存储：localstorage/sessionstorage
		- localstorage在浏览器中存储 key/value 对，没有过期时间
			- sessionstorage在浏览器中存储 key/value 对，在关闭会话窗口后将会删除这些数据
			- 缺点：换个浏览器或换台电脑购物车数据丢失
			- 好处：不用和服务端交互
			- 总结：看具体需求而定，一般情况是希望各平台保持一致的
			- 后端存储到缓存如redis
		- 可以开启AOF持久化防止重启丢失(推荐)
		
- 购物⻋数据结构
	- 一个购物⻋里面，存在多个购物项，所以购物⻋结构是一个双层Map:
	
Map<String,Map<String,String>>
第一层Map，Key是用户id或者用户浏览器标识+ID生成的key
第二层Map，Key是购物⻋中商品id，值是购物⻋数据
- 对应redis里面的存储
	- Hash数据结构
	
### Set数据结构最佳案例
- 用户画像标签去重
	- 介绍
		- 用户画像 英文为User Profile，是根据用户基本属性、 社会属性、行为属性、心理属性等真实信息而抽象出的一个标签化的、虚拟的用户模型。“用户画像”的实质是对 “人”的数字化。
			- 应用场景有很多，比如个性化推荐、精准营销、金融⻛控、精细化运营等等， 举个例子来理解用户画像的实际应用价值，我们经常用手机网购，淘宝里面的千人千面
			- 通过“标签 tag”来对用户的多维度特征进行提炼和标识，那每个人的用户画像就需要存储，set集合就适合去重
			- 用户画像不止针对某个人，也可以某一人群或行业的画像
			- 案例
		- BoundSetOperations operations  = redisTemplate.boundSetOps("user:tags:1");
		operations.add("car","student","rich","guangdong","dog","rich");
		
Set<String> set1 = operations.members();
System.out.println(set1);

operations.remove("dog");
Set<String> set2 = operations.members();
System.out.println(set2);
- 社交应用里面的关注、粉丝、共同好友
	- 介绍
		- 用差集、并集、差集可以很好的体现出不同用户之间的优势、共同等数据
			- 粉丝、关注需要满足去重，比如用户反复取消关注/关注操作
			- 案例
		- 
		
### SortedSet数据结构最佳案例
- 用户积分实时榜单
	- 背景
		- 用户玩游戏-积分实时榜单
			- IT视频热销实时榜单
			- 电商商品热销实时榜单
			- 注意
		- 一般的排行榜读多写少，可以对 master 进行写入操作，然后多个 slave 进行读取操作。(MySQL主从复制(Master-Slave))
			- [ ](https://www.cnblogs.com/gl-developer/p/6170423.html)
				- 如果是对象记得重写HashCode与Equals方法(确认唯一性)
			- 案例
		- // 获取sortedset方法
		BoundZSetOperations<String, UserPoint> operations = redisTemplate.boundZSetOps("point:rank:real");
		
## 分布式锁
### 背景
- 为了防止分布式系统中的多个进程之间相互干扰，我们需要一种分布式协调技术来对这些进程进行调度

- 利用互斥机制来控制共享资源的访问，这就是分布式锁要解决的问题

### 目的
- 保证同一时间只有一个客户端可以对共享资源进行操作

- 避免共享资源并发操作导致数据问题

### 解决方案
- 加锁
	- 本地锁
		- synchronize、lock等，锁在当前进程内， 集群部署下依旧存在问题
			- 分布式锁
		- redis、zookeeper等实现，虽然还是锁，但是多个进程共用的锁标记，可以用Redis、Zookeeper、Mysql等都可以
			- 
			
### 设计分布式锁应该考虑的东⻄
- 排他性
	- 在分布式应用集群中，同一个方法在同一时间只能被一台机器上的一个线程执行
	
- 容错性
	- 分布式锁一定能得到释放，比如客户端奔溃或者网络中断
	
- 满足可重入、高性能、高可用

- 注意分布式锁的开销、锁粒度

### 基于Redis实现分布式锁的几种坑
- 实现分布式锁 可以用 Redis、Zookeeper、Mysql数据库这几种 , 性能最好的是Redis且是最容易理解
	- 分布式锁离不开 key - value 设置
		- key 是锁的唯一标识，一般按业务来决定命名，比如想要给一种 优惠券活动加锁，key 命名为 “coupon:id” 。value就可以 使用固定值，比如设置成1
		
- 实现分布式锁的逻辑
	- 加锁 SETNX key value
		- setnx 的含义就是 SET if Not Exists，有两个参数 setnx(key, value)，该方法是原子性操作
		
如果 key 不存在，则设置当前 key 成功，返回 1;

如果当前 key 已经存在，则设置当前 key 失败，返回 0
```plaintext
- 加锁失败时自旋

- 解锁 del (key)

	- 得到锁的线程执行完任务，需要释放锁，以便其他线程可以进入，调用 del(key)

- 配置锁超时 expire (key，30s)

	- 客户端奔溃或者网络中断，资源将会永远被锁住,即死锁，因此需要给key配置过期时间，以保证即使没有被显式释放，这把锁也要在一定时间后自动释放

- 使用原生分布式锁的大体流程

	-  

- 简单分布式锁流程存在的问题
```
(没有使用原子性、解锁没有判断是否是自身的线程、解锁原子性)
```plaintext
	- 多个命令之间不是原子性操作，如 setnx 和 expire 之 间，如果 setnx 成功，但是 expire 失败，且宕机了， 则这个资源就是死锁

		- 使用原子命令:设置和配置过期时间 
```
setnx / setex 如: set key 1 ex 30 nx
java里面 redisTemplate.opsForValue().setIfAbsent("seckill_1","success",30,TimeUnit.MILLISECONDS)
```plaintext
	- 业务超时，存在其他线程误删，key 30秒过期，假如线程A执行很慢超过30秒，则key就被释放了，其他线程B就得到了锁，这个时候线程A执行完成，而B还没执行完成，结果就是线程A删除了线程B加的锁

		-  

		- 进一步细化误删

			- 当线程A获取到正常值时，返回带代码中判断期间锁过期了，线程B刚好重新设置了新值，线程A那边有判断value是自己的标识，然后调用del方法，结果就是删除了新设置的线程B的值

			- 本质还是判断和删除命令不是原子性操作导致的(删除命令可能会误删其他线程的值)

	- 总结

		- 加锁+配置过期时间: 保证原子性操作

		- 解锁: 防止误删除、也要保证原子性操作

- 解决1: 手动增加线程判断

	- 可以在 del 释放锁之前做一个判断，验证当前的锁是不是自己加的锁, 那 value 应该是存当前线程的标识或者uuid

		- String key = "coupon_66"
```
String value = Thread.currentThread().getId()

if(setex(key, value, 30, TimeUnit.MILLISECONDS) == 1) {
try {
//做对应的业务逻辑
} finally {
//删除锁，判断是否是当前线程加的
if(get(key).equals(value)){
//还存在时间间隔
del(key)
}
}
} else {
//睡眠100毫秒，然后自旋调用本方法

}
```plaintext
- 解决2: lua脚本保证原子性

	- 核心是保证多个指令原子性，加锁使用setnx setex 可以保证原子性，那解锁使用判断和删除怎么保证原子性

	- 多个命令的原子性: 采用 lua脚本+redis, 由于【判断和 删除】是lua脚本执行，所以要么全成功，要么全失败

		- //获取lock的值和传递的值一样，调用删除操作返回1，否 则返回0
```
String script = "if redis.call('get',KEYS[1])== ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end";

//Arrays.asList(lockKey)是key列表，uuid是参数 Integer result = redisTemplate.execute(new DefaultRedisScript<>(script, Long.class), Arrays.asList(lockKey), uuid);
```plaintext
- 遗留问题：如果业务逻辑执行耗时比较长，超出了锁的过期时间，如果自动进行锁续期？

	- 原生分布式锁中，我们一般把锁过期时间设置的久一点， 比如10分钟

	- 原生代码+redis实现分布式锁使用比较复杂，且有些锁续期问题更难处理

		- [延伸出框架 官方推荐方式: https://redis.io/topics/distlock](https://redis.io/topics/distlock)
```
## SpringCache
### 简介
- [文档: https://spring.io/guides/gs/caching/](https://spring.io/guides/gs/caching/)

- 自Spring 3.1起，提供了类似于@Transactional注解事 务的注解Cache支持，且提供了Cache抽象

- 提供基本的Cache抽象，方便切换各种底层Cache 只需要更少的代码就可以完成业务数据的缓存

- 提供事务回滚时也自动回滚缓存，支持比较复杂的缓存逻辑

- 核心
	- 一个是Cache接口，缓存操作的API;
		- 一个是CacheManager管理各类缓存，有多个缓存框架的实现
	
### 使用
- 项目中引入starter
	```plaintext
	<dependency>
	  <groupId>org.springframework.boot</groupId>
	  <artifactId>spring-boot-starter-cache</artifactId>
	
	</dependency>
	
	
	```
- 配置文件指定缓存类型
	- spring:
	cache:
	type: redis
	
- 启动类开启缓存注解
	- @EnableCaching
	
### SpringBoot整合MybatisPlus连接Mysql数据库
- 添加依赖
	```plaintext
	<!--mybatis plus和springboot整合--> 
	
	<dependency>
	          <groupId>com.baomidou</groupId>
	          <artifactId>mybatis-plus-boot-starter</artifactId>
	          <version>3.4.0</version>
	</dependency>
	
	<!--数据库驱动--> 
	
	<dependency>
	      <groupId>mysql</groupId>
	      <artifactId>mysql-connector-java</artifactId>
	      <version>8.0.15</version>
	</dependency>
	
	
	```
- 新增配置
	- #==============================数据库相关配置 ========================================
	#数据库配置
	spring:
	datasource: driver-class-name: com.mysql.cj.jdbc.Driver
	url: jdbc:mysql://127.0.0.1:3306/xdclass_user?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
	username: root
	password: xdclass.net
	#配置plus打印sql日志
	mybatis-plus:
	configuration:
	log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
	
- 数据库和表建立

- 插入数据

- DO类编写

- 编写Mapper

- 编写Service

- 编写controller
	- 分页接口
		- @Override
		public Map<String, Object> page(int page, int size) {
		Page<ProductDO> pageInfo = new Page<>(page, size);
		IPage<ProductDO> productDOIPage = productMapper.selectPage(pageInfo, null);
		Map<String, Object> pageMap = new HashMap<>(3);
		pageMap.put("total_record", productDOIPage.getTotal());
		pageMap.put("total_page", productDOIPage.getPages());
		pageMap.put("current_data", productDOIPage.getRecords());
		return pageMap;
		}
			- 其他接口...
	
- 分⻚插件配置
	- @Bean
	public MybatisPlusInterceptor mybatisPlusInterceptor() {
	MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
	interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
	return interceptor;
	}
	
### SpringCache常用注解
- Cacheable
	- 标记在一个方法上，也可以标记在一个类上
		- 缓存标注对象的返回结果，标注在方法上缓存该方法的返回值，标注在类上缓存该类所有的方法返回值
		- value 缓存名称，可以有多个
		- key 缓存的key规则，可以用springEL表达式，默认是方法参数组合
		- spEL表达式
			- methodName 当前被调用的方法名
				- root.methodname
					- args 当前被调用的方法的参数列表
				- root.args[0]
					- result 方法执行后的返回值
				- result
					- key一定要是唯一标识
			- condition 缓存条件，使用springEL编写，返回true才缓存
		- 案例
		- //对象
		@Cacheable(value = {"product"}, key="#root.methodName")
		
//分⻚
@Cacheable(value = {"product_page"}, key="#root.methodName + #page+'_'+#size")
- CachePut
	- Cacheable主要用于查找，获取数据库数据时会把数据同步到缓存一份，下次获取，如果缓存中数据没有过期，就从缓存中查找并返回
	CachePut主要用于更新，更新或查找数据库时，也会同步更新缓存中的数据
	Cacheable和CachePut的key一定要保持一致
		- 根据方法的请求参数对其结果进行缓存，每次都会触发真实方法的调用
		- value 缓存名称，可以有多个
		- key 缓存的key规则，可以用springEL表达式，默认是方法参数组合
		- condition 缓存条件，使用springEL编写，返回true才缓存
		- 案例
		- @CachePut(value = {"product"}, key = "#productDO.id")
		
- CacheEvict
	- 从缓存中移除相应数据, 触发缓存删除的操作
		- value 缓存名称，可以有多个
		- key 缓存的key规则，可以用springEL表达式，默认是方法参数组合
		- beforeInvocation = false
		- 缓存的清除是否在方法之前执行, 默认代表缓存清除操作是在方法执行之后执行;
			- 如果出现异常缓存就不会清除
			- beforeInvocation = true
		- 代表清除缓存操作是在方法运行之前执行，无论方法是否出现异常，缓存都清除
			- 案例
		- @CacheEvict(value = {"product"}, key = "#root.args[0]")
		
- Caching
	- 组合多个Cache注解使用
		- 一个方法需要操作多个缓存
			- 允许在同一方法上使用多个嵌套的@Cacheable、 @CachePut和@CacheEvict注释
		- 案例
		- @Caching(
		cacheable = {
		@Cacheable(value = "product", keyGenerator = "springCacheCustomKeyGenerator", cacheManager = "cacheManager1Minute")
		},
		put = {
		@CachePut(value = "product", key = "#id"),
		@CachePut(value = "product", key = "'stock:'+#id")
		}
		)
		
### SpringCache框架自定义CacheManager配置和过期时间
- 修改redis缓存序列化器和配置manager过期时间
	- // 一分钟过期
	@Bean
	public RedisCacheManager cacheManager1Minute(RedisConnectionFactory connectionFactory) {
	RedisCacheConfiguration config = instanceConfig(60L);
	return RedisCacheManager.builder(connectionFactory)
	.cacheDefaults(config)
	.transactionAware()
	.build();
	}
	
// 1小时过期
@Bean
@Primary //不指定cachemanager的时候默认使用这个
public RedisCacheManager cacheManager1Hour(RedisConnectionFactory connectionFactory) {
RedisCacheConfiguration config = instanceConfig(3600L);
return RedisCacheManager.builder(connectionFactory)
.cacheDefaults(config)
.transactionAware()
.build();
}

// 1天过期
@Bean
public RedisCacheManager cacheManager1Day(RedisConnectionFactory connectionFactory) {
RedisCacheConfiguration config = instanceConfig(3600 * 24L);
return RedisCacheManager.builder(connectionFactory)
.cacheDefaults(config)
.transactionAware()
.build();
}

private RedisCacheConfiguration instanceConfig(Long ttl) {
Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
ObjectMapper objectMapper = new ObjectMapper();
objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
objectMapper.registerModule(new JavaTimeModule());
```plaintext
  // 去掉各种@JsonSerialize注解的解析
  objectMapper.configure(MapperFeature.USE_ANNOTATIONS, false);

  // 只针对非空的值进行序列化

 objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

  // 将类型序列化到属性json字符串中 objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance ,
  ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
  jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

  return RedisCacheConfiguration.defaultCacheConfig()
          .entryTtl(Duration.ofSeconds(ttl))
          //.disableCachingNullValues()
          .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(jackson2JsonRedisSerializer));
```
}
- 使用Cacheable注解的时候指定cacheManager
	- @Cacheable(value = {"product"}, key="#root.methodName", cacheManager = "cacheManager1Minute")
	
### SpringCache框架自定义缓存KeyGenerator
- 问题
	- 每次需要自己手动定制key的规则，过于麻烦，并且不利于维护和管理，需要一个统一的规则生成key
	
- 添加配置
	- @Bean
	public KeyGenerator springCacheCustomKeyGenerator(){
	return new KeyGenerator() {
	@Override
	public Object generate(Object o, Method method, Object... objects) {
	return o.getClass().getSimpleName() + "_" + method.getName() + "_" + StringUtils.arrayToDelimitedString(objects, "_");
	}
	};
	}
		- 最终key中的格式：模块名:类名_方法名_参数
	
- 使用
	- 注意：key 属性和keyGenerator属性只能二选一
		- @Cacheable(value = {"product"}, keyGenerator ="springCacheCustomKeyGenerator", cacheManager = "cacheManager1Minute")
	
## 分布式缓存问题及解决方案
### 缓存击穿 (某个热点key缓存失效了)
- 原因
	- 缓存中没有但数据库中有的数据，假如是热点数据，那key在缓存过期的一刻，同时有大量的请求，这些请求都会击穿到DB，造成瞬时DB请求量大、压力增大。
		- 和缓存雪崩的区别在于这里针对某一key缓存，后者则是很多key。
	
- 预防
	- 方案一(推荐)
		- 设置热点数据不过期
			- 定时任务定时更新缓存
			- 方案二
		- 设置互斥锁
			- 当第一个请求发现这个key所对应的缓存已经过期了，就给这个key对应的缓存加锁，当其他请求过来的时候发现已经加锁了，就一直阻塞等待，直到第一个请求从数据库中拿到数据，并且设置到缓存中，解锁后，后续请求即可正常拿到缓存中的数据
				- 为了高性能，当发现缓存加锁后，也可以直接返回(牺牲部分用户的请求)
			
- SpringCache解决方案
	- 缓存的同步sync
		- sync 可以指示底层将缓存锁住，使只有一个线程可以进入计算，而其他线程堵塞，直到返回结果更新到缓存中
		- @Cacheable(value = {"product"},key = "#root.args[0]", cacheManager = "customCacheManager", sync=true)
	
### 缓存雪崩(多个热点key都过期)
- 原因
	- 大量的key设置了相同的过期时间，导致在缓存在同一时刻全部失效，造成瞬时DB请求量大、压力骤增，引起雪崩
	
- 预防
	- 存数据的过期时间设置随机，防止同一时间大量数据过期现象发生
		- 设置热点数据永远不过期，定时任务定时更新
	
- SpringCache解决方案
	- 设置差别的过期时间
		- 比如CacheManager配置多个过期时间维度
		- 配置文件 time-to-live 配置
		- cache:
		#使用的缓存类型
		type: redis
		#过期时间
		redis:
		time-to-live: 3600000
			# 开启前缀，默以为true	use-key-prefix: true	# 键的前缀, 默认就是缓存名cacheNames	key-prefix: XX_CACHE	# 是否缓存空结果，防止缓存穿透，默以为true	cache-null-values: true
### 缓存穿透(查询不存在数据)
- 原因
	- 查询一个不存在的数据，由于缓存是不命中的，并且出于容错考虑，如发起为id为“-1”不存在的数据
		- 如果从存储层查不到数据则不写入缓存这将导致这个不存在的数据每次请求都要到存储层去查询，失去了缓存的意义。存在大量查询不存在的数据，可能DB就挂掉了，这也是黑客利用不存在的key频繁攻击应用的一种方式。
	
- 预防
	- 接口层增加校验，数据合理性校验
		- 缓存取不到的数据，在数据库中也没有取到，这时也可以将key-value对写为key-null，设置短点的过期时间，防止同个key被一直攻击
	
- SpringCache解决方案
	- 空结果也缓存，默认不配置condition或者unless就行
	
### 案例总结
- 缓存带来的效果
	- 使用缓存前，单机qps是4千
		- 使用分布式缓存3万
		- 使用分布式缓存+本地缓存 5万 单机 高并发下-容器编排自动化扩容，只要有足够的服务器，可以无限扩容
		- 阿里、腾讯、百度、京东、美团、字节等，都是这样的流程, 应对海量请求
	
## [进阶]分布式缓存Redis6.x持久化配置
### Redis持久化介绍
- Redis是一个内存数据库，如果没有配置持久化，redis重启后数据就全丢失

- 因此开启redis的持久化功能，将数据保存到磁盘上，当redis重启后，可以从磁盘中恢复数据。

### 两种持久化方式
- RDB (Redis DataBase)
	- 介绍
		- 在指定的时间间隔内将内存中的数据集快照写入磁盘
			- 默认的文件名为dump.rdb
			- 产生快照的情况
		- save(不推荐)
			- 会阻塞当前Redis服务器，执行save命令期间，Redis不能处理其他命令，直到RDB过程完成为止
				- bgsave
			- fork创建子进程，RDB持久化过程由子进程负责，会在后台异步进行快照操作，快照同时还可以响应客户端请求
				- 自动化
			- 配置文件来完成，配置触发 Redis的 RDB 持久化条件
				- 比如 "save m n"。表示m秒内数据集存在n次修改时，自动触发bgsave
				- 主从架构
			- 从服务器同步数据的时候，会发送sync执行同步操作，master主服务器就会执行bgsave
				- 优点
		- RDB文件紧凑，全量备份，适合用于进行备份和灾难恢复
			- 在恢复大数据集时的速度比 AOF 的恢复速度要快
			- 生成的是一个紧凑压缩的二进制文件
			- 缺点
		- 每次快照是一次全量备份，fork子进程进行后台操作，子进程存在开销
			- 在快照持久化期间修改的数据不会被保存，可能丢失数据
			- 核心配置
		- dir 持久化文件的路径
			- dbfilename 文件名
			- #任何ip可以访问
		bind 0.0.0.0
		
#守护进程 , 如果是docker需设置为no
daemonize yes

#密码
requirepass 123456

#日志文件
logfile "/usr/local/redis/log/redis.log"

#持久化文件名称
dbfilename forest.rdb

#持久化文件存储路径
dir /usr/local/redis/data

#关闭rdb
#save ""

#持久化策略, 10秒内有个1个key改动，执行快照
save 10 1

######以上是之前配置######

#导出rdb数据库文件压缩字符串和对象,默认是yes，会浪费CPU但是节省空间
rdbcompression yes
# 导入时是否检查
rdbchecksum yes
```plaintext
- 注意：redis重启时会从rdb文件中把数据捞起来(恢复)
```
- AOF (append only file)
	- 介绍
		- append only file，追加文件的方式，文件容易被人读懂
			- 以独立日志的方式记录每次写命令， 重启时再重新执行AOF文件中的命令达到恢复数据的目的
			- 写入过程宕机，也不影响之前的数据，可以通过 redis-check-aof检查修复问题
			- 配置实战
		- appendonly yes，默认不开启
			- AOF文件名 通过 appendfilename 配置设置，默认文件名是appendonly.aof
			- 存储路径同RDB持久化方式一致，使用dir配置
			- bind 0.0.0.0
		
daemonize yes

requirepass 123456Xdclass

logfile "/usr/local/redis/log/redis.log"

dbfilename forest.rdb

dir /usr/local/redis/data

#save 10 2

#save 100 5

#关闭RDB
save ""

rdbcompression yes

#对rdb数据进行校验，耗费CPU资源，默认为yes
rdbchecksum yes

appendonly yes

appendfilename "appendonly.aof"

appendfsync everysec
```plaintext
- 核心原理

	- Redis每次写入命令会追加到aof_buf(缓冲区)

	- AOF缓冲区根据对应的策略向硬盘做同步操作

	- 高频AOF会带来影响，特别是每次刷盘

- 提供了3种同步方式，在性能和安全性方面做出平衡

	- appendfsync always

		- 每次有数据修改发生时都会写入AOF文件，消耗性能多

	- appendfsync everysec

		- 每秒钟同步一次，该策略为AOF的缺省策略。

	- appendfsync no

		- 不主从同步，由操作系统自动调度刷磁盘，性能是最好的，但是最不安全

- 重写rewrite配置

	- 为什么要重写rewrite配置

		- AOF文件越来越大，需要定期对AOF文件进行重写达到压缩

		- 旧的AOF文件含有无效命令会被忽略，保留最新的数据命令

		- 多条写命令可以合并为一个

		- AOF重写降低了文件占用空间

		- 更小的AOF文件可以更快地被Redis加载

	- 重写触发配置

		- 手动触发

			- 直接调用bgrewriteaof命令

		- 自动触发

			- auto-aof-rewrite-min-size和auto-aof-rewrite-percentage参数

			- auto-aof-rewrite-min-size

				- 表示运行AOF重写时文件最小体积，默认为64MB。

				- AOF文件最小重写大小，只有当AOF文件大小大于该值时候才可能重写，6.x默认配置64mb。

			- auto-aof-rewrite-percentage

				- 代表当前AOF文件空间和上一次重写后AOF文件空间(aof_base_size)的比值。

				- 当前AOF文件大小和最后一次重写后的大小之间的比率等于或者等于指定的增⻓百分比，如100代表当前AOF文件是上次重写的两倍时候才重写。 

		- 常用配置

			- # 是否开启aof 
```
appendonly yes
# 文件名称
appendfilename "appendonly.aof"
# 同步方式
appendfsync everysec
# aof重写期间是否同步
no-appendfsync-on-rewrite no
# 重写触发配置
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
# 加载aof时如果有错如何处理
# yes表示如果aof尾部文件出问题，写log记录并继续执行。 no表示提示写入等待修复后写入
aof-load-truncated yes
### AOF和RDB的选择问题
- Redis提供了不同的持久性选项
	- RDB持久化以指定的时间间隔执行数据集的时间点快照。
		- AOF持久化记录服务器接收的每个写入操作，将在服务器启动时再次读取，重建原始数据集。使用与Redis协议本身相同的格式以仅追加方式记录命令，当文件太大时，Redis能够重写
	
- RDB的优缺点
	- 优点
		- RDB最大限度地提高了Redis的性能，父进程不需要参与磁盘I/O
			- RDB文件紧凑，全量备份，适合用于进行备份和灾难恢复
			- 在恢复大数据集时的速度比 AOF 的恢复速度要快
			- 生成的是一个紧凑压缩的二进制文件
			- 缺点
		- 如果您需要在Redis停止工作时(例如断电后)将数据丢失的可能性降至最低，则RDB并不好
			- RDB经常需要fork才能使用子进程持久存储在磁盘上。如果数据集很大，Fork可能会非常耗时
		
- AOF的优缺点
	- 优点
		- 数据更加安全
			- 当Redis AOF文件太大时，Redis能够在后台自动重写AOF
			- AOF以易于理解和解析的格式，一个接一个地包含所有操作的日志
			- 缺点
		- AOF文件通常比同一数据集的等效RDB文件大
			- 根据确切的fsync策略，恢复的时候AOF可能比RDB慢
		
- 在线上我们到底该怎么做?
	- RDB持久化与AOF持久化一起使用
		- 如果Redis中的数据并不是特别敏感或者可以通过其它方式重写生成数据
		- 集群中可以关闭AOF持久化，靠集群的备份方式保证可用性
		- 自己制定策略定期检查Redis的情况，然后可以手动触发备份、重写数据;
		- 采用集群和主从同步
	
- Redis4.0后开始的rewrite支持混合模式
	- 就是rdb和aof一起用
		- 直接将rdb持久化的方式来操作将二进制内容覆盖到aof文件中，rdb是二进制，所以很小
		- 有写入的话还是继续append追加到文件原始命令，等下次文件过大的时候再次rewrite
		- 默认是开启状态
		- 好处
		- 混合持久化结合了RDB持久化和 AOF 持久化的优点，采取了rdb的文件小易于灾难恢复
			- 同时结合AOF，增量的数据以AOF方式保存了，数据更少的丢失
			- 坏处
		- 前部分是RDB格式，是二进制，所以阅读性较差
			- 数据恢复
		- 先看是否存在aof文件，若存在则先按照aof文件恢复，aof比rdb全，且aof文件也包含rewrite成rdb二进制格式数据
			- 若aof不存在，则才会查找rdb是否存在
		
## [进阶]Redis6.X服务端info+config命令和key过期删除策略以及内存淘汰算法
### info命令
- 介绍
	- info命令介绍
		- 查看服务器的各种信息和统计数值
			- 用途：运维服务器监控，可以用java调用redis命令获取对应信息
			- 使用
		- 在redis连接终端输入info命令，即可查看服务器配置信息和状态信息
			- 主要配置说明
		- Server: #有关redis服务器的常规信息
		redis_mode:standalone # 运行模式，单机或者集群
		multiplexing_api:epoll  # redis所使用的事件处理机制
		run_id:3abd26c33dfd059e87a0279defc4c96c13962ede # redis服务器的随机标识符(用于sentinel和集群)
		config_file:/usr/local/redis/conf/redis.conf # 配置文件路径
		
Clients: #客户端连接部分
connected_clients:10 # 已连接客户端的数量(不包括通过slave连接的客户端)

Memory: # 内存消耗相关信息
used_memory:874152 # 使用内存，以字节(byte)B为单位
used_memory_human:853.66K # 以人类可读的格式返回 Redis 分配的内存总量
used_memory_rss:2834432 # 系统给redis分配的内 存即常驻内存，和top 、 ps 等命令的输出一致
used_memory_rss_human:2.70M # 以人类可读的格 式返回系统redis分配的常驻内存top、ps等命令的输出一致
used_memory_peak:934040 # 内存使用的峰值大小
used_memory_peak_human:912.15K
total_system_memory:1039048704 # 操作系统的 总内存 ，以字节(byte)为单位
total_system_memory_human:990.91M
used_memory_lua:37888 # lua引擎使用的内存
used_memory_lua_human:37.00K

maxmemory:0 # 最大内存的配置值，0是不限制
maxmemory_human:0B maxmemory_policy:noeviction # 达到最大内存配置值后的策略

Persistence: #RDB和AOF相关信息
rdb_bgsave_in_progress:0 # 标识rdb save是否进行中
rdb_last_bgsave_status:ok # save操作状态
rdb_last_bgsave_status:ok # save操作状态
rdb_last_bgsave_time_sec:-1 rdb  # save操作使用的时间(单位s)
rdb_current_bgsave_time_sec:-1  # save操作正在进行，则是所使用的时间

aof_enabled:1 # 是否开启aof，默认没开启
aof_rewrite_in_progress:0  # 标识aof的rewrite操作是否在进行中
aof_last_rewrite_time_sec:-1  # 上次rewrite操作使用的时间(单位s)
aof_current_rewrite_time_sec:-1 # 如果 rewrite操作正在进行，则记录所使用的时间
aof_last_bgrewrite_status:ok #上次rewrite操作的状态
aof_current_size:0 # aof当前大小

Stats: #一般统计
evicted_keys:0 # 因为内存大小限制，而被驱逐出去的键的个数

Replication: #主从同步信息
role:master # 角色
connected_slaves:1 # 连接的从库数
master_sync_in_progress:0 # 标识主redis正在同步到从redis

CPU: #CPU消耗统计
Cluster: #集群部分
cluster_enabled:0 # 实例是否启用集群模式

Keyspace:#数据库相关统计
db0:keys=4,expires=0,avg_ttl=0 # db0的key的数量,带有生存期的key的数,平均存活时间
### config命令
- 介绍
	- 可以动态地调整 Redis 服务器的配置(configuration)而无须重启
		- config get xxx、config set xxx
	
- 常用配置
	- daemonize #后端运行
	bind #ip绑定
	timeout #客户端连接时的超时时间，单位为秒。当客户端在 这段时间内没有发出任何指令，那么关闭该连接
	
databases #设置数据库的个数，可以使用 SELECT 命令来切 换数据库。默认使用的数据库是 0
save #设置 Redis 进行rdb持久化数据库镜像的频率。
rdbcompression #在进行镜像备份时，是否进行压缩

slaveof #设置该数据库为其他数据库的从数据库
masterauth #当主数据库连接需要密码验证时，在这里配置

maxclients #限制同时连接的客户数量,当连接数超过这个值 时,redis 将不再接收其他连接请求,返回error

maxmemory #设置 redis 能够使用的最大内存，一般线上都需要设置
- 备注
	- 防止所用内存超过服务器物理内存， maxmemory限制的是Redis实际使用的内存量， 也就是used_memory统计项对应的内存
		- 由于内存碎片率的存在， 实际消耗的内存可能会比 maxmemory设置的更大， 实际使用时要小心这部分内存溢出
		- 默认无限使用服务器内存，为防止极端情况下导致系统内存耗尽，建议所有的Redis进程都要配置maxmemory在64bit系统下，maxmemory设置为0表示不限制Redis内存使用，在32bit系统下，maxmemory不能超过3GB
	
- 注意
	- redis在占用的内存超过指定的maxmemory之后，通过maxmemory_policy确定redis是否释放内存以及如何释放内存
	
### Redis6的key过期时间删除策略
- 背景
	- redis的key配置了过期时间，这个是怎么被删除的
		- redis数据明明过期了，怎么还占用着内存?
		- Redis 就只能用 10G，你要是往里面写了 20G 的数据，会发生什么？淘汰哪些数据
	
- redis key过期策略
	- 定期删除+惰性删除。
	
- Redis如何淘汰过期的keys
(set name "张三" 3600)
	- 定期删除
		- 隔一段时间，就随机抽取一些设置了过期时间的key，检查其是否过期，如果过期就删除
			- 定期删除可能会导致很多过期 key 到了时间并没有被删除掉，那咋整呢，所以就是惰性删除
			- 惰性删除
		- 概念
			- 当一些客户端尝试访问它时，key会被发现并主动的过期
				- 放任键过期不管，但是每次从键空间中获取键时，都检查取得的键是否过期，如果过期的话，就删除该键
			- 总结
		- Redis服务器实际使用的是惰性删除和定期删除两种策略：通过配合使用这两种删除策略，服务器可以很好地在合理使用CPU时间和避免浪费内存空间之间取得平衡。
			- 问题
		- 如果定期删除漏掉了很多过期 key，然后你也没及时去查，也就没走惰性删除，此时会怎么样?
			- 如果大量过期 key 堆积在内存里，导致 redis 内存块耗尽了，就需要走内存淘汰机制
			- 解决
		- 设计缓存中间件：可以参考redis的key过期淘汰方式和内存不足淘汰方式
		
### 内存不足时-Redis的Key内存淘汰策略
- 背景
	- 何时发生：redis在占用的内存超过指定的maxmemory之后
		- 如果解决：通过maxmemory_policy确定redis是否释放内存以及如何释放内存
		- 提供多种策略
	
- 策略
	- volatile-lru(least recently used)
		- 最近最少使用算法，从设置了过期时间的键中选择空转时间最⻓的键值对清除掉;
			- volatile-lfu(least frequently used)
		- 最近最不经常使用算法，从设置了过期时间的键中选择某段时间之内使用频次最小的键值对清除掉;
			- volatile-ttl
		- 从设置了过期时间的键中选择过期时间最早的键值对清除 (删除即将过期的)
			- volatile-random
		- 从设置了过期时间的键中，随机选择键进行清除;
			- allkeys-lru
		- 最近最少使用算法，从所有的键中选择空转时间最⻓的键值对清除;
			- allkeys-lfu
		- 最近最不经常使用算法，从所有的键中选择某段时间之内使用频次最少的键值对清除;
			- allkeys-random
		- 所有的键中，随机选择键进行删除;
			- noeviction
		- 不做任何的清理工作，在redis的内存超过限制之后，所有的写入操作都会返回错误；但是读操作都能正常的进行；
		
- 注意
	- config配置的时候 下划线_的key需要用中横线-
		- 127.0.0.1:6379> config set maxmemory_policy volatile-lru
		(error) ERR Unsupported CONFIG parameter:maxmemory_policy
		
127.0.0.1:6379> config set maxmemory-policy volatile-lru
OK
## [进阶]Redis6.X主从复制+读写分离
### 介绍
- 背景
	- 单机部署简单，但是可靠性低，且不能很好利用CPU多核处理能力
		- 生产环境-必须要保证高可用-一般不可能单机部署(单机很危险)
		- 读写分离是可用性要求不高、性能要求较高、数据规模小的情况;
	
- 目标
	- 读写分离，扩展主节点的读能力，分担主节点读压力
		- 容灾恢复，一旦主节点宕机，从节点作为主节点的备份可以随时顶上来
	
- Redis主从架构介绍
	- 
	
### Redis6.X 主从复制 1主2从架构环境准备
- 配置
	- mkdir -p /data/redis/master/data
	mkdir -p /data/redis/slave1/data
	mkdir -p /data/redis/slave2/data
	
#从节点开启只读模式(默认)
replica-read-only yes

#从节点访问主节点的密码，和requirepass一样 masterauth 123456

#哪个主节点进行复制
replicaof 8.129.113.233 6379
- 创建主配置文件redis.conf
	- bind 0.0.0.0
	port 6379
	#守护进程, 如果是docker需设置为no
	daemonize yes
	
requirepass "123456"

logfile "/usr/local/redis/log/redis1.log"
dbfilename "forest.rdb"
dir "/usr/local/redis/data"
appendonly yes
appendfilename "appendonly1.aof"
masterauth "123456"
- 创建两个从配置文件redis.conf
	- bind 0.0.0.0
	port 6380
	daemonize yes
	requirepass "123456"
	logfile "/usr/local/redis/log/redis2.log"
	dbfilename "forest2.rdb"
	dir "/usr/local/redis/data"
	appendonly yes
	appendfilename "appendonly2.aof"
	replicaof 8.129.113.233 6379
	masterauth "123456"
	
- 创建从配置文件redis.conf
	- bind 0.0.0.0
	port 6381
	daemonize yes
	requirepass "123456"
	logfile "/usr/local/redis/log/redis3.log"
	dbfilename "forest3.rdb"
	dir "/usr/local/redis/data"
	appendonly yes
	appendfilename "appendonly3.aof"
	replicaof 8.129.113.233 6379
	masterauth "123456"
	
- 注意
	- 防火墙记得关闭，或者开放对应的端口
		- 阿里云服务器记得开放网络安全组
		
### Redis6.X 主从复制1主2从架构搭建
- 启动
	- #启动主
	./redis-server /data/redis/master/data/redis.conf
	
#启动从
./redis-server /data/redis/slave1/data/redis.conf

#启动从
./redis-server /data/redis/slave2/data/redis.conf
# 客户端连接节点
./redis-cli -a 123456 -p 6381
- 查看状态
	- info replication
	
- 主从复制和读写验证
	- 在主节点设置缓存  set name jack
		- 在从节点上也可以获取  get name  的结果 jack
		- 
	
- 无法在从节点上写数据
	- 
	
- 日志
	- 
	
- 注意
	- 防火墙记得关闭，或者开放对应的端口
		- 6379 主节点
		6380 从节点
		6381 从节点
		
### Redis6.X主从复制-读写分离原理解析
- 主从复制分两种(主从刚连接的时候，进行全量同步；全同步结束后，进行增量同步)

- 全量复制
	- master服务器会开启一个后台进程用于将redis中的数据生成一个rdb文件
		- 主服务器会缓存所有接收到的来自客户端的写命令，当后台保存进程处理完毕后，会将该rdb文件传递给slave服务器
		- slave服务器会将rdb文件保存在磁盘并通过读取该文件将数据加载到内存
		- 在此之后master服务器会将在此期间缓存的命令通过redis传输协议发送给slave服务器
		- 然后slave服务器将这些命令依次作用于自己本地的数据集上最终达到数据的一致性
	
- 增量复制
	- Slave初始化后开始正常工作时主服务器发生的写操作同步到从服务器的过程
		- 服务器每执行一个写命令就会向从服务器发送相同的写命令，从服务器接收并执行收到的写命令
	
- 特点
	- 主从复制对于 主/从 redis服务器来说是非阻塞的，所以同步期间都可以正常处理外界请求
		- 一个主redis可以含有多个从redis，每个从redis可以接收来自其他从redis服务器的连接
		- 从节点不会让key过期，而是主节点的key过期删除后，成为del命令传输到从节点进行删除
		- 从节点开启 sync 看日志
			- 
		
- 加速复制(可靠性不是很高)
	- 完全重新同步需要在磁盘上创建一个RDB文件，然后加载这个文件以便为从服务器发送数据
		- 在比较低速的磁盘，这种操作会给主服务器带来较大的压力
		- 新版支持无磁盘的复制，子进程直接将RDB通过网络发送给从服务器，不使用磁盘作为中间存储
		- 配置开启
		- repl-diskless-sync yes #(默认是no)
		
- 主从断开重连
	- 如果遭遇连接断开，重新连接之后可以从中断处继续进行复制，而不必重新同步
		- 2.8版本后部分重新同步这个新特性内部使用PSYNC命令，旧的实现中使用SYNC命令
	
## [进阶]Redis6.X高可用之主从+Sentinel哨兵监控
### 背景
- 前面搭建了主从，当主服务器宕机后，需要手动把一台从服务器切换为主服务器，人工干预费事费力，还会造成一段时间内服务不可用

### 哨兵模式介绍
- Redis提供了哨兵的命令，是一个独立的进程

- 原理
	- 哨兵通过发送命令给多个节点，等待Redis服务器响应，从而监控运行的多个Redis实例的运行情况
		- 当哨兵监测到master宕机，会自动将slave切换成master，通过通知其他的从服务器，修改配置文件切换主机
	
### Sentinel三大工作任务
- 监控(Monitoring)
	- Sentinel 会不断地检查你的主服务器和从服务器是否运作正常
	
- 提醒(Notification)
	- 当被监控的某个 Redis 服务器出现问题时，Sentinel 可以通过 API 向管理员或者其他应用程序发送通知
	
- 自动故障迁移(Automatic failover)
	- 当一个主服务器不能正常工作时， Sentinel 会开始一次自动故障迁移操作， 它会将失效主服务器的其中一个从服务器升级为新的主服务器， 并让失效主服务器的其他从服务器改为复制新的主服务器
		- 当客户端试图连接失效的主服务器时，集群也会向客户端返回新主服务器的地址，使得集群可以使用新主服务器代替失效服务器
	
### 问题
- 一个哨兵进程对Redis服务器进行监控，可能会出现问题

- 一般是使用多个哨兵进行监控，各个哨兵之间还会进行监控，形成多哨兵模式

### 多哨兵模式下线名称介绍
- 主观下线(Subjectively Down， 简称 SDOWN)
	- 是单个 Sentinel 实例对服务器做出的下线判断，比如网络问题接收不到通知等
		- 一个服务器没有在 down-after-milliseconds 选项所指定的时间内， 对向它发送 PING 命令的 Sentinel 返回一个有效回复(valid reply)， 那么 Sentinel 就会将这个服务器标记为主观下线
	
- 客观下线(Objectively Down， 简称 ODOWN)
	- 指的是多个 Sentinel 实例在对同一个服务器做出 SDOWN 判断，并且通过 SENTINEL is-master-down-by-addr 命令互相交流之后，得出的服务器下线判断
		- 一个 Sentinel 可以通过向另一个 Sentinel 发送 SENTINEL is-master-down-by-addr 命令来询问对方是否认为给定的服务器已下线
		- 客观下线条件只适用于主服务器
	
- 仲裁 quorum
	- Sentinel 在给定的时间范围内，从其他 Sentinel 那里接收到了【足够数量】的主服务器下线报告，那么 Sentinel 就会将主服务器的状态从主观下线改变为客观下线
		- 这个【足够数量】就是配置文件里面的值，一般是Sentinel个数的一半加1，比如3个Sentinel则就设置为2
		- down-after-milliseconds 是一个哨兵在超过规定时间依旧没有得到响应后，会自己认为主机不可用
		- 当拥有认为主观下线的哨兵达到sentinel monitor所配置的数量时，就会发起一次投票，进行failover
	
### Sentinel哨兵搭建环境准备
- 核心流程
	- 每秒ping，超过时间不响应 则认为主观下线
		- 满足多个，则认为是客观下线
		- 投票选择主节点
		- 如果没有足够的节点同意master下线，则状态会被移除
	
- 环境准备
	- 配置3个哨兵，每个哨兵的配置都是一样的
		- 启动顺序：先启动主再启动从，最后启动3个哨兵
		- 哨兵端口是【26379】记得开放
		- #不限制ip
		bind 0.0.0.0
		
# 让sentinel服务后台运行
daemonize yes
# 配置监听的主服务器，mymaster代表服务器的名称，自定义，172.18.172.109 代表监控的主服务器，6379代表端口，
#2代表只有两个或两个以上的哨兵认为主服务器不可用的时 候，才会进行failover操作。
sentinel monitor mymaster 172.18.172.109 6379 2
# sentinel auth-pass定义服务的密码，mymaster是服务名称，123456是Redis服务器密码
sentinel auth-pass mymaster 123456

#超过5秒master还没有连接上，则认为master已经停止
sentinel down-after-milliseconds mymaster 5000

#如果该时间内没完成failover操作，则认为本次 failover失败
sentinel failover-timeout mymaster 30000
```plaintext
- 在目录下创建3个文件sentinel-1.conf、sentinel-2.conf、sentinel-3.conf

	- port 26379
```
bind 0.0.0.0
daemonize yes
pidfile "/var/run/redis-sentinel-1.pid"
logfile "/var/log/redis/sentinel_26379.log"
dir "/tmp"
sentinel monitor mymaster 8.129.113.233 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel auth-pass mymaster 123456
sentinel failover-timeout mymaster 30000
```plaintext
	- port 26380
```
bind 0.0.0.0
daemonize yes
pidfile "/var/run/redis-sentinel-2.pid"
logfile "/var/log/redis/sentinel_26380.log"
dir "/tmp"
sentinel monitor mymaster 8.129.113.233 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel auth-pass mymaster 123456
sentinel failover-timeout mymaster 30000
```plaintext
	- port 26381
```
bind 0.0.0.0
daemonize yes
pidfile "/var/run/redis-sentinel-3.pid"
logfile "/var/log/redis/sentinel_26381.log"
dir "/tmp"
sentinel monitor mymaster 8.129.113.233 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel auth-pass mymaster 123456
sentinel failover-timeout mymaster 30000
```plaintext
- 记得创建 /var/log/redis 文件夹
```
### Sentinel哨兵集群搭建
- 启动哨兵集群
	- ./redis-server /usr/local/redis/conf/sentinel-1.conf --sentinel
		- ./redis-server /usr/local/redis/conf/sentinel-2.conf --sentinel
		- ./redis-server /usr/local/redis/conf/sentinel-3.conf --sentinel
	
- 关闭主redis节点模拟服务器宕机
	- 自动推选一个从节点为主节点
		- 
			- 主节点恢复自动变为从节点
		- 
		
- 注意：如果是云服务器，网络安全组需要开放端口

- 优点
	- 主从可以自动切换，可用性更高
	
- 缺点
	- 主从切换会丢失短暂数据
		- 主节点的写能力和存储能力受限 (集群分片可以解决)
	
### SpringBoot整合redis主从和sentinel哨兵
- 配置
	- 增加sentinel配置，不用配置redis的host和port
		- 
		
- 只有第一次才从数据库获取数据，后续从缓存中获取
	- 
	
- 旧的master节点宕机，自动返回新的master节点
	- 
		- 
	
- 总结：不直接连接redis，而是连接sentinel，sentinel会先尝试连接旧的master节点，当发现旧的master节点宕机，自动返回最新的master节点

## [进阶]Redis6.X高可用之Cluster集群和分片
### Cluster集群介绍
- 背景
	- Sentinel解决了主从架构故障自动迁移的问题
		- 但是Master主节点的写能力和存储能力依旧受限
		- 使用Redis的集群cluster就是为了解决单机Redis容量有限的问题，将数据按一定的规则分配到多台机器
	
- 什么是集群Cluster
	- 是一组相互独立的、通过高速网络互联的计算机，它们构成了一个组，并以单一系统的模式加以管理
		- 容易和分布式弄混，分布式系统简单的可以认为就是一个庞大的系统，进行拆分成多个小系统
		- 总结：集群是各个节点都做相同的事情，分布式是拆分后的各个小系统分别负责不同的事情。
	
- Redis集群模式介绍
	- Cluster模式是Redis3.0开始推出
		- 采用无中心结构，每个节点保存数据和整个集群状态, 每个节点都和其他所有节点连接
		- 官方要求：至少6个节点才可以保证高可用，即3主3从；扩展性强、更好做到高可用
		- 各个节点会互相通信，采用gossip协议交换节点元数据信息（类似网状型）
		- 数据分散存储到各个节点上
		- 
			```plaintext
		  - 写数据的时候，是分散存储到各个Master节点的，Slave1节点负责Master1节点的拷贝，其余以此类推，当Master1节点宕机，Slave1就会顶上来作为Master节点
		```
### Cluster数据分片和虚拟哈希槽介绍
- 背景
	- 主节点的写能力和存储能力受限
		- 单台机器无法满足需求，因此把数据分散存储到多个机器
		- 类似案例: mysql分库分表
	
- 常⻅的数据分区算法
	- 哈希取模
		- 对选择的 partitioning key 计算其哈希值，得到的哈希值就是对应的分区
			- 范围分片
		- 通过确定分区键是否在某个范围内来选择分区
			- 一致性Hash分区
		- redis cluster集群没有采用一致性哈希方案，而是采用【数据分片】中的哈希槽来进行数据存储与读取的
	
- 什么是Redis的哈希槽 slot
	- Redis集群预分好16384个槽，当需要在 Redis 集群中放置一个 key-value 时，根据 CRC16(key) mod 16384 的值，决定将一个key放到哪个桶中
	
- 大体流程
	- 假设主节点的数量为3，将16384个槽位按照【用户自己的规则】去分配这3个节点，每个节点复制一部分槽位
		- 节点1的槽位区间范围为0-5460
		- 节点2的槽位区间范围为5461-10922
		- 节点3的槽位区间范围为10923-16383
		- 注意: 从节点是没有槽位的，只有主节点才有
	
- 存储查找
	- 对要存储查找的键进行crc16哈希运算,得到一个值，并取模16384，判断这个值在哪个节点的范围区间
		- 假设crc16("test_key")%16384=3000，就是节点一
		- crc16算法不是简单的hash算法，是一种校验算法
	
- 

- 使用哈希槽的好处就在于可以方便的添加或移除节点。
	- 当需要增加节点时，只需要把其他节点的某些哈希槽挪到新节点就可以了;
		- 当需要移除节点时，只需要把移除节点上的哈希槽挪到其他节点就行了
	
### Cluster集群环境准备
- 说明
	- 旧版本的需要使用ruby语言进行构建，新版5之后直接用redis-cli即可
		- 6个节点，三主双从，主从节点会自动分配，不是人工指定
		- 主节点故障后，从节点会替换主节点
	
- 注意点
	- 把之前的rdb、aof文件删除
	
- 节点(网络安全组开放端口)
	- 6381、6382
	6383、6384
	6385、6386
	
- 

- 配置
	- bind 0.0.0.0
	port 6381
	daemonize yes
	requirepass "123456"
	logfile "/usr/local/redis/log/redis1.log"
	dbfilename "forest1.rdb"
	dir "/usr/local/redis/data"
	appendonly yes
	appendfilename "appendonly1.aof"
	masterauth "123456"
	#是否开启集群
	cluster-enabled yes
	
# 生成的node文件，记录集群节点信息，默认为 nodes.conf，防止冲突，改为nodes-6381.conf
cluster-config-file nodes-6381.conf

#节点连接超时时间
cluster-node-timeout 20000

#集群节点的ip，当前节点的ip
cluster-announce-ip 172.18.172.109

#集群节点映射端口
cluster-announce-port 6381

#集群节点总线端口,节点之间互相通信，常规端口+1万
cluster-announce-bus-port 16381
- 注意：集群部署开发、生产一般都是内网，减少带宽带来的影响

### Cluster集群三主三从搭建实战
- 启动6个节点
	- 停掉之前部署的redis主从复制哨兵
		- 查看redist服务启动的进程
			- ps -ef | grep redis
				- ./redis-server ../conf/cluster/redis1.conf
	./redis-server ../conf/cluster/redis2.conf
	./redis-server ../conf/cluster/redis3.conf
	./redis-server ../conf/cluster/redis4.conf
	./redis-server ../conf/cluster/redis5.conf
	./redis-server ../conf/cluster/redis6.conf
	
- 加入集群(其中一个节点执行即可)
	- --cluster 构建集群全部节点信息
		- --cluster-replicas 1 主从节点的比例，1表示1主1从的方式
		- ./redis-cli -a 123456 --cluster create 172.18.172.109:6381 172.18.172.109:6382 172.18.172.109:6383 172.18.172.109:6384 172.18.172.109:6385 172.18.172.109:6386 --cluster-replicas 1
		- 
	
- 检查状态信息(其中一个节点执行即可)
	- ./redis-cli -a 123456 --cluster check 172.18.172.109:6381
		- 
		
### Cluster集群读写命令实战
- 集群状态
	- ./redis-cli -c -a 123456 -p 6379
	
#集群信息
cluster info

#节点信息
cluster nodes
```plaintext
	-  
```
- 测试集群读写命令set/get
	- key哈希运算计算槽位置
		- 槽在当前节点的话直接插入/读取，否则自动转向到对应的节点
	
- 操作都是主节点操作，从节点只是备份

- 流程解析
	- 启动应用
		- 加入集群
		- 从节点请求复制主节点(和主从复制一样)
		- 先全量
			- 再增量
		
### Cluster集群整合SpringBoot2.X
- 不在同个网络，所以集群改为阿里云公网ip地址才可以访问（这里是本地+阿里云服务器导致）
	- 公司开发部署都会用同个网络
		- 配置文件修改
		- #对外的ip
		cluster-announce-ip 8.129.113.233
		
#对外端口
cluster-announce-port

#集群桥接端口
cluster-announce-bus-por
```plaintext
- 动态修改配置（临时的，重启redis失效）

	- config set cluster-announce-ip 8.129.113.233
```
- 连接池添加
	- 
		<dependency>	<groupId>org.apache.commons</groupId>
	<artifactId>commons-pool2</artifactId>	</dependency>
- 配置文件(注释Sentinel相关配置)
	- cluster:
	#命名的最多转发次数
	max-redirects: 3
	nodes: 8.129.113.233:6381,8.129.113.233:6382,8.129.113.233:6383,8.129.113.233:6384,8.129.113.233:6385,8.129.113.233:6386
	
### Cluster集群故障自动转移实战和总结
- 集群里面有故障时的表现
	- 某个master节点宕机
		- 从节点成为新的master节点
		- 
		
- 命令
	- ./redis-cli -c -a 123456 -p 6381
	
#集群信息
cluster info

#节点信息
cluster nodes
```plaintext
	-  
```
- 高可用架构总结
	- 主从模式: 读写分离，备份，一个Master可以有多个 Slaves
		- 哨兵sentinel: 监控，自动转移，哨兵发现主服务器挂了后，就会从slave中重新选举一个主服务器
		- 集群: 为了解决单机Redis容量有限的问题，将数据按一定的规则分配到多台机器，内存/QPS不受限于单机，提高并发量。
		- 这三种在不同的公司都有可能用到，具体看业务情况和实际qps
	
## [进阶]分布式缓存Redis6.X新特性
### 多线程
- redis6多线程只是用来处理网络数据的读写和协议解析上，底层数据操作还是单线程

- 执行命令仍然是单线程，之所以这么设计是不想因为多线程而变得复杂，需要去控制 key、lua、事务，LPUSH/LPOP 等等的并发问题

- 默认不开启
	- io-threads-do-reads yes
	
io-threads 线程数
- 官方建议 ( 线程数小于机器核数 )
	- 4 核的机器建议设置为 2 或 3 个线程
		- 8 核的建议设置为4或6个线程
		- 启多线程后，是否会存在线程并发安全问题?
		- 不会有安全问题，Redis 的多线程部分只是用来处理网络数据的读写和协议解析，执行命令仍然是单线程顺序执行。
		
### ACL 权限控制(暂时有点鸡肋，作为了解)
- 引入了 ACL(Access Control List)
	- 之前的redis没有用户的概念，redis6引入了acl
		- 可以给每个用户分配不同的权限来控制权限
		- 通过限制对命令和密钥的访问来提高安全性，以使不受信任的客户端无法访问
		- 提高操作安全性，以防止由于软件错误或人为错误而导致进程或人员访问 Redis，从而损坏数据或配置
		- 文档: [https://redis.io/topics/acl](https://redis.io/topics/acl)
		- 常用命令
		- acl list 当前启用的 ACL 规则
			- acl cat 支持的权限分类列表
			- acl cat hash 返回指定类别中的命令
			- acl setuser 创建和修改用户命令
			- acl deluser 删除用户命令
			- +<command> 将命令添加到用户可以调用的命令列表 中，如+@hash
		-<command> 将命令从用户可以调用的命令列表中移除
		
#切换默认用户
auth default 123456

#例子 密码 123 ，全部key，全部权限 acl setuser jack on >123 ~* +@all

#例子 密码 123 ，全部key，get权限 acl setuser jack on >123 ~* +get
```plaintext
	-  
```
### 客户端缓存(client side caching)
注意：不是很稳定，服务器通知客户端某个key过期了，这个时候网络出现问题，那这种情况就有问题，但是这种本地缓存性能是高很多的
- 类似浏览器缓存一样
	- 在服务器端更新了静态文件(如css、js、图片)，能够在客户端得到及时的更新，但又不想让浏览器每次请求都从服务器端获取静态资源
		- 类似前端的-Expires、Last-Modified、Etag缓存控制
		- 文档: [https://redis.io/topics/client-side-caching](https://redis.io/topics/client-side-caching)
		- 
	
- 分为两种模式
	- redis在服务端记录访问的连接和相关的key， 当key有变化时通知相应的应用，应用收到请求后自行处理有变化的key, 进而实现 client cache与redis的一致 这需要客户端实现，目前lettuce对其进行了支持
		- 默认模式
		- Server 端全局唯一的表(Invalidation Table)记录每个Client访问的Key，当发生变更时，向client推送数据过期消息。
			- 优点: 只对Client发送其访问过的被修改的数据
			- 缺点: Server端需要额外存储较大的数据量。
			- 广播模式
		- 客户端订阅key前缀的广播，服务端记录key前缀与client的对应关系。当相匹配的key发生变化时通知client。
			- 优点: 服务端记录信息比较少
			- 缺点: client会收到自己未访问过的key的失效通知
		
