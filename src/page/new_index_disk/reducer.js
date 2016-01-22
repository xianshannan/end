import { DISK_DETAIL_STATUS_REQ, DISK_STORAGE_STATUS_REQ, NEW_INDEX_CITY_TAB } from './action'

export function new_index_disk(state={data : {area:'北京',p:1}},action){
    switch(action.type){
		case DISK_DETAIL_STATUS_REQ : 
		     return Object.assign({}, state, {
		        data : action['param'],
		        type : DISK_DETAIL_STATUS_REQ
		     });
		     break;
		default :
		     return state;
		     break;
	}
}

export function getStorageResponse(state={data : {area:'北京',p:1}},action){
    if(action.type === DISK_STORAGE_STATUS_REQ){
    	return  Object.assign({}, state, {
	        data : action['param'],
	        type : DISK_STORAGE_STATUS_REQ
	     });
    }
    return state;
}

export function cityTab(state={data : {area:'北京',p:1}},action){
	if(action.type === NEW_INDEX_CITY_TAB){
		return  Object.assign({}, state, {
	        data : action['param'],
	        type : DISK_STORAGE_STATUS_REQ
	     });
	}
	return state;
}