---
urlname: sharding-jdbc
title: ShardingJDBC分库分表mysql数据库实战笔记
updated: '2024-01-13 18:37:30'
date: '2024-01-13 18:08:13'
status: 已发布
catalog:
  - 后端
  - 分库分表
---
# ShardingJDBC分库分表mysql数据库实战笔记
## 为什么要学习分库分表和Sharding-JDBC
### 多数互联网公司里面用的技术，高并发项目都离不开分库分表
### 数据库性能优化的至关重要环节，分库分表是必杀技之一
### 在多数互联网公司中，ShardingJDBC占有率很高，是Apache 下的顶级项目
### 高级工程师岗位面试都喜欢问分库分表各种业务场景
### 可以作为公司内部培训技术分享必备知识，超多案例+实战等
## 海量数据下Mysql架构演变升级+分库 分表优缺点
### Mysql数据库架构演变历史
- 单机
	- 请求量大查询慢
		- 单机故障导致业务不可用
	
- 主从
	- 数据库主从同步，从库可以水平扩展，满足更大读需求
		- 但单服务器TPS，内存，IO都是有限的
	
- 双主
	- 用户量级上来后，写请求越来越多
		- 一个Master是不能解决问题的，添加多了个主节点进行写入
		- 多个主节点数据要保存一致性，写操作需要2个master之间同步更加复杂
	
- 分库和分表
	- 
	
### 业务增⻓-数据库性能优化思路讲解
- 面试官：这边有个数据库-单表1千万数据，未来1年还会增⻓多 500万，性能比较慢，说下你的优化思路

- 注意
	- 千万不要一上来就说分库分表，这个是最忌讳的事项
	
- 两个⻆度思考
	- 不分库分表
		- 软优化
			- 数据库参数调优
				- 分析慢查询SQL语句，分析执行计划，进行sql改写和程序改写
				- 优化数据库索引结构
				- 优化数据表结构优化
				- 引入NOSQL和程序架构调整
				- 硬优化
			- 提升系统硬件(更快的IO、更多的内存)：带宽、CPU、硬盘
				- 分库分表
		- 根据业务情况而定，选择合适的分库分表策略(没有通用的策略)
			- 外卖、物流、电商领域
				- 先看只分表是否满足业务的需求和未来增⻓
			- 数据库分表能够解决单表数据量很大的时，数据查询 的效率问题
				- 无法给数据库的并发操作带来效率上的提高，分表 的实质还是在一个数据库上进行的操作，受数据库IO性能的限制
				- 如果单分表满足不了需求，再分库分表一起
		
- 结论
	- 在数据量及访问压力不是特别大的情况，首先考虑缓存、读写分离、索引技术等方案
		- 如果数据量极大，且业务持续增⻓快，再考虑分库分表方案
	
### 分库分表解决的现状问题
- 解决数据库本身瓶颈
	- 连接数: 连接数过多时，就会出现‘too many connections’的错误，访问量太大或者数据库设置的最大 连接数太小的原因
		- Mysql默认的最大连接数为100.可以修改，而mysql服务允许的最大连接数为16384
		- 数据库分表可以解决单表海量数据的查询性能问题
		- 数据库分库可以解决单台数据库的并发访问压力问题
		- 
	
- 解决系统本身IO、CPU瓶颈
	- 磁盘读写IO瓶颈，热点数据太多，尽管使用了数据库本身缓存，但是依旧有大量IO，导致sql执行速度慢
		- 网络IO瓶颈，请求的数据太多，数据传输大，网络带宽不够，链路响应时间变⻓
		- CPU瓶颈，尤其在基础数据量大单机复杂SQL计算，SQL语句执行占用CPU使用率高，也有扫描行数大、锁冲突、锁等待等原因
		- 可以通过 show processlist; 、show full processlist， 发现 CPU 使用率比较高的SQL
			- 常⻅的对于查询时间⻓，State 列值是 Sending data， Copying to tmp table，Copying to tmp table on disk，Sorting result，Using filesort 等都是可能有性能问题SQL，清楚相关影响问题的情况可以kill掉
			- 也存在执行时间短，但是CPU占用率高的SQL，通过上 面命令查询不到，这个时候最好通过执行计划分析 explain进行分析
		
### Mysql数据库分库分表后的六大问题
(具体如何解决？看后续笔记，总的来说优点大于缺点)
- 问题一：跨节点数据库Join关联查询
	- 数据库切分前，多表关联查询，可以通过sql join进行实现
		- 分库分表后，数据可能分布在不同的节点上，sql join带来 的问题就比较麻烦
	
- 问题二：分库操作带来的分布式事务问题
	- 操作内容同时分布在不同库中，不可避免会带来跨库事务
		- 问题，即分布式事务
	
- 问题三：执行的SQL排序、翻⻚、函数计算问题
	- 分库后，数据分布在不同的节点上， 跨节点多库进行查询时，会出现limit分⻚、order by排序等问题
		- 而且当排序字段非分片字段时，更加复杂了，要在不同的 分片节点中将数据进行排序并返回，然后将不同分片返回 的结果集进行汇总和再次排序(也会带来更多的CPU/IO资 源损耗)
	
- 问题四：数据库全局主键重复问题
	- 常规表的id是使用自增id进行实现，分库分表后，由于表中数据同时存在不同数据库中，如果用自增id，则会出现冲突问题
	
- 问题五：容量规划,分库分表后二次扩容问题
	- 业务发展快，初次分库分表后，满足不了数据存储，导致需要多次扩容
	
- 问题六：分库分表技术选型问题
	- 市场分库分表中间件相对较多，框架各有各的优势与短板，应该如何选择
	
## 海量数据下Mysql数据库常⻅分库分 表介绍
### 海量数据处理之Mysql数据库【垂直分表】
- 需求：商品表字段太多，每个字段访问频次不一样，浪费了IO资源，需要进行优化

- 垂直分表介绍
	- 也就是“大表拆小表”，基于列字段进行的
		- 拆分原则一般是表中的字段较多，将不常用的或者数据较大，⻓度较⻓的拆分到“扩展表 如text类型字段
		- 访问频次低、字段大的商品描述信息单独存放在一张表中，访问频次较高的商品基本信息单独放在一张表中
		- 垂直拆分原则
		- 把不常用的字段单独放在一张表;
			- 把text，blob等大字段拆分出来放在附表中;
			- 业务经常组合查询的列放在一张表中
		
- 举个例子：商品详情一般是拆分主表和附表
	- 拆分前
		- CREATE TABLE `product` (
		`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
		`title` varchar(524) DEFAULT NULL COMMENT '视频标 题',
		`cover_img` varchar(524) DEFAULT NULL COMMENT '封面图',
		
`price` int(11) DEFAULT NULL COMMENT '价格,分', `total` int(10)                      DEFAULT '0' COMMENT '总库存',
`left_num` int(10) DEFAULT '0' COMMENT '剩余',
`learn_base` text COMMENT '课前须知，学习基础', `learn_result` text              COMMENT '达到水平',
`summary` varchar(1026) DEFAULT NULL COMMENT '概述',
`detail` text COMMENT '视频商品详情', PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```plaintext
- 拆分后

	- CREATE TABLE `product` (
```
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`title` varchar(524) DEFAULT NULL COMMENT '视频标 题',
`cover_img` varchar(524) DEFAULT NULL COMMENT '封面图',
`price` int(11) DEFAULT NULL COMMENT '价格,分',
`total` int(10) DEFAULT '0' COMMENT '总库存',
`left_num` int(10) DEFAULT '0' COMMENT '剩余', PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `product_detail` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`product_id` int(11) DEFAULT NULL COMMENT '产品主 键',
`learn_base` text COMMENT '课前须知，学习基础',
`learn_result` text COMMENT '达到水平',
`summary` varchar(1026) DEFAULT NULL COMMENT '概述',
`detail` text COMMENT '视频商品详情', PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
### 海量数据处理之Mysql数据库【垂直分库】
- 需求：C端项目里面，单个数据库的CPU、内存⻓期处于90%+的利用率，数据库连接经常不够，需要进行优化

- 垂直分库介绍
	- 垂直分库针对的是一个系统中的不同业务进行拆分， 数据库的连接资源比较宝贵且单机处理能力也有限
		- 没拆分之前全部都是落到单一的库上的，单库处理能力成为瓶 颈，还有磁盘空间，内存，tps等限制
		- 拆分之后，避免不同库竞争同一个物理机的CPU、内存、网络 IO、磁盘，所以在高并发场景下，垂直分库一定程度上能够突破IO、连接数及单机硬件资源的瓶颈
		- 垂直分库可以更好解决业务层面的耦合，业务清晰，且方便管理和维护
		- 一般从单体项目升级改造为微服务项目，就是垂直分库
		- 垂直分库
		
- 问题：垂直分库分表可以提高并发，但是依然没有解决单表数据量过大的问题

### 海量数据处理之Mysql数据库【水平分表】
- 需求：当一张表的数据达到几千万时，查询一次所花的时间⻓，需要进行优化，缩短查询时间

- 如何理解：都是大表拆小表
	- 垂直分表：表结构拆分
		- 水平分表：数据拆分
	
- 水平分表
	- 把一个表的数据分到一个数据库的多张表中，每个表只有这个表的部分数据
		- 核心是把一个大表，分割N个小表，每个表的结构是一样的，数据不一样，全部表的数据合起来就是全部数据
		- 针对数据量巨大的单张表(比如订单表)，按照某种规则(RANGE,HASH取模等)，切分到多张表里面去
		- 但是这些表还是在同一个库中，所以单数据库操作还是有IO 瓶颈，主要是解决单表数据量过大的问题
		- 减少锁表时间，没分表前，如果是DDL(create/alter/add等)语句，当需要添加一列的时候mysql会锁表，期间所有的读写操作只能等待
		- 为什么减少锁表时间：数据量小了，只需操作一个小表，使得锁定的粒度更小
		
### 海量数据处理之Mysql数据库【水平分库】
- 需求：高并发的项目中，水平分表后依旧在单个库上面，1个数据库资源瓶颈 CPU/内存/带宽等限制导致响应慢，需要进行优化

- 水平分库
	- 把同个表的数据按照一定规则分到不同的数据库中，数据库在不同的服务器上
		- 水平分库是把不同表拆到不同数据库中，它是对数据行的拆分，不影响表结构
		- 每个库的结构都一样,但每个库的数据都不一样，没有交集，所有库的并集就是全量数据
		- 水平分库的粒度，比水平分表更大
	
### 海量数据处理之Mysql数据库分库分表总结
- 如何确定是否要使用分库分表
	- 需要提前考虑系统一年到两年左右的业务增⻓情况，如果一到两年内用户增长到一定量才使用
		- 对数据库服务器的QPS、连接数、容量等做合理评估和规划，不是一上来就“分库分表”
		- “分库分表”在前期不一定最适合
	
- 不使用“分库分表”的情况下如何做
	- 常规开发里面单表建议1千万内，推荐是百万级别单表存储，常规sql和索引优化先行，然后结合缓存+异步+nosql+mq，这样基本能满足常规场景了
	
- 接下来是垂直和水平分库分表总结
	- 垂直⻆度(表结构不一样)
		- 垂直分表：将一个表字段拆分多个表，每个表存储部分字段
			- 好处：避免IO时锁表的次数，分离热点字段和非热点字段， 避免大字段IO导致性能下降
				- 原则：业务经常组合查询的字段一个表；不常用字段一个表；text、blob类型字段作为附属表
				- 垂直分库：根据业务将表分类，放到不同的数据库服务器上
			- 好处：避免表之间竞争同个物理机的资源，比如CPU/内 存/硬盘/网络IO
				- 原则：根据业务相关性进行划分，领域模型，微服务划分一般就是垂直分库
				- 水平⻆度(表结构一样)
		- 水平分库：把同个表的数据按照一定规则分到不同的数据库中，数据库在不同的服务器上
			- 好处：多个数据库，降低了系统的IO和CPU压力
				- 原则
				- 选择合适的分片键和分片策略，和业务场景配合
					- 避免数据热点和访问不均衡、避免二次扩容难度大
					- 水平分表：同个数据库内，把一个表的数据按照一定规则拆分到多个表中，对数据进行拆分，不影响表结构
			- 单个表的数据量少了，业务SQL执行效率高，降低了系统的IO和CPU压力
				- 原则
				- 选择合适的分片键和分片策略，和业务场景配合
					- 避免数据热点和访问不均衡、避免二次扩容难度大
				
- 互联网公司实际使用情况
	- 公司业务稳定发展，多数情况是为了解决【单库单表】数据量过多问题
		- 一般在开发微服务项目中，默认就是垂直角度的【分库分表】
		- 重点是水平⻆度的【分库分表】
	
## Mysql数据库-水平分库分表常⻅策略
### 水平分库分表，根据什么规则进行？怎么划分？
### 方案一：range
- 自增id，根据ID范围进行分表(左闭右开)
	- 规则案例
		- 1~1,000,000 是 table_1
			- 1,000,000 ~2,000,000 是 table_2
			- 2,000,000~3,000,000 是 table_3
			- 更多...
			- 优点
		- id是自增⻓，可以无限增⻓
			- 扩容不用迁移数据，容易理解和维护
			- 缺点
		- 大部分读和写都访会问新的数据，有IO瓶颈，整体资源利用率低
			- 数据倾斜严重，热点数据过于集中，部分节点有瓶颈
			- 比如订单列表，用户最经常看的是新的订单，而旧的订单数据不常看，这部分数据占用的资源就浪费了
			
- Range范围分库分表，有热点问题，所以这个没用?
	- 有用，范围的话更多的是水平分表，主要目的是避免热点问题
	
- 自增id，根据ID范围进行分表延伸解决方案，你 能想到多少种？
	- 范围⻆度
	(范围的话更多是水平分表)
		- 数字
			- 自增id范围
				- 时间
			- 年、月、日范围
				- 比如按照月份生成 库或表 pay_log_2022_01、 pay_log_2022_02
				- 空间
			- 地理位置：省份、区域(华东、华北、华南)
				- 比如按照 省份 生成库或表
				- 基于Range范围分库分表业务场景
		- 微博发送记录、微信消息记录、日志记录
			- id增⻓/时间分区都行
				- 水平分表为主，水平分库则容易造成资源的浪费
				- 网站签到等活动流水数据
			- 时间分区最好
				- 水平分表为主，水平分库则容易造成资源的浪费
				- 大区划分
			- 一二线城市和五六线城市活跃度不一样，如果能避免热点问题，即可选择
				- saas业务水平分库(华东、华南、华北等)，每个库即包含热点也包含非热点数据，这样就不会造成资源浪费
			
### 方案二：Hash取模
(Hash分库分表是最普遍的方案)
- 疑问：为啥不直接取模？如果取模的字段不是整数型要先hash，统一规则就行
	- Hash取模
	
- 案例
	- 需求：用户ID是整数型的，要分2库，每个库表数量4表，一共8张表，用户ID取模后，值是0到7的要平均分配到每张表
		- 计算公式
		- A库ID = userId % 库数量 2
		表ID = userId / 库数量 2 % 表数量4
			- 实现举例
		- 这样就能保证表被平均分配
		
- 优点
	- 保证数据较均匀的分散落在不同的库、表中，可以有效的避免热点数据集中问题
	
- 缺点
	- 扩容不是很方便，需要数据迁移
	
## 分库分表常⻅中间件介绍和 ShardingSphere极速认知
### 业界常⻅数据库分库分表中间件介绍
- Cobar(已经被淘汰没使用了)

- TDDL
	- 淘宝根据自己的业务特点开发了 TDDL (Taobao Distributed Data Layer)
		- 基于JDBC规范，没有server，以client-jar的形式存在，引入项目即可使用
		- 开源功能比较少，阿里内部使用为主
	
- Mycat
	- [地址 http://www.mycat.org.cn/](http://www.mycat.org.cn/)
		- Java语言编写的MySQL数据库网络协议的开源中间件，前身Cobar
		- 遵守Mysql原生协议，跨语言，跨平台，跨数据库的通用中间件代理
		- 是基于 Proxy，它复写了 MySQL 协议，将 Mycat Server 伪装成一个 MySQL 数据库
		- 和ShardingShere下的Sharding-Proxy作用类似，需要单独部署
		- 
	
- ShardingSphere下的Sharding-JDBC
	- [地址：https://shardingsphere.apache.org/](https://shardingsphere.apache.org/)
		- Apache ShardingSphere 是一套开源的分布式数据库中间件解决方案组成的生态圈
		- 它由 Sharding-JDBC、Sharding-Proxy 和 Sharding-Sidecar 3个独立产品组合
			- Sharding-JDBC
		- 基于jdbc驱动，不用额外的proxy，支持任意实现 JDBC 规范的数据库
			- 它使用客户端直连数据库，以 jar 包形式提供服务，无需额外部署和依赖
			- 可理解为加强版的 JDBC 驱动，兼容 JDBC 和各类 ORM 框架
		
- Mycat和ShardingJDBC的区别
	- 两者设计理念相同，主流程都是SQL解析-->SQL路由-->SQL改 写-->结果归并
		- Sharding-JDBC
		- 基于jdbc驱动，不用额外的proxy，在本地应用层重写Jdbc 原生的方法，实现数据库分片形式
			- 是基于 JDBC 接口的扩展，是以 jar 包的形式提供轻量级服务的，性能高
			- 代码有侵入性
			- Mycat
		- 是基于 Proxy，它复写了 MySQL 协议，将 Mycat Server伪装成一个 MySQL 数据库
			- 客户端所有的jdbc请求都必须要先交给MyCat，再有 MyCat转发到具体的真实服务器
			- 缺点是效率偏低，中间包装了一层
			- 代码无侵入性
			- 在高并发业务中，我们更愿意选择性能高的产品，也就是Sharding-JDBC
	
### 分库分表中间件Apache ShardingSphere
- 什么是ShardingSphere
	- 已于2020年4月16日成为 Apache 软件基金会的顶级项目
		- 是一套开源的分布式数据库解决方案组成的生态圈，定位为Database Plus
		- 它由 JDBC、Proxy 和 Sidecar这 3 款既能够独立部署，又支持混合部署配合使用的产品组成
	
- 三大构成
	- ShardingSphere-Sidecar(规划中，简单知道就行)
		- 定位为 Kubernetes 的云原生数据库代理，以 Sidecar 的 形式代理所有对数据库的访问
			- 通过无中心、零侵入的方案提供与数据库交互的啮合层，即 Database Mesh，又可称数据库网格
			- ShardingSphere-JDBC
		- 它使用客户端直连数据库，以 jar 包形式提供服务
			- 无需额外部署和依赖，可理解为增强版的 JDBC 驱动，完全兼容 JDBC 和各种 ORM 框架
			- 适用于任何基于 JDBC 的 ORM 框架，如：JPA、Hibernate、 Mybatis，或直接使用 JDBC
			- 支持任何第三方的数据库连接池，如：DBCP、 C3P0、BoneCP、HikariCP 等;
			- 支持任意实现 JDBC 规范的数据库，目前支持 MySQL、PostgreSQL、Oracle、SQLServer 以及任何可使用 JDBC 访问的数据库
			- 采用无中心化架构，与应用程序共享资源，适用于 Java 开发的高性能的轻量级 OLTP 应用
			- 
			- ShardingSphere-Proxy
		- 数据库代理端，提供封装了数据库二进制协议的服务端版本，用于完成对异构语言的支持
			- 向应用程序完全透明，可直接当做 MySQL/PostgreSQL
			- 它可以使用任何兼容 MySQL/PostgreSQL 协议的访问客户端(如：MySQL Command Client、MySQL Workbench、Navicat 等)操作数据
			- 
		
- 三大组件对比

### 分库分表和Sharding-Jdbc常⻅概念术语
- 目的：站着统一水平线上，沟通无障碍，统一下专业术语

- 数据节点Node
	- 数据分片的最小单元，由数据源名称和数据表组成
		- 比如：ds_0.product_order_0
	
- 真实表
	- 在分片的数据库中真实存在的物理表
		- 比如订单表 product_order_0、product_order_1、 product_order_2
	
- 逻辑表
	- 水平拆分的数据库(表)的相同逻辑和数据结构表的总称
		- 比如订单表 product_order_0、product_order_1、 product_order_2，逻辑表就是product_order
	
- 绑定表
	- 指分片规则一致的主表和子表
		- 比如product_order表和product_order_item表，均按照 order_id分片，则此两张表互为绑定表关系
		- 绑定表之间的多表关联查询不会出现笛卡尔积关联，关联查询 效率将大大提升
		- 笛卡尔积就是返回了所有可能的集合，是无意义的操作
			- 绑定关系后，product_order_0查询product_order_item_0表，不会再去查询product_order_item_1表
	
- 广播表
	- 指所有的分片数据源中都存在的表，表结构和表中的数据在每个数据库中均完全一致
		- 适用于数据量不大且需要与海量数据的表进行关联查询的场景
		- 数据量小的冗余表，在各个库里都存一份
			- 例如：字典表、配置表
	
### 分库分表和Sharding-Jdbc常⻅分片算法讲解
- 概述：数据库表分片(水平库、表)，包含分片键和分片策略

- 分片键 (PartitionKey)
	- 用于分片的数据库字段，是将数据库(表)水平拆分的关键字段
		- 比如prouduct_order订单表，根据订单号 out_trade_no做哈希取模，则out_trade_no是分片键
		- 除了对单分片字段的支持，ShardingSphere也支持根据多个字段进行分片
	
- 分片策略
	- 行表达式分片策略InlineShardingStrategy(必备)
		- 只支持【单分片键】使用Groovy的表达式，提供对SQL语句中的 = 和 IN 的分片操作支持
			- 可以通过简单的配置使用，无需自定义分片算法，从而避免繁琐的Java代码开发
			- 举例
				- prouduct_order_$->{user_id % 8} 表示订单表根据 user_id模8，而分成8张表，表名称为 prouduct_order_0 到 prouduct_order_7
					- 标准分片策略StandardShardingStrategy(需了解)
		- 只支持【单分片键】，提供PreciseShardingAlgorithm和 RangeShardingAlgorithm两个分片算法
			- PreciseShardingAlgorithm 精准分片是必选的，用于处理 = 和 IN 的分片
			- RangeShardingAlgorithm 范围分配是可选的，用于处理BETWEEN AND分片
			- 如果不配置RangeShardingAlgorithm，如果SQL中用了BETWEEN AND语法，则将按照全库路由处理，性能下降
			- 复合分片策略ComplexShardingStrategy(需了解)
		- 支持【多分片键】，多分片键之间的关系复杂，由开发者自己实现，提供最大的灵活度
			- 提供对SQL语句中的=, IN和BETWEEN AND的分片操作支持
			- Hint分片策略HintShardingStrategy(需了解)
		- 这种分片策略无需配置分片健，分片健值也不再从SQL中解析，外部手动指定分片健或分片库，让SQL在指定的分库、分表中执行
			- 用于处理使用Hint行分片的场景，通过Hint而非SQL解析的方式分片的策略
			- Hint策略会绕过SQL解析的，对于这些比较复杂的需要分片的查询，Hint分片策略性能可能会更好
			- 不分片策略NoneShardingStrategy(需了解)
	
## SpringBoot2.5+MybatisPlus整合Sharding-Jdbc实战
### SpringBoot2.5+MybatisPlus+Sharding-Jdbc项目创建
- 修改配置
	- 
		<properties>	<java.version>11</java.version>
	<maven.compiler.source>11</maven.compiler.source>
	<maven.compiler.target>11</maven.compiler.target>
	<spring.boot.version>2.5.5</spring.boot.version>
	<mybatisplus.boot.starter.version>3.4.0</mybatisplus.boot.starter.version>
	<lombok.version>1.18.16</lombok.version>
	<sharding-jdbc.version>4.1.1</sharding-jdbc.version>
	<junit.version>4.12</junit.version>
	<druid.version>1.1.16</druid.version>	<skipTests>true</skipTests>	</properties>
- 版本依赖
	- 
		```plaintext
		<dependencies>
		```	  <dependency>
		      <groupId>org.springframework.boot</groupId>
		      <artifactId>spring-boot-starter-web</artifactId>
		      <version>${spring.boot.version}</version>
		  </dependency>
		  <dependency>
		      <groupId>org.springframework.boot</groupId>
		      <artifactId>spring-boot-starter-test</artifactId>
		      <version>${spring.boot.version}</version>
		      <scope>test</scope>
		  </dependency>
		  <!--mybatis plus和springboot整合-->
		  <dependency>
		      <groupId>com.baomidou</groupId>
		      <artifactId>mybatis-plus-boot-starter</artifactId>
		      <version>${mybatisplus.boot.starter.version}</version>
		  </dependency>
		  <dependency>
		      <groupId>mysql</groupId>
		      <artifactId>mysql-connector-java</artifactId>
		      <version>8.0.27</version>
		  </dependency>
		  <dependency>
		      <groupId>org.projectlombok</groupId>
		      <artifactId>lombok</artifactId>
		      <version>${lombok.version}</version>
		      <!--<scope>provided</scope>-->
		  </dependency>
		  <dependency>
		      <groupId>org.apache.shardingsphere</groupId>
		      <artifactId>sharding-jdbc-spring-boot-starter</artifactId>
		      <version>${sharding-jdbc.version}</version>
		  </dependency>
		  <dependency>
		      <groupId>junit</groupId>
		      <artifactId>junit</artifactId>
		      <version>${junit.version}</version>
		  </dependency>	  </dependencies>
### 数据库讲解和分库分表SQL脚本创建说明
- 分库分表需求：2库2表

- 数据库和表
	- xdclass_shop_order_0
		- product_order_0
			- product_order_1
			- xdclass_shop_order_1
		- product_order_0
			- product_order_1
		
- SQL脚本
	- CREATE TABLE `product_order_0` (
	`id` bigint NOT NULL AUTO_INCREMENT, `out_trade_no` varchar(64) DEFAULT NULL COMMENT '订
	单唯一标识',
	`state` varchar(11) DEFAULT NULL COMMENT 'NEW 未支
	付订单,PAY已经支付订单,CANCEL超时取消订单',
	`create_time` datetime DEFAULT NULL COMMENT '订单生
	成时间',
	`pay_amount` decimal(16,2) DEFAULT NULL COMMENT '订
	单实际支付价格',
	`nickname` varchar(64) DEFAULT NULL COMMENT '昵称', `user_id` bigint DEFAULT NULL COMMENT '用户id', PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
	COLLATE=utf8mb4_bin;
		- 其余的表根据上面的脚本修改表名即可
	
- 实体类
	- DO类的表名是逻辑表
		- Mapper
	
### Sharding-Jdbc常规数据源配置和水平分表实战
- 配置文件，配置数据源、分片键和分片算法

### SpringBoot+Sharding-Jdbc单元测试和问题点引出
- 编写单元测试
	- 
	
- 运行效果
	- 成功执行，自动生成逻辑SQL，然后经过Sharding-JDBC解释成真实SQL，最后经过SQL路由到对应的数据库表中
	
- 问题
	- 数据表的主键重复，这是因为使用了ID自增，但在分布式系统需要保证全局ID唯一，下一章解决
	
## 分库分表进阶之Snowflake雪花算法 实战
### 分库分表下常⻅主键id生产策略
- 背景
	- 单库下一般使用Mysql自增ID, 但是分库分表后，会造成不同分片上的数据表主键会重复。
	
- 需求
	- 性能强劲
		- 全局唯一
		- 防止恶意用户规矩id的规则来获取数据
	
- 业界常用ID解决方案
	- 数据库自增ID
		- 利用自增id, 设置不同的自增步⻓， auto_increment_offset、auto-increment-increment
			- 举个例子
			- DB1：单数，从1开始、每次加2
				- DB2：偶数，从2开始，每次加2
				- 缺点
			- 依靠数据库系统的功能实现，但是未来扩容麻烦
				- 主从切换时的不一致可能会导致重复发号
				- 性能瓶颈存在单台数据库服务器上
				- UUID
		- 性能非常高，没有网络消耗
			- 缺点
			- 无序的字符串，不具备趋势自增特性
				- UUID太⻓，不易于存储，浪费存储空间，很多场景不适用
				- Redis发号器
		- 利用Redis的INCR和INCRBY来实现，原子操作，线程安全，性能比Mysql强劲
			- 缺点
			- 需要占用网络资源，增加系统复杂度
				- Snowflake雪花算法
		- twitter 开源的分布式 ID 生成算法，代码实现简单、不占用宽带、数据迁移不受影响
			- 生成的 id 中包含有时间戳，所以生成的 id 按照时间递增
			- 部署了多台服务器，需要保证系统时间一样，机器编号不一样
			- 缺点
			- 依赖系统时钟(多台服务器时间一定要一样)
			
### 分布式 ID 生成算法 Snowflake原理
- 什么是雪花算法Snowflake
	- twitter用scala语言编写的高效生成唯一ID的算法
		- 优点
		- 生成的ID不重复
			- 算法性能高
			- 基于时间戳，基本保证有序递增
		
- 计算机的基础知识回顾
	- bit与byte
		- bit(位)：电脑中存储的最小单位，可以存储二进制中的0或1
			- byte(字节)：一个byte由8个bit组成
			- 常规64位系统里面java数据类型存储字节大小
		- int：4 个字节
			- 数据类型在不同位数机器的平台下⻓度不同
				- 16位平台 int 2个字节16位
			32位平台 int 4个字节32位
			64位平台 int 4个字节32位
				- short：2 个字节
			- long：8 个字节
			- byte：1 个字节
			- float：4 个字节
			- double：8 个字节
			- char：2 个字节
		
- 雪花算法生成的数字，long类，所以就是8个byte，64bit
	- long表示的值 -9223372036854775808(-2的63次方) ~ 9223372036854775807(2的63次方-1)
		- 生成的唯一值用于数据库主键，不能是负数，所以值为 0~9223372036854775807(2的63次方-1)
		- 
	
### 分布式ID生成器Snowflake里面的坑你是否知道
- 分布式ID生成器需求
	- 性能强劲
		- 全局唯一不能重复
		- 防止恶意用户规矩id的规则来获取数据
	
- 全局唯一不能重复，可能导致重复的坑
	- 坑一
		- 分布式部署就需要分配不同的workId, 如果workId相同，可能会导致生成的id相同
			- 坑二
		- 分布式情况下，需要保证各个系统时间一致，如果服务器的时钟回拨，就会导致生成的 id 重复
			- 啥时候会有系统回拨?
			- 人工去生产环境做了系统时间调整(????)
				- 业务需求，代码里面做了系统时间同步
			
- 配置实操
	- 配置workerId
		- spring.shardingsphere.sharding.tables.product_order.key-generator.props.worker.id=1
			- 配置id生成策略
		- 方式一
			- 订单id使用MybatisPlus的配置，ProductOrder类配置
				- @TableId(value = "id", type = IdType.ASSIGN_ID)
				- 默认实现类为DefaultIdentifierGenerator雪花算法
					- 方式二
			- 使用Sharding-Jdbc配置文件，注释DO类里面的id分配策略
				- #id生成策略
			spring.shardingsphere.sharding.tables.product_o rder.key-generator.column=id spring.shardingsphere.sharding.tables.product_o rder.key-generator.type=SNOWFLAKE
				- 进阶：动态指定sharding jdbc 的雪花算法中的属性work.id属性
		- 使用sharding-jdbc中的使用IP后几位来做workId, 但在某些情况下会出现生成重复ID的情况
			- 解决办法：在启动时给每个服务分配不同的workId, 引入redis/zk都行，缺点就是多了依赖
		
- 按照上述配置，执行测试用例后，插入数据库的效果，解决上一章ID重复问题
	- 生成了全局唯一的ID
	
## 分库分表进阶之广播表和绑定表配置 实战
### Sharding-Jdbc广播表介绍和配置实战
- 什么是广播表
	- 指所有的分片数据源中都存在的表，表结构和表中的数据在每个数据库中均完全一致
		- 适用于数据量不大且需要与海量数据的表进行关联查询的场景
		- 例如：字典表、配置表
		- 场景：配置信息需要跨库查询，使用广播表只需在本库查询，因为每个库都存在
	
- 注意点
	- 分库分表中间件，对应的数据库字段，不能是sql的关键字，否则容易出问题，且报错不明显
	
- 配置实战
	- 数据库和表
		- xdclass_shop_order_0
			- ad_config
				- xdclass_shop_order_1
			- ad_config
				- 创建ad_config表
		- CREATE TABLE `ad_config` (
		`id` bigint unsigned NOT NULL COMMENT '主键id', `config_key` varchar(1024) COLLATE utf8mb4_bin
		DEFAULT NULL COMMENT '配置key',
		`config_value` varchar(1024) COLLATE utf8mb4_bin
		DEFAULT NULL COMMENT '配置value',
		`type` varchar(128) COLLATE utf8mb4_bin DEFAULT
		NULL COMMENT '类型', PRIMARY KEY (`id`)
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
			- 在两个库中分别创建表
			- POJO类
		- @Data
		@EqualsAndHashCode(callSuper = false)
		@TableName("ad_config")
		public class AdConfigDO {
		private Integer id;
		private String configKey;
		private String configValue;
		private String type;
		}
			- Mapper
		- public interface AdConfigMapper extends BaseMapper<AdConfigDO> {
		}
			- 配置文件
		- #配置广播表
		spring.shardingsphere.sharding.broadcast- tables=ad_config spring.shardingsphere.sharding.tables.ad_config.ke y-generator.column=id spring.shardingsphere.sharding.tables.ad_config.ke y-generator.type=SNOWFLAKE
			- 执行测试用例效果
		- 执行成功，逻辑SQL转换成真实SQL，分别在所有分片数据源中插入
			- 数据库查看效果
		- 在不同的库都插入了对应的数据，并且数据是相同的，雪花算法生成的ID也是相同的
		
### Sharding-Jdbc水平分库+水平分表配置实战
- 库表结构
	- 2个数据库、每个库2张表
	
- 需求
	- 插入订单数据，分布在不同的库和表上
	
- 实战
	- 数据库和表
		- xdclass_shop_order_0
			- product_order_0
				- product_order_1
				- xdclass_shop_order_1
			- product_order_0
				- product_order_1
				- 分库分表配置
		- 分库规则：根据 user_id 进行分库
			- 分表规则：根据 product_order_id 订单号进行分表
			- 
			# 打印执行数据库以及语句
spring.shardingsphere.props.sql.show=true
# 数据源
spring.shardingsphere.datasource.names=ds0,ds1
# 第一个数据库
spring.shardingsphere.datasource.ds0.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.ds0.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.ds0.jdbc-url=jdbc:mysql://120.25.217.15:3306/xdclass_shop_order_0?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.shardingsphere.datasource.ds0.username=root
spring.shardingsphere.datasource.ds0.password=xdclass.net168
# 第二个数据库
spring.shardingsphere.datasource.ds1.type=com.zaxxer.hikari.HikariDataSource
spring.shardingsphere.datasource.ds1.driver-class-name=com.mysql.cj.jdbc.Driver
spring.shardingsphere.datasource.ds1.jdbc-url=jdbc:mysql://120.25.217.15:3306/xdclass_shop_order_1?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
spring.shardingsphere.datasource.ds1.username=root
spring.shardingsphere.datasource.ds1.password=xdclass.net168

#配置workId
spring.shardingsphere.sharding.tables.product_order.key-generator.props.worker.id=1

#配置广播表
spring.shardingsphere.sharding.broadcast-tables=ad_config
spring.shardingsphere.sharding.tables.ad_config.key-generator.column=id
spring.shardingsphere.sharding.tables.ad_config.key-generator.type=SNOWFLAKE

#配置分库规则
spring.shardingsphere.sharding.tables.product_order.database-strategy.inline.sharding-column=user_id
spring.shardingsphere.sharding.tables.product_order.database-strategy.inline.algorithm-expression=ds$->{user_id % 2 }

#id生成策略
spring.shardingsphere.sharding.tables.product_order.key-generator.column=id
spring.shardingsphere.sharding.tables.product_order.key-generator.type=SNOWFLAKE
# 指定product_order表的数据分布情况，配置数据节点,行表达式标 识符使用 ${...} 或 $->{...}，
# 但前者与 Spring 本身的文件占位符冲突，所以在 Spring 环境 中建议使用 $->{...}
#spring.shardingsphere.sharding.tables.product_order.actual-data-nodes=ds0.product_order_$->{0..1}
spring.shardingsphere.sharding.tables.product_order.actual-data-nodes=ds$->{0..1}.product_order_$->{0..1}
# 指定product_order表的分片策略，分片策略包括【分片键和分片算法】
spring.shardingsphere.sharding.tables.product_order.table-strategy.inline.sharding-column=id
spring.shardingsphere.sharding.tables.product_order.table-strategy.inline.algorithm-expression=product_order_$->{id % 2}
```plaintext
	- 通过user_id取模2，确定是哪个库，然后再通过productId取模2，确定是哪个表

- 清空表数据

- 执行测试用例效果

	- 执行20条插入命令，逻辑SQL被解析成真实库表SQL插入语句

	- 20条数据被分散插入到不同库和表中

- 数据库和表的下标如果不想从0开始，则hash取模后+1

	- {user_id % 2+1}
```
### Sharding-Jdbc绑定表介绍和配置实战
- 什么是绑定表
	- 指分片规则一致的主表和子表
		- 比如product_order表和product_order_item表，均按照order_id分片，则此两张表互为绑定表关系
		- 绑定表之间的多表关联查询不会出现笛卡尔积关联，关联查询效率将大大提升
		- 
	
- 实战
	- 数据库和表
		- xdclass_shop_order_0
			- product_order_0
				- product_order_1
				- product_order_item_0
				- product_order_item_1
				- xdclass_shop_order_1
			- product_order_0
				- product_order_1
				- product_order_item_0
				- product_order_item_1
				- 创建表
		- CREATE TABLE `product_order_item_0` (
		`id` bigint unsigned NOT NULL AUTO_INCREMENT, `product_order_id` bigint DEFAULT NULL COMMENT '订单号',
		`product_id` bigint DEFAULT NULL COMMENT '产品id', `product_name` varchar(128) DEFAULT NULL COMMENT '商品名称',
		`buy_num` int DEFAULT NULL COMMENT '购买数量', `user_id` bigint DEFAULT NULL,PRIMARY KEY (`id`)
		) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
			- 库表数量
			- 修改配置
		- #分库策略 默认
		spring.shardingsphere.sharding.default-database-strategy.inline.sharding-column=user_id
		spring.shardingsphere.sharding.default-database-strategy.inline.algorithm-expression=ds$->{user_id % 2}
		
# 指定product_order_item表的数据分布情况
spring.shardingsphere.sharding.tables.product_order_item.actual-data-nodes=ds$->{0..1}.product_order_item_$->{0..1} spring.shardingsphere.sharding.tables.product_order_item.table-strategy.inline.sharding-column=product_order_id spring.shardingsphere.sharding.tables.product_order_item.table-strategy.inline.algorithm-expression=product_order_item_$->{product_order_id % 2}

#绑定表
spring.shardingsphere.sharding.binding‐tables[0]=product_order,product_order_item
```plaintext
- 执行用例效果

	- 在没有配置绑定关系时，出现笛卡尔积，多了很多无意义的SQL查询

	- 配置了绑定关系的查询效果，使用绑定表查询，少了无关系的SQL查询
```
### Sharding-Jdbc水平分库+分表后的查询和删除操作实战
- 查询操作
	- 有分片键(标准路由)
		- =、in
			- 
				- 无分片键(全库表路由)
		- =、in
			- 
			
- 删除操作
	- 有分片键(标准路由)
		- =、in
			- 效果同上
				- 无分片键(全库表路由)
		- =、in
			- 效果同上
			
## Sharding-Jdbc核心流程+多种分片策略实战
### Sharding-Jdbc 分库分表执行流程原理
- 项目使用
	- 
	
- Sharding-JDBC做的事情
	- ⻓：SQL解析 -> SQL优化 -> SQL路由 -> SQL改写 -> SQL执行 -> 结果归并 -> 返回结果
		- 短：SQL解析 -> SQL路由 -> SQL改写 -> SQL执行 -> 结果归并
		- 完整流程
	
### Sharding-Jdbc实战之标准分片策略-精准分片算法【分表】
- StandardShardingStrategy
	- 只支持【单分片键】，提供PreciseShardingAlgorithm和RangeShardingAlgorithm两个分片算法
		- PreciseShardingAlgorithm 精准分片 是必选的，用于处理=和IN的分片
		- RangeShardingAlgorithm 范围分片是可选的，用于处理BETWEEN AND分片
		- 如果不配置RangeShardingAlgorithm，如果SQL中用了BETWEEN AND语法，则将按照全库路由处理，性能下降
	
- 实现数据表自定义精准分片算法
	- public class CustomTablePreciseShardingAlgorithm implements PreciseShardingAlgorithm<Long> {
		/**	- @param dataSourceNames 数据源集合,在分库时值为所有分片库的集合databaseNames, 分表时为对应分片库中所有分片表的集合tablesNames
		- @param shardingValue 分片属性，包括 logicTableName 为逻辑表, columnName 分片健（字段）, value 为从 SQL 中解析出的分片健的值
		- @return
	*/
	@Override
	public String doSharding(Collection<String> dataSourceNames, PreciseShardingValue<Long> shardingValue) {
	for(String datasourceName : dataSourceNames){
	String value = shardingValue.getValue() % dataSourceNames.size() + "";
	//product_order_0
	if(datasourceName.endsWith(value)){
	return  datasourceName;
	}
	}
	return null;
	}
	}
	
- 修改配置
	- 类名获取：右键复制上面实现的类文件路径
		- 注释之前的配置
		- 
		# 指定product_order表的数据分布情况，配置数据节点,在 Spring 环境中建议使用 $->{...}
spring.shardingsphere.sharding.tables.product_order.actual-data-nodes=ds0.product_order_$->{0..1}

#指定精准分片算法(水平分表)
spring.shardingsphere.sharding.tables.product_order.table-strategy.standard.sharding-column=id
spring.shardingsphere.sharding.tables.product_order.table-strategy.standard.precise-algorithm-class-name=net.xdclass.strategy.CustomTablePreciseShardingAlgorithm
- 运行测试用例：新增订单记录
	- 
		- 断点查看变量值，分表，用雪花算法生成的ID取模表数量，映射对应的表名
		- 循环第一次，成功向表0插入数据
	
### Sharding-Jdbc实战之标准分片策略-精准分片算法【分库分表】
- 实现数据库自定义精准分片算法
(自定义分库和分表算法的实现基本是一样的)
	- public class CustomDBPreciseShardingAlgorithm implements PreciseShardingAlgorithm<Long> {
		/**	- @param dataSourceNames 数据源集合。在分库时值为所有分片库的集合 databaseNames，分表时为对应分片库中所有分片表的集合 tablesNames
		- @param preciseShardingValue  分片属性，包括 logicTableName 为逻辑表，columnName 分片健（字段），value 为从 SQL 中解析出的分片健的值
		- @return
	*/
	@Override
	public String doSharding(Collection<String> dataSourceNames, PreciseShardingValue<Long> preciseShardingValue) {
	for(String datasourceName : dataSourceNames){
		```plaintext
		 String value = preciseShardingValue.getValue() % dataSourceNames.size() + "";
		 //ds0、ds1
		 if(datasourceName.endsWith(value)){
		     return  datasourceName;
		 }
		```	}
		return null;
		}
		}
- 修改配置
	- 类名获取：右键复制上面实现的类文件路径
		- 结合上一节分表的配置
		- #指定全部数据节点，水平分库分表
	spring.shardingsphere.sharding.tables.product_order.actual-data-nodes=ds$->{0..1}.product_order_$->{0..1}
	
# 分库分片健
spring.shardingsphere.sharding.tables.product_order.database-strategy.standard.sharding-column=user_id
# 分库分片算法
spring.shardingsphere.sharding.tables.product_order.database-strategy.standard.precise-algorithm-class-name=net.xdclass.strategy.CustomDBPreciseShardingAlgorithm

#指定精准分片算法(水平分表)
spring.shardingsphere.sharding.tables.product_order.table-strategy.standard.sharding-column=id
spring.shardingsphere.sharding.tables.product_order.table-strategy.standard.precise-algorithm-class-name=net.xdclass.strategy.CustomTablePreciseShardingAlgorithm
- 运行用例：新增订单记录
	- 断点先是进入数据库分片算法，然后进入数据表分片算法
	
### Sharding-Jdbc分片策略实战之标准分片策略-范围分片算法
- RangeShardingAlgorithm 范围分片
	- 用于处理BETWEEN AND语法，没配置的话会报错 Cannot find range sharding strategy in sharding rule.
		- 没配置但使用了BETWEEN AND情况报错
			- 主要是会根据 SQL中给出的分片健值范围值处理分库、分表逻辑
	
- 实现自定义范围分片算法
	- public class CustomRangeShardingAlgorithm implements RangeShardingAlgorithm<Long> {
	/**
		- 
		- @param dataSourceNames 数据源集合。在分库时值为所有分片库的集合databaseNames，分表时为对应分片库中所有分片表的集合tablesNames
		- @param shardingValue  分片属性，包括 logicTableName 为逻辑表，columnName 分片健（字段），value 为从 SQL 中解析出的分片健的值
		- @return
	*/
	@Override
	public Collection<String> doSharding(Collection<String> dataSourceNames, RangeShardingValue<Long> shardingValue) {
	Set<String> result = new LinkedHashSet<>();
	//between 开始值
	Long lower  = shardingValue.getValueRange().lowerEndpoint();
	//between 结束值
	Long upper = shardingValue.getValueRange().upperEndpoint();
		for(long i=lower;i<=upper;i++){
		for(String datasource : dataSourceNames){
		String value = i % dataSourceNames.size() +"";
		if(datasource.endsWith(value)){
		result.add(datasource);
		}
		}
		}
		return result;
		}
		}
- 修改配置
	- #在精准水平分表基础上，增加一个范围分片
	spring.shardingsphere.sharding.tables.product_order.table-strategy.standard.range-algorithm-class-name=net.xdclass.strategy.CustomRangeShardingAlgorithm
	
- 运行用例：范围查询
	- 同一数据库下，1到1只有一条数据，所以只运行一次真实SQL
		- 同一数据库下，1到2有2条数据，但是分散在2个表中，所以运行了2次真实SQL
	
### Sharding-Jdbc分片策略实战之复合分片算法
- 复合分片算法ComplexShardingStrategy
(由于维护比较复杂，工作用不多，故了解即可)
	- 提供对SQL语句中的=, IN和BETWEEN AND的分片操作，支持【多分片键】
		- 由于多分片键之间的关系复杂，Sharding-JDBC并未做过多的封装
		- 而是直接将分片键值组合以及分片操作符交于算法接口，全部由应用开发者实现，提供最大的灵活度
	
- 实现自定义复合分片算法
	- public class CustomComplexKeysShardingAlgorithm implements ComplexKeysShardingAlgorithm<Long> {
	/**
		- 
		- @param dataSourceNames 数据源集合。在分库时值为所有分片库的集合 databaseNames，分表时为对应分片库中所有分片表的集合 tablesNames
		- @param complexKeysShardingValue  分片属性，包括logicTableName 为逻辑表，columnName 分片健（字段），value 为从 SQL 中解析出的分片健的值
		- @return
	*/
	@Override
	public Collection<String> doSharding(Collection<String> dataSourceNames, ComplexKeysShardingValue<Long> complexKeysShardingValue) {
		// 得到每个分片健对应的值
		Collection<Long> orderIdValues = this.getShardingValue(complexKeysShardingValue, "id");
		Collection<Long> userIdValues = this.getShardingValue(complexKeysShardingValue, "user_id");	List<String> shardingSuffix = new ArrayList<>();
		// 对两个分片健取模的方式 product_order_0_0、product_order_0_1、product_order_1_0、product_order_1_1
		for (Long userId : userIdValues) {
		for (Long orderId : orderIdValues) {
		String suffix = userId % 2 + "_" + orderId % 2;
		for (String databaseName : dataSourceNames) {
		if (databaseName.endsWith(suffix)) {
		shardingSuffix.add(databaseName);
		}
		}
		}
		}
		return shardingSuffix;
		}	/**	- shardingValue  分片属性，包括
		- logicTableName 为逻辑表，
		- columnNameAndShardingValuesMap 存储多个分片健 包括key-value
		- key：分片key，id和user_id
		- value：分片value，66和99
		- 
		- @return shardingValues 集合
	*/
	private Collection<Long> getShardingValue(ComplexKeysShardingValue<Long> shardingValues, final String key) {
	Collection<Long> valueSet = new ArrayList<>();
	Map<String, Collection<Long>> columnNameAndShardingValuesMap = shardingValues.getColumnNameAndShardingValuesMap();
		if (columnNameAndShardingValuesMap.containsKey(key)) {
		valueSet.addAll(columnNameAndShardingValuesMap.get(key));
		}
		return valueSet;
		}
}
- 修改配置
	- 注释其他分片策略，否则报错 Only allowed 0 or 1 sharding strategy configuration
		- spring.shardingsphere.sharding.tables.product_order.actual-data-nodes=ds$->{0..1}.product_order_$->{0..1}
	
# 复合分片算法,order_id,user_id 同时作为分片健
spring.shardingsphere.sharding.tables.product_order.table-strategy.complex.sharding-columns=user_id,id
spring.shardingsphere.sharding.tables.product_order.table-strategy.complex.algorithm-class-name=net.xdclass.strategy.CustomComplexKeysShardingAlgorithm
- 运行测试用例：多分片键查询
	- 测试代码，多个分片键
		- complexKeysShardingValue存的是对应的分片键和值
		- 由于数据源中不存在1_0这样的复合键命名，所以始终返回空，这里也不用过多测试
	
### Sharding-Jdbc分片策略实战之Hint分片算法
- Hint分片策略HintShardingStrategy
	- hint的中文意思：提示、暗示
		- 这种分片策略无需配置文件进行配置分片健，分片健值也不再从 SQL中解析，外部手动指定分片健或分片库，让 SQL在指定的分库、分表中执行
		- 通过Hint代码指定的方式而非SQL解析的方式分片的策略
		- Hint策略会绕过SQL解析的，对于这些比较复杂的需要分片的查询，Hint分片策略性能可能会更好
		- 可以指定sql去某个库某个表进行执行
	
- 实现自定义Hint分片算法
(自定义完算法只实现了一部分，需要在调用 SQL前通过 HintManager 指定分库、分表信息)
	- 分库
		- public class CustomDBHintShardingAlgorithm implements HintShardingAlgorithm<Long> {
		/**
			- 
		- @param dataSourceNames 数据源集合。在分库时值为所有分片库的集合 databaseNames，分表时为对应分片库中所有分片表的集合 tablesNames
		- 
		- @param hintShardingValue  分片属性，包括logicTableName 为逻辑表，
		- 
		```plaintext
		                      columnName 分片健（字段），hit策略此处为空 ""
		```	- 
		```plaintext
		                      value 【之前】都是 从 SQL 中解析出的分片健的值,用于取模判断
		```	- 
		```plaintext
		                      HintShardingAlgorithm不再从SQL 解析中获取值，而是直接通过 hintManager.addTableShardingValue("product_order", 1)参数进行指定
		```	- @return
	*/
	@Override
	public Collection<String> doSharding(Collection<String> dataSourceNames, HintShardingValue<Long> hintShardingValue) {
	Collection<String> result = new ArrayList<>();
	for(String datasourceName: dataSourceNames){
	for(Long shardingValue : hintShardingValue.getValues()){
	String value = shardingValue % dataSourceNames.size()+"";
		```plaintext
		     if(datasourceName.endsWith(value)){
		         result.add(datasourceName);
		     }
		 }
		```	}
		return result;
		}
		}	- 分表
		- public class CustomTableHintShardingAlgorithm implements HintShardingAlgorithm<Long> {
		/**
			- 
		- @param dataSourceNames 数据源集合。在分库时值为所有分片库的集合 databaseNames，分表时为对应分片库中所有分片表的集合 tablesNames
		- 
		- @param hintShardingValue  分片属性，包括logicTableName 为逻辑表，
		- 
		```plaintext
		                      columnName 分片健（字段），hit策略此处为空 ""
		```	- 
		```plaintext
		                      value 【之前】都是 从 SQL 中解析出的分片健的值,用于取模判断
		```	- 
		```plaintext
		                      HintShardingAlgorithm不再从SQL 解析中获取值，而是直接通过 hintManager.addTableShardingValue("product_order", 1)参数进行指定
		```	- @return
	*/
	@Override
	public Collection<String> doSharding(Collection<String> dataSourceNames, HintShardingValue<Long> hintShardingValue) {
	Collection<String> result = new ArrayList<>();
	for(String datasourceName: dataSourceNames){
	for(Long shardingValue : hintShardingValue.getValues()){
	String value = shardingValue % dataSourceNames.size()+"";
		```plaintext
		     if(datasourceName.endsWith(value)){
		         result.add(datasourceName);
		     }
		 }
		```	}
		return result;
		}
		}
- 修改配置
	- 配置多个数据源ds
		- spring.shardingsphere.sharding.tables.product_order.actual-data-nodes=ds$->{0..1}.product_order_$->{0..1}
			- #无需在配置里指定分片键，在代码中指定
	spring.shardingsphere.sharding.tables.product_order.database-strategy.hint.algorithm-class-name=net.xdclass.strategy.CustomDBHintShardingAlgorithm
	spring.shardingsphere.sharding.tables.product_order.table-strategy.hint.algorithm-class-name=net.xdclass.strategy.CustomTableHintShardingAlgorithm
	
- 运行测试用例
	- 
		```plaintext
		/**
		```	- 正常可以用AOP进行实现
	*/
	@Test
	public void testHit(){
	//清除历史规则
	HintManager.clear();
		//获取对应的实例
		HintManager hintManager = HintManager.getInstance();	//设置库的分片键值，value是用于库分片取模
		hintManager.addDatabaseShardingValue("product_order",3L);	//设置表的分片键值，value是用于表分片取模
		hintManager.addTableShardingValue("product_order",8L);	//如果在读写分离数据库中，Hint 可以强制读主库（主从复制存在一定延时，但在业务场景中，可能更需要保证数据的实时性）
		//hintManager.setMasterRouteOnly();	//对应的value,只做查询，不做sql解析
		productOrderMapper.selectList(new QueryWrapper<ProductOrderDO>().eq("id",66L));
		}	- 通过代码指定的库分片键值，value取模库总数后结果是在ds1数据库中
		- 通过代码指定的表分片键值，value取模表总数后结果是在product_order_0表
		- 最后得出这条SQL会在ds1库product_order_0表中执行
	
- 注意：之前没用partitionKey会触发全库表路由，发出很多不相干的 SQL。使用Hint方式是可以避免这个问题

### Sharding-Jdbc多种分片策略实战总结
- 自己实现分片策略的优缺点
	- 优点：可以根据分片策略代码里面自己拼装真实的数据库、 真实的表，灵活控制分片规则
		- 缺点：增加了编码，不规范的sql容易造成全库表扫描，部分sql语法支持不友好
	
- 行表达式分片策略 InlineShardingStrategy
	- 只支持【单分片键】使用Groovy的表达式，提供对SQL语句中的 =和IN 的分片操作支持
		- 可以通过简单的配置使用，无需自定义分片算法，从而避免繁琐的Java代码开发
		- prouduct_order_$->{user_id % 8}
	表示订单表根据 user_id模8，而分成8张表，表名称为 prouduct_order_0 到 prouduct_order_7
	
- 标准分片策略StandardShardingStrategy
	- 只支持【单分片键】，提供PreciseShardingAlgorithm和RangeShardingAlgorithm两个分片算法
		- PreciseShardingAlgorithm 精准分片 是必选的，用于处理=和IN的分片
		- RangeShardingAlgorithm 范围分配 是可选的，用于处理BETWEEN AND分片
		- 如果不配置RangeShardingAlgorithm，如果SQL中用了BETWEEN AND语法，则将按照全库路由处理，性能下降
	
- 复合分片策略ComplexShardingStrategy
	- 支持【多分片键】，多分片键之间的关系复杂，由开发者自己实现，提供最大的灵活度
		- 提供对SQL语句中的=, IN和BETWEEN AND的分片操作支持
	
- Hint分片策略HintShardingStrategy
	- 这种分片策略无需配置分片健，分片健值也不再从SQL中解析，外部手动指定分片健或分片库，让SQL在指定的分库、分表中执行
		- 用于处理使用Hint行分片的场景，通过Hint而非SQL解析的方式分片的策略
		- Hint策略会绕过SQL解析的，对于这些比较复杂的需要分片的查询，Hint分片策略性能可能会更好
	
## Sharding-Jdbc分库分表常⻅问题解决方案讲解
### Sharding-Jdbc分库分表后已经解决的三大问题
- 分库分表解决带来的新问题，学到这里，已经解决了大部分了

- 问题一：执行的SQL排序、翻⻚、函数计算问题
	- 分库后，数据分布在不同的节点上，跨节点多库进行查询时，会出现limit分⻚、order by排序等问题
		- 而且当排序字段非分片字段时，更加复杂了，要在不同的分片节点中将数据进行排序并返回，然后将不同分片返回的结果集进行汇总和再次排序(也会带来更多的CPU/IO资源损耗)
		- 解决方式
		- 业务上要设计合理，利用好PartitionKey，查询的数据分布同个数据节点上，避免跨节点多库进行查询
			- sharding-jdbc在结果合并层自动帮我们解决很多问题(流式归并和内存归并)
		
- 问题二：数据库全局主键重复问题
	- 常规表的id是使用自增id进行实现，分库分表后，由于表中数据同时存在不同数据库中，如果用自增id，则会出现冲突问题
		- 解决方式
		- UUID
			- 自研发号器 redis
			- 雪花算法
		
- 问题三：分库分表技术选型问题
	- 市场分库分表中间件相对较多，框架各有各的优势与短板，应该如何选择
		- 解决方式
		- 开源产品：主要是Mycat和ShardingJdbc区别，也是被面试官问比较多的
			- 两者设计理念相同，主流程都是
		SQL解析-->SQL路由-->SQL改写-->结果归并
			- sharding-jdbc(推荐)
			- 基于jdbc驱动，不用额外的proxy，在本地应用层重写Jdbc原生的方法，实现数据库分片形式
				- 是基于 JDBC 接口的扩展，是以 jar 包的形式提供轻量级服务的，性能高
				- 代码有侵入性
				- Mycat
			- 是基于 Proxy，它复写了 MySQL 协议，将 Mycat Server 伪装成一个 MySQL 数据库
				- 客户端所有的jdbc请求都必须要先交给MyCat，再由MyCat转发到具体的真实服务器
				- 缺点是效率偏低，中间包装了一层
				- 代码无侵入性
			
### Sharding-Jdbc分库分表-跨节点数据库Join关联和多维度查询
- 问题：跨节点数据库Join关联查询 和 多维度查询

- 数据库切分前，多表关联查询，可以通过sql join进行实现

- 分库分表后，数据可能分布在不同的节点上，sql join带来的问题就比较麻烦

- 不同维度查看数据，利用的partitionKey是不一样的

- 解决方案
	- 冗余字段
		- 广播表
		- NOSQL汇总
	
- 案例一
	- 订单需要用户的基本信息，但是分布在不同库上
		- 进行字段冗余，订单表冗余用户昵称、头像
	
- 案例二
	- 订单表的partionKey是user_id，用户查看自己的订单列表方便，但商家查看自己店铺的订单列表就麻烦，分布在不同数据节点
		- 解决：订单冗余存储在es上一份
		- 业务架构流程：用户查看自己的订单数据，可以通过分片键精确查找，但商家就不能了，商家订单分散在不同的库，也不能通过分片键查找，查询效率和性能都很低。解决方案是通过Canal Server伪装成从节点，它会监听主节点数据拷贝，然后再通过kafka队列存储到es上，商家直接从es上面查询，降低mysql压力，并且是读写分离的
		
### Sharding-Jdbc分库分表操作带来的分布式事务问题
- 问题：分库操作带来的分布式事务问题
	- 操作内容同时分布在不同库中，不可避免会带来跨库事务问题，即分布式事务
		- 
			- 常⻅分布式事务解决方案
		- 2PC 和 3PC
			- 两阶段提交，基于XA协议
				- TCC
			- Try、Confirm、Cancel
				- 事务消息
			- 最大努力通知型
				- 分布式事务框架
		- TX-LCN：支持2PC、TCC等多种模式
			- [https://github.com/codingapi/tx-lcn](https://github.com/codingapi/tx-lcn)
				- 更新慢(个人感觉处于停滞状态)
				- Seata：支持 AT、TCC、SAGA 和 XA 多种模式
			- [https://github.com/seata/seata](https://github.com/seata/seata)
				- 背靠阿里，专⻔团队推广
				- 阿里云商业化产品GTS
				- [https://www.aliyun.com/aliware/txc](https://www.aliyun.com/aliware/txc)
					- RocketMq：自带事务消息解决分布式事务
			- [https://github.com/apache/rocketmq](https://github.com/apache/rocketmq)
				- 项目解决方案
		- MQ+本地Task
			- 案例
		
### Sharding-Jdbc容量规划-分库分表后二次扩容问题
- 业务发展快，初次分库分表后，满足不了数据存储，导致需要多次扩容，数据迁移问题

- 取决是哪种分库分表规则
	- Range范围
		- 时间：不用考虑扩容迁移
			- 区域：调整分片粒度，需要全量迁移
			- Hash取模
		- 业务最多的是hash取模分片，因为分库分表涉及到rehash过程
			- 解决方式
			- 分片数量建议可以成偶数倍扩容策略，只需要【迁移部分数据】即可
				- 旧节点的数据，有一半要迁移至一个新增节点中
				- 原来是2个库，扩容为4个库，通过哈希取模，原来的数据只需要迁移一半至一个新增节点
					- 更多解决方式
		- 利用一致性Hash思想，增加虚拟节点，减少迁移数据量
			- 一致性Hash思想解释
				- 
					- 专⻔的数据库表，记录数据存储位置，进行路由
			- 增加额外IO
				- ...
		
### Sharding-Jdbc 分库分表-二次扩容实施方案讲解
- 方式一
	- 利用数据库主从同步
		- 
			- 新增两个数据库 A2、A3 作为从库，设置主从同步关系为: A0=>A2、A1=>A3,
			- 开启主从数据同步，早期数据手工同步过去
			- 发布新程序，某个时间点开始，利用MQ存储CUD操作
			- 关闭数据库实例的主从同步关系
			- 校验数据，消费原先MQ存储CUD操作，配置新分片规则和生效
			- 数据校验和修复
			- 依赖gmt_modified字段，所以常规数据表都需要加这个字段
				- 由数据库自己维护值，根据业务场景，进行修复对应的数据
				- 校验步骤
				- 开始迁移时间假如是2022-01-01 00:00:00
					- 查找 gmt_modified 数据校验修复大于开始时间点，就是修改过的数据
					- 各个节点的冗余数据进行删除
			- 主从节点恰好是交集
				- 缺点
			- 同步的很多数据到最后都需要被删除
				- 一定要提前做，越晚做成本越高，因为扩容期间需要存储的数据更多
				- 基本都离不开代码侵入，加锁等操作
				- 优点
			- 利用mysql自带的主从同步能力
				- 方案简单，代码量相对少
			
- 方式二
	- 对外发布公告，停机迁移
		- 严格一致性要求：比如证券、银行部分数据等
		- 优点：最方便、且安全
		- 缺点
		- 会造成服务不可用，影响业务
			- 根据停机的时间段，数据校验人员有压力
		
