create database passport character set gbk;
use passport;
charset gbk;
grant all on passport.* to ppt@localhost identified by 'ppt';

create table user (userid varchar(20) primary key, passwd varchar(100), 
     fullname varchar(20) not null, createtime datetime, lastlogin datetime, 
     groupid int default 2,
     status int(2) default 0,
     loginretry int(4) default 0,
     pwdexpiredate datetime,
     lockexpiredate datetime,
     oldpasswds varchar(200),     
     foreign key(groupid) references groups(groupid) on update cascade on delete cascade );
     
create table groups (groupid int  primary key, groupname varchar(20) unique,	description varchar(100));

insert into groups values(1, 'admin', '系统管理员'),(2, 'operator', '操作员');
insert into user(userid, passwd, fullname, groupid, status, createtime) values ('root', 'cm9vdA==', 'root', 1, 1, sysdate());
commit;

create table usergroup (userid varchar(20) not null, groupid int not null, 
 unique  key(userid, groupid),
 foreign key(userid) references user(userid) on update cascade on delete cascade, 
 foreign key(groupid)references groups(groupid) on update cascade on delete cascade);

insert into usergroup values('root', 1);

create table district (districtid int primary key, districtname varchar(50) unique, address varchar(100));
create table site (siteid int primary key, sitename varchar(50) unique, districtid int, address varchar(100));
alter table site add constraint foreign key(districtid) references district(districtid) on update cascade on delete cascade;

insert into district(districtid, districtname) values(1, '上海');
insert into site(siteid, sitename, address, districtid) values(1, '上海浦东', '上海陆家嘴路168号', 1);
commit;

create table dept (deptid int primary key, deptname varchar(50) unique, address varchar(100), upperdeptid int);

create table passport (passportid int primary key, ip varchar(16) unique, 
  hostname varchar (50), givenname varchar (50), siteid int, deptid int, 
  owner varchar(20), rootpwd varchar(50), pppnumber varchar(20),
  setip varchar(16), netmask varchar(16), gateway varchar(16),
  pppip varchar(16), pppipnum int,
  syslogfilter_1 varchar(50), syslogdest_1 varchar(50), syslogip_1 varchar(50),
  syslogfilter_2 varchar(50), syslogdest_2 varchar(50), syslogip_2 varchar(50),
  syslogfilter_3 varchar(50), syslogdest_3 varchar(50), syslogip_3 varchar(50),  
  syslogfilter_4 varchar(50), syslogdest_4 varchar(50), syslogip_4 varchar(50),
  ipf_ip_1 varchar(50), ipf_protocol_1 varchar(20), ipf_port_1 varchar(10), ipf_rule_1 varchar(20),
  ipf_ip_2 varchar(50), ipf_protocol_2 varchar(20), ipf_port_2 varchar(10), ipf_rule_2 varchar(20),
  ipf_ip_3 varchar(50), ipf_protocol_3 varchar(20), ipf_port_3 varchar(10), ipf_rule_3 varchar(20),
  ipf_ip_4 varchar(50), ipf_protocol_4 varchar(20), ipf_port_4 varchar(10), ipf_rule_4 varchar(20)
 );
     
alter table passport add constraint foreign key(siteid) references site(siteid);
alter table passport add constraint foreign key(deptid) references dept(deptid);

create table devices ( passportid int not null, portid int not null, 
  grp varchar(20), title varchar (50), 
  mode varchar(20), 
  port varchar(10),
  protocol varchar(20),
  serial_setting varchar(50),
  passportip varchar(16),
  primary key(passportid, portid)
 );
alter table devices add constraint foreign key(passportid) references passport(passportid) on delete cascade;

create table user_passport_acl (
  userid varchar(20) not null,
  passportid int not null,
  username varchar(50),
  pwd varchar(100),
  primary key(userid, passportid),
  foreign key(userid) references user(userid) on update cascade on delete cascade,
  foreign key(passportid) references passport(passportid) on update cascade on delete cascade);

create table user_device_acl (
  userid varchar(20) not null, 
  passportid int not null,
  portid int not null,
  username varchar(50),
  pwd varchar(100),
  primary key(userid, passportid, portid),
  foreign key(userid) references user(userid) on update cascade on delete cascade,
  foreign key(passportid, portid) references devices(passportid, portid) on update cascade on delete cascade
);


create table digi_log (id int primary key, digi_ip varchar(12) not null, 
  userid varchar(20), dtime datetime, content varchar(200));
		
create table logs  (id int auto_increment primary key, host varchar(50), facility varchar(50), priority varchar(20), level varchar(20), 
  tag varchar(20), datetime char(20), program varchar(50), msg varchar(200)); 

create table log4port  (id int auto_increment primary key, host varchar(50), facility varchar(50), priority varchar(20), level varchar(20), 
  tag varchar(20), datetime char(20), program varchar(50), msg varchar(200)); 


update user_passport_acl set pwd = 'ZGJwcw==' where userid='root';
update user set passwd = 'cm9vdA==' where userid='root';
commit;

/* 2010.11.20 added */

create table ipfilter (id int auto_increment primary key, ip varchar(50) not null);
commit;

alter table user add loginretry int(4) default 0;
alter table user add pwdexpiredate datetime;
alter table user add lockexpiredate datetime;
alter table user add oldpasswds varchar(200);



