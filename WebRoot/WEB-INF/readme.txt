Ӧ��ͨ�����й���ϵͳ��װ������֪

���ΰ�װ��

ϵͳ�������������
1. mysql 5.1 �����ϰ汾
2. ��־��������� syslog-ng 1.6.12 
3. Զ�̵�¼��� putty
4. python 2.5 �����ϰ汾

��װ mysql:
   ��׼��װ���� 
	
��װ python
   ��׼��װ���� 

��װ putty/plink on Linux server

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
ж��ϵͳ�Դ���syslog,���߽���ֹͣ services syslog stop;checkconfig syslogd off
[root@cactiez tmp]# yum -y install syslog-ng
��װ�µ�syslog-ng



���ã�

1,  mysql ����
	1)   ����mysql ������
	2)   ���С�WEB-INF\classes\��Ŀ¼�µġ�mysql_ddl.sql �ļ��е� sql ��� 
	     sql������õ���ȱʡ������ppt, �����޸ĳ����Լ���Ҫ�����롣

  	3)   �����������Ƿ���ȷִ�С�ִ���������Ӧ�ÿ��Կ�����13����

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


2,  ���á�syslog-ng
	1)�����ѡ�WEB-INF\classes\ Ŀ¼�µġ�syslog-ng.conf �ļ����Ƶ� /usr/local/etc/syslog-ng/syslog-ng.conf ·���£�
��	���������Ŀ¼�����ڣ��ֶ�������ӦĿ¼��
	2)    �޸� /usr/local/etc/syslog-ng/syslog-ng.conf �ļ��� ���õ��� mysql ���ݿ��û���������
	
	3)    ������fifo �ܵ��ļ�
		mkfifo /var/log/mysql.pipe
		mkfifo /var/log/mysql_port_log.pipe
	4) ���� syslog-ng
		syslog-ng 

	[root@localhost ~]# ps -ef | grep mysql
	
	root 4907  4906  0 11:07 ?  00:00:00 /bin/sh -c /usr/bin/mysql -uppt -pppt passport < /var/log/mysql.pipe
	root 4908  4906  0 11:07 ?  00:00:00 /bin/sh -c /usr/bin/mysql -uppt -pppt passport < /var/log/mysql_port_log.pipe

	����ܿ����������У�˵����syslog-ng ����������
	�������������ǡ�syslog-ng ���ӽ��̣�
	syslog-ng������־������ܵ���
	mysql�ӹܵ�������־���������ݿ�



3,  ���á�tomcat ����
    1) applicationContext.xml


	���ļ�applicationContext.xml�����ҵ�����������

	<bean id="config" class="com.cg.passportmanagement.common.Config" scope="singleton" >
		<property name="sshUser" value="ooboperator"> </property>
		<property name="sshPassword" value="1QAZxsw23EDC"></property>
		<property name="directConnectToPassport" value="true"></property>
		<property name="serverIP" value="192.168.0.126"></property>
	</bean>

	sshUser 
		������ΪԶ�̵�¼(ssh)�����е���"��������" ���û���
		������Ϊ: ooboperator

	sshPassword��
		������ΪԶ�̵�¼(ssh)�����е���"��������" �ķ�������
		������Ϊ: 1QAZxsw23EDC

	directConnectToPassport��
		true:  ��Զ�̵�¼���뾭��"��������"��ֱ�ӵ�¼Ŀ��˿��豸
		false: �ȵ�¼��������(��sshUser/sshPassword), ����"��������"��¼Ŀ��˿��豸 
	serverIP
		"��������" ��IP

     
	��������Դ��

        <bean id="dataSource"
		class="org.apache.commons.dbcp.BasicDataSource">
		<property name="driverClassName" value="com.mysql.jdbc.Driver"> </property>
		<property name="url" value="jdbc:mysql://localhost/passport"></property>
		<property name="username" value="ppt"></property>
		<property name="password" value="ppt"></property>
	</bean>
	
	url
		Ӧ��ͨ��ϵͳ�õ������ݿ⣬������Ϊ��passport 
	username 
		mysql ���û���, ������Ϊ��ppt 
	password
		mysql ������, ������Ϊ��ppt 
		
	2) �����޶�IP����
	        �� /tomcat��װĿ¼/conf/server.xml
	       �� <Engine></Engine> �� </Engine>��ǩ֮ǰ��ӣ�
	   <Valve className="org.apache.catalina.valves.RemoteAddrValve" 
          allow="192.168.0.*, 127.0.0.1, 16.158.154.*" 
          deny=""/>
                ���� allow=""����д������ʵ�IP��ַ���ߵ�ַ�Σ��ö��Ÿ������������Ǻű�ʾ��ַ�Σ��磺
                    Ҫ���� 192.168.1.0-192.168.5.255 �� 192.168.10.0-192.168.15.255 
         allow=��192.168.[1-5].*,192.168.[10-15].*��
        
                    Ҫ�ܾ���ַ���ַ�η��ʣ��뽫��ַд�� deny=""��˫������
                    
    3) �Ự��ʱ���ã�
                 �� /tomcat��װĿ¼/conf/web.xml �ļ��в��� session-timeout ���������λΪ���ӣ�Ĭ��Ϊ 30���ӡ�
                 Ҳ���� ��ǰӦ�õ�Ŀ¼�µ�web.xml�ļ��м���ͬ����������
       /tomcat��װĿ¼/webapps/ROOT/WEB-INF/web.xml
 
       <session-config>
           <session-timeout>30</session-timeout>
       </session-config>


4. ���� Tomcat ��������:
      1. �༭ /etc/rc.local
      2. ����һ�У�  /tomcat��װĿ¼/bin/catalina.sh start

5. ɾ���ϰ汾�� python, 
      1.  rm /usr/bin/python
      2.  ln -s /usr/local/bin/python /usr/bin/python


    	 


������װ��

1,  ֹͣ��tomcat 
	catalina.sh stop

2�� ���� WEB-INF/ Ŀ¼�µ������ļ�����
	applicationContext.xml
	web.xml

3,  ɾ����webapps Ŀ¼�¡�PassportManagement.war �Լ���PassportManagement �ļ���

4,  �ѡ��°�ġ�PassportManagement.war �ļ����Ƶ� tomcat ��װĿ¼�µġ�webapps �ļ�����

5,  ���� tomcat
	catalina.sh start

6,  ��������ϣ�webapps Ŀ¼�¡�PassportManagement �ļ������´�����֮���ٴ�ֹͣtomcat 
	catalina.sh stop

7,  �ѡ�����2 ���ݺõ��ļ����Ƶ���ӦĿ¼��(����)

8,  ������tomcat
	catalina.sh start




/* 2010.11.20 ֮���������װ  */

1�� mysql ���ݿ�� ���޸�

create table ipfilter (id int auto_increment primary key, ip varchar(50) not null);
insert into ipfilter values(1, '127.0.0.1');
commit;

alter table user add loginretry int(4) default 0;
alter table user add pwdexpiredate datetime;
alter table user add lockexpiredate datetime;
alter table user add oldpasswds varchar(200);

2��ϵͳ�������õ��޸ģ�applicationContext.xml 
		<!-- ��������ۼ����Դ�����Ĭ��3�� -->
		<property name="maxPasswordRetry" value="3"></property>
		<!-- �ʺŽ���ʱ�� ��Ĭ��3Сʱ-->
		<property name="unlockInterval" value="3"></property>
		<!-- �������������Ĭ��365�� -->
		<property name="pwdExpireDays" value="365"></property>
		











keytool -genkey -alias tomcat -keyalg RSA -keysize 1024 -validity 365 -keystore tomcat.keystore 



