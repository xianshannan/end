import React from 'react'

const ENTERPRISE_MANAGER_APROVAL_TYPE = ["","观看用户","推流用户"]

export const ENTERPRISE_MANAGER_TABLE_ENTERPRISE = [
     {
		title: 'APP ID',
		dataIndex: 'app_id'
     },
     {
		title: '代号',
		dataIndex: 'code'
     },
     {
		title: '所属企业',
		dataIndex: 'identity'
     },
     {
		title: '起始',
		dataIndex: 'start'
     },
     {
		title: '结束',
		dataIndex: 'end'
     },
     {
		title: '分段ID总数',
		dataIndex: 'total'
     },
     {
		title: '新ID段用途',
		dataIndex: 'usage_type',
		render: function(text,record){
			return <span>{ ENTERPRISE_MANAGER_APROVAL_TYPE[text]}</span>
		}
     },
     {
		title: '新ID段类型',
		dataIndex: 'num_type'
     },
     {
		title: '创建时间',
		dataIndex: 'created',
		render : function(text,record){
			return <span>{ new Date(text).Format('yyyy-MM-dd hh:mm:ss') }</span>
		}
     },
     {
		title: '操作',
		dataIndex: 'opt',
		render : function(text ,record){
			if(record["status"] === 0){
				var aprovalFun = record["aprovalFun"];
				return <span className = "color_blue" onClick = { ()=> aprovalFun(record) }>审核</span>
			}else{
				return <span className = "color_green">使用中</span>
			}
		}
     }

]