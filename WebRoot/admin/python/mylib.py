import sys
import telnetlib

def connectDigi(HOST, PORT, user, password):
  try:
    tn = telnetlib.Telnet(HOST, PORT, 5)
  except:
    print "Cannot connect host"
    sys.exit(1)
 
  tn.read_until("login: ")
  tn.write(user + "\n")
  if password:
  	tn.read_until("Password: ")
  	tn.write(password + "\r\n")
 
  msg = tn.read_until("# ", 8)
  if msg[-2:].find("# ") == -1 :
    print "Password Error"
    sys.exit(1)

  print "login successfully"
 
  return tn;