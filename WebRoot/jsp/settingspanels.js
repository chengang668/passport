
var myDeptData = [
    [1,'root','超级管理员'],
    [2,'admin','管理员'],
    [3,'operator','操作员']
];

var form2;
var newFormWin2;

/* ====================================================================================*/
var deptds = new Ext.data.ArrayStore({
				fields: [
				   {name: 'deptid', type: 'int'},
				   {name: 'deptname'},
				   {name: 'deptdesc'}
				]
			});

var showDepts = {
	id: 'dept-admin-panel',
	// title: '组管理',
	layout: 'border',
	items:[
		{
			region: 'center',
			xtype: 'grid',
			layout: 'fit',
			loadMask :true,  //  载入遮罩动画 
			store: deptds,
			columns: [
				{id:'deptid',header: 'ID', width: 50, sortable: true, dataIndex: 'deptid'},
				{header: '组名', width: 85, sortable: true, dataIndex: 'deptname'},
				{header: '组描述', width: 100, sortable: true, dataIndex: 'deptdesc'}
			],
			stripeRows: true,
			//autoExpandColumn: 'lastlogin',

			// Add a listener to load the data only after the grid is rendered:
			listeners: {
				render: function(){
					this.store.loadData(myDeptData);
				}
			},
			tbar: [{
				text: '添加组',
				iconCls: 'group-add24',
				scale:'large'
			},'-',
			{
				text: '修改组',
				iconCls: 'group-mod24',
				scale:'large'
			},'-',
			{
				text: '删除组',
				iconCls: 'group-del24',
				scale:'large'
			}],
			// 添加分页工具栏
			bbar : new Ext.PagingToolbar( {
				pageSize :30,
				store :deptds,
				displayInfo :true,
				displayMsg :'显示 {0}-{1}条 / 共 {2} 条',
				emptyMsg :"无数据。"
			})
		}
		]
};




