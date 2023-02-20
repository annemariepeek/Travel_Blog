const express = require('express')
const path = require('path')

let inital_path = path.join(__dirname, "public")

const app = express()
app.use(express.static(inital_path))

app.get('/', (requ))