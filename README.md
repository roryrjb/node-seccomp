# node-seccomp [![Build Status](https://travis-ci.org/roryrjb/node-seccomp.svg?branch=master)](https://travis-ci.org/roryrjb/node-seccomp) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![NPM version](https://img.shields.io/npm/v/node-seccomp.svg)](https://npmjs.org/package/node-seccomp) [![License](http://img.shields.io/npm/l/node-seccomp.svg)](LICENSE)

> Node wrapper around [`libseccomp`](https://github.com/seccomp/libseccomp)

### Requirements

* a Linux distribution
* C/C++ tool stack (GCC, etc...)
* libseccomp `>= 2.4.0`

### What this is

If you don't know what __seccomp__ is, have a look
[here](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html).

This is a wrapper around the __libseccomp__ C library, which is itself an
interface over the seccomp syscall and eBPF. In a nutshell it is used to
intercept system calls in a process and get the Linux kernel to do something
with them. Generally this will be to kill the process or raise an error if an
unexpected syscall is called in your application.

With Node.js and the way it works internally with V8 and libuv this is more
complicated, even with the simplest Node.js applications.
due to the various threads that will run underneath. Before version `2.4.0` of `libseccomp`
the default behaviour of the _kill_ setting was to kill the thread (`SCMP_ACT_KILL`), what this usually
means for a Node.js process is that it silently stops, as of `2.4.0` there is a kill
setting that ensures the process itself is killed (`SCMP_ACT_KILL_PROCESS`), __which is the only method this
wrapper currently supports__. With seccomp you can also get it to raise a specific
error instead (there are other options as well which I haven't used and won't
describe here, see `man seccomp_init` for more details), but in my mind that
forces you to add additional logic to handle this and differentiate between errors for other reasons.

__SCMP_ACT_KILL_PROCESS__

__SCMP_ACT_KILL__

__SCMP_ACT_ERRNO__

__SCMP_ACT_ALLOW__

### Installation

```
$ npm install --save node-seccomp
```

### Usage

__Example:__

```javascript
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
}).listen(8000) // Error: listen EADDRINUSE: address already in use 0.0.0.0:8000
```
