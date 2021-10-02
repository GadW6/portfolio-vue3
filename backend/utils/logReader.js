const fs = require('fs')
const path = require('path')

const asyncLogsArray = (() => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '..', 'log', 'access.log'), { encoding: 'utf8', flag: 'r' }, (err, data) => {
      if (err) return reject(err)
      resolve(data.split('\n'))
    })
  })
})()

const raw = async (limit = 30) => {
  const logs = await asyncLogsArray
  return logs.reverse().slice(1, limit + 1)
}

const filteredLogsApi = async (limit = 30) => {
  const data = await asyncLogsArray
  const logsObj = data.filter(row => {
    const rowObject = {...row.split(' ')}
    if(Object.keys(rowObject).length > 1) return (
      rowObject[3].includes('/v1/') &&
      !rowObject[3].includes('/v1/images') &&
      !rowObject[3].includes('/v1/tags')
    )
  })
  return logsObj.reverse().slice(0, limit)
}

const logsObjectArray = async (arrayToFilter = filteredLogsApi()) => {
  const data = await arrayToFilter
  return data.map(row => {
    const chunks = row.split(' ')
    return {
      address: chunks[0],
      method: chunks[2],
      path: chunks[3],
      status: chunks[5],
      latency: chunks[8]
    }
  })
}

module.exports = {
  raw,
  filteredLogsApi,
  logsObjectArray
}


