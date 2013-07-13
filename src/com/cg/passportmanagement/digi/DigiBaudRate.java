package com.cg.passportmanagement.digi;

/*

*/

public class DigiBaudRate {

	public transient String baudrate = null;
	public transient String databit = null;
	public transient String parity = null;
	public transient String stopbit = null;
	public transient String flowcontrol = null;
	
	public DigiBaudRate(){
		;
	}

	/*'75','150','200','300','600','1200','1800','2400','4800','9600','19200','38400','57600','115200','230400'*/
	/* ['8 bits','7 bits'] */
	/* ['None','Even','Odd'] */
	/* ['1 bit','2 bits'] */
	/* ['None','XON/XOFF', 'Hardware'] */
	
	public DigiBaudRate translate(){
		DigiBaudRate tr = new DigiBaudRate();
		int selector;
		String[] brate = {"75","150","200","300","600","1200","1800","2400","4800","9600","19200","38400","57600","115200","230400"};
		if ((selector = index(brate, baudrate))==-1){
			return null;
		}
		tr.setBaudrate(String.valueOf(selector+1));

		String[] dbit = {"8 bits","7 bits"};
		if ((selector = index(dbit, databit))==-1){
			return null;
		}
		tr.setDatabit(String.valueOf(selector+1));

		String[] par = {"None","Even","Odd"};
		if ((selector = index(par, parity))==-1){
			return null;
		}
		tr.setParity(String.valueOf(selector+1));
		
		String[] arrStopbit = {"1 bit","2 bits"};
		if ((selector = index(arrStopbit, stopbit))==-1){
			return null;
		}
		tr.setStopbit(String.valueOf(selector+1));
		
		String[] arrFlowCntrl = {"None","XON/XOFF","Hardware"};
		if ((selector = index(arrFlowCntrl, flowcontrol))==-1){
			return null;
		}
		tr.setFlowcontrol(String.valueOf(selector+1));

		return tr;
	}
	
	public String getDescString(){
		StringBuilder desc_string = new StringBuilder(baudrate);
		desc_string.append("-" + parity.charAt(0));
		desc_string.append("-" + databit.charAt(0));
		desc_string.append("-" + stopbit.charAt(0));

		String tmp;
		tmp = flowcontrol.compareToIgnoreCase("None")==0? "NO" : flowcontrol.compareToIgnoreCase("Hardware")==0? "HW" : "SW";
		desc_string.append("-" + tmp);
		return desc_string.toString();
	}
	
	public String getBaudrate() {
		return baudrate;
	}

	public void setBaudrate(String baudrate) {
		this.baudrate = baudrate;
	}

	public String getDatabit() {
		return databit;
	}

	public void setDatabit(String databit) {
		this.databit = databit;
	}

	public String getParity() {
		return parity;
	}

	public void setParity(String parity) {
		this.parity = parity;
	}

	public String getStopbit() {
		return stopbit;
	}

	public void setStopbit(String stopbit) {
		this.stopbit = stopbit;
	}

	public String getFlowcontrol() {
		return flowcontrol;
	}

	public void setFlowcontrol(String flowcontrol) {
		this.flowcontrol = flowcontrol;
	}

	private int index (String[] arr, String v){
		int i=0;
		for (String item : arr){
			if (item.compareToIgnoreCase(v)==0)
				return i;
			++i;
		}
		return -1;
	}

}
