import api from "./api";

const username = localStorage.getItem("username");
const role = localStorage.getItem("role");

/**
 * Lấy tất cả công việc
 */
export const getAllWorks = async () => {
  try {
    const res = await api.get("/works-posted", {
      headers: { "X-Role": role },
    });
    return res.data.map((e) => ({
      id: e.id,
      position: e.position,
      descriptionWork: e.descriptionWork,
      salary: e.salary,
      companyId: e.companyId,
      company: e.companyName,
      createdByUsername: e.createdByUsername,
    }));
  } catch (err) {
    console.error("Lỗi khi load tất cả công việc:", err);
    throw err;
  }
};

/**
 * Lấy chi tiết 1 công việc theo id
 */
export const getWork = async (id) => {
  try {
    const res = await api.get(`/works-posted/${id}`, {
      headers: { "X-Role": role },
    });
    const e = res.data;
    return {
      id: e.id,
      position: e.position,
      descriptionWork: e.descriptionWork,
      salary: e.salary,
      companyId: e.companyId,
      company: e.companyName,
      createdByUsername: e.createdByUsername,
    };
  } catch (err) {
    console.error(`Lỗi khi load chi tiết công việc id=${id}:`, err);
    throw err;
  }
};

/**
 * Tạo công việc mới
 */
export const createWork = async (data) => {
  try {
    const res = await api.post("/works-posted", data, {
      headers: { "X-Username": username },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi khi tạo công việc:", err);
    throw err;
  }
};

/**
 * Cập nhật công việc
 */
export const updateWork = async (id, data) => {
  try {
    const res = await api.put(`/works-posted/${id}`, data, {
      headers: { "X-Username": username, "X-Role": role },
    });
    return res.data;
  } catch (err) {
    console.error(`Lỗi khi cập nhật công việc id=${id}:`, err);
    throw err;
  }
};

/**
 * Xóa công việc
 */
export const deleteWork = async (id) => {
  try {
    await api.delete(`/works-posted/${id}`, {
      headers: { "X-Username": username, "X-Role": role },
    });
  } catch (err) {
    console.error(`Lỗi khi xóa công việc id=${id}:`, err);
    throw err;
  }
};

/**
 * Tìm kiếm công việc theo từ khóa
 * Lưu ý: backend phải có endpoint /works-posted/search
 */
export const searchWorks = async (keyword) => {
  try {
    const res = await api.get(
      `/works-posted/search?keyword=${encodeURIComponent(keyword)}`
    );
    return res.data.map((e) => ({
      id: e.id,
      position: e.position,
      descriptionWork: e.descriptionWork,
      salary: e.salary,
      companyId: e.companyId,
      company: e.companyName,
      createdByUsername: e.createdByUsername,
    }));
  } catch (err) {
    console.error("Lỗi khi tìm kiếm công việc:", err);
    throw err;
  }
};
