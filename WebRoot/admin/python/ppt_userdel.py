import sys
import telnetlib
import mylib

#  ppt_userdel.py 192.168.0.5 23 root dbps dingjun dingjun

if len( sys.argv ) < 6:
  print "usage: cmd ip port user pwd"
  print "sample: ppt_userdel.py 192.168.0.5 23 root dbps change"
  sys.exit(1)

HOST = sys.argv[1]
PORT = sys.argv[2]
user = sys.argv[3]
password = sys.argv[4]

olduser = sys.argv[5]

tn = mylib.connectDigi(HOST, PORT, user, password)

# del user 
# deluser username
tn.write('deluser ' + olduser + ' \n')
tn.write("\n")
tn.read_until("# ")

#save
tn.write("saveconf\n")
tn.read_until("# ", 10)
tn.write("applyconf\n")
tn.read_until("# ", 10)

# show result
print 'done'

tn.close()
