import path from 'path'
import { config } from 'dotenv'
config({path:path.join('env',`.env.${process.env.NODE_ENV}`)})
console.log(process.env.ENV);

(async ()=>{
    await import('./main.js')
})()