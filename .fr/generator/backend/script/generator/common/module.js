import * as actionCreator from './action' 

export function ${moduleId}(state = {}, action) {
    switch (action.type) {
    	<!--reducer_fetch_begin-->
		case actionCreator.REQUEST${MODULEID}: 
		case actionCreator.RECIEVE${MODULEID}: 	
			return Object.assign({}, state,action);
		<!--reducer_fetch_end-->
        default:
			return state;
    }
}

export function ${moduleId}Form(state = {}, action){
	switch(action.type){
		<!--reducer_input_begin-->
		case actionCreator.INPUT${inputId}${MODULEID}:
			return Object.assign({}, state,action);
		<!--reducer_input_end-->
		default:
			return state;
	}
	
}
