const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const exportStudentsToExcel = async (students, userId) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Students');

  // Add headers
  worksheet.columns = [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Student ID', key: 'studentId', width: 20 },
    { header: 'Class', key: 'studentClass', width: 15 },
    { header: 'Gender', key: 'gender', width: 10 },
    { header: 'DOB', key: 'dob', width: 15 },
    { header: 'Print Status', key: 'printStatus', width: 15 },
  ];

  // Add rows
  students.forEach(student => {
    worksheet.addRow({
      name: student.name,
      studentId: student.studentId,
      studentClass: student.studentClass,
      gender: student.gender,
      dob: student.dob,
      printStatus: student.printStatus || 'Not Printed'
    });
  });

  const exportDir = path.join(__dirname, '../exports');
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  const filePath = path.join(exportDir, `${userId}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return filePath; // You can send this file path in response or use it later
};

module.exports = exportStudentsToExcel;
