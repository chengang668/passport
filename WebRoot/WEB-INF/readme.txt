应急通道集中管理系统安装配置需知

初次安装：

系统所需其他软件：
1. mysql 5.1 或以上版本
2. 日志服务器软件 syslog-ng 1.6.12 
3. 远程登录软件 putty
4. python 2.5 或以上版本

安装 mysql:
   标准安装方法 
	
安装 python
   标准安装方法 

安装 putty/plink on Linux server

putty-0.60.tar.gz   
tar -xzvf putty-0.60.tar.gz
cd putty-0.60/unix
./configure
make
make install


install syslog-ng 
http://www.balabit.com/network-security/syslog-ng/

syslog-ng-1.6.12
./configure
make
make install

#syslog-ng restart


[root@cactiez tmp]# rpm -e --nodeps syslog
卸载系统自带的syslog,或者将其停止 services syslog stop;checkconfig syslogd off
[root@cactiez tmp]# yum -y install syslog-ng
安装新的syslog-ng



配置：

1,  mysql 配置
	1)   进入mysql 命令行
	2)   运行　WEB-INF\classes\　目录下的　mysql_ddl.sql 文件中的 sql 语句 
	     sql语句中用到的缺省密码是ppt, 可以修改成你自己想要的密码。

  	3)   检查所有语句是否正确执行。执行以下命令，应该可以看到　13个表

	[root@localhost ~]# mysql -u ppt -pppt passport
	mysql> show tables;
	+--------------------+
	| Tables_in_passport |
	+--------------------+
	| dept               |
	| devices            |
	| digi_log           |
	| district           |
	| groups             |
	| log4port           |
	| logs               |
	| passport           |
	| site               |
	| user               |
	| user_device_acl    |
	| user_passport_acl  |
	| usergroup          |
	+--------------------+
	13 rows in set (0.01 sec)


2,  配置　syslog-ng
	1)　　把　WEB-INF\classes\ 目录下的　syslog-ng.conf 文件复制到 /usr/local/etc/syslog-ng/syslog-ng.conf 路径下，
　	　　　如果目录不存在，手动创建相应目录。
	2)    修改 /usr/local/etc/syslog-ng/syslog-ng.conf 文件中 所用到的 mysql 数据库用户名和密码
	
	3)    创建　fifo 管道文件
		mkfifo /var/log/mysql.pipe
		mkfifo /var/log/mysql_port_log.pipe
	4) 启动 syslog-ng
		syslog-ng 

	[root@localhost ~]# ps -ef | grep mysql
	
	root 4907  4906  0 11:07 ?  00:00:00 /bin/sh -c /usr/bin/mysql -uppt -pppt passport < /var/log/mysql.pipe
	root 4908  4906  0 11:07 ?  00:00:00 /bin/sh -c /usr/bin/mysql -uppt -pppt passport < /var/log/mysql_port_log.pipe

	如果能看到以上两行，说明　syslog-ng 正常启动，
	以上两个进程是　syslog-ng 的子进程，
	syslog-ng　将日志输出至管道，
	mysql从管道读入日志并插入数据库



3,  配置　tomcat 服务
    1) applicationContext.xml


	打开文件applicationContext.xml　并找到以下配置项

	<bean id="config" class="com.cg.passportmanagement.common.Config" scope="singleton" >
		<property name="sshUser" value="ooboperator"> </property>
		<property name="sshPassword" value="1QAZxsw23EDC"></property>
		<property name="directConnectToPassport" value="true"></property>
		<property name="serverIP" value="192.168.0.126"></property>
	</bean>

	sshUser 
		配置项为远程登录(ssh)过程中担当"堡垒主机" 的用户名
		例子中为: ooboperator

	sshPassword　
		配置项为远程登录(ssh)过程中担当"堡垒主机" 的访问密码
		例子中为: 1QAZxsw23EDC

	directConnectToPassport　
		true:  则远程登录无须经过"堡垒主机"，直接登录目标端口设备
		false: 先登录堡垒主机(用sshUser/sshPassword), 经由"堡垒主机"登录目标端口设备 
	serverIP
		"堡垒主机" 的IP

     
	配置数据源：

        <bean id="dataSource"
		class="org.apache.commons.dbcp.BasicDataSource">
		<property name="driverClassName" value="com.mysql.jdbc.Driver"> </property>
		<property name="url" value="jdbc:mysql://localhost/passport"></property>
		<property name="username" value="ppt"></property>
		<property name="password" value="ppt"></property>
	</bean>
	
	url
		应急通道系统用到的数据库，例子中为　passport 
	username 
		mysql 的用户名, 例子中为　ppt 
	password
		mysql 的密码, 例子中为　ppt 
		
	2) 配置限定IP访问
	        打开 /tomcat安装目录/conf/server.xml
	       在 <Engine></Engine> 中 </Engine>标签之前添加：
	   <Valve className="org.apache.catalina.valves.RemoteAddrValve" 
          allow="192.168.0.*, 127.0.0.1, 16.158.154.*" 
          deny=""/>
                其中 allow=""中填写允许访问的IP地址或者地址段，用逗号隔开。可以用星号表示地址段，如：
                    要允许 192.168.1.0-192.168.5.255 和 192.168.10.0-192.168.15.255 
         allow=”192.168.[1-5].*,192.168.[10-15].*”
        
                    要拒绝地址或地址段访问，请将地址写在 deny=""的双引号中
                    
    3) 会话超时配置：
                 在 /tomcat安装目录/conf/web.xml 文件中查找 session-timeout 的配置项，单位为分钟，默认为 30分钟。
                 也可在 当前应用的目录下的web.xml文件中加入同样的配置项
       /tomcat安装目录/webapps/ROOT/WEB-INF/web.xml
 
       <session-config>
           <session-timeout>30</session-timeout>
       </session-config>


4. 配置 Tomcat 开机启动:
      1. 编辑 /etc/rc.local
      2. 加入一行：  /tomcat安装目录/bin/catalina.sh start

5. 删除老版本的 python, 
      1.  rm /usr/bin/python
      2.  ln -s /usr/local/bin/python /usr/bin/python


    	 


升级安装：

1,  停止　tomcat 
	catalina.sh stop

2， 备份 WEB-INF/ 目录下的配置文件：　
	applicationContext.xml
	web.xml

3,  删除　webapps 目录下　PassportManagement.war 以及　PassportManagement 文件夹

4,  把　新版的　PassportManagement.war 文件复制到 tomcat 安装目录下的　webapps 文件夹中

5,  启动 tomcat
	catalina.sh start

6,  待启动完毕，webapps 目录下　PassportManagement 文件夹重新创建好之后，再次停止tomcat 
	catalina.sh stop

7,  把　步骤2 备份好的文件复制到相应目录下(覆盖)

8,  重启　tomcat
	catalina.sh start




/* 2010.11.20 之后的升级安装  */

1， mysql 数据库表 的修改

create table ipfilter (id int auto_increment primary key, ip varchar(50) not null);
insert into ipfilter values(1, '127.0.0.1');
commit;

alter table user add loginretry int(4) default 0;
alter table user add pwdexpiredate datetime;
alter table user add lockexpiredate datetime;
alter table user add oldpasswds varchar(200);

2，系统参数配置的修改：applicationContext.xml 
		<!-- 密码错误累计重试次数，默认3次 -->
		<property name="maxPasswordRetry" value="3"></property>
		<!-- 帐号解锁时间 ，默认3小时-->
		<property name="unlockInterval" value="3"></property>
		<!-- 密码过期天数，默认365天 -->
		<property name="pwdExpireDays" value="365"></property>
		











keytool -genkey -alias tomcat -keyalg RSA -keysize 1024 -validity 365 -keystore tomcat.keystore 



