import telnetlib

host['ip']='16.157.130.3'
host['user']='scuser'
host['password']='qing$123'
host['commands']=['cd /lib', 'ls']

def do(host):
    tn = telnetlib.Telnet(host['ip'])
    tn.set_debuglevel(2)

    tn.read_until("login: ")
    tn.write(host['user'] + "\n")
    tn.read_until("Password: ")
    tn.write(host['password'] + "\n")

    for command in host['commands']:
        tn.write(command+'\n')
    
    tn.write("exit\n")
    print tn.read_all()
    
    print 'Finish!'
