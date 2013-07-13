myinit();
Ext.onReady( function() {
	Ext.QuickTips.init();
	var newFormWin;
	var form1;
	var _jsonReader = new Ext.data.JsonReader( {
		root :'list',
		totalProperty :'totalCount',
		id :'levelid',
		successProperty :'@success'
	}, [ {
		name :'levelid',
		mapping :'levelid',
		type :'int'
	}, {
		name :'levelname',
		mapping :'levelname'
	}, {
		name :'description',
		mapping :'description'
	} ]);
	// Store
		var ds = new Ext.data.Store( {
			proxy :new Ext.data.HttpProxy( {
				url :'LevelAjaxJsonData.action'
			}),
			//
			reader :_jsonReader
		});
		ds.setDefaultSort('levelid', 'desc');

		// ColumnModels
		var cm = new Ext.grid.ColumnModel( [ new Ext.grid.RowNumberer(), {
			id :'levelid',
			header :'���',
			dataIndex :'levelid',
			width :40
		}, {
			header :"��������",
			dataIndex :'levelname',
			width :50,
			sortable :true,
			locked :false
		}, {
			header :"����",
			dataIndex :'description',
			width :100
		} ]);
		// by default columns are sortable
		cm.defaultSortable = true;

		var grid = new Ext.grid.GridPanel( {
			// var grid = new Ext.grid.EditorGridPanel( {
			collapsible :true,// �Ƿ����չ��
			animCollapse :false,// չ��ʱ�Ƿ��ж���Ч��
			clicksToEdit :4,
			title :'�������',
			iconCls :'icon-grid',
			store :ds,
			cm :cm,
			renderTo :'topic-grid',

			viewConfig : {
				forceFit :true
			},
			/*
			 * // ������ݵİ�ť buttons : [ { text : '����' }, { text : 'ȡ��' }],
			 * buttonAlign : 'center',// ��ť����
			 * 
			 */
			// ��ӷ�ҳ������
			bbar :new Ext.PagingToolbar( {
				pageSize :30,
				store :ds,
				displayInfo :true,
				displayMsg :'��ʾ {0}-{1}�� / �� {2} ��',
				emptyMsg :"�����ݡ�",
				items : [ '-', {
					pressed :true,
					enableToggle :true,
					text :'��ť',
					cls :'x-btn-text-icon details',
					toggleHandler :ptb_bt1
				} ]
			}),
			// ������ݵĹ�����
			tbar : [ {
				id :'New1',
				text :' �½�  ',
				tooltip :'�½�һ����',
				iconCls :'add',
				handler : function() {
					ptb_bt1();
				}
			}, '-', {
				text :'�޸�',
				tooltip :'�޸�',
				iconCls :'edit',
				handler : function() {
					ptb_bt2();
				}
			}, '-', {
				text :'ɾ��',
				tooltip :'ɾ����ѡ�������',
				iconCls :'remove',
				handler : function() {
					ptb_bt3();
				}
			} ],
			width :700,
			height :400,
			frame :true,
			loadMask :true,// �������ֶ���
			autoShow :true
		});

		ds.load( {
			params : {
				start :0,
				limit :30,
				forumId :4
			}
		});
		grid.render();
		grid.on("rowdblclick", function(grid) {
			loadFormData(grid);
		});
		// ���뱻ѡ��������еı�����
		var loadFormData = function(grid) {
			var _record = grid.getSelectionModel().getSelected();
			if (!_record) {
				Ext.example.msg('�޸Ĳ���', '��ѡ��Ҫ�޸ĵ�һ�');
			} else {
				myFormWin();
				form1.form.load( {
					url :'LoadLevel.action?level.levelid=' + _record
							.get('levelid'),
					waitMsg :'������������...',

					failure : function() {
						Ext.example.msg('�༭', '����ʧ��');
					},
					success : function() {
						Ext.example.msg('�༭', '����ɹ���');
					}
				});
			}
		}
		// ��ҳ��������ť--�½��¼�
		var ptb_bt1 = function() {
			myFormWin();
		};
		// �޸��¼�
		var ptb_bt2 = function() {

			loadFormData(grid);

		};
		// ɾ���¼�
		var ptb_bt3 = function() {

			var _record = grid.getSelectionModel().getSelected();
			if (_record) {
				Ext.MessageBox.confirm('ȷ��ɾ��', '��ȷ��Ҫɾ������������', function(btn) {
					if (btn == "yes") {
						var m = grid.getSelectionModel().getSelections();
						var jsonData = "";
						for ( var i = 0, len = m.length; i < len; i++) {
							var ss = m[i].get("levelid");
							if (i == 0) {
								jsonData = jsonData + ss;
							} else {
								jsonData = jsonData + "," + ss;
							}
							ds.remove(m[i]);
						}
						ds.load( {
							params : {
								start :0,
								limit :30,
								delData :jsonData
							}
						});

						// Ext.example.msg('---ɾ������---', '��ɾ����������');
					}
				});
			} else {
				Ext.example.msg('ɾ������', '��ѡ��Ҫɾ���������');
			}
		};

		// form_win

		var myFormWin = function() {
			// create the window on the first click and reuse on subsequent
			// clicks

			if (!newFormWin) {
				newFormWin = new Ext.Window( {
					el :'topic-win',
					layout :'fit',
					width :400,
					height :300,
					closeAction :'hide',
					plain :true,
					title :'����',
					items :form1

				});
			}
			newFormWin.show('New1');
		}
		var _jsonFormReader = new Ext.data.JsonReader( {
			root :'list',
			totalProperty :'totalCount',
			id :'levelid',
			successProperty :'@success'
		}, [ {
			name :'level.levelid',
			mapping :'levelid',
			type :'int'
		}, {
			name :'level.levelname',
			mapping :'levelname'
		}, {
			name :'level.description',
			mapping :'description'
		} ]);

		// {success:false,errors:{CompanyID:"��˾���a������", CompanyName:"��˾���Q���}"}}
		form1 = new Ext.FormPanel( {
			// collapsible : true,// �Ƿ����չ��
			labelWidth :75, // label settings here cascade unless overridden
			url :'AddLevel.action',
			frame :true,
			title :'��Ӽ���',
			bodyStyle :'padding:5px 5px 0',
			width :350,
			waitMsgTarget :true,
			reader :_jsonFormReader,
			defaults : {
				width :230
			},
			defaultType :'textfield',
			items : [ {
				fieldLabel :'����ID',
				name :'level.levelid',
				allowBlank :false
			}, {
				fieldLabel :'��������',
				name :'level.levelname',
				allowBlank :false
			}, new Ext.form.TextArea( {
				fieldLabel :'����',
				name :'level.description',
				growMin :234
			}) ],

			buttons : [ {
				text :'����',
				disabled :false,
				handler : function() {
					if (form1.form.isValid()) {
						form1.form.submit( {
							url :'AddLevel.action',
							success : function(from, action) {
								Ext.example.msg('����ɹ�', '��Ӽ���ɹ���');
								ds.load( {
									params : {
										start :0,
										limit :30,
										forumId :4
									}
								});
							},
							failure : function(form, action) {
								Ext.example.msg('����ʧ��', '��Ӽ���ʧ�ܣ�');
							},
							waitMsg :'���ڱ������ݣ��Ժ�...'
						});
						newFormWin.hide();
					} else {
						Ext.Msg.alert('��Ϣ', '����д������ύ!');
					}
				}
			}, {
				text :'ȡ��',
				handler : function() {
					newFormWin.hide();
				}
			} ]
		});
	});
