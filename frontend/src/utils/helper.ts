export const formatSalary = (salary: number) => {
  // Format with dot as thousands separator
  return salary.toLocaleString('vi-VN') + ' VND';
};