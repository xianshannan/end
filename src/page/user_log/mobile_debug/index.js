import React from 'react'
import { connect } from 'react-redux'
import { pushPath ,replacePath } from 'redux-simple-router'
import * as action from './action'
import {Form, Input, Button, Icon,Table } from 'antd_c'
import Monitor from '../../sidebar/user_log'
import Pagination from '../pagination.js'
import { title } from '../title.js'
import LogForm from '../form.js'
import { getUrlParams } from 'function'
import { columns,logData } from './data'
const FormItem = Form.Item;
let data = []; 

class mobile_debug extends React.Component {
	constructor(){
		super(); 
		this.type = null;
	}

	componentDidMount(){
		if(!this.props.mobile_debug.posts){
			this.getData({ })	
		}
		this.hasMount = true;
		this.type = getUrlParams(this.props.route.path)[1];
		//console.log(1)
	}

	getData(params={}){
		let { dispatch,mobile_debug } = this.props
		dispatch(action.fetchData(params,this.type));	
	}
	
	onPaginationChange(p){
		this.getData({
			p : p
		})	
	}

    render() {
		//console.log(this.props)
		let { mobile_debug ,location,dispatch } = this.props;
		let { params } = mobile_debug;
		if(this.hasMount && mobile_debug.posts && mobile_debug.posts.logs){
			if(mobile_debug.posts.logs[0]){
				if( !mobile_debug.posts.logs[0].key){
					data = logData(mobile_debug);
				}
			}else{
				data = [];
			}
			
		}
        return (
			<Monitor location={location} >
				<h2>{title[this.type]}</h2>
				<br/>
				<LogForm action={action}/>
				
				{
					!mobile_debug.posts &&
					<Table className="" loading={mobile_debug.isFetching} size="middle"
						columns={columns} dataSource={[]} pagination={false} bordered/>
				}
				{
					mobile_debug.posts &&
					<Table className="" loading={mobile_debug.isFetching} size="middle"
						columns={columns} dataSource={data} pagination={false} bordered/>
				}
				{
					mobile_debug.posts && mobile_debug.posts.total_pages > 1 &&
					<Pagination action={action}/>
				}
			</Monitor>
        )
    }
}
/**
 *	组件初始props,过state传递到props
 */
function mapStateToProps(state,props){
	//console.log("mobile_debug组件初始props",state);
	return {
		//routing : state.routing,
	    mobile_debug : state.mobile_debug
	};
}
module.exports = connect(mapStateToProps)(mobile_debug)
module.exports.component = mobile_debug;