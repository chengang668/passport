import sys
import telnetlib
import mylib

if len( sys.argv ) < 8:
  print "set static ip of eth0"
  print "usage: cmd ip port user pwd ip nmask gateway" 
  print "sample: ppt_init.py 192.168.0.5 23 root dbps"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

newip = sys.argv[5]
netmask = sys.argv[6]
gateway = sys.argv[7]
  
tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write("configmenu \n")

for sel in [1, 1, 1, 1]:
	tn.read_until("help)> ")
	tn.write("1\n")

tn.read_until("help)> ")
tn.write("1\n")
tn.read_until("SELECT> ")
tn.write("1\n")

tn.read_until(" help)> ") 
tn.write("2\n")
tn.read_until("NEW : ") 
tn.write( newip + "\n")

tn.read_until(" help)> ") 
tn.write("3\n")
tn.read_until("NEW : ") 
tn.write(netmask + "\n")

tn.read_until(" help)> ") 
tn.write("4\n")
tn.read_until("NEW : ") 
tn.write(gateway + "\n")

#enable or disable secondary IP address
#tn.read_until(" help)> ") 
#tn.write("5\n")
#tn.read_until("SELECT> ") 
#tn.write("1\n")

#save & apply
tn.read_until(" help)> ") 
tn.write("a\n")
tn.read_until("? (y, n) : ") 
tn.write("y\n")
tn.read_until("? (y, n) : ") 
tn.write("y\n")

tn.read_until(" help)> ") 
tn.write("\n")




tn.read_until(" 1. ") 
msg = " 1. " + tn.read_until("\r\n[h]")

# strip the last 7 chars
msg=msg[:-7]
#msg = msg.rstrip("\n[")
print msg

tn.close()