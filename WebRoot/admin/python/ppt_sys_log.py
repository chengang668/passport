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
logfile = sys.argv[5]


#user = 'root'
#password = 'dbps'

try:
  tn = telnetlib.Telnet(HOST, PORT)
  tn.read_until("login: ")
  tn.write(user + "\n")
  tn.read_until("Password: ")
  tn.write(password + "\r\n")

  print ("login successfully")
except:
  print   "Cannot connect host"
  exit(1)
  
#tn.set_debuglevel(2)

tn.read_until("# ")

print "grep -E \"login:\"\\|\"Connection closed\"\\|\"SSH authentication\"\\|\"disconnected\"  /var/log/" + logfile + "\n"

#tn.write("cat /var/log/" + logfile + "\n")

tn.write("grep -E \"login:\"\\|\"Connection closed\"\\|\"SSH authentication\"\\|\"disconnected\"  /var/log/" + logfile + "\n")

msg = tn.read_until("\n[")

# strip the last 2 chars
msg=msg[:-2]
#msg = msg.rstrip("\n[")

print msg

tn.close()


