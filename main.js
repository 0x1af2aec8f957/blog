const [express, mustacheExpress] = [
    require('express'),
    require('mustache-express')],
  [fs, path, marked, process] = [
    require('fs'),
    require('path'),
    require('marked'),
    require('child_process')]
app = express()

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', `${__dirname}/view`)

app.get('/', function (req, res) {
  /*
  * name,
        label,*/
  const dirFilePath = path.resolve(__dirname, 'components')
  fs.readdir(dirFilePath, (error, files) => {
    if (error) return res.send(error)
    const array = []
    for (let x of files) {
      const object = fs.statSync(path.join(dirFilePath, x))
      array.push({
        name: x.split('-')[0],
        label: x.split('-')[1].replace(/\.md/, ''),
        path: x.replace(/\.md/, ''),
        time: `${object.ctime.getFullYear()}年${object.ctime.getMonth() +
        1}月${object.ctime.getDate()}日`,
      })
    }
    return res.render('index', {
      title: 'Ed Me',
      components: array,
    })
  })
  /*res.render('index', {title: 'TEST', message: 'Hello Visitor!'})*/
})

app.get('/:path', function (req, res) {  // user get file
  const filePath = path.join(__dirname, 'components', `${req.params.path}.md`)
  fs.stat(filePath, function (error, stats) {
    if (error) return res.send('错误的路径')
    if (stats.isFile()) {
      return res.render('index', {
        title: req.params.path,
        html: marked(fs.readFileSync(filePath, 'utf-8')),
      })
    }
    return res.send('not path')
  })
})

app.post('/pushCode', function (req, res) { // github push or commit
  process.exec(`python ${path.join(__dirname,'gitPull.py')}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send({error})
    else return res.sendStatus(200)
  })
})

marked.setOptions({
  highlight: code => require('highlight').highlightAuto(code).value,
})
//  components.io
app.listen(3000)