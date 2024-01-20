import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  events: {},
  editEvents:false
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    getEvents(state, action) {
      state.events = action.payload;
    },
    updateEvents(state, action) {
      state.editEvents = action.payload;
    },
  },
});

export default eventSlice.reducer;

export function SetEvents(event) {
  return (dispatch, getState) => {
    dispatch(eventSlice.actions.getEvents(event));
  };
}
export function updateEvents(val) {
  return (dispatch, getState) => {
    dispatch(eventSlice.actions.updateEvents(val));
  };
}