import sys
import telnetlib
import mylib

# ppt_port_baudrate_mod.py 192.168.0.5 23 root "dbps" 4 11 2 2 2 2 2

if len( sys.argv ) < 11:
  print "usage: cmd ip port user pwd"
  print "sample: ppt_port_baudrate_mod.py 192.168.0.5 23 root dbps 4 11 2 2 2 2 "
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

portid = sys.argv[5]
port_baudrate = sys.argv[6]
port_data_bit = sys.argv[7]
port_parity_bit = sys.argv[8]
port_stop_bit = sys.argv[9]
port_flow_control = sys.argv[10]

tn = mylib.connectDigi(HOST, PORT, user, password)

tn.write("configmenu \n")

tn.read_until("help)> ")
tn.write("2\n")

tn.read_until("help)> ")
tn.write("4\n")

# select the # of port to modify
tn.read_until("help)> ")
tn.write( portid +"\n" )

# baud rate 
tn.read_until("help)> ")
tn.write("8\n")

tn.read_until("help)> ")
tn.write("2\n")
tn.read_until("SELECT> ")
tn.write(port_baudrate+"\n")

# data bit
tn.read_until("help)> ")
tn.write("3\n")
tn.read_until("SELECT> ")
tn.write(port_data_bit+"\n")

# Parity bit
tn.read_until("help)> ")
tn.write("4\n")
tn.read_until("SELECT> ")
tn.write(port_parity_bit+"\n")

# stop bit
tn.read_until("help)> ")
tn.write("5\n")
tn.read_until("SELECT> ")
tn.write(port_stop_bit+"\n")

# flow control
tn.read_until("help)> ")
tn.write("6\n")
tn.read_until("SELECT> ")
tn.write(port_flow_control+"\n")

#save
tn.read_until(" help)> ") 
tn.write("a\n")
tn.read_until("? (y, n) : ", 4) 
tn.write("y\n")
tn.read_until("? (y, n) : ", 8) 
tn.write("y\n")

tn.read_until(" help)> ", 8) 

# show result
print 'done'

tn.close()


#tn.interact()