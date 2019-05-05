# node-seccomp

> Node wrapper around [`libseccomp`](https://github.com/seccomp/libseccomp)

### Requirements

* a Linux distribution
* C/C++ tool stack (GCC, etc...)
* libseccomp `>= 2.4.0`

### What this is

If you don't know what __seccomp__ is, have a look
[here](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html).

This is a wrapper around the __libseccomp__ C library, which is itself a simpler
interface over some lower level parts of the Linux kernel. In a nutshell it is
used to intercept system calls in a process and get the Linux kernel to
do something with them. Generally this will be to kill the process or raise an error.

With Node.js and the way it works with V8 and libuv this is somewhat more complicated
even with the simplest Node.js applications, say compared to a simple C application,
due to the various threads that will run underneath. Before version `2.4.0` of `libseccomp`
the default behaviour of the _kill_ setting was to kill the thread (`SCMP_ACT_KILL`), what this usually
means for a Node.js process is that it silently stops, as of `2.4.0` there is a kill
setting that ensures the process itself is killed (`SCMP_ACT_KILL_PROCESS`), __which is the only method this
wrapper currently supports__. With seccomp you can also get it to raise a specific
error instead (there are other options as well which I haven't used and won't
describe here, see `man seccomp_init` for more details), but in my mind that
forces you to add additional logic to handle this and differentiate between errors for other reasons.

### Installation

This wrapper implementation relies on a new (as of 5th May 2019) version of `libseccomp` (`>= 2.4.0`)
which will most likely not be supported by your Linux distribution of choice in its
package repo. You can however [download it](https://github.com/seccomp/libseccomp/releases), compile it and install it manually, it should
just be a matter of `./configure && sudo make install` but follow any instructions [here](https://github.com/seccomp/libseccomp).

```
$ npm install --save node-seccomp
```

### Usage

By default all syscalls are blocked, you have to specify any that you want to allow.
There is a single function that is exported, call it with a variable number of arrays,
each array containing only strings listing syscalls, i.e.:

```javascript
require('node-seccomp')(['write', 'read'], ['accept'])
```

This is pretty tedious however so with inspiration from
__OpenBSD's__ [`pledge`](https://man.openbsd.org/pledge) syscall there's
also some predefined arrays with common syscalls that are required. This
part is very much a work in progress and will need tweaking and fleshing out,
as the syscall groupings and syscalls themselves will vary between the OSs.

__Example:__

```javascript
const seccomp = require('node-seccomp')
const { stdio } = seccomp

// any syscalls before initialising seccomp will work
// http.createServer(...) - accept, socket, setsockopt, etc...

seccomp(stdio)

console.log('writing to stdout!')
```