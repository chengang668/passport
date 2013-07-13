import getpass
import sys
import telnetlib

HOST = '16.157.130.3'
user = raw_input("Enter your remote account: ")
password = getpass.getpass()

# global command
try:
  tn = telnetlib.Telnet(HOST)
  print ("login successfully")
except:
  print   "Cannot connect host"
  exit 
  
#tn.set_debuglevel(2)
       
print ("user is:" + user)
print ("password is:" + password)

tn.read_until("login: ")
tn.write(user + "\n")
if password:
    tn.read_until("Password: ")
    tn.write(password + "\r\n")

msg = tn.read_until("$")

tn.write("ls /lib \n")
# tn.write("exit \n")

#print tn.read_all()

tn.interact()