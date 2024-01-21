---
title: K8s笔记
urlname: a819666aa68d94cd43692e05bac074e0
date: '2024-01-20 16:15:19'
updated: '2024-01-21 12:29:18'
description: 容器编排k8s最佳实践kubernetes+Rancher2.x笔记为什么要学习容器编排调度Kubernetes 多数互联网公司里面用的技术，实现跨主机多容器编排调度管理的最佳技术之一  可以实现服务注册发现、DevOps自动部署和回滚，能够自动实现请求的负载均衡分配网络流量  在多数互联网公...
---
# 容器编排k8s最佳实践kubernetes+Rancher2.x笔记

## 为什么要学习容器编排调度Kubernetes

-  多数互联网公司里面用的技术，实现跨主机多容器编排调度管理的最佳技术之一 
-  可以实现服务注册发现、DevOps自动部署和回滚，能够自动实现请求的负载均衡分配网络流量 
-  在多数互联网公司中，Kubernetes占有率很高，是近几年大量流行 
-  可以作为公司内部培训技术分享必备知识，超多案例+实战等 

### 有谁在用，进一线大厂(国内大厂多数都有用)

-  国内：阿里、字节、腾讯 、微信、网易、⻁牙、⻘云、新浪等 
-  国外：谷歌、Facebook、亚⻢逊、苹果等 

### [K8S文档：](https://kubernetes.io/docs/home/)[https://kubernetes.io/docs/home/](https://kubernetes.io/docs/home/)

## 互联网项目部署方式历史发展

### 应用程序部署方式

![](/images/2c24c986115eb4a27a2cf8c34acd0fd1.png)

-  传统部署时代 
   -  早期的时候，在物理服务器上运行应用程序 
   -  缺点 
      -  无法限制在物理服务器中运行的应用程序资源使用，会导致资源分配问题，过高或过低 
      -  部署多个物理机，维护许多物理服务器的成本很高。 
-  虚拟化部署时代 
   -  虚拟化技术允许在单个物理服务器的 CPU 上运行多台虚拟机(VM) 
   -  虚拟化能使应用程序在不同 VM 之间被彼此隔离，且能提供一定程度的安全性 
   -  能够更好地利用物理服务器的资源，具有更高的可伸缩性，以及降低硬件成本等等的好处 
   -  缺点 
      -  需要单独一个系统，占用资源 
      -  不能灵活的扩容和缩容 
-  容器部署时代 
   -  容器类似于 VM，但是更宽松的隔离特性，使容器之间可以共享操作系统(OS) 
   -  最熟悉的就是Docker容器化技术 
      -  一行命令可以部署任意一个 mysql、nginx、redis、RabbitMQ、Kakfa等热⻔中间件 
      -  docker命令可以操作当前机器上的1个容器 
      -  docker-compose可以操作当前机器上的多个容器 
      -  容器比起 VM 被认为是更轻量级的，每个容器都具有自己的文件系统、CPU、内存、进程空间等 
      -  跨云和操作系统发行版本的可移植性：可在 Ubuntu、CoreOS、CentOS、Google Kubernetes Engine 和其他任何地方运行 

### 那Docker容器化技术带来了哪些问题

-  10个物理机发布100个容器，怎么快速发布和管理 
-  用户请求过来，怎么分配请求到100个容器里面 
-  突发海量请求过来，如何根据情况进行快速扩容 
-  应用发布上线出现问题，需要进行回滚历史版本，如何进行回滚 
-  某个容器故障了，如何快速启动新容器去替代 
-  ...... 

### 上面容器管理的问题称为容器编排，为了解决这些问题，产生了一些容器编排的软件

-  Docker Swarm：Docker自己的容器编排工具 
-  Mesos：Apache的资源管控的工具，结合Marathon使用 
-  Kubernetes：Google开源的的容器编排工具, 基于内部 Borg系统的开源版本 

### 什么是Kubernetes?

-  Kubernetes 这个名字源于希腊语，意为“舵手”或“⻜行员” 
-  k8s 这个缩写是因为 k 和 s 之间有八个字符的关系。 
-  Google 在 2014 年开源了 Kubernetes 项目。 Kubernetes建立在Google大规模运行生产工作负载十几年经验的基础上，结合了社区中最优秀的想法和实践。 
-  Kubernetes是一个可移植、可扩展的开源平台，用于管理容器化的工作负载和服务，简称K8S 
-  [官方文档：](https://kubernetes.io/zh-cn/docs/home/)[https://kubernetes.io/zh-cn/docs/home/](https://kubernetes.io/zh-cn/docs/home/) 

### k8s概述

-  K8S的本质是一组服务器集群，可以在对应服务器集群的每个节点上运行程序，来对节点中的容器进行管理 
-  类似Master-Work方式，每个服务器上安装特定的k8s组件，就可以形成集群，然后部署对应的应用即可。 

### k8s常⻅的功能

-  服务发现和负载均衡 
   -  Kubernetes 可以使用 DNS 名称或自己的 IP 地址来暴露容器 
   -  如果进入容器的流量很大， Kubernetes 能够自动实现请求的负载均衡分配网络流量，从而使部署稳定 
-  存储编排 
   - Kubernetes 允许自动挂载选择的存储系统，例如本地存储、云提供商存储等
-  自动部署和回滚 
   -  可以用k8s自动化部署创建新容器，删除现有容器并将它们的所有资源用于新容器。 
   -  当版本发布错误，可以立刻回退到之前的版本 
-  自我修复 
   - 如果某个容器宕机了，K8S 可以快速重新启动新的的容器，替换旧的容器
-  密钥与配置管理 
   - K8S允许存储和管理敏感信息，例如密码、OAuth 令牌和 ssh 密钥

### Kubernetes常⻅组件和整体架构

-  kubernetes常⻅概念 
   -  Master 
      - 指的是集群控制节点(相当于整个集群的指挥中心)，在每个Kubernetes集群里都需要有一个Master来负责整个集群的管理和控制
   -  Node 
      -  除了master，k8s集群中的其他机器被称为Node节点，Node节点才是kubernetes集群中的工作负载节点 
      -  每个Node节点都会被master分配一些工作负载(docker容器)，node节点上的docker负责容器的运行 
   -  Pod 
      -  Pod是一组容器, 在K8S中，最小的单位是Pod，一个Pod可以包含多个容器，但通常情况下我们在每个Pod中仅使用一个容器 
      -  可以把Pod理解成豌豆荚, Pod内的每个容器是一颗颗豌豆 

![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/bc07266c-303b-41aa-b216-7f86a0f7b6b3/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 1.png) 

      -  分类 
         -  自主创建：直接创建出来的Pod，这种pod删除后就没有了，也不会自动重建 
         -  控制器创建：通过控制器创建的pod，这类Pod删除了之后还会自动重建 
   -  Pod Controller 
      -  控制器是管理pod的中间层，只需要告诉Pod控制器，想要创建多少个什么样的Pod，它会创建出满足条件的Pod并确保每一个Pod资源处于用户期望的目标状态。如果Pod在运行中出现故障，它会基于指定策略重新编排Pod 
      -  通过它来实现对pod的管理，比如启动pod、停止pod、扩展pod的数量等等 
      -  类型 
         - ReplicaSet、Deployment、Horizontal Pod Autoscaler、DaemonSet等
   -  Service 
      -  在k8s里面，每个Pod都会被分配一个单独的IP地址，但这个 IP地址会随着Pod的销毁而消失 
      -  Service (服务)就是用来解决这个问题的，对外服务的统一入口，用于为一组提供服务的Pod抽象一个稳定的网络访问地址 
      -  一个Service可以看作一组提供相同服务的Pod的对外访问接口，作用于哪些Pod是通过标签选择器来定义的 
   -  Label 
      -  K8S提供了一种机制来为Pod进行分类，那就是Label(标签)，同一类pod会拥有相同的标签 
      -  Label的具体形式是key-value的标记对，可以在创建资源的时候设置，也可以在后期添加和修改 
      -  给某个资源对象定义一个Label，就相当于给它打了一个标签，可以通过Label Selector(标签选择器)查询和筛选拥有某些Label的资源对象，K8S通过这种方式实现了类似 SQL的对象查询机制 
      -  应用场景 
         - 未使用前，分散难管理，如果需要部署不同版本的应用到不同的环境中，难操作

![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/f2e4ae2a-1a75-4197-8877-c2f8bd927a69/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 2.png) 

         - 为Pod打上不同标签，使用Label组织的Pod，轻松管理

![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/b5677daa-e74a-4bc6-95e6-949bb49cce9b/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 3.png) 

   -  Label选择器 
      -  对应的资源打上标签后，可以使用标签选择器过滤指定的标签 
      -  标签选择器目前有两个 
         -  基于等值关系(等于、不等于) 
         -  基于集合关系(属于、不属于、存在) 
   -  NameSpace 
      -  可以在一个物理集群上运行多个虚拟集群，这种虚拟集群被称作命名空间，用来隔离pod的运行环境 
      -  同一个名字空间中的资源名称必须唯一，而不同名字空间之间则没有这个要求 
      -  NameSpace是不能嵌套的，每一个 Kubernetes 的资源都只能在一个NameSpace内 
      -  名字空间是在多个用户之间划分集群资源的一种方法(通过资源配额) 
      -  不必使用多个名字空间来分隔轻微不同的资源，例如同一软件的不同版本：应该使用标签来区分同一名字空间中的不同资源 
      -  Kubernetes 会创建四个初始NameSpace名称空间 
         -  default 
            - 没有指明使用其它名字空间的对象所使用的默认名字空间
         -  kube-system 
            - Kubernetes系统创建对象所使用的名字空间
         -  kube-public 
         -  kube-node-lease 
   -  应用分类 
      -  有状态应用 
         -  不能简单的实现负载均衡的服务，有数据产生的服务，Redis、MySql、RabbitMQ等 
         -  相关服务须通过一些较复杂的配置才能做到负载均衡 
         -  有状态的应用，建议直接在物理机部署，方便维护管理 
      -  无状态应用 
         -  没有对应业务数据的应用，可以简单的实现负载均衡，复制一个节点即可快速扩容，如SpringCloud中的业务服务 
         -  无状态的应用适合部署在Kubernetes(K8s)中或者容器中 
-  kubernetesK8S整体架构<br />![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/4b9e8ff0-e8c9-4248-9edb-5effc365a6e4/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 4.png) 
   - 也是Client-Server模型

![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/be135f79-ec1d-4c55-bc92-10c5df25ac23/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 5.png) 

   -  控制节点Master-Node，负责集群的管理 (Master也可以多个，保证高可用) 
      -  apiserver：提供操作【k8s集群资源】的唯一入口， RESTful方式请求,并提供认证、授权、访问控制、API注册和发现等 
      -  scheduler：负责资源的调度，按照预定的调度策略，【计 算】将Pod调度到相应的Node节点进行应用部署 
      -  controller-manager：控制器管理中心，负责维护集群的状态，比如故障检测、滚动更新等，根据调度器的安排通知对应的节点创建pod 
      -  etcd：存储中心，是兼具一致性和高可用性的键值数据库，可以作为保存 Kubernetes 所有集群数据的后台数据库 
   -  工作节点Worker-Node，负责为集群提供运行环境 
      -  Worker-Node是Pod真正运行的主机，可以是物理机也可以是虚拟机，Node本质上不是K8S来创建的，K8S只是管理Node上的资源，为了管理Pod，每个Node节点上至少需要运行 container runtime(Docker)、kubelet和kube-proxy服务 
      -  kubelet：相当于主节点派到工作节点的一个代表，用于管理本机容器(相当于master节点的化身)，负责维护容器的生命周期也负责Volume(CVI)和网络(CNI)的管理 
      -  kube-proxy：负责为Service提供cluster内部的服务发现/网络代理/负载均衡等操作，为部署的应用程序提供访问入口，和apiserver是不一样的，后者是操作k8s集群内部的 

## K8S常⻅集群架构和云服务器搭建实 战

### K8S常⻅集群架构和搭建方式介绍

-  k8s集群类型有多种 
   -  单master-Node集群 
      - 一主多从，推荐测试环境

![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/6b285b54-db8d-465d-98eb-b3ed646fac4b/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 6.png) 

      - 服务器要求：服务器要求至少2台2核4G以上的云服务器
   -  多master-Node集群 
      - 多主多从(高可用集群)，推荐生产环境使用

![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/aa8a70bb-5425-44ef-85fe-103e2b04dc32/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 7.png) 

      - 服务器要求：服务器要求至少4台2核4G以上的云服务器
   -  单节点k8s集群 
      -  单一个节点 
      -  服务器要求：服务器要求至少一台2核4G以上的云服务器 
-  k8s搭建方式 
   -  kubeadm搭建(推荐) 
      -  是一个K8s部署工具，提供kubeadm init和kubeadm join 
      -  用于快速搭建k8s集群，比较推荐 
   -  二进制包搭建 
      -  从github下载发行版的二进制包，手动部署每个组件，组成Kubernetes集群 
      -  可以了解底层，但是步骤繁琐，坑比较多 
   -  Minikube搭建 
      - 是一种轻量化的Kubernetes集群，是k8s社区为了帮助开发者和学习者能够更好学习和体验k8s功能而推出的，使用个人PC的虚拟化环境就快速构建启动单节点k8s
-  练习方案 
   -  方案一：Minikube搭建进行搭建，1台服务器 
   -  方案二：一主多从，共2台以上服务器 
   -  我选择的方案：阿里云Linux CentOS 7.8按量付费两台 

### 基于KubeAdm搭建多节点K8S集群

-  安装 
   -  安装Docker(主节点+工作节点) 
      -  先安装yml 
```shell
yum install -y yum-utils device-mapper-persistent- data lvm2
```
 

      -  设置阿里云镜像 
```shell
sudo yum-config-manager --add-repo <http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo>
```
 

      -  查看可安装的docker版本 
```shell
yum list docker-ce --showduplicates | sort -r
```
 

      -  安装docker 
```shell
yum -y install docker-ce-20.10.10-3.el7
```
 

      -  查看docker版本 
```shell
docker -v
```
 

      -  配置开机自启动 
```shell
systemctl enable docker.service
```
 

      -  启动docker 
```shell
systemctl start docker
```
 

      -  查看docker 启动状态 
```shell
systemctl status docker
```
 

   -  配置镜像源(主节点+工作节点) 
```shell
cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
<https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg>
EOF
```
 

   -  安装kubelet kubeadm kubectl(主节点+工作节点) 
```shell
yum install -y kubelet-1.18.0 kubeadm-1.18.0 kubectl-1.18.0
```
 

   -  主节点初始化(主节点) 
      - 只修改两个地方(master主机【内网IP】，k8s软件版本)
```shell
kubeadm init \\
--apiserver-advertise-address=172.31.101.9 \\
--image-repository [registry.aliyuncs.com/google_containers](<http://registry.aliyuncs.com/google_containers>) \\
--kubernetes-version v1.18.0 \\
--service-cidr=10.96.0.0/12 \\
--pod-network-cidr=10.244.0.0/16
```

      -  说明 
         -  `-apiserver-advertise-address`：主节点的内网ip地址 
         -  `-image-repository` 镜像仓库 
         -  `-kubernetes-version` k8s版本 
         -  `-service-cidr` + `--pod-network-cidr` 网段不重复即可 
   -  当初始化完成之后执行命令，并加入工作节点 
      -  按照提示执行命令 
      -  主节点执行命令 
         -  加入工作节点 
         -  查看节点 
```shell
kubectl get nodes
```
 

            - 状态都是NotReady，需要配置网络插件
         -  安装网络插件 
```shell
kubectl apply -f <https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml>
```
 

         -  查看节点状态 
```shell
kubectl get node
```
 

         -  查看系统pod状态 
```shell
kubectl get pods -n kube-system
```
 

### 5分钟基于K8S集群部署你的第一个K8S应用

-  查看k8s集群信息 
```shell
kubectl cluster-info
```
 

-  查看节点信息 
```shell
kubectl get node
```
<br />![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/212b3e1f-d797-4066-a08d-c1935431d925/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 8.png) 

-  查看内部组件 
```shell
kubectl get pod -A
```
<br />![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/af622fb2-c65e-450d-bfbe-5f8f0f081d01/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 9.png) 

-  部署第一个K8S应用-Nginx，并通过公网ip访问 
   -  创建deployment(Pod控制器的一种) 
```shell
kubectl create deployment xdclass-nginx --image=nginx:1.23.0
```
 

   -  查看deployment和pod 
```shell
kubectl get deployment,pod,svc
```
<br />![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/4277b070-9c8d-4dff-a600-7c0ae5942d53/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 10.png) 

   -  暴露80端口，创建service 
```shell
kubectl expose deployment xdclass-nginx --port=80 --type=NodePort
```
 

   -  查看端口映射 
```shell
kubectl get pod,svc
```
<br />![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/87b53b53-0207-47c2-bfd6-30639dafb961/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 11.png) 

   -  在浏览器访问, 工作节点开放端口31512，访问工作节点ip: 31512(网络安全组记得开放31512端口) 
      - master、node节点访问这个 开放的端口都可以
-  注意 
   -  Kubeadm部署，暴露端口对外服务，会随机选端口，默认范围是30000~32767，可以修改指定<br />![https://prod-files-secure.s3.us-west-2.amazonaws.com/48018283-2714-46c7-9db0-8578c93b2688/d6549964-4928-48f5-a5e8-9b6245de2179/Untitled.png](K8s笔记+75d943eb-4fe1-4783-bb50-6784268e2a09/Untitled 12.png) 

## Kubernetes核心资源管理操作实战

### Kubernetes常⻅资源管理命令介绍

-  概念 
   -  k8s是一个服务器集群系统，用户可以在集群中部署各种服务，也就是在k8s集群上运行一个个的容器 
   -  在k8s中，pod是最小的管理单元而非容器，一个pod中可以有多个容器 
   -  在k8s集群中，所有内容都可以被抽象为资源，通过操作资源来管理k8s集群 
-  使用kubectl来管理资源 
   -  kubectl用法 
```shell
kubectl [command] [TYPE] [NAME] [flags]
```
 

      -  commad：对资源具体的操作，如create创建、get获取、delete删除 
      -  TYPE：指定资源类型，大小写敏感 
      -  NAME：指定资源的名称，大小写敏感，如果省略名称则 显示所有资源 
      -  flags：指定可选的参数，如可用-s或者-server指定Kubernetes API server的地址和端口 
   -  例子 
      -  获取全部节点 
```shell
kubectl get node
```
 

      -  获取全部pod 
```shell
kubectl get pod
```
 

      -  查看某个pod内容 
```shell
kubectl get pod pod_name
```
 

      -  获取全部名称空间 
```shell
kubectl get ns
```
 

      -  查看创建的资源 
```shell
kubectl get pod,svc,deploy
```
 

      -  删除nginx pod，如果是靠deploy控制器创建的pod，直接删除则会自动创建新的 
```shell
kubectl delete pod pod名称
```
 

      -  提示：如果需要删除则直接删除depoly控制器即可，pod会被删除 
   -  资源管理方式 
      -  命令式对象管理：直接使用命令去操作资源 
```shell
kubectl run 资源名称 --image=镜像名称 --port=端口号
```
 

         -  例子 
```shell
kubectl run xdclass-nignx-pod --image=nginx:1.23.0 --port=80 kubectl create deployment xdclass-nginx --image=nginx:1.23.0
```
 

      -  命令式对象配置：通过命令配置和配置文件去操作资源 
```shell
kubectl create -f 配置文件名称.yaml
```
 

      -  声明式对象配置：通过apply和配置文件操作资源 
```shell
kubectl apply -f 配置文件名称.yaml
```
 

      -  yaml例子 
```shell
apiVersion: apps/v1
kind: Deployment
metadata:
   name: nginx-deployment
   labels:
      app: nginx-deployment
spec:
   replicas: 1
   selector:
      matchLabels:
         app: nginx-pod
   template:
      metadata:
           labels:
              app: nginx-pod
      spec:
         containers:
         - name: nginx
             image: nginx:1.23.0
             imagePullPolicy: IfNotPresent
             ports:
             - containerPort: 80
```
 
```shell
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - image: nginx:1.23.0
    name: pod
    ports:
    - name: nginx-port
      containerPort: 80
      protocol: TCP
```
 

      -  kubectl create 和 kubectl apply的区别 
         -  kubectl create 命令首次执行时会创建资源，当再次执行的时候会报错，因为资源名称在同一命名空间内是唯一的 
         -  kubectl apply在首次执行的时候也会创建对应的资源，当再次执行的时候会根据配置文件进行升级、扩容等操作，即使配置文件没有变化也不影响 
