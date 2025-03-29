import request from "@/utils/request";

// 获取员工列表
export const queryAllApi = (name,gender,begin,end,page,pageSize) => request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`);
// 添加
export const addApi = (emp) => request.post("/emps", emp);
// 按照id修改
export const updateApi = (dept) => request.put(`/emps`, dept);
// 按照id查询
export const queryByIdApi = (id) => request.get(`/emps/${id}`);
// 按照id删除
export const deleteApi = (id) => request.delete(`/emps?ids=${id}`);
