<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
 <html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>页面</title>

<link rel="stylesheet" type="text/css" href="/resource/ext-2.3.0/resources/css/ext-all.css" />

<link rel="stylesheet" type="text/css" href="/resource/ext-2.3.0/init.css" />

<script src="/resource/ext-2.3.0/adapter/ext/ext-base.js" type="text/javascript"></script>

<script src="/resource/ext-2.3.0/ext-core.js" type="text/javascript"></script>

<script src="/resource/ext-2.3.0/ext-all.js"  type="text/javascript"></script>

 <script src="/resource/ext-2.3.0/init.jsp"  type="text/javascript"></script>

<script src="/resource/ext-2.3.0/source/locale/ext-lang-zh_CN.js"  type="text/javascript"></script>


<SCRIPT type="text/javascript" src="Level.js"></SCRIPT>

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

.save {
	background-image: url(Button8.png) !important;
}
</STYLE>
</head>
<body class="x-vista">
<SCRIPT type="text/javascript">
   Ext.BLANK_IMAGE_URL = '/resource/ext-2.3.0/resources/images/default/s.gif';
</SCRIPT>

<div id="topic-grid"></div>


<div id="topic-win" class="x-hidden">
<div class="x-window-header">Hello Dialog</div>
<div id="topic-tabs"></div>
</div>
</body>
</html>