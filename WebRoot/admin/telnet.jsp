<html>

<head>
  <title>JAVA Telnet Applet</title>
  <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
  <link rel="stylesheet" href="/css/global.css" type="text/css"/>

<script Language=JavaScript>
  function openThis(){
  	var sw=screen.width-100;
  	var sh=screen.height-75;
  	if(sw>660) sw=660;
  	if(sh>672) sh=672;
  	
  	window.resizeTo(sw,sh);
  	window.moveTo((screen.width-sw)/2,(screen.height-sh)/2);
  }
  
  function closeThis(){
  	if(window.stop){
  		window.stop();
  		setTimeout("window.close()",1000);
  	}
  	else{window.close();}
  }
  
  </script>
</head>
  
  <body onLoad=openThis()>
  
  <center>
  
  <table border=1 width=590 cellspacing=0 bordercolordark=#000084 bordercolorlight=#000084>
  	<tr>
  		<td bgcolor=#000084 height=22>
    	<font color=#FFFFFF><b>&nbsp;&nbsp;&nbsp;Telnet [ 2 : Port Title #2 ]</b></font>
    	</td>
    </tr>
  </table>
  
  <applet codebase="." archive="jta25.jar" code="de.mud.jta.Applet" width=590 height=532>
    <param name="plugins" value="Socket,Telnet,Terminal,ButtonBar,Status">
    <param name="config" value="term.config">
    <param name="port" value="7002">
    <param name="TerminalSize" value="[80,24]">
    
    <br><b>Your Browser seems to have no Java support. Please get a new browser or enable Java to see this applet!</b>
    <br>
  </applet>

  </center>
  <br>
  
  <form>
    <center>
        <input type=button value="Close" onClick=closeThis()>
    </center>
  </form>
</body>

</html>

