import sys
import telnetlib
import mylib

#  ppt_user_acl.py 192.168.0.5 23 root dbps port#  user_list

if len( sys.argv ) < 7:
  print "usage: cmd ip port user pwd port# user_list"
  print "sample: ppt_user_acl.py 192.168.0.5 23 root dbps 1 \"cg root test admin\" "
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

portid = sys.argv[5]
userlist = sys.argv[6]

tn = mylib.connectDigi(HOST, PORT, user, password)

# perl -p -i -e 's/port_permitted_users=.*$/port_permitted_users=temp cg test/g'  /tmp/cnf/ports/port1/.usracctl.cnf
cmd = "perl -p -i -e 's/port_permitted_users=.*$/port_permitted_users=" + userlist + "/g' /tmp/cnf/ports/port" +  portid + "/.usracctl.cnf"

tn.write(cmd + ' \n')
tn.read_until("# ")

#save
tn.write("saveconf\n")
tn.read_until("# ", 10)
# tn.write("applyconf\n")
# tn.read_until("# ", 10)

# show result
print 'done'

tn.close()
