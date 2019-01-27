import {goBack, replace} from "react-router-redux";
import _ from "lodash";
import {rest_api} from "./rest_helper";

const KEY = "SENSOR"
const base_path = "/sensor"

const initial_state = () => {

    let result = {
        list: {},
        types: {
            t1: {label: "T1", parameter: {name: {label: "Name", type: "text"}}},
            t2: {
                label: "T2", parameter: {
                    www: {label: "WWW", type: "text"}
                }
            }
        }

    }

    return result
}

export const add = (data) => rest_api(base_path + "/", KEY + "_ADD", "post", {}, {...data}, undefined, undefined, (dispatch, getState, request, response) => dispatch(replace("sensor/" + response.data.id)));
export const load = () => rest_api(base_path + "/", KEY + "_LOAD", "get");
export const save = (id, data) => rest_api(base_path + "/" + id, KEY + "_SAVE", "put", {}, {...data});
export const remove = (id) => rest_api(base_path + "/" + id, KEY + "_REMOVE", "delete", {id}, undefined, undefined, (dispatch) => dispatch(goBack()));
export const call_action = (id, action) => rest_api(base_path+"/"+id+"/action" , KEY+"_CALL_ACTION", "post", {}, {action});


const sensor = (state = initial_state(), action) => {
    switch (action.type) {
        case KEY + "_ADD_DATA_RECEIVED":
        case KEY + "_SAVE_DATA_RECEIVED":
            return {...state, list: {...state.list, [action.payload.id]: action.payload}}
        case KEY + "_LOAD_DATA_RECEIVED":
            return {...state, list: {...action.payload}}
        case KEY + "_REMOVE_DATA_RECEIVED":
            return {...state, list: _.omit(state.list, action.context.id)}
        case "SENSOR_UPDATE":
            return {...state, list: {...state.list, [action.payload.id]: {...state.list[action.payload.id], value: action.payload.value, cache:action.payload.cache}}}
        case "SYSTEM_LOAD_DATA_RECEIVED":
            return {...state, list: {...action.payload.sensor.items}, types: {...action.payload.sensor.types}}
        default:
            return state
    }
}

export default sensor

