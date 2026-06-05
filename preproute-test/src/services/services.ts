/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "/Users/shivam.sutar/Personal-Projects/preproute-test/src/services/axiosInstance.ts";

export const getAllSubjects = async () => {
    const response = await axiosInstance.get("/subjects");
    return response.data;
};


//Get Service calls
export const getTopicsBySubject = async (subjectId: string | number) => {
    const response = await axiosInstance.get(`/topics/subject/${subjectId}`);
    return response.data;
};

export const getSubTopicsByTopic = async (topicId: string | number) => {
    const response = await axiosInstance.get(`/sub-topics/topic/${topicId}`);
    return response.data;
};

export const getAllTests = async () => {
    const response = await axiosInstance.get("/tests");
    return response.data;
};

export const getTestById = async (id: any) => {
    const response = await axiosInstance.get(`/tests/${id}`);
    return response.data;
};

//Post Service calls
export const login = async (data: any) => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
};

export const createTest = async (data: any) => {
    const response = await axiosInstance.post("/tests", data);
    return response.data;
};

export const createQuestionsInBulk = async (data: any) => {
    const response = await axiosInstance.post("/questions/bulk", data);
    return response.data;
};

//Put Servcie calls
export const updateTest = async (id: string | number) => {
    const response = await axiosInstance.put(`/tests/${id}`);
    return response.data;
};

export const publishTest = async (id: string | number) => {
    const response = await axiosInstance.put(`/tests/${id}`);
    return response.data;
};