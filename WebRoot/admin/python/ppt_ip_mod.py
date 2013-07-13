import sys
import telnetlib
import mylib

#  ppt_ip_mod.py 192.168.0.6 23 root dbps 192.168.0.5 255.255.255.0 192.168.0.1"

if len( sys.argv ) < 8:
  print "set static ip of eth0"
  print "usage: cmd ip port user pwd ip nmask gateway" 
  print "sample: ppt_ip_mod.py 192.168.0.6 23 root dbps 192.168.0.5 255.255.255.0 192.168.0.1"
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

for sel2 in [['2', newip],['3', netmask],['4', gateway]]:
	msg = tn.read_until(" help)> ", 3) 
	if msg[-7:] != "help)> ":
		print 'error'
		exit(1)
	tn.write(sel2[0]+"\n")
	msg = tn.read_until("NEW : ", 3) 
	if msg[-6:] != "NEW : ":
		print 'error'
		exit(1)
	tn.write( sel2[1] + "\n")

#save & apply
tn.read_until(" help)> ") 
tn.write("a\n")
tn.read_until("? (y, n) : ") 
tn.write("y\n")
tn.read_until("? (y, n) : ", 10) 
tn.write("y\n")
tn.read_until(" help)> ", 20) 

tn.write("\n")

print 'done'

tn.close()