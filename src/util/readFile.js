/* 读取文件 */
export const readFile = (file) => {
    return new Promise(resolve => {
        // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
        let reader = new FileReader()
            // 该方法用于将File对象转化为二进制文件
        reader.readAsBinaryString(file)
            // 当把文件所有数据加载完毕后，把数据传给promise的下一步
        reader.onload = ev => {
            resolve(ev.target.result)
        }
    })
}