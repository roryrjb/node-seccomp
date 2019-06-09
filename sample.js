const {
  SCMP_ACT_ALLOW,
  SCMP_ACT_ERRNO,
  NodeSeccomp,
  errors: {
    EADDRINUSE
  }
} = require('./')

const seccomp = NodeSeccomp()

console.log('works')

seccomp
  .init(SCMP_ACT_ALLOW)
  .ruleAdd(SCMP_ACT_ERRNO(EADDRINUSE), 'bind')
  .load()

require('http').createServer((req, res) => {
  res.end('hello\n')
}).listen(8000)

