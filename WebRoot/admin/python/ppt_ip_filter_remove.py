import sys
import telnetlib

if len( sys.argv ) < 2:
  print "usage: cmd ip port user pwd remove_num"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]
remove_num = sys.argv[5]

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

tn.write("-\n")

tn.read_until("number : ")

tn.write("2\n") 

tn.read_until("(y/n) : ")
tn.write("y\n")

tn.read_until("help)> ")
tn.write("a\n")

tn.read_until("(y, n) : ")
tn.write("y\n")

tn.read_until("(y, n) : ")
tn.write("y\n")

tn.read_until("help)> ")
tn.write("x\n")

tn.read_until("(y, n) : ")
tn.write("y\n")

tn.close()

