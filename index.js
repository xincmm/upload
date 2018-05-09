import 'babel-polyfill'
import $ from 'jquery'
import SparkMD5 from 'spark-md5'
import { readablizeBytes } from './helper/readablizeBytes'

const chunkSize = 5 * 1024 * 1024 /* 分片大小为 5 MB */
let fileSize = 0,
  /* 文件大小 */
  file = null,
  hasUploaded = 0,
  /* 已经上传的分割数目 */
  chunks = 0 /* 分片总数 */

/* 开始上传按钮被点击之后执行 */
$('#upload').click(() => {
  file = $('#file')[0].files[0]
  fileSize = file.size
  console.log(`文件大小：${ readablizeBytes(fileSize) }`)
  responseChange(file)
})

/* 0. 响应点击 */
const responseChange = async (file) => {
  /* 开始校验，返回文件的 MD5 值 */
  const fileMd5Value = await md5File(file)
  console.log(fileMd5Value)
}

/* 1. 修改时间 + 文件名称 + 最后修改时间 -> MD5 */
const md5File = (file) => {
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = file.size / 100,
      chunks = 100,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader()
    let currentChunk = 0

    fileReader.onload = (e) => {
      spark.append(e.target.result)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        const cur = +(new Date())
        console.log('Finished loading')
        const result = spark.end()
        console.log(result)
        resolve(result)
      }
    }

    fileReader.onerror = () => {
      console.warn('oops, something went wrong')
    }

    const loadNext = () => {
      const start = currentChunk * chunkSize,
        end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
      $('#checkProcessStyle').css({
        width: (currentChunk + 1) + '%'
      })
      $('#checkProcessStyle').attr('aria-valuenow', currentChunk + 1)
      $('#checkProcessStyle').html((currentChunk + 1) + '%')
    }
    loadNext()
  })
}