import getpass
import sys
import telnetlib
import mylib

if len( sys.argv ) < 2:
  print "usage: cmd ip port user pwd"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write("configmenu \n")

tn.read_until("help)> ")

tn.write("6\n")

tn.read_until("help)> ")
tn.write("3\n")

sstr = tn.read_until(" 1. ", 5)

if sstr[-4:].find(" 1. ") != 0:
  tn.close()
  exit(1)

msg = "  1. " + tn.read_until("\r\n[h]")

# strip the last 7 chars
msg=msg[:-7]
#msg = msg.rstrip("\n[")

print msg

tn.close()
