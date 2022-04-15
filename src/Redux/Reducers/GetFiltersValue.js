import { createSlice } from "@reduxjs/toolkit";


const filtersValueSlice = createSlice({
    name : "filtersValueSlice",
    initialState : [],
    reducers : {
        dataRecived : (state,action) => {
            return state = action.payload
        }
    }
})

export default filtersValueSlice.reducer;
export const {dataRecived} = filtersValueSlice.actions;