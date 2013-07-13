package com.cg.passportmanagement.database;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne; 
import javax.persistence.Table;
import org.hibernate.annotations.GenericGenerator;


/**
 * passport entity. @author MyEclipse Persistence Tools
 */
@Entity
@Table(name="passport" ,catalog="passport")

public class Passport  implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	// Fields    

     private Integer passportid;
     private String ip;
     private String hostname;
     private String givenname;
     private Dept dept;
     private Site site;
     private String owner;
     private String rootpwd;
	 private String pppnumber;

     private String setip;
     private String netmask;
	 private String gateway;
     private String pppip;
     private Integer pppipnum;     

	 private String syslogfilter_1;
     private String syslogdest_1;
     private String syslogip_1;

	 private String syslogfilter_2;
     private String syslogdest_2;
     private String syslogip_2;

	 private String syslogfilter_3;
     private String syslogdest_3;
     private String syslogip_3;

	 private String syslogfilter_4;
     private String syslogdest_4;
     private String syslogip_4;
     
     private String ipf_ip_1;
     private String ipf_protocol_1;
     private String ipf_port_1;
     private String ipf_rule_1;
     
     private String ipf_ip_2;
     private String ipf_protocol_2;
     private String ipf_port_2;
     private String ipf_rule_2;
     
     private String ipf_ip_3;
     private String ipf_protocol_3;
     private String ipf_port_3;
     private String ipf_rule_3;
     
     private String ipf_ip_4;
     private String ipf_protocol_4;
     private String ipf_port_4;
     private String ipf_rule_4;

     // private Set<UserPassportAcl> userPassportAcls = new HashSet<UserPassportAcl>(0);

    // Constructors

    /** default constructor */
    public Passport() {
    }

    
    /** full constructor */
    public Passport(Dept dept, Site site, String ip, String hostname, String givenname, String owner) {
        this.ip = ip;
        this.hostname = hostname;
        this.givenname = givenname;
        this.dept = dept;
        this.site = site;
        this.owner = owner; 
    }

   
    // Property accessors
    @GenericGenerator(name="generator", strategy="increment")@Id @GeneratedValue(generator="generator")
    @Column(name="passportid", unique=true, nullable=false)

    public Integer getPassportid() {
        return this.passportid;
    }
    
    public void setPassportid(Integer passportid) {
        this.passportid = passportid;
    }
    
    @Column(name="ip", length=16)

    public String getIp() {
        return this.ip;
    }
    
    public void setIp(String ip) {
        this.ip = ip;
    }
    
    @Column(name="hostname", length=50)

    public String getHostname() {
        return this.hostname;
    }
    
    public void setHostname(String hostname) {
        this.hostname = hostname;
    }
    
    @Column(name="givenname", length=50)

    public String getGivenname() {
        return this.givenname;
    }
    
    public void setGivenname(String givenname) {
        this.givenname = givenname;
    }
    
    @Column(name="owner", length=20)

    public String getOwner() {
        return this.owner;
    }
    
    public void setOwner(String owner) {
        this.owner = owner;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "deptid", nullable = true)
    public Dept getDept() {
        return this.dept;
    }
    
    public void setDept(Dept dept) {
        this.dept = dept;
    }
    
	@ManyToOne(fetch=FetchType.EAGER)
    @JoinColumn(name="siteid", nullable = true)
    public Site getSite() {
        return this.site;
    }
    
    public void setSite(Site site) {
        this.site = site;
    }
    /*
    @OneToMany(cascade=CascadeType.ALL, fetch=FetchType.LAZY, mappedBy="passport")
    public Set<UserPassportAcl> getUserPassportAcls() {
        return this.userPassportAcls;
    }
    
    public void setUserPassportAcls(Set<UserPassportAcl> userPassportAcls) {
        this.userPassportAcls = userPassportAcls;
    }
    */

    @Column(name="rootpwd", length=50)
    public String getRootpwd() {
		return rootpwd;
	}

	public void setRootpwd(String rootpwd) {
		this.rootpwd = rootpwd;
	}

	@Column(name="pppnumber", length=20)
	public String getPppnumber() {
		return pppnumber;
	}

	public void setPppnumber(String pppnumber) {
		this.pppnumber = pppnumber;
	}

	@Column(name="setip", length=16)
	public String getSetip() {
		return setip;
	}

	public void setSetip(String setip) {
		this.setip = setip;
	}

	@Column(name="netmask", length=16)
	public String getNetmask() {
		return netmask;
	}

	public void setNetmask(String netmask) {
		this.netmask = netmask;
	}

	@Column(name="gateway", length=16)
	public String getGateway() {
		return gateway;
	}

	public void setGateway(String gateway) {
		this.gateway = gateway;
	}

	@Column(name="pppip", length=16)
	public String getPppip() {
		return pppip;
	}

	public void setPppip(String pppip) {
		this.pppip = pppip;
	}

	@Column(name="pppipnum" )
	public Integer getPppipnum() {
		return pppipnum;
	}

	public void setPppipnum(Integer pppipnum) {
		this.pppipnum = pppipnum;
	}

	@Column(name="syslogfilter_1" )
	public String getSyslogfilter_1() {
		return syslogfilter_1;
	}

	public void setSyslogfilter_1(String syslogfilter_1) {
		this.syslogfilter_1 = syslogfilter_1;
	}

	@Column(name="syslogdest_1" )
	public String getSyslogdest_1() {
		return syslogdest_1;
	}

	public void setSyslogdest_1(String syslogdest_1) {
		this.syslogdest_1 = syslogdest_1;
	}

	@Column(name="syslogip_1" )
	public String getSyslogip_1() {
		return syslogip_1;
	}

	public void setSyslogip_1(String syslogip_1) {
		this.syslogip_1 = syslogip_1;
	}

	@Column(name="syslogfilter_2" )
	public String getSyslogfilter_2() {
		return syslogfilter_2;
	}

	public void setSyslogfilter_2(String syslogfilter_2) {
		this.syslogfilter_2 = syslogfilter_2;
	}

	@Column(name="syslogdest_2" )
	public String getSyslogdest_2() {
		return syslogdest_2;
	}

	public void setSyslogdest_2(String syslogdest_2) {
		this.syslogdest_2 = syslogdest_2;
	}

	@Column(name="syslogip_2" )
	public String getSyslogip_2() {
		return syslogip_2;
	}

	public void setSyslogip_2(String syslogip_2) {
		this.syslogip_2 = syslogip_2;
	}

	@Column(name="syslogfilter_3" )
	public String getSyslogfilter_3() {
		return syslogfilter_3;
	}

	public void setSyslogfilter_3(String syslogfilter_3) {
		this.syslogfilter_3 = syslogfilter_3;
	}

	public String getSyslogdest_3() {
		return syslogdest_3;
	}

	@Column(name="syslogdest_3" )
	public void setSyslogdest_3(String syslogdest_3) {
		this.syslogdest_3 = syslogdest_3;
	}

	@Column(name="syslogip_3" )
	public String getSyslogip_3() {
		return syslogip_3;
	}

	public void setSyslogip_3(String syslogip_3) {
		this.syslogip_3 = syslogip_3;
	}

	@Column(name="syslogfilter_4" )
	public String getSyslogfilter_4() {
		return syslogfilter_4;
	}

	public void setSyslogfilter_4(String syslogfilter_4) {
		this.syslogfilter_4 = syslogfilter_4;
	}

	@Column(name="syslogdest_4" )
	public String getSyslogdest_4() {
		return syslogdest_4;
	}

	public void setSyslogdest_4(String syslogdest_4) {
		this.syslogdest_4 = syslogdest_4;
	}

	@Column(name="syslogip_4" )
	public String getSyslogip_4() {
		return syslogip_4;
	}


	public void setSyslogip_4(String syslogip_4) {
		this.syslogip_4 = syslogip_4;
	}

	@Column(name="ipf_ip_1" )
	public String getIpf_ip_1() {
		return ipf_ip_1;
	}


	public void setIpf_ip_1(String ipf_ip_1) {
		this.ipf_ip_1 = ipf_ip_1;
	}

	@Column(name="ipf_protocol_1" )
	public String getIpf_protocol_1() {
		return ipf_protocol_1;
	}


	public void setIpf_protocol_1(String ipf_protocol_1) {
		this.ipf_protocol_1 = ipf_protocol_1;
	}

	@Column(name="ipf_port_1" )
	public String getIpf_port_1() {
		return ipf_port_1;
	}


	public void setIpf_port_1(String ipf_port_1) {
		this.ipf_port_1 = ipf_port_1;
	}

	@Column(name="ipf_rule_1" )
	public String getIpf_rule_1() {
		return ipf_rule_1;
	}


	public void setIpf_rule_1(String ipf_rule_1) {
		this.ipf_rule_1 = ipf_rule_1;
	}

	@Column(name="ipf_ip_2" )
	public String getIpf_ip_2() {
		return ipf_ip_2;
	}


	public void setIpf_ip_2(String ipf_ip_2) {
		this.ipf_ip_2 = ipf_ip_2;
	}

	@Column(name="ipf_protocol_2" )
	public String getIpf_protocol_2() {
		return ipf_protocol_2;
	}


	public void setIpf_protocol_2(String ipf_protocol_2) {
		this.ipf_protocol_2 = ipf_protocol_2;
	}

	@Column(name="ipf_port_2" )
	public String getIpf_port_2() {
		return ipf_port_2;
	}


	public void setIpf_port_2(String ipf_port_2) {
		this.ipf_port_2 = ipf_port_2;
	}

	@Column(name="ipf_rule_2" )
	public String getIpf_rule_2() {
		return ipf_rule_2;
	}


	public void setIpf_rule_2(String ipf_rule_2) {
		this.ipf_rule_2 = ipf_rule_2;
	}

	@Column(name="ipf_ip_3" )
	public String getIpf_ip_3() {
		return ipf_ip_3;
	}


	public void setIpf_ip_3(String ipf_ip_3) {
		this.ipf_ip_3 = ipf_ip_3;
	}

	@Column(name="ipf_protocol_3" )
	public String getIpf_protocol_3() {
		return ipf_protocol_3;
	}


	public void setIpf_protocol_3(String ipf_protocol_3) {
		this.ipf_protocol_3 = ipf_protocol_3;
	}

	@Column(name="ipf_port_3" )
	public String getIpf_port_3() {
		return ipf_port_3;
	}


	public void setIpf_port_3(String ipf_port_3) {
		this.ipf_port_3 = ipf_port_3;
	}

	@Column(name="ipf_rule_3" )
	public String getIpf_rule_3() {
		return ipf_rule_3;
	}


	public void setIpf_rule_3(String ipf_rule_3) {
		this.ipf_rule_3 = ipf_rule_3;
	}

	@Column(name="ipf_ip_4" )
	public String getIpf_ip_4() {
		return ipf_ip_4;
	}


	public void setIpf_ip_4(String ipf_ip_4) {
		this.ipf_ip_4 = ipf_ip_4;
	}

	@Column(name="ipf_protocol_4" )
	public String getIpf_protocol_4() {
		return ipf_protocol_4;
	}


	public void setIpf_protocol_4(String ipf_protocol_4) {
		this.ipf_protocol_4 = ipf_protocol_4;
	}

	@Column(name="ipf_port_4" )
	public String getIpf_port_4() {
		return ipf_port_4;
	}


	public void setIpf_port_4(String ipf_port_4) {
		this.ipf_port_4 = ipf_port_4;
	}

	@Column(name="ipf_rule_4" )
	public String getIpf_rule_4() {
		return ipf_rule_4;
	}


	public void setIpf_rule_4(String ipf_rule_4) {
		this.ipf_rule_4 = ipf_rule_4;
	}

}