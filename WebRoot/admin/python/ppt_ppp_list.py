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
  
#tn.set_debuglevel(2)

tn.read_until("login: ")
tn.write(user + "\n")
if password:
    tn.read_until("Password: ")
    tn.write(password + "\r\n")

msg = tn.read_until("# ", 8)
if msg[-2:].find("# ") == -1 :
  print "Password Error"
  exit(1)

print "login successfully"

tn.write("configmenu \n")

tn.read_until("help)> ")
tn.write("1\n")

tn.read_until("help)> ")
tn.write("11\n")

tn.read_until(" help)> ")
tn.write("1\n")

tn.read_until(" 1. ") 
msg = " 1. " + tn.read_until("\r\n[h]")

# strip the last 7 chars
msg=msg[:-7]
#msg = msg.rstrip("\n[")

print msg

#C:\work\PassportManagement\WebRoot\admin\python>python ppt_ip_list.py 192.168.161.5 23 root dbps
#login successfully
# 1. IP mode                     : static IP
# 2. IP address                  : 192.168.161.5
# 3. Subnet mask                 : 255.255.255.0
# 4. Default gateway             : 192.168.161.1
# 5. Enable/Disable secondary IP address  : Disable

# or
#login successfully
# 1. IP mode                     : static IP
# 2. IP address                  : 192.168.161.5
# 3. Subnet mask                 : 255.255.255.0
# 4. Default gateway             : 192.168.161.1
# 5. Enable/Disable secondary IP address  : Enable
# 6. Secondary IP address        : 192.168.0.5
# 7. Secondary subnet mask       : 255.255.255.0
# 8. Secondary gateway           : 192.168.0.1

tn.close()