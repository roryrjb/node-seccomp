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
to your process or with that information. Generally this means killing the
process or raising an error if an unexpected syscall is called.

__SCMP_ACT_KILL_PROCESS__

Only available as of version `2.4.0` of `libseccomp`. It ensures the whole
process is killed. It is the only _kill_ action exposed in this module.

__SCMP_ACT_KILL__

:no_entry: This action isn't supported by this module.

With Node.js and the way it works internally with V8 and libuv, if a thread is
killed it's unpredictable exactly what will happen, and in my tests,
the application just appears to hang and never recovers.

__SCMP_ACT_ERRNO__

:warning: Use of this action is not recommended.

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

seccomp
  .init(SCMP_ACT_ALLOW)
  .ruleAdd(SCMP_ACT_ERRNO(EADDRINUSE), 'bind')
  .load()

require('http').createServer((req, res) => {
  res.end('hello\n')
}).listen(8000) // Error: listen EADDRINUSE: address already in use 0.0.0.0:8000
```
