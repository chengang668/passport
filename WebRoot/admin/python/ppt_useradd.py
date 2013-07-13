import sys
import telnetlib
import mylib

#  ppt_useradd.py 192.168.0.5 23 root dbps dingjun dingjun

if len( sys.argv ) < 7:
  print "usage: cmd ip port user pwd"
  print "sample: ppt_useradd.py 192.168.0.5 23 root dbps change 2Bechanged "
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

newuser = sys.argv[5]
pwd = sys.argv[6] 

tn = mylib.connectDigi(HOST, PORT, user, password)

# add user 
# adduser -G vadmin -H -s "/bin/csm.master" username
tn.write('adduser -G users -h "/tmp" -s "/bin/csm.master" ' + newuser + ' \n')

msg = tn.read_until("new password: ", 4) 
if msg[-14:]=='new password: ':
	tn.write(pwd + "\n")
	tn.read_until("new password: ")
	tn.write(pwd + "\n")
	tn.read_until("# ")
	#save
	tn.write("saveconf\n")
	tn.read_until("# ", 10)
	tn.write("applyconf\n")
	tn.read_until("# ", 10)

# show result
print 'done'

tn.close()
