import * as XLSX from "xlsx";

//把json数据导出到excel文件中
export function export_excel(excelData, fileName) {
    // 将数据写入表格中
    const data = XLSX.utils.json_to_sheet(excelData);
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    // 将工作表放入工作簿中
    XLSX.utils.book_append_sheet(wb, data, "data");
    // 生成文件并下载
    XLSX.writeFile(wb, fileName + ".xlsx");
}
//把英文表头换为中文
export function convert_excel_data(excelData, tHeader) {
    return excelData.map((item) => {
        const obj = {};
        for (const k in item) {
            if (tHeader[k]) {
                obj[tHeader[k]] = item[k];
            }
        }
        return obj;
    });
}