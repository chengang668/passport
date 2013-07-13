import mylib
import sys
import telnetlib

if len( sys.argv ) < 2:
  print "usage: cmd ip port user pwd"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]
 
tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write("who \n")

tn.read_until("HOST", 5)
tn.read_until("\n", 5)

msg = tn.read_until("\n[", 5)

# strip the last 2 chars
msg=msg[:-2]
#msg = msg.rstrip("\n[")
print msg

tn.close()
 
