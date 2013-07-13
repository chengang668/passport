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

portid = sys.argv[5]
port_new_title = sys.argv[6]

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
tn.write("5\n")

tn.read_until("help)> ")
tn.write("1\n")
tn.read_until("NEW : ")
tn.write( port_new_title + "\n")

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


#tn.interact()