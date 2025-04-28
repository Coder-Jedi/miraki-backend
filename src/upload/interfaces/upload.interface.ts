export interface FileUploadResponse {
  url: string;
  key: string;
  fileId: string;
  name: string;
  size: number;
  fileType: string;
}

export interface UploadResult {
  success: boolean;
  data: {
    url: string;
    key: string;
  };
  message?: string;
}