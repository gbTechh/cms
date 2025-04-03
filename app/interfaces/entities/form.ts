export interface IFormSubmission {
    id: string;
    formId: string;
    data: Record<string, any>; // { name: "Juan", email: "j@test.com" }
    createdAt: string;
}