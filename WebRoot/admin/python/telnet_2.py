import telnetlib
import sys

host='16.157.130.3'
port = 23
command='showall'
timeout = 2

#cg['ip']='16.157.130.3'
#inputs['port']=23
#inputs['user']='chengang'
#inputs['password']='chengang'
#inputs['commands']=['cd /lib', 'ls']


def telnet():
    global command
    try:
        tn = telnetlib.Telnet(host, port)
        print   "login successfully"
    except:
        print   "Cannot connect host"
        return   
   
    #tn.set_debuglevel(2)

    tn.read_until("login: ")
    tn.write("scuser" + "\r\n")
    tn.read_until("Password: ")
    tn.write("qing$123" + "\r\n")
    
    msg = tn.read_until("$")
    tn.write("ls -l /" + "\r\n")
    msg = tn.read_until("$")
    print msg
    
    tn.write("ls -1 /" + "\n")
    msg = tn.read_until("$")
    
    print msg
    
    tn.close()
    
#    tn.write(command+'\r\n')
#    msg = tn.read_until("$",timeout)
#    tn.write("exit\r\n")
#    tn.close()
#    print msg
#    cont = raw_input("\ncommand>")
#    if cont != '':
#        command = cont
#    show()


def help():
    print """python telnet.py [host=<host>] [port=<port>] [timeout=<timeout>] [command=<command>]"""
   
if __name__ == "__main__":
    if len(sys.argv) >= 2:  # additional parameters
        for arg in sys.argv[1:]:
            pv=arg.split("=")
            if len(pv)!=2:
                help()
                sys.exit()
            if pv[0] == "min":
                min=int(pv[1])
            elif pv[0] == "host":
                host=pv[1]
            elif pv[0] == "port":
                port = int(pv[1])
            elif pv[0] == "command":
                command = pv[1]
            elif pv[0] == "timeout":
                timeout = int(pv[1])
            else:
                help()
                sys.exit()
#    show()

help()

telnet()