export interface IFormSubmission {
  id: string;
  collectionId: string;
  data: Record<string, any>; // { name: "Juan", email: "j@test.com" }
  createdAt: string;
}

export interface IFormSubmissionCreate {
  collectionId: string;
  data: Record<string, any>;
}

export interface IFormSubmissionError {
  data?: string;
}
