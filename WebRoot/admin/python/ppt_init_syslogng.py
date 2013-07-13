import sys
import telnetlib
import mylib

#  ppt_init_syslogng.py  192.168.0.5 23 root "dbps" 192.168.0.126

if len( sys.argv ) < 6:
  print "usage: cmd ip port user pwd syslog_ip"
  print "sample: ppt_init_syslogng.py  192.168.0.5 23 root dbps 192.168.0.126"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

syslogip = sys.argv[5]

tn = mylib.connectDigi(HOST, PORT, user, password)

lines = [
'/system/syslogng/*1/dest=4',
'/system/syslogng/*1/filter=2048',
'/system/syslogng/*1/location=/var/log/messages',
'/system/syslogng/*2/dest=2',
'/system/syslogng/*2/filter=2048',
'/system/syslogng/*2/location=' + syslogip,
'/system/syslogng/*3/dest=2',
'/system/syslogng/*3/filter=4096',
'/system/syslogng/*3/location=' + syslogip,
'EOF'
]

tn.write('cat > /tmp/cnf/sys/syslog-ng.cnf << EOF\n')
for line in lines:
  tn.read_until("> ")
  tn.write(line + '\n');

tn.read_until("# ")
#save
tn.write("saveconf\n")
tn.read_until("# ", 10)
tn.write("applyconf\n")
tn.read_until("# ", 10)

#restart syslog-ng
tn.write("service syslog-ng restart\n")
tn.read_until("# ", 20)

# show result
print 'done'

tn.close()
