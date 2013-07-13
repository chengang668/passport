<%@ page language="java" contentType="text/html; charset=gb2312"
	pageEncoding="gb2312"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
		<title>页面</title>
		<link rel="stylesheet" type="text/css" href="resource/ext-3.0.0/resources/css/ext-all.css" />
		<link rel="stylesheet" type="text/css" href="resource/ext-3.0.0/init.css" />
		<script type="text/javascript" src="resource/ext-3.0.0/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="resource/ext-3.0.0/ext-all.js"></script>
		<script type="text/javascript" src="resource/ext-3.0.0/init.jsp"></script>
		<SCRIPT type="text/javascript" src="Level.js"></SCRIPT>
<SCRIPT type="text/javascript">
Ext.BLANK_IMAGE_URL = "resource/ext-3.0.0/resources/images/default/s.gif";
</SCRIPT>  

		<STYLE type="text/css">
.ss {
	text-align: left;;
}

.icon-grid {
	background-image: url(grid.png) !important;
}

.add {
	background-image: url(new.png) !important;
}

.edit {
	background-image: url(edit.png) !important;
}

.remove {
	background-image: url(del.png) !important;
}
</STYLE>
	</head>
	<body class="x-vista">
		<div id="topic-grid"></div>

		<div id="topic-win" class="x-hidden">
			<div class="x-window-header">
				Hello Dialog 1
			</div>
			<div id="topic-tabs"></div>
		</div>
	</body>
</html>