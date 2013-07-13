import mylib
import sys
import telnetlib

if len( sys.argv ) < 6:
  print "usage: cmd ip port user pwd portid"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]
portid = '0'
if len( sys.argv ) >= 6:
	portid = sys.argv[5]

cmd = "who "
if portid != '0':
	cmd = "who | grep ttyC" + str(int(portid)-1)

tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write(cmd+ " \n")
msg = tn.read_until("[root@", 5)

# strip the last 2 chars
msg=msg[:-6]
#msg = msg.rstrip("\n[")
print msg

tn.close()
 
