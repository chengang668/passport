
var myDeptData = [
    [1,'root','��������Ա'],
    [2,'admin','����Ա'],
    [3,'operator','����Ա']
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
	// title: '�����',
	layout: 'border',
	items:[
		{
			region: 'center',
			xtype: 'grid',
			layout: 'fit',
			loadMask :true,  //  �������ֶ��� 
			store: deptds,
			columns: [
				{id:'deptid',header: 'ID', width: 50, sortable: true, dataIndex: 'deptid'},
				{header: '����', width: 85, sortable: true, dataIndex: 'deptname'},
				{header: '������', width: 100, sortable: true, dataIndex: 'deptdesc'}
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
				text: '�����',
				iconCls: 'group-add24',
				scale:'large'
			},'-',
			{
				text: '�޸���',
				iconCls: 'group-mod24',
				scale:'large'
			},'-',
			{
				text: 'ɾ����',
				iconCls: 'group-del24',
				scale:'large'
			}],
			// ��ӷ�ҳ������
			bbar : new Ext.PagingToolbar( {
				pageSize :30,
				store :deptds,
				displayInfo :true,
				displayMsg :'��ʾ {0}-{1}�� / �� {2} ��',
				emptyMsg :"�����ݡ�"
			})
		}
		]
};




