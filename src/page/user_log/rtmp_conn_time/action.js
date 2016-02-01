import fetch from 'isomorphic-fetch'
import { params } from 'function'

export const LOG_INPUT_PEERID_17 = 'LOG_INPUT_PEERID_17'
export const LOG_INPUT_START_TIME_17 = 'LOG_INPUT_BEGIN_TIME'
export const LOG_INPUT_END_TIME_17 = 'LOG_INPUT_END_TIME_17'
export const RECIEVE_LOG_17 = 'RECIEVE_LOG_17'
export const REQUEST_LOG_17 = 'REQUEST_LOG_17'

let common = {
	isFetching : false,//正在获取数据
	fetched : false,//已经获取到数据
}

export function input_peerid(text){
	return {
		type : LOG_INPUT_PEERID_17,
		peer_id : text
	}
}

export function input_start_time(text){
	return {
		type : LOG_INPUT_START_TIME_17,
		start_time : text
	}
}

export function input_end_time(text){
	return {
		type : LOG_INPUT_END_TIME_17,
		end_time : text
	}
}

function requestPosts(params={}) {
	return	Object.assign({},common,{
        type: REQUEST_LOG_17,
		isFetching : true,
		posts : null,
	});
}

function receivePosts(params={},json) {
	return	Object.assign({},common,{
        type: RECIEVE_LOG_17,
		fetched : true,
        posts: json,
        receivedAt: Date.now()
	});
}

export function fetchData(_params={}) {
	let modules = 'rtmp_conn_time';
	let obj = {
		p:1,
		return_type: 'json',
	}
	_params = Object.assign(obj,_params);
    return dispatch => {
        dispatch(requestPosts(_params))
		var url = params(`http://120.26.74.53/api/logs/${modules}`,_params);
		return fetch(url)
            .then(response => response.json())
            .then(function(json){
				dispatch(receivePosts(_params,json));
			}).catch(function(e){
				console.log('parsing failed', e)
			})
    }
}

