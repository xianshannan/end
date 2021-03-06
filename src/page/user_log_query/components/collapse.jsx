import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Table,Collapse } from 'antd'
import { title } from '../../user_log/title'
import * as deal from './index'
import CollapseItem from 'libs/antd/collapseItemTable'
const Panel = Collapse.Panel;
let t_data = [];
class NCollapse extends React.Component {

	shouldComponentUpdate(){
		//console.debug(this.props)
		//return false;
		return true;
	}

	componentDidMount(){
		
	}

	getType(type){
		switch(type){
			case 'camera_debug':
				type = 'rtmp_device';
			case 'camera_time':
				type = 'rtmp_device';
			case 'mobile_debug':
				type = 'rtmp_device';
			case 'camera_time_last':
				type = 'rtmp_device';
			case 'camera_debug_last':
				type = 'rtmp_device';
		}
		return type;
	}

	change(key){
		var obj = { }
		obj[key] = true;
		if(!this.state){
			this.setState(obj)
		}
		if(this.state && !this.state[key]){
			this.setState(obj)
		}
	}

    render() {
		let _this = this;
	    let { data,deal_table,active,typeName } = this.props;
		data = deal.deal(data);
		let columns = [];
		var show = '';
		if(active == typeName){
			show = "show";
		}
		let className = "uql_hide_table " + show; 
        return (
			<div className={className}>
				{
					data.length > 0 && 
					<div className="ant-collapse">
						{
						data.map(function(d,key){
							if(!d.t_create_at){ d.t_create_at = d.create_at; }
							var create_at = d.t_create_at.replace(/(.*?)\ /g,'');
							var type = _this.getType(d.type); 
							if(!type){
								t_title = `日志类型对照表需更新(msg_cmd:${d.log_type})，请联系开发人员`; 
								return (
									<CollapseItem data={ [] } columns={[]} title={t_title} key={key}/>
								)
							}
							//console.debug(d)
							if(!d.key2){
								let user_log = { }
								user_log.posts = { }
								user_log.posts.logs = [];
								user_log.posts.logs.push(d);
								if(deal_table[type] && deal_table[type].logData){
									t_data[key] = deal_table[type].logData(user_log)
								}else{
									//console.debug(deal_table[type])
									t_title = `日志类型对照表需更新(msg_cmd:${d.log_type})，请联系开发人员`; 
									return (
										<CollapseItem data={ [] } columns={[]} title={t_title} key={key}/>
									)
								}
							}
							d.key2 = key + 1;
							columns = deal_table[type].columns; 
							var color = '';
							switch(parseInt(d.status)){
								case 2:
									color = "#FA0";
									break;
								case 3:
									color = "red";
									break;
							}
							var _t = create_at + " / " + title[d.type];
							var t_title = <span style={ {color} }>
								{ _t }
							</span> 
							return (
								<CollapseItem data={ t_data[key] } columns={columns} title={t_title} key={key}/>
							)

						})
						}
					</div>
				}
			</div>
			
					
	    )
    }
}

module.exports = NCollapse
