import { createSlice } from "@reduxjs/toolkit";

export interface TagMedia {
  id: number;
  url: string;
}

export interface TagMatch {
  date: string;
  id: number;
  message: string;
  media: TagMedia[];
}

interface TagsInitialState {
  currentTag: string;
  matches: TagMatch[];
}

const initialState = {
  currentTag: "",
  matches: [],
};

const tagsSlice = createSlice({
  name: "tagsSlice",
  initialState,
  reducers: {
    // @ts-ignore
    setCurrentTag: (_state, { payload }: { payload: TagsInitialState }) => {
      return payload;
    },
  },
});

export const { setCurrentTag } = tagsSlice.actions;

export default tagsSlice.reducer;
