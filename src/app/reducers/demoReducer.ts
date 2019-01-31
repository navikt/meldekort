import { Constants, DemoActions } from '../types/demo';

// STATE
// A simple one field 'list' to configureStore list of string in our state
export interface DemoState {
    list: string[];
    loading: boolean;
}

// defining inital state
const init: DemoState = {
    list: [],
    loading: false
};

// when called for the first time, it will return initial state.
const demoReducer = (state: DemoState = init,
                     action: DemoActions): DemoState => {

    // man har vanligvis en switch/case ../default for å route til riktig action.
    // Fungerer som en slags if-setning.

    // If case, action type = ADD_ITEM, add item from actions payload to state field list
    switch (action.type) {

        case Constants.ADD_ITEM:
            console.log('suuumthin');
            return { ...state, list: [...state.list, action.payload.item]};

        case Constants.SET_LOADING:
            return {...state, ...action.payload};

        default:
            return state;
    }
};

export default demoReducer;