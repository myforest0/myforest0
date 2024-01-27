---
title: 分布式缓存Redis6.X+高可用集群笔记
urlname: 51ee5d1b79664e09aa36aa64af9d1320
date: '2024-01-20 16:15:24'
updated: '2024-01-22 13:49:30'
description: 'Q: 为什么要学习RedisA: 解决高并发下性能问题 高并发解决方案：  队列：Rabbitmq、Kafka  缓存  分布式缓存：Redis、Memcached  本地缓存：Mybatis、Redis本地单机服务   怎么选择缓存方案？结合业务数据选择，一般都是共同存在的。衍生问题及解决：...'
---
## Q: 为什么要学习Redis

#### A: 解决高并发下性能问题

- 
高并发解决方案：

   - 
队列：Rabbitmq、Kafka

   - 
缓存

      - 
分布式缓存：Redis、Memcached

      - 
本地缓存：Mybatis、Redis本地单机服务


### 怎么选择缓存方案？

结合业务数据选择，一般都是共同存在的。

### 衍生问题及解决：热点key问题

#### 定义

缓存中的某些key对应的value存储在集群中的某台机器，使得所有流量集中涌向这台机器，造成系统瓶颈，并且无法通过扩容来解决。比如：热搜词、热点新闻、热卖商品

#### 解决方案

排除带宽或者传输影响，服务在拿到分布式缓存数据后，在本地缓存一份（可以设置过期时间），以后每次请求，都先检查本地缓存是否存在缓存key，如果存在则直接返回，如果不存在则再去访问分布式缓存机器获取数据。

## Redis简介

- 
属于Nosql的一种

   - 
Nosql

      - 
是一种非关系型数据库管理系统

      - 
不使用SQL作为查询语言

      - 
不需要固定的表格模式：键值对、列存储、文档存储、图形数据库

      - 
产品：Redis、Memcached、Mongodb、Hbase

- 
是一个开源的由C语言编写的存储数据库，支持网络，支持基于内存、分布式、可选持久化。并且它提供了多种语言的API，比如Java、JavaScript、Python都可以使用Redis

- 
Redis是内存中的数据结构存储系统，它可以被用作数据库、缓存、消息中间件，支持字符串（strings）、散列（hashes）、列表（lists）、集合（sets）、有序集合（sorted sets）等


## 安装

#### 源码编译安装

- 源码安装Redis-上传到Linux服务(先安装升级gcc再编译)

注意：安装编译redis6需要升级gcc，默认自带的gcc版本比较老

```shell
#安装gcc
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
```

#### Docker安装

- 安装docker

```shell
yum install docker-io -y
```

- 运行docker

```shell
systemctl start docker
```
