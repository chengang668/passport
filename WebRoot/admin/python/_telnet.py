import getpass
import sys
import telnetlib

if len( sys.argv ) < 2:
  print "usage: cmd ip port user pwd"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]
 
try:
  tn = telnetlib.Telnet(HOST, PORT, 5)
except:
  print "Cannot connect host"
  exit(1)

tn.read_until("login: ")
tn.write(user + "\n")
if password:
    tn.read_until("Password: ")
    tn.write(password + "\r\n")

print ("login successfully")

try:
  tn.interact();
  tn.close();
  exit(1)
except:
  print "connection closed"
  exit(1)

