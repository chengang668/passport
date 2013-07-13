import sys
import telnetlib
import mylib

if len( sys.argv ) < 7:
  print "usage: cmd ip port user pwd portid protocol"
  print "sample: ppt_port_baudrate_mod.py 192.168.0.5 23 root dbps 4 'SSH'"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

portid = sys.argv[5]
new_protocol = sys.argv[6]

if new_protocol == 'SSH' :
  new_protocol = '2'
else:
  new_protocol = '1'

tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write("configmenu \n")

tn.read_until("help)> ")
tn.write("2\n")

tn.read_until("help)> ")
tn.write("4\n")

# select the # of port to modify
tn.read_until("help)> ")
tn.write( portid +"\n" )

# port name
tn.read_until("help)> ")
tn.write("1\n")

tn.read_until("help)> ")
tn.write("5\n")

tn.read_until("SELECT> ")
tn.write( new_protocol + "\n")

#save
tn.read_until(" help)> ", 3) 
tn.write("a\n")
tn.read_until("? (y, n) : ", 3) 
tn.write("y\n")
tn.read_until("? (y, n) : ", 5) 
tn.write("y\n")
tn.read_until(" help)> ", 5) 
# show result
print 'done'

tn.close()
