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
  tn = telnetlib.Telnet(HOST, PORT)
  print ("login successfully")
except:
  print   "Cannot connect host"
  exit(1)
  
#tn.set_debuglevel(2)

tn.read_until("login: ")
tn.write(user + "\n")
if password:
    tn.read_until("Password: ")
    tn.write(password + "\r\n")

tn.read_until("# ")
tn.write("configmenu \n")

tn.read_until("help)> ")
tn.write("2\n")

tn.read_until("help)> ")
tn.write("4\n")

# select the # of port to modify
tn.read_until("help)> ")
tn.write("1\n")

# Basic configuration
tn.read_until("help)> ")
tn.write("1\n")

# port name
tn.read_until("help)> ")
tn.write("7\n")
tn.read_until("NEW : ")
tn.write("chengang_new\n")

# Baudrate 
tn.read_until("help)> ")
tn.write("8\n")
tn.read_until("SELECT> ")
tn.write("10\n")

# data bit 
tn.read_until("help)> ")
tn.write("9\n")
tn.read_until("SELECT> ")
tn.write("1\n")

#save
tn.read_until(" help)> ") 
tn.write("a\n")
tn.read_until("? (y, n) : ") 
tn.write("y\n")
tn.read_until("? (y, n) : ") 
tn.write("y\n")

# show result
tn.read_until(" 1. ") 
msg = " 1. " + tn.read_until("\r\n[h]")

# strip the last 7 chars
msg=msg[:-7]
#msg = msg.rstrip("\n[")

print msg 

tn.close()


#tn.interact()