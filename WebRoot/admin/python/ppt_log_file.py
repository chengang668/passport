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



#HOST = '192.168.161.5'
#user = raw_input("Enter your remote account: ")
#password = getpass.getpass()

#user = 'root'
#password = 'dbps'

# global command
try:
  tn = telnetlib.Telnet(HOST, PORT)
  print ("login successfully")
except:
  print   "Cannot connect host"
  exit(1)
  
#tn.set_debuglevel(2)
       
#print ("user is:" + user)
#print ("password is:" + password)

tn.read_until("login: ")
tn.write(user + "\n")
if password:
    tn.read_until("Password: ")
    tn.write(password + "\r\n")

tn.read_until("# ")

tn.write("configmenu \n")

tn.read_until("help)> ")

# 6. System status & log
tn.write("6\n")

tn.read_until("help)> ")

# 2. System logging
tn.write("2\n")

# 5. System log filename         : messages
tn.read_until("5. System log filename")
tn.read_until(":")

msg = tn.read_until("\n")

print msg

tn.close()
