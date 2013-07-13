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

tn.write("1\n")

tn.read_until("help)> ")

tn.write("5\n")

tn.read_until("help)> ")

tn.write("+\n")

tn.read_until("SELECT> ")

tn.write("1\n")

tn.read_until("SELECT> ")

tn.write("1\n")

tn.read_until("NEW : ")

tn.write("192.168.0.165/255.255.255.0\n")

tn.read_until("SELECT> ")

tn.write("1\n")

tn.read_until("NEW : ")
tn.write("23\n")

tn.read_until("SELECT> ")
tn.write("1\n")

tn.read_until("(y, n) : ")
tn.write("y\n")

tn.read_until("help)> ")
tn.write("a\n")

#tn.interact()

tn.read_until("(y, n) : ")
tn.write("y\n")

tn.read_until("(y, n) : ")
tn.write("y\n")


tn.close()

