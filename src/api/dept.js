import request from "@/utils/request";

// 获取部门列表
export const queryAllApi = () => request.get("/depts");

// 添加
export const addApi = (dept) => request.post("/depts", dept);

// 按照id查询
export const queryByIdApi = (id) => request.get(`/depts/${id}`);

// 按照id修改
export const updateApi = (dept) => request.put(`/depts`, dept);

// 按照id删除
export const deleteApi = (id) => request.delete(`/depts?id=${id}`);
