/* 辅助函数：文件大小单位转换 */
const readablizeBytes = (bytes) => {
  let s = ['Bytes', 'KB', 'MB', 'GB']
  let e = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e]
}

export { readablizeBytes }