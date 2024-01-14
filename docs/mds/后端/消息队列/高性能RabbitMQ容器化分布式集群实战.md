---
urlname: rabbitmq
title: 高性能RabbitMQ容器化分布式集群实战
updated: '2024-01-15 01:30:15'
date: '2024-01-13 18:06:24'
status: 已发布
catalog:
  - 后端
  - 消息队列
---
# 高性能RabbitMQ容器化分布式集群实战
## 为什么要学习RabbitMQ消息队列
### 多数互联网公司里面用的技术栈，可以承载海量消息处理
### 在多数互联网公司中，RabbitMQ占有率很高，且全球都很流行
### 在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现强劲，与SpringAMQP完美的整合、API丰富易用
### 可以作为公司内部培训技术分享必备知识，可靠性投递、消费、高可用集群等
## 开发环境准备和新版 SpringBoot2.X项目创建
### 必备基础环境:JDK8或者JDK11版本 + Maven3.5(采用默 认) + IDEA旗舰版 + Mysql5.7以上版本
- 不要用JDK11以上，非大规模的LTS版本且多数软件不支持

- 2021~2024年内，JDK11会是大规模流行

### 操作系统: Win10或者Mac苹果
### 创建新版SpringBoot2.X项目
- [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)

- 在线构建工具 [https://start.spring.io/](https://start.spring.io/)

### 注意: 有些包maven下载慢，等待下载如果失败
- 删除本地仓库spring相关的包，重新执行 mvn install

- 建议先使用默认的maven仓库，不用更换地址

### 当前项目仓库地址修改
```java
<!-- 代码库 --> 

<repositories>
        <repository>
            <id>maven-ali</id>
            <url>http://maven.aliyun.com/nexus/content/groups/public//</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
                <updatePolicy>always</updatePolicy>
                <checksumPolicy>fail</checksumPolicy>
            </snapshots>
        </repository>
</repositories>

<pluginRepositories>
        <pluginRepository>
            <id>public</id>
            <name>aliyun nexus</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
</pluginRepositories>
```
## MQ消息中间件 +JMS+AMQP核心知识
### 什么是MQ消息中间件
- 全称MessageQueue，主要是用于程序和程序直接通信，异步+解耦

- 使用场景
	- 核心应用
		- 解耦: 订单系统->物流系统
			- 异步: 用户注册->发送邮件，初始化信息
			- 削峰: 秒杀、日志处理
			- 跨平台、多语言
		- 分布式事务、最终一致性
		- RPC调用上下游对接，数据源变动->通知下属
		- 
	
### 什么是JMS: Java消息服务(Java Message Service), Java平台中关于面向消息中间件的接口
- 介绍
	- JMS是一种与厂商无关的 API，用来访问消息收发系统消息，它类似于JDBC(Java Database Connectivity)。这里，JDBC 是可以用来访问许多不同关系数据库的API
		- 是由Sun公司早期提出的消息标准，旨在为java应用提供统一的消息操作，包括create、send、receive
		- JMS是针对java的，那微软开发了NMS(.NET消息传递服务)
		- 
	
- 特性
	- 面向Java平台的标准消息传递API
		- 在Java或JVM语言比如Scala、Groovy中具有互用性
		- 无需担心底层协议
		- 有queues和topics两种消息传递模型
		- 支持事务、能够定义消息格式(消息头、属性和内容)
	
- 常⻅概念
	- JMS提供者: 连接面向消息中间件的，JMS接口的一个实现，RocketMQ,ActiveMQ,Kafka等等
		- JMS生产者(Message Producer): 生产消息的服务
		- JMS消费者(Message Consumer): 消费消息的服务
		- JMS消息: 数据对象
		- JMS队列: 存储待消费消息的区域
		- JMS主题: 一种支持发送消息给多个订阅者的机制
		- JMS消息通常有两种类型: 点对点(Point-to-Point)、发布/订阅(Publish/Subscribe)
	
- 基础编程模型
	- MQ中需要用的一些类
		- ConnectionFactory: 连接工厂，JMS 用它创建连接
		- Connection: JMS 客户端到JMS Provider的连接
		- Session: 一个发送或接收消息的线程
		- Destination: 消息的目的地; 消息发送给谁.
		- MessageConsumer / MessageProducer: 消息消费者，消息生产者
	
### 什么是AMQP高级消息队列协议和MQTT拓展
- 背景
	- JMS或者NMS都没有标准的底层协议，它们可以在任何底层协议上运行，但是API是与编程语言绑定的，AMQP解决了这个问题，它使用了一套标准的底层协议
	
- 什么是AMQP
	- AMQP(advanced message queuing protocol)在2003年时被提出，最早用于解决金融领不同平台之间的消息传递交互问题，就是一种协议，兼容JMS
		- 更准确说的是链接协议 binary-wire-level-protocol 直接定义网络交换的数据格式，类似http
		- 具体的产品实现比较多，RabbitMQ就是其中一种
		- 
	
- 特性
	- 独立于平台的底层消息传递协议
		- 消费者驱动消息传递
		- 跨语言和平台的互用性、属于底层协议
		- 有5种交换类型direct，fanout，topic，headers，system
		- 面向缓存的、可实现高性能、支持经典的消息队列，循环，存储和转发
		- 支持⻓周期消息传递、支持事务(跨消息队列)
	
- AMQP和JMS的主要区别
	- AMQP不从API层进行限定，直接定义网络交换的数据格式，这使得实现了AMQP的provider天然性就是跨平台
		- 比如Java语言产生的消息，可以用其他语言比如python的进行消费
		- AQMP可以用http来进行类比，不关心实现接口的语言，只要都按照相应的数据格式去发送报文请求，不同语言的client可以和不同语言的server进行通讯
		- JMS消息类型: TextMessage/ObjectMessage/StreamMessage等
		- AMQP消息类型: Byte[]
	
- MQTT科普
	- MQTT: 消息队列遥测传输(Message QueueingTelemetry Transport)
		- 背景
		- 我们有面向基于Java的企业应用的JMS和面向所有其他应用需求的AMQP，那这个MQTT是做啥的?
			- 计算性能不高的设备不能适应AMQP上的复杂操 作，MQTT它是专⻔为小设备设计的
			- MQTT主要是是物联网(IOT)中大量的使用
			- 特性
		- 内存占用低，为小型无声设备之间通过低带宽发送短消息而设计
			- 不支持⻓周期存储和转发，不允许分段消息(很难发送⻓消息)
			- 支持主题发布-订阅、不支持事务(仅基本确认)
			- 消息实际上是短暂的(短周期)
			- 简单用户名和密码、不支持安全连接、消息不透明
		
## 业界主流消息队列和技术选型讲解
### 对比当下主流的消息队列和选择问题
- 业界主流的消息队列: Apache ActiveMQ、Kafka、RabbitMQ、RocketMQ

- ActiveMQ: [http://activemq.apache.org/](http://activemq.apache.org/)
	- Apache出品，历史悠久，支持多种语言的客户端和 协议，支持多种语言Java, .NET, C++ 等
		- 基于JMS Provider的实现
		- 缺点: 吞吐量不高，多队列的时候性能下降，存在消息丢失的情况，比较少大规模使用
	
- Kafka: [http://kafka.apache.org/](http://kafka.apache.org/)
	- 是由Apache软件基金会开发的一个开源流处理平台，由Scala和Java编写。Kafka是一种高吞吐量的分布式发布订阅消息系统，它可以处理大规模的网站 中的所有动作流数据(网⻚浏览，搜索和其他用户的行动)，副本集机制，实现数据冗余，保障数据尽量不丢失; 支持多个生产者和消费者
		- 类似MQ，功能较为简单，主要支持简单的MQ功能
		- 它提供了类似于JMS的特性，但是在设计实现上完全不同，它并不是JMS规范的实现
		- 缺点: 不支持批量和广播消息，运维难度大，文档比较少，需要掌握Scala
	
- RocketMQ: [http://rocketmq.apache.org/](http://rocketmq.apache.org/)
	- 阿里开源的一款的消息中间件, 纯Java开发，具有高吞吐量、高可用性、适合大规模分布式系统应用的特点, 性能强劲(零拷⻉技术)，支持海量堆积, 支持指 定次数和时间间隔的失败消息重发,支持consumer 端tag过滤、延迟消息等，在阿里内部进行大规模使 用，适合在电商，互联网金融等领域
		- 基于JMS Provider的实现
		- 缺点: 社区相对不活跃，更新比较快，纯java支持
	
- RabbitMQ: [http://www.rabbitmq.com/](http://www.rabbitmq.com/)
	- 是一个开源的AMQP实现，服务器端用Erlang语言编写，支持多种客户端，如: Python、Ruby、.NET、 Java、C，用于在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现不错
		- 缺点: 使用Erlang开发，阅读和修改源码难度大
	
## RabbitMQ核心概念+环境说明
### 什么是RabbitMQ消息队列
- 是一个开源的AMQP实现，服务器端用Erlang语言编写，支持多种客户端，如: Python、Ruby、.NET、 Java、C、用于在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现不错，与SpringAMQP完美的整合、API丰富易用

- 文档: [https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)

- 核心概念(了解了这些概念，是使用好RabbitMQ的基础)
	- 
		- Broker
		- RabbitMQ的服务端程序，可以认为一个mq节点就是一个broker
			- Producer 生产者
		- 创建消息Message，然后发布到RabbitMQ中
			- Consumer 消费者
		- 消费队列里面的消息
			- Message 消息
		- 生产消费的内容，有消息头和消息体，也包括多个属性配置，比如routingKey路由键
			- Queue 队列
		- 是RabbitMQ的内部对象，用于存储消息，消息都只能存储在队列中
			- Channel 信道
		- 一条支持多路复用的通道，独立的双向数据流通 道，可以发布、订阅、接收消息。
			- 信道是建立在真实的TCP连接内的虚拟连接，复用TCP连接的通道
			- Connection 连接
		- 是RabbitMQ的socket链接，它封装了socket协议相关部分逻辑，一个连接上可以有多个channel进行通信
			- Exchange 交换器
		- 生产者将消息发送到 Exchange，交换器将消息路由 到一个或者多个队列中，里面有多个类型，队列和交换机是多对多的关系。
			- RoutingKey 路由键
		- 生产者将消息发给交换器的时候，一般会指定一个RoutingKey，用来指定这个消息的路由规则
			- 最大⻓度255 字节
			- Binding 绑定
		- 通过绑定将交换器与队列关联起来，在绑定的时候 一般会指定一个绑定键 ( BindingKey )，这样 RabbitMQ 就知道如何正确地将消息路由到队列了
			- 生产者将消息发送给交换器时，需要一个RoutingKey，当 BindingKey和RoutingKey相匹配时，消息会被路由到对应的队列中
				- 注意：BindingKey和RoutingKey是完全匹配，BindingKey可以用正则
				- Virtual host 虚拟主机
		- 用于不同业务模块的逻辑隔离，一个Virtual Host里面可以有若干个Exchange和Queue，同一个 VirtualHost 里面不能有相同名称的Exchange或Queue
			- 默认是 /
			- 例如：
			/dev
			/test
			/pro
			
### 安装RabbitMQ 的Linux服务器环境准备
- RabbitMQ安装方式
	- 安装文档 [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)
		- 源码安装
		- 依赖多、且版本和维护相对复杂
			- 需要erlang环境、版本也是有要求
			- docker镜像安装(推荐)
		- 不用安装其他相关依赖，容器化部署是趋势
			- 方便管理维护，企业多采用这个方式
		
- Linux服务器准备: CentOS7.x以上即可
	- 本地虚拟机
		- 不同系统容易出现确实依赖库，硬件也存在不兼容
			- 阿里云ECS服务器 (推荐，2核4g)
		- 统一环境，公司多基本都是用云服务器，对于工作上帮助大
			- 本地开发
		- IDEA旗舰版 + JDK8 / JDK11 + Maven3.5以上 + SpringBoot2.X
		
## Docker介绍和使用场景
### 官网: [https://www.docker.com/get-started](https://www.docker.com/get-started)
### 什么是Dokcer
- 百科:一个开源的应用容器引擎，让开发者可以打包他们 的应用以及依赖包到一个可移植的容器中，然后发布到 任何流行的 Linux 机器上，也可以实现虚拟化。

- 容器是完全使用沙箱机制，相互之间不会有任何接口， 使用go语言编写，在LCX(linux容器)基础上进行的封装

- 总结
	- 就是可以快速部署启动应用
		- 实现虚拟化，完整资源隔离
		- 一次编写，四处运行
		- 但有一定的限制，比如Docker是基于Linux 64bit 的，无法在32bit的linux/Windows/unix环境下使用
	
### 为什么要用
- 提供一次性的环境，假如需要安装Mysql、 RocketMQ、RabbitMQ，则需要安装很多依赖库、版本等，如果使用Docker则通过镜像就可以直接启动运行

- 快速动态扩容，使用docker部署了一个应用，可以制作成镜像，然后通过Dokcer快速启动

- 组建微服务架构，可以在一个机器上模拟出多个微服务，启动多个应用

- 更好的资源隔离和共享

- 一句话:开箱即用，快速部署，可移植性强，环境隔离

### 安装Docker实战
- 远程连接ECS实例

- 依次运行以下命令添加yum源。
	- yum update
	yum install epel-release -y
	yum clean all
	yum list
	
- 安装并运行Docker。
	- yum install docker-io -y
	systemctl start docker
	
- 检查安装结果。
	- docker info
	
- 启动使用Docker
	- systemctl start docker  #运行Docker守护进程
		- systemctl stop docker #停止Docker守护进程
		- systemctl restart docker #重启Docker守护进程
	
### Dokcer基础知识
- 概念
	- Docker 镜像 - Docker images: 容器运行的只读模板，操作系统+软件运行环境+用户程序
		- Docker 容器 - Docker containers: 容器包含了某个应用运行所需要的全部环境
		- Docker 仓库 - Docker registeries: 用来保存镜像，有公有和私有仓库，好比Maven的中央仓库和本地私服
		- 总结：对比面向对象的方式
	
- Docker容器常⻅命令
	- 搜索镜像: docker search xxx
		- 列出当前系统存在的镜像: docker images
		- 拉取镜像: docker pull xxx
		- xxx是具体某个镜像名称(格式 REPOSITORY:TAG)
			- REPOSITORY: 表示镜像的仓库源，TAG: 镜像的标签
			- 运行一个容器
		- docker run --name mynginx -p 8080:80 -d nginx
		
docker run 运行一个容器
-d 后台运行
-p 端口映射
--name "xxx" 容器名称
```plaintext
- 列举当前运行的容器: docker ps

- 检查容器内部信息: docker inspect 容器名称

- 删除镜像: docker rmi IMAGE_NAME

	- 强制移除镜像不管是否有容器使用该镜像 增加 -f 参数

- 停止某个容器: docker stop 容器名称

- 启动某个容器: docker start 容器名称

- 移除某个容器: docker rm 容器名称 (容器必须是停止状态)

- 列举全部 容器: docker ps -a

- 查看容器启动日志

	- docker logs -f containerid
```
## 新版RabbitMQ安装和web管控台
### Docker安装并运行RabbitMQ
- 仓库地址: [https://hub.docker.com/_/rabbitmq/](https://hub.docker.com/_/rabbitmq/)

- #拉取镜像
docker pull rabbitmq:management

docker run -d --hostname rabbit_host1 --name my_rabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=password -p 15672:15672 -p 5672:5672 rabbitmq:management

#介绍
-d 以守护进程方式在后台运行
-p 15672:15672 management 界面管理访问端口
-p 5672:5672 amqp 访问端口
--name:指定容器名

--hostname  设定容器的主机名，它会被写到容器内的 /etc/hostname 和 /etc/hosts，作为容器主机IP的别名，并且将显示在容器的bash中
-e 参数
RABBITMQ_DEFAULT_USER 用户名
RABBITMQ_DEFAULT_PASS 密码
```plaintext
-  
```
### 主要端口介绍
- 4369 erlang 发现口
5672 client 端通信口
15672 管理界面 ui 端口
25672 server 间内部通信口

- 访问管理界面
	- ip:15672
	
- 注意
	- 检查Linux服务器防火墙是否关闭
		- #CentOS 7 以上默认使用的是firewall作为防火墙 查看防火墙状态
		firewall-cmd --state
		
#停止firewall
systemctl stop firewalld.service

#禁止firewall开机启动
systemctl disable firewalld.service
```plaintext
- 检查云服务器面板网络安全组是否开放端口
```
### RabbitMQ控制台介绍
- 管控台介绍
	- 默认rabbitmq账号密码 guest/guest(admin/password)
		- 
		- 
	
- 每个虚拟主机默认就有7个交换机
	- 
	
## Java整合RabbitMQ 工作队列模型
### Java项目创建并整合RabbitMQ
- 创建Maven项目
	- 
	
- 删除部分没用的配置

- 修改jdk版本，如果是使用jdk8的，改为1.8即可

- 添加依赖
	- 官方地址: [https://www.rabbitmq.com/java-client.html](https://www.rabbitmq.com/java-client.html)
	
依赖地址: [https://mvnrepository.com/artifact/com.r](https://mvnrepository.com/artifact/com.r) abbitmq/amqp-client/5.10.0
```plaintext
- <dependency>
  <groupId>com.rabbitmq</groupId>
  <artifactId>amqp-client</artifactId>
  <version>5.10.0</version>
  </dependency>
```

### 玩转RabbitMQ简单队列实战
- 简单队列测试
	- 文档 [https://www.rabbitmq.com/tutorials/tutorial-one-java.html](https://www.rabbitmq.com/tutorials/tutorial-one-java.html)
		- 
	
- 消息生产者
	- 代码编写
		- 
		
- 消息消费者(会一直监听队列)
	- 自动确认消息
		- 
			- 自定义消费回调
		- 
		
- 管控台中有对应的信息显示
	- 
	
### RabbitMQ工作队列 轮训策略实战
- 工作队列
	- 消息生产能力大于消费能力，增加多几个消费节点
		- 和简单队列类似，增加多个几个消费节点，处于竞争关系
		- 默认策略: round robin 轮训
		- 
		- 生产者代码
		- 
			- 消费者1代码
		- 
			- 消费者2代码
		- 
		
- 轮训策略验证
	- 先启动两个消费者，再启动生产者
		- 缺点: 存在部分节点消费过快，部分节点消费慢，导致不能合理处理消息
		- 验证结果：
		- 消费者1
			- 消费者2
			- 由于服务器性能原因，消费者2性能高于消费者1，导致实际消费者1消费慢很多，且占用过多消息效率下降
		
### 公平策略验证
- 限制消费者每次消费1个，消费完成再消息下一个
	- channel.basicQos(1);
	
- 解决消费者能力消费不足的问题，降低消费时间问题
	- 
	
## RabbitMQ 交换机和发布订阅模式实战
### Exchange 交换机
- 介绍
	- 
		- 生产者将消息发送到 Exchange，交换器将消息路由到一个或者多个队列中，交换机有多个类型，队列和交换机是多对多的关系。
		- 交换机只负责转发消息，不具备存储消息的能力，如果没有队列和exchange绑定，或者没有符合的路由规则，则消息会被丢失
		- RabbitMQ有四种交换机类型，分别是Direct exchange、Fanout exchange、Topic exchange、 Headers exchange，最后的基本不用
		- 
	
- 交换机类型
	- Direct Exchange 定向
		- 将一个队列绑定到交换机上，要求该消息与一个特定的路由键完全匹配
			- 例子: 如果一个队列绑定到该交换机上要求路由键 “aabb”，则只有被标记为“aabb”的消息才被转发，不会转发aabb.cc，也不会转发gg.aabb，只会转发aabb （点到点）
			- 处理路由健
			- Fanout Exchange 广播
		- 只需要简单的将队列绑定到交换机上，一个发送到交换机的消息都会被转发到与该交换机绑定的所有队列上。很像子网广播，每台子网内的主机都获得了一份复制的消息
			- Fanout交换机转发消息是最快的，用于发布订阅，广播形式，中文是扇形
			- 不处理路由键
			- Topic Exchange 通配符
		- 主题交换机是一种发布/订阅的模式，结合了直连交换机与扇形交换机的特点
			- 将路由键和某模式进行匹配。此时队列需要绑定在一个模式上
			- 符号“#”匹配一个或多个词，符号“*”匹配不多不少一个词
			- 例子: 因此“abc.#”能够匹配到“abc.def.ghi”，但是 “abc.*” 只会匹配到“abc.def”。
			- Headers Exchanges(少用)
		- 根据发送的消息内容中的headers属性进行匹配，在绑定Queue与Exchange时指定一组键值对
			- 当消息发送到RabbitMQ时会取到该消息的headers与Exchange绑定时指定的键值对进行匹配;
			- 如果完全匹配则消息会路由到该队列，否则不会路由到该队列
			- 不处理路由键
		
### RabbitMQ的发布订阅消息模型(广播)
- 介绍
	- 发布-订阅模型中，消息生产者不再是直接面对queue(队列名称)，而是直面exchange，都需要经过exchange来进行消息的发送，所有发往同一个fanout交换机的消息都会被所有监听这个交换机的消费者接收到
		- 发布订阅-消息模型引入fanout交换机
		- 文档: [https://www.rabbitmq.com/tutorials/tutorial-](https://www.rabbitmq.com/tutorials/tutorial-) three-java.html
	
- 应用场景
	- 微信公众号
		- 新浪微博关注
		- 
	
- 总结
	- 通过把消息发送给交换机，交换机转发给对应绑定的队列
		- 交换机绑定的队列是排它独占队列，队列会自动删除
	
### 实战
- 消息生产者 代码
	- 
	
- 3个消费者监听 代码都一样
	- 
	
- 管控台
	- 
		```plaintext
	  -  
	```
## RabbitMQ 主题、路由模式实战
### 路由模式
- 什么是rabbitmq的路由模式
	- 文档: [https://www.rabbitmq.com/tutorials/tutorial-four-java.html](https://www.rabbitmq.com/tutorials/tutorial-four-java.html)
		- 交换机类型是Direct
		- 队列和交换机绑定，需要指定一个路由key(也叫 Bingding Key)
		- 消息生产者发送消息给交换机，需要指定routingKey
		- 交换机根据消息的路由key，转发给对应的队列
		- 
	
- 例子: 日志采集系统 ELK
	- 一个队列收集error信息->告警
		- 
			- 一个队列收集全部信息->日常使用
		- 
			- 生产者
		- 
			- 运行结果，两个队列分别只会收到绑定队列的日志信息
		- 
			- 管控台
		- 
		
### 主题模式
- 背景
	- 如果业务很多路由key，怎么维护??
		- topic交换机，支持通配符匹配模式，更加强大
		- 工作基本都是用这个topic模式
	
- 什么是rabbitmq的主题模式
	- [文档 https://www.rabbitmq.com/tutorials/tutorial-five-java.html](https://www.rabbitmq.com/tutorials/tutorial-five-java.html)
		- 交换机是 topic, 可以实现 发布订阅模式fanout 和 路由模式Direct 的功能，更加灵活，支持模式匹配，通配符等
		- 交换机通过通配符进行转发到对应的队列，* 代表一个 词，#代表1个或多个词，一般用#作为通配符居多，比 如 #.order, 会匹配 info.order、sys.error.order，而 *.order，只会匹配 info.order，之间是使用. 点进行分割多个词的； 如果是 .， 则info.order、error.order都会匹配
		- 
		- 注意
		- 只有在交换机和队列绑定时用的bindingKey使用通配符的路由健
			- 生产者发送消息时需要使用具体的路由健
			- 例子: 日志采集系统
		- 一个队列收集订单系统的全部日志信息
			- #.log
				- order.log.#
			
- 实战
	- 日志采集系统
		- 一个队列收集订单系统的error日志信息，order.log.error
			- 
				- 一个队列收集全部系统的全部级别日志信息，* .log. *
			- 
				- 运行结果，可以用通配符配置路由键，不用全部列出来
			- 
				- 管控台
			- 
			
## RabbitMQ多种工作模式总结
### 对照官网回顾总结
[https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)
### 简单模式
- 一个生产、一个消费，不用指定交换机，使用默认交换机

### 工作队列模式
- 一个生产，多个消费，可以有轮训和公平策略，不用指定交换机，使用默认交换机

### 发布订阅模式
- fanout类型交换机，通过交换机和队列绑定，不用指定 绑定的路由健，生产者发送消息到交换机，fanout交换 机直接进行转发，消息不用指定routingkey路由健

### 路由模式
- direct类型交换机，过交换机和队列绑定，指定绑定的路由健，生产者发送消息到交换机，交换机根据消息的路由key进行转发到对应的队列，消息要指定routingkey路由健

### 通配符模式
- topic交换机，过交换机和队列绑定，指定绑定的【通配符路由健】，生产者发送消息到交换机，交换机根据消息的路由key进行转发到对应的队列，消息要指定routingkey路由健

## SpringBoot2.X+SpringAMQP整合RabbitMQ实战
### SpringAMQP+创建SpringBoot2.X
- 什么是Spring-AMQP
	- 官网:[https://spring.io/projects/spring-amqp](https://spring.io/projects/spring-amqp)
		- Spring 框架的AMQP消息解决方案，提供模板化的发送和接收消息的抽象层，提供基于消息驱动的POJO的消息监听等
		- 提供不依赖于任何特定的AMQP代理实现或客户端库通用的抽象，最终用户代码将很容易实现更易替换、添加和删除AMQP，因为它可以只针对抽象层来开发
		- 总之就是提高我们的框架整合消息队列的效率，SpringBoot为更方便开发RabbitMQ推出了starter。
		- 使用 spring-boot-starter-amqp 进行开发
	
- 创建新版SpringBoot2.X项目
	- 官网: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
		- 在线构建工具 [https://start.spring.io/](https://start.spring.io/)
	
- Maven仓库修改(建议先使用默认的maven仓库，不用更换地址)

```java
<!-- 代码库 --> 
  <repositories>
        <repository>
            <id>maven-ali</id>
           <url>http://maven.aliyun.com/nexus/content/groups/public//</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>true</enabled>
                <updatePolicy>always</updatePolicy>
                <checksumPolicy>fail</checksumPolicy>
            </snapshots>
        </repository>
</repositories>
<pluginRepositories>
        <pluginRepository>
            <id>public</id>
            <name>aliyun nexus</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
            <releases>
                <enabled>true</enabled>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
</pluginRepositories>
```
- spring-boot-starter-amqp 依赖添加

```java
<!--引入AMQP--> 

<dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```
### SpringBoot2.X整合Rabbitmq实战
- yml配置文件修改
	- #消息队列
	spring:
	rabbitmq:
	host: 10.211.55.13
	port: 5672
	virtual-host: /dev
	password: password
	username: admin
	
- RabbitMQConfig文件

```plaintext
@Configuration
public class RabbitMQConfig {

public static final String EXCHANGE_NAME = "order_exchange";

public static final String QUEUE = "order_queue";

/**

- topic 交换机

- @return
*/
@Bean
public Exchange orderExchange(){
return ExchangeBuilder.topicExchange(EXCHANGE_NAME).durable(true).build();
}

/**

- 队列

- @return
*/
@Bean
public Queue orderQueue(){
return QueueBuilder.durable(QUEUE).build();
}

/**

- 交换机和队列绑定关系
*/
@Bean
public Binding orderBinding(Queue queue, Exchange exchange){
return BindingBuilder.bind(queue).to(exchange).with("order.#").noargs();
}

}


```
- 消息生产者-测试类
	```plaintext
	  - @SpringBootTest
	class XdclassSpApplicationTests {
	
	@Autowired
	private RabbitTemplate template;
	
	@Test
	void testSend() {
	
	for (int i = 0; i < 5; i++) {
	      template.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "order.new", "新订单");
	  }
	  }
	  }
	```

- 消息消费者
	```plaintext
	@Component
	@RabbitListener(queues = "order_queue")
	public class OrderMQListener {
	
	@RabbitHandler
	public void messageHandler(String body, Message message){
	
	long msgTag = message.getMessageProperties().getDeliveryTag();
	  System.out.println("msgTag="+msgTag);
	  System.out.println("message="+message.toString());
	  System.out.println("body="+body);
	  
	  }
	  }
	```
- 执行效果
	- 
	
## 高级特性：RabbitMQ消息可靠性投递+消费
### RabbitMQ消息可靠性投递
(确保投递)
- 什么是消息的可靠性投递
	- 保证消息百分百发送到消息队列中去
		- 详细
		- 保证mq节点成功接受消息
			- 消息发送端需要接受到mq服务端接受到消息的确认应答
			- 完善的消息补偿机制，发送失败的消息可以再感知并二次处理
		
- RabbitMQ消息投递路径
	- 生产者->交换机->队列->消费者
		- 通过两个点控制消息的可靠性投递
		- 生产者到交换机
			- 通过confirmCallback回调
				- 交换机到队列
			- 通过returnCallback回调
			
- 建议
	- 开启消息确认机制以后，保证了消息的准确送达，但由于频繁的确认交互，rabbitmq整体效率变低，吞吐量下降严重，不是非常重要的消息真心不建议用消息确认机制
	
- 消息可靠性投递confirmCallback实战
	- 生产者到交换机
		- 通过confirmCallback
			- 生产者投递消息后，如果Broker收到消息后，会给生产者一个ACK。生产者通过ACK，可以确认这条消息是否正常发送到Broker，这种方式是消息可靠性投递的核心
			- 开启confirmCallback
		- #旧版，确认消息发送成功，通过实现ConfirmCallBack接 口，消息发送到交换器Exchange后触发回调
		spring.rabbitmq.publisher-confirms=true
		
#新版，NONE值是禁用发布确认模式，是默认值，CORRELATED值是发布消息成功到交换器后会触发回调方法
spring.rabbitmq.publisher-confirm-type: correlated
```plaintext
- 开发实战

	- 模拟异常，修改一个不存在的交换机名称

	- 效果：confirmCallback中收到的ack为false，说明消息投递失败，可以根据业务做相关处理，比如记录日志到数据库

		-  
```
- 消息可靠性投递returnCallback实战
	- 交换机到队列
		- 通过returnCallback
			- 消息从交换器发送到对应队列失败时触发
			- 两种模式
			- 交换机到队列不成功，则丢弃消息(默认)
				- 交换机到队列不成功，返回给消息生产者，触发returnCallback
				- //为true,则交换机处理消息到路由失败，则会返回给生产者
			template.setMandatory(true);
			
//或者配置文件
spring.rabbitmq.template.mandatory=true
```plaintext
- 第一步 开启returnCallback配置

	- #新版 
```
spring.rabbitmq.publisher-returns=true
```plaintext
- 第二步 修改交换机投递到队列失败的策略

	- #为true,则交换机处理消息到路由失败，则会返回给生产者 spring.rabbitmq.template.mandatory=true

- 开发实战

	- 修改配置

		-  

	- 编写测试用例

		-  

	- 效果：交换机发送到一个不存在的队列，则会返回给生产者，在ReturnCallback类的returnMessage重写方法中可以拿到对应的失败消息，后续可以根据业务记录相关日志到数据库
```
### RabbitMQ消息确认机制ACK
(确保消息被合理处理)
- 背景: 消费者从broker中监听消息，需要确保消息被合理处理
	- 
	
- RabbitMQ的ACK介绍
	- 消费者从RabbitMQ收到消息并处理完成后，反馈给RabbitMQ，RabbitMQ收到反馈后才将此消息从队列中删除
		- 消费者在处理消息出现了网络不稳定、服务器异常等现象，那么就不会有ACK反馈，RabbitMQ会认为这个消息没有正常消费，会将消息重新放入队列中
		- 只有当消费者正确发送ACK反馈，RabbitMQ确认收到后，消息才会从RabbitMQ服务器的数据中删除。
		- 消息的ACK确认机制默认是打开的，消息如未被进行ACK的消息确认机制，这条消息被锁定Unacked
	
- 确认方式
	- 自动确认(默认)
		- 手动确认 manual
		- spring:
		rabbitmq:
		#开启手动确认消息，如果消息重新入队，进行重试
		listener:
		simple:
		acknowledge-mode: manual
			- 其他(基本不用，忽略)
	
### 消息确机制ACK实战+DeliveryTag介绍
- 拒绝后重新入队的例子
(会反复入队，deliveryTag在递增)
	- 
		- 管控台
		- 
		
- 拒绝后不重新入队的例子
(不重新入队)
	- 
		- 管控台
		- 拒绝的队列状态变成UnAcked
			- 过一会自动删除
			
- deliveryTag
	- 表示消息投递序号，每次消费消息或者消息重新投递后，deliveryTag都会增加
	
- basicAck
	- 告诉broker，消息已经被确认，使用此回执方法后，消息会被 rabbitmq broker 删除
	
- basicNack
	- basicReject一次只能拒绝接收一个消息，可以设置是否 requeue。
	
- basicReject
	- basicNack方法可以支持一次0个或多个消息的拒收，可以设置是否requeue。
	
- 人工审核异常消息
(对于拒绝并重新入队的消息设置重试机制或记录日志，人工处理)
	- 设置重试阈值，超过后确认消费成功，记录消息，人工处理
	
## 高级特性：RabbitMQ TTL死信队列+延迟队列实战
### 什么是TTL
- time to live 消息存活时间

- 如果消息在存活时间内未被消费，则会被清除

- RabbitMQ支持两种ttl设置
	- 单独消息进行配置ttl
		- 整个队列进行配置ttl(居多)
	
### 什么是rabbitmq的死信队列
(和普通队列没区别)
- 没有被及时消费的消息存放的队列

### 什么是rabbitmq的死信交换机
- Dead Letter Exchange(死信交换机，缩写:DLX)当消息成为死信后，会被重新发送到另一个交换机，这个交换机就是DLX死信交换机。

- 

### 消息有哪几种情况成为死信
- 消费者拒收消息(basic.reject/ basic.nack)，并且没有重新入队 requeue=false

- 消息在队列中未被消费，且超过队列或者消息本身的过期时间TTL(time-to-live)

- 队列的消息⻓度达到极限

- 结果: 消息成为死信后，如果该队列绑定了死信交换机，则消息会被死信交换机重新路由到死信队列

### RabbitMQ死信队列 + TTL实战
- RabbitMQ管控台消息TTL测试
	- 队列过期时间使用参数，对整个队列消息统一过期
	(一般用这种方式)
		- x-message-ttl
			- 单位ms(毫秒)
			- 消息过期时间使用参数
	(缺点：如果队列头部消息未过期，队列中间消息已经过期，依旧还在队列里面)
		- expiration
			- 单位ms(毫秒)
			- 两者都配置的话，时间短的先触发
	
- RabbitMQ Web控制台测试
	- 新建死信交换机(和普通没区别)
		- 
			- 新建死信队列 (和普通没区别)
		- 
			- 死信交换机和队列绑定
		- 
			- 新建普通队列，设置过期时间、指定死信交换机
		- 
			- 测试: 直接web控制台往product_qeueu发送消息
		- 发送消息
			- 消息到达普通队列
			- 消息没有被消费，过期后自动转发到私信队列
			- 总结：死信队列、死信交换机和普通队列、普通交换机没有区别，核心是看普通队列要不要绑定死信交换机
	
### RabbitMQ 延迟队列介绍和应用场景
- 什么是延迟队列
	- 一种带有延迟功能的消息队列，Producer 将消息发送到消息队列服务端，但并不期望这条消息立⻢投递，而是推迟到在当前时间点之后的某一个时间投递到 Consumer 进行消费，该消息即定时消息
	
- 使用场景
	- 通过消息触发一些定时任务，比如在某一固定时间点向用户发送提醒消息
		- 用户登录之后5分钟给用户做分类推送、用户多少天未登录给用户做召回推送
		- 消息生产和消费有时间窗口要求: 比如在天猫电商交易中超时未支付关闭订单的场景，在订单创建时会发送一条延时消息。这条消息将会在 30 分钟以后投递给消费者，消费者收到此消息后需要判断对应的订单是否已完成支付。如支付未完成，则关闭订单。如已完成支付则忽略
	
- 业界的一些实现方式
	- 定时任务高精度轮训(耗性能)
		- 采用RocketMQ自带延迟消息功能
		- RabbitMQ本身是不支持延迟队列的，怎么办?
		- 结合死信队列的特性，就可以做到延迟消息
			- 
		
## 综合实战：主题模式+延迟消息-实现新商家规定时间内上架商品检查
### 业务逻辑介绍
- 背景
	- JD、淘系、天猫、拼多多电商平台，规定新注册的商家，审核通过后需要在【规定时间】内上架商品，否则冻结账号。
	
- 使用RabbitMQ实现
	- 代码
		- 流程图
	
### 创建死信交换机和队列
- 

### 创建普通队列并绑定私信交换机
- 

### 流程
- 消息生产
	- 投递到普通的topic交换机
		- 消息过期，进入死信交换机
	
- 消息消费
	- 消费者监听死信交换机的队列
	
## 高级特性：Rabbitmq高可用集群实战讲解
### 背景
- 掌握了消息的可靠性投递，还有消费，假如mq节点宕机了怎么办?

- 因此需要做多节点集群配置

- 

### RabbitMQ高可用普通集群模式
- 默认的集群模式，比如有节点node1和node2、node3，三个节点是普通集群，但是他们仅有相同的元数据，即交换机、队列的结构

- 案例
	- 消息只存在其中的一个节点里面，假如消息A，存储在node1节点，消费者连接node1这个节点消费消息时，可以直接取出来
		- 但如果消费者是连接的是其他节点，那rabbitmq会把 queue 中的消息从存储它的节点中取出， 并经过连接节点转发后再发送给消费者
		- 问题
		- 假如node1故障，那node2无法获取node1存储未被消费的消息;
			- 如果node1持久化后故障，那需要等node1恢复后才可以正常消费，如果node1没做持久化后故障，那消息将会丢失
			- 这个情况无法实现高可用性，且节点间会增加通讯获取消息，性能存在瓶颈
			- 项目中springboot+amqp里面需要写多个节点的配置
		- spring.rabbitmq.addresses=192.168.1.1:5672,192.168.1.2:5672,192.168.1.3:5672
			- 该模式更适合于消息无需持久化的场景，如日志传输的队列
		- 
		
- 注意: 集群需要保证各个节点有相同的token令牌
	- erlang.cookie是erlang的分布式token文件，集群内各个节点的erlang.cookie需要相同，才可以互相通信
	
- 

### RabbitMQ高可用mirror镜像集群模式
(大厂基本使用这个方式)
- 队列做成镜像队列，让各队列存在于多个节点中

- 和普通集群比较大的区别就是【队列queue的消息message 】会在集群各节点之间同步，且并不是在 consumer 获取数据时临时拉取，而普通集群则是临时从存储的节点里面拉取对应的数据

- 结论
(空间换时间)
	- 实现了高可用性，部分节点挂掉后，不影响正常的消费，可以保证100%消息不丢失，推荐3个奇数节点，结合 LVS+Keepalive进行IP漂移，防止单点故障
	
- 缺点
	- 由于镜像队列模式下，消息数量过多，大量的消息同步也会加大网络带宽开销，适合高可用要求比较高的项目
		- 过多节点的话，性能则更加受影响
	
- 注意: 集群需要保证各个节点有相同的token令牌
	- erlang.cookie是erlang的分布式token文件，集群内各个节点的erlang.cookie需要相同，才可以互相通信
	
- 其他通过插件形成的集群，比如Federation集群

### RabbitMQ高可用普通集群搭建综合实战
- 基础准备
	- 清理单机和网络开放
		- 关闭原先的单节点
			- 云服务器网络安全组开放对应的端口
			- 防火墙一定要关闭
			- 准备3个节点安装好rabbitmq，形成集群 (记得每个节点间隔几十秒再启动，如果失败删除宿主机文件重新搭建)
		- 节点一：主节点创建
			- #-v映射目录
			docker run -d --hostname rabbit_host1 --name rabbitmq1 -p 8001:15672 -p 8672:5672 
			-e RABBITMQ_NODENAME=rabbit  
			-e RABBITMQ_DEFAULT_USER=admin 
			-e RABBITMQ_DEFAULT_PASS=resonance.fun  
			-e RABBITMQ_ERLANG_COOKIE='rabbitmq_cookie_forest'  
			--privileged=true  
			-v /usr/local/rabbitmq/1/lib:/var/lib/rabbitmq  
			-v /usr/local/rabbitmq/1/log:/var/log/rabbitmq 
			rabbitmq:management
				- 节点二创建
			- docker run -d --hostname rabbit_host2 --name rabbitmq2 -p 8002:15672 -p 8673:5672 
			--link rabbitmq1:rabbit_host1 
			-e RABBITMQ_NODENAME=rabbit  
			-e RABBITMQ_DEFAULT_USER=admin  
			-e RABBITMQ_DEFAULT_PASS=resonance.fun  
			-e RABBITMQ_ERLANG_COOKIE='rabbitmq_cookie_forest'  
			--privileged=true  
			-v /usr/local/rabbitmq/2/lib:/var/lib/rabbitmq  
			-v /usr/local/rabbitmq/2/log:/var/log/rabbitmq  
			rabbitmq:management
				- 节点三创建
			- docker run -d --hostname rabbit_host3 --name rabbitmq3 -p 8003:15672 -p 8674:5672 
			--link rabbitmq1:rabbit_host1 
			--link rabbitmq2:rabbit_host2 
			-e RABBITMQ_NODENAME=rabbit 
			-e RABBITMQ_DEFAULT_USER=admin 
			-e RABBITMQ_DEFAULT_PASS=resonance.fun 
			-e RABBITMQ_ERLANG_COOKIE='rabbitmq_cookie_forest' 
			--privileged=true 
			-v /usr/local/rabbitmq/3/lib:/var/lib/rabbitmq 
			-v /usr/local/rabbitmq/3/log:/var/log/rabbitmq 
			rabbitmq:management
				- 参数说明
			- --hostname
				- 自定义Docker容器的 hostname
					- --link
				- 容器之间连接，link不可或缺，使得三个容器能互相通信
					- --privileged=true
				- 使用该参数，container内的root拥有真正的root权限，否则容器出现permission denied
					- -v
				- 宿主机和容器路径映射
					- -e
				- RABBITMQ_NODENAME
					- 节点名，缺省 Unix*: rabbit@$HOSTNAME
						- RABBITMQ_DEFAULT_USER=admin
					- 用户名
						- RABBITMQ_DEFAULT_PASS=resonance.fun
					- 密码
						- RABBITMQ_ERLANG_COOKIE
					- Erlang Cookie 值必须相同，也就是一个集群内
						- 参数的值必须相同， 相当于不同节点之间通讯的密钥，erlang.cookie是erlang的分布式 token文件，集群内各个节点的erlang.cookie需要相同，才可以互相通信
					
- 高可用普通集群搭建
	- 配置集群
		- 节点一配置集群
			- docker exec -it rabbitmq1 bash
			rabbitmqctl stop_app
			rabbitmqctl reset
			rabbitmqctl start_app
			exit
				- 节点二加入集群
			- #--ram是以内存方式加入，忽略该参数默认为磁盘节点。
			docker exec -it rabbitmq2 bash
			rabbitmqctl stop_app
			rabbitmqctl reset
			rabbitmqctl join_cluster --ram rabbit@rabbit_host1
			rabbitmqctl start_app
			exit
				- 节点三加入集群
			- #--ram是以内存方式加入，忽略该参数默认为磁盘节点。
			docker exec -it rabbitmq3 bash
			rabbitmqctl stop_app
			rabbitmqctl reset
			rabbitmqctl join_cluster --ram rabbit@rabbit_host1
			rabbitmqctl start_app
			exit
				- 查看集群节点状态
			- rabbitmqctl cluster_status
				- 配置启动了3个节点，1个磁盘节点和2个内存节点
				- 
					- 访问节点一的web管控台，可以看到多个节点
			- 
				- 测试
			- node1 主节点创建队列，发送消息 (可以选择消息是否持久化)
				- 
					- node2和node3通过节点自身的web管控台可以看到队列和消息
				- 节点1
					- 
						- 节点2
					- 
						- 节点3
					- 
						- 问题: 如果把node1节点停止，node2和node3会收不到消息
				- node1主节点(磁盘节点)停止，其他节点会收不到消息，只有node1主节点重启才可以
					- 
						- 备注: 如果是在非主节点(非磁盘节点)创建队列和发送消息，则其他队列可以显示
			
- RabbitMQ高可用普通集群 SpringBoot测试
(主节点停掉，其余节点就不能用了)
	- SpringBoot项目配置集群
		- #配置文件修改
		#消息队列
		spring:
		rabbitmq:
		addresses: 115.159.78.92:8672,115.159.78.92:8673,115.159.78.92:8674
		virtual-host: /dev
		password: resonance.fun
			username: admin
	#开启消息二次确认,生产者到broker的交换机
	publisher-confirm-type: correlated
	#开启消息二次确认，交换机到队列的可靠性投递
	publisher-returns: true #为true，则交换机处理消息到路由失败，则会返回给生产者
	template:
	mandatory: true
	#消息手工确认ACK
	listener:
	simple:
	acknowledge-mode: manual	- 管控台新建virtual host: /dev
		- 代码
		- 交换机、队列配置
			- 
				- 监听
			- 
				- 测试用例
			- 
				- 正常发送消息
		- 其余节点都能收到
			- 
				- 模拟异常
		- 先发送消息，然后停止node1，启动SpringBoot项目，消息则消费不了，且报错
			- 发送消息
				- 停止node1
				- 
					- 启动SpringBoot，无法消费，且报错
				- 重新启动node1，启动SpringBoot项目，恢复正常
			- 重新启动node1
				- 
					- 重新启动SpringBoot，恢复正常
			
### RabbitMQ高可用mirror镜像集群配置策略配置实战
(基于普通集群增加配置)
- 背景
	- 前面搭建了普通集群，如果磁盘节点挂掉后，如果没开启持久化数据就丢失了，其他节点也无法获取消息，所以我们这个集群方案需要进一步改造为镜像模式集群。
	
- 策略policy介绍
	- rabbitmq的策略policy是用来控制和修改集群的vhost队列和Exchange复制行为
		- 就是要设置哪些Exchange或者queue的数据需要复制、同步，以及如何复制同步
	
- 创建一个策略来匹配队列
	- 路径: rabbitmq管理⻚面 —> Admin —> Policies —> Add / update a policy
		- 参数: 策略会同步同一个VirtualHost中的交换器和队列数据
		- name: 自定义策略名称
			- Pattern: 匹配符，^ 代表匹配所有
			- Definition:
			- ha-mode=all 为匹配类型，分为3种模式: all(表示所有的queue)
				- all: 表示在集群中所有的节点上进行镜像同步(一般都用这个参数)
					- exactly: 表示在指定个数的节点上进行镜像同步，节点的个数由ha-params指定
					- nodes: 表示在指定的节点上进行镜像同步，节点名称通过ha-params指定
					- ha-sync-mode: 镜像消息同步方式 automatic(自 动)，manually(手动)
				- 管控台新增policy
		- 
		
- 配置好后，+2的意思是有三个节点，一个节点本身和两个镜像节点，且可以看到策略名称 forest_policy
	- 
	
- 集群重启顺序
	- 集群重启的顺序是固定的，并且是相反的
		- 启动顺序: 磁盘节点 => 内存节点
		- 关闭顺序: 内存节点 => 磁盘节点
		- 最后关闭必须是磁盘节点，否则容易造成集群启动失败、数据丢失等异常情况
	
- SpringBoot2.x项目整合RabbitMQ高可用mirror镜像集群
	- SpringBoot AMQP单机配置
		- 和集群模式配置对比多了port、host，少了addresses
			- 高可用镜像集群配置
	(和普通集群模式是一样的配置)
		- #配置文件修改
		#消息队列
		spring:
		rabbitmq:
		addresses: 115.159.78.92:8672,115.159.78.92:8673,115.159.78.92:8674
		virtual-host: /dev
		password: resonance.fun
			username: admin
	#开启消息二次确认,生产者到broker的交换机
	publisher-confirm-type: correlated
	#开启消息二次确认，交换机到队列的可靠性投递
	publisher-returns: true #为true，则交换机处理消息到路由失败，则会返回给生产者
	template:
	mandatory: true
	#消息手工确认ACK
	listener:
	simple:
	acknowledge-mode: manual	- 高可用集群测试
	(停掉主节点，其他节点也能正常查看队列和消费)
		- 关闭消费者监听
			- 生产者发送一个消息
			- 
				- 
				- 停止节点一，节点1web管控台访问不了
			- 
				- 节点3正常，消息依旧存在
				- 节点2正常，消息依旧存在
				- 启动消费者监听，可以消费到消息
			- 重新启动，正常消费
			
## RabbitMQ核心原理
### RabbitMQ里面vhost虚拟主机的作用你知道不?
(业务隔离、环境隔离、用户权限隔离)
- 如何理解RabbitMQ里面的虚拟主机
	- vhost可以认为是一个虚拟的小型rabbitmq队列
		- 内部均含有独立的，queue、exchange 和 binding 等
		- 其拥有独立的权限系统，可以做到vhost范围的用户控制，更多用于做不同权限的隔离
	
- 用于不同业务模块的逻辑隔离，一个Virtual Host里面可以有若干个Exchange和Queue，同一个VirtualHost 里面不能有相同名称的Exchange或Queue

### 项目中为什么使用消息队列
- 使用场景
(好处)
	- 核心应用
		- 解耦: 订单系统 -> 物流系统
			- 异步: 用户注册 -> 发送邮件，初始化信息
			- 削峰: 秒杀、日志处理
			- 跨平台、多语言
		- 分布式事务、最终一致性
		- RPC调用上下游对接，数据源变动 -> 通知下属
		- 
	
- 缺点
	- 系统可用性越低: 外部依赖越多，依赖越多，出问题⻛险越大
		- 系统复杂性提高: 需要考虑多种场景，比如消息重复消费，消息丢失
		- 需要更多的机器和人力: 消息队列一般集群部署，而且需要运维和监控，例如topic申请等
	
### 项目中为什么使用消息队列，怎么选择哪个队列产品
- 业界主流的消息队列: Apache ActiveMQ、Kafka、RabbitMQ、RocketMQ

- ActiveMQ: [http://activemq.apache.org/](http://activemq.apache.org/)
	- Apache出品，历史悠久，支持多种语言的客户端和 协议，支持多种语言Java, .NET, C++ 等
		- 基于JMS Provider的实现
		- 缺点: 吞吐量不高，多队列的时候性能下降，存在 消息丢失的情况，比较少大规模使用
	
- Kafka: [http://kafka.apache.org/](http://kafka.apache.org/)
(日志、大数据、海量数据增加缓冲)
	- 是由Apache软件基金会开发的一个开源流处理平台，由Scala和Java编写。Kafka是一种高吞吐量的分布式发布订阅消息系统，它可以处理大规模的网站中的所有动作流数据(网⻚浏览，搜索和其他用户的行动)，副本集机制，实现数据冗余，保障数据尽量不丢失；支持多个生产者和消费者
		- 类似MQ，功能较为简单，主要支持简单的MQ功能
		- 缺点: 不支持批量和广播消息，运维难度大，文档比较少，需要掌握Scala
	
- RocketMQ: [http://rocketmq.apache.org/](http://rocketmq.apache.org/)
(电商、金融、团队规模大，使用Java语言多、适合二次定制)
	- 阿里开源的一款的消息中间件, 纯Java开发，具有高吞吐量、高可用性、适合大规模分布式系统应用的特点，性能强劲(零拷⻉技术)，支持海量堆积，支持指定次数和时间间隔的失败消息重发，支持consumer端tag过滤、延迟消息等，在阿里内部进行大规模使用，适合在电商，互联网金融等领域
		- 基于JMS Provider的实现
		- 缺点: 社区相对不活跃，更新比较快，纯java支持
	
- RabbitMQ: [http://www.rabbitmq.com/](http://www.rabbitmq.com/)
(电商、金融、更新稳定、全球大规模使用，不适合二次定制，使用Erlang语言开发少)
	- 是一个开源的AMQP实现，服务器端用Erlang语言编写，支持多种客户端，如: Python、Ruby、.NET、Java、C、用于在分布式系统中存储转发消息，在易用性、扩展性、高可用性等方面表现不错
		- 缺点: 使用Erlang开发，阅读和修改源码难度大
	
### 项目中消息队列怎么避免重复消费，说下你知道哪几种方案
(怎么样可以避免重复消费)
- 任何消息队列产品不保证消息不重复，如果你的业务需要保证严格的不重复消息，需要你自己在业务端去重

(场景：消费者由于网络或其他原因没有ACK成功，这个消息一般会被重新投放到队列中，重新给消费者消费)
```plaintext
- kafka、rocketmq、rabbitmq等都是一样的

- 接口幂等性保障 ，消费端处理业务消息要保持幂等性

	- 幂等性，通俗点说，就一个数据或者一个请求，给你重复来多次，你得确保对应的数据是不会改变的

		- Redis

			- setNX() , 做消息id去重 java版本目前不支持设置 过期时间，可以用lua脚本保证设置值和过期时间原子性

				- //Redis中操作，判断是否已经操作过
```
boolean flag = jedis.setNX(key);
if(flag){
//消费
}else{
//忽略，重复消费
}
```plaintext
			- Incr 原子操作: key自增，大于0 返回值大于0则 说明消费过

				- int num =  jedis.incr(key);
```
if(num == 1){
//消费
}else{
//忽略，重复消费
}
```plaintext
			- 上述两个方式都可以，但是排重可以不考虑原子问题，数据量多需要设置过期时间，考虑原子问题

		- 数据库去重表
```
(性能较低)
```plaintext
			- 某个字段使用Message的key做唯一索引
```
- 核心还是业务场景，不一定每个消息消费都需要加上述的操作，比如下面的场景
	- 优惠券记录释放的MQ消息，即锁定的消息变成可用的，不管多少次都是一样的结果
		- update coupon_record set state='NEW'
		where id=#{id} and state='LOCK'
			- 评论点赞计数，需要保证幂等性，因为一个消息就会导致数值发生变化
	
### 你知道RabbitMQ是如何保障消息可靠性投递的吗?
(Rabbitmq的消息可靠性投递)
- 什么是消息的可靠性投递
	- 保证消息百分百发送到消息队列中去
		- 详细
		- 保证mq节点成功接受消息
			- 消息发送端需要接受到mq服务端接受到消息的确认应答
			- 完善的消息补偿机制，发送失败的消息可以再感知并二次处理
			- 注意：交换机、队列、消息都需要开启持久化，防止丢失
			
- RabbitMQ消息投递路径
	- 生产者-->交换机->队列->消费者
		- 
			- 通过两个的点控制消息的可靠性投递
		- 生产者到交换机
			- 通过confirmCallback
				- 生产者投递消息后，如果Broker收到消息后，会给生产者一个ACK。生产者通过ACK，可以确认这条消息是否正常发送到Broker，这种方式是消息可靠性投递的核心
					- 交换机到队列
			- 通过returnCallback
				- 交换机到队列不成功，丢弃(默认)或者返回给消息生产者，触发returnCallback
					- 消费者开启手工确认
	
- 建议
	- 消息确认机制不是必须的
	(性能下降，看具体的项目在性能和可用中权衡)
		- 开启消息确认机制以后，保证了消息的准确送达，但由于频繁的确认交互，rabbitmq整体效率变低，吞吐量下降严重，不是非常重要的消息真心不建议用消息确认机制
	
### 你知道RabbitMQ是如何实现延迟队列的吗，说下使用场景
(Rabbitmq的死信队列和延迟队列)
- 什么是rabbitmq的死信队列
	- 没有被及时消费的消息存放的队列
		- 什么是rabbitmq的死信交换机
		- Dead Letter Exchange(死信交换机，缩写:DLX)当消息成为死信后，会被重新发送到另一个交换机，这个交换机就是DLX死信交换机。
			- 
			
- 消息有哪几种情况成为死信
	- 消费者拒收消息(basic.reject/basic.nack)，并且没有重新入队requeue=false
		- 消息在队列中未被消费，且超过队列或者消息本身的过期时间TTL(time-to-live)
		- 队列的消息⻓度达到极限
		- 结果: 消息成为死信后，如果该队列绑定了死信交换机，则消息会被死信交换机重新路由到死信队列
	
- 使用场景
	- 通过消息触发一些定时任务，比如在某一固定时间点向用户发送提醒消息
		- 用户登录之后5分钟给用户做分类推送、用户多少天未登录给用户做召回推送;
		- 消息生产和消费有时间窗口要求: 比如在天猫电商交易中超时未支付关闭订单的场景，在订单创建时会发送一条延时消息。这条消息将会在 30 分钟以后投递给消费者，消费者收到此消息后需要判断对应的订单是否已完 成支付。如支付未完成，则关闭订单。如已完成支付则忽略
	
- 例子
	- 优惠券回收
		- 商品库存回收
		- 超时未支付-定时关单实现
	
### 更多...
