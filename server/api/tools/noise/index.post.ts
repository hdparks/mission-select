import savePixels from 'save-pixels'
import fs from 'fs'
import ndarray from 'ndarray'
import ops from 'ndarray-ops'

export default defineEventHandler(async(event) => {
  const results: number[][] = await readBody(event) 
  let a = ndarray<number[]>(results.flat(1), [results[0].length, results.length])
  ops.mulseq(a, 255)
  console.log(results, a)
  const filename = 'public/noise/'+new Date().toISOString() + '.png'
  const writeStream = fs.createWriteStream(filename)
  savePixels(a, 'png').pipe(process.stdout)
  savePixels(a, 'png').pipe(writeStream)
  return 200 
})
