import React from 'react'
import Component from 'libs/react-libs/Component'
import { connect } from 'react-redux'
import * as Antd from 'antd'
import * as actionCreator from './action'
import Bar from "./components/Bar"
require("css/public_monitor.css")

class View extends Component {
	constructor(props){
		super(props); 
	}
	componentDidMount(){
		this.props.dispatch(actionCreator.fetchGetData())
	}
	componentWillUnmount(){
	}
	/**
	 *	数据处理与适配
	 */
	dataAdapter(){
		var obj = {
			list: require('./dataSet/summary'),
			//获取格式为[[1003774,0.5],[1003776,1]]的子数组中index为1的所有值组成新数组
			getValueArray(data){
				var arr = [];
				data.forEach(v=>{
					arr.push(v[1])
				})
				return arr;
			},
			fill_fn(v){
				var fill = "blue";
				if(v < 0.5){
					fill = "blue";
				}else if(v >= 0.5 && v < 0.8){
					fill = "rgba(241, 238, 48, 0.88)";
				}else if(v >= 0.8){
					fill = "red";
				}
				return fill;	
			},
			getTableExtendContent(key,data){
				var bar_transform = "";
				var bar_height = 30;
				var v = data[key];
				//console.debug(key,data,v)
				return (
					<div>
						<h4 className="mt10">发送比</h4>
						<svg className="p-m-bar mt10">
							<Bar height={bar_height} width={2} data={v.send_rate_detail} 
								max_value={1} gap={1} field={1} transform={bar_transform} fill={this.fill_fn}/>
						</svg>
						<h4 className="mt10">观看人数</h4>
						<svg className="p-m-bar mt10">
							<Bar height={bar_height} width={2} data={v.viwers_detail}
								max_value={Math.max.apply(null,this.getValueArray(v.viwers_detail))} 
								gap={1} field={1} transform={bar_transform}/>
						</svg>
						<h4 className="mt10">推送带宽</h4>
						<svg className="p-m-bar mt10">
							<Bar height={bar_height} width={2} data={v.publish_bandwidth_detail} 
								max_value={Math.max.apply(null,this.getValueArray(v.publish_bandwidth_detail))} 
								gap={1} field={1} transform={bar_transform}/>
						</svg>
					</div>
				)	
			}
		}
		return obj; 
	}
	/**
	 *	事件处理
	 */
	events(){
		var _this = this;
		return{
		}
	}
    render() {
		super.render();
		var _this = this;
		let { targetProps } = this.props;
		let targetData,listData,send_rate_detail,viwers_detail,publish_bandwidth_detail;
		if(targetProps.main && targetProps.main.result){
			targetData = targetProps.main;
			send_rate_detail = targetData.result.total.send_rate_detail;
			viwers_detail = targetData.result.total.viwers_detail;
			publish_bandwidth_detail = targetData.result.total.publish_bandwidth_detail;
			this.list.getCurrentComponent(this)
			listData = this.list.dataAdapter([targetData.result.total])//针对不同数据要改动
			var bar_transform = "translate(0,0)"
			var bar_height = 30;
			var app_data = this.list.dataAdapter(targetData.result.apps)//针对不同数据要改动
		}
		return (
			<div className="public_monitor">
				{
					!targetData &&
					<Antd.Spin className="mt15" size="large"/>
				}
				{
					targetData &&
					<div>
						<h2>汇总信息</h2>	
						<Antd.Table className="mt10 summary" columns={this.list.columns} dataSource={listData} 
								size="middle" bordered pagination={ false }/>	
						<h4 className="mt10">发送比</h4>
						<svg className="p-m-bar mt10">
							<Bar height={bar_height} width={2} data={send_rate_detail} 
								max_value={1} gap={1} field={1} transform={bar_transform} fill={this.fill_fn}/>
						</svg>
						<h4 className="mt10">观看人数</h4>
						<svg className="p-m-bar mt10">
							<Bar height={bar_height} width={2} data={viwers_detail}
								max_value={Math.max.apply(null,this.getValueArray(viwers_detail))} 
								gap={1} field={1} transform={bar_transform}/>
						</svg>
						<h4 className="mt10">推送带宽</h4>
						<svg className="p-m-bar mt10">
							<Bar height={bar_height} width={2} data={publish_bandwidth_detail} 
								max_value={Math.max.apply(null,this.getValueArray(publish_bandwidth_detail))} 
								gap={1} field={1} transform={bar_transform}/>
						</svg>
						<h2>App信息</h2>	
						<Antd.Table className="mt10" columns={this.list.columns} dataSource={app_data} 
							size="middle" pagination={ false }
							expandedRowRender={record=>this.getTableExtendContent(record.key,targetData.result.apps)}/>	
					</div>
				}
			</div>
		)	
    }
}

var ReduxView = connect((state)=>{
	return {
	    targetProps : state.public_monitor,
	};
})(View)
ReduxView.defaultProps = Object.assign({},Component.defaultProps,{
	title: "R2框架-页面标题设置处",
	breadcrumb:[
		{
			label:'public_monitor',
		},
	],
});
module.exports = ReduxView; 