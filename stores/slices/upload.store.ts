import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UploadState {
  isUploading: boolean;
  fileId: number | null;
  fileUrl: string | null;
  error: string | null;
}

const initialState: UploadState = {
  isUploading: false,
  fileId: null,
  fileUrl: null,
  error: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.isUploading = true;
      state.error = null;
    },
    uploadSuccess: (
      state,
      action: PayloadAction<{ fileId: number; fileUrl: string }>
    ) => {
      state.isUploading = false;
      state.fileId = action.payload.fileId;
      state.fileUrl = action.payload.fileUrl;
      state.error = null;
    },
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    resetUpload: (state) => {
      state.isUploading = false;
      state.fileId = null;
      state.fileUrl = null;
      state.error = null;
    },
  },
});

export const { uploadStart, uploadSuccess, uploadFailure, resetUpload } =
  uploadSlice.actions;

export default uploadSlice.reducer;
