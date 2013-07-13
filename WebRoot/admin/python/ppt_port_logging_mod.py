import sys
import telnetlib
import mylib

if len( sys.argv ) < 6:
  print "reset all ports to log on syslog local1"
  print "usage: cmd ip port user pwd x" 
  print "x is: \n 1: local1\n 2: local2\n 3: local3\n 4: local\n 5: local5\n 6: local6\n 7: local7\n" 
  print "sample: ppt_port_logging_mod.py 192.168.0.5 23 root dbps 1"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

logfacility = sys.argv[5]
if int(logfacility) > 7 or int(logfacility) <= 0 :
  print 'error'
  sys.exit(1)
  
tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write("configmenu \n")

tn.read_until("help)> ")
tn.write("2\n")

tn.read_until("help)> ")
tn.write("4\n")

# apply for all ports
portid = '0'
# select the # of port to modify
msg = tn.read_until("help)> ")
tn.write( portid + '\n' )

msg = tn.read_until("help)> ")
tn.write( "9\n" )

for sel in [[1, 2], [2, 3], [4, 2], [5, logfacility]]:
	tn.read_until("help)> ")
	tn.write(str(sel[0]) + "\n")
	tn.read_until("SELECT> ")
	tn.write(str(sel[1]) + "\n")

tn.read_until("help)> ")
tn.write('..\n')
tn.read_until("help)> ")
tn.write('..\n')

#save
tn.read_until(" help)> ", 5) 
tn.write("a\n")
tn.read_until("? (y, n) : ", 2) 
tn.write("y\n")
tn.read_until("? (y, n) : ", 10) 
tn.write("y\n")
tn.read_until(" help)> ", 10) 
# show result
print 'done'

tn.close()
