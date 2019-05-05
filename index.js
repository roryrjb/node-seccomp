const seccomp = require('bindings')('seccomp')

const stdio = [
  'access',
  'ioctl',
  'futex',
  'set_robust_list',
  'prlimit64',
  'exit',
  'exit_group',

  'openat', // rpath
  'readlink', // rpath

  'epoll_ctl',
  'epoll_pwait',
  'rt_sigprocmask',
  'rt_sigaction',
  'brk',
  'clock_getres',
  'clock_gettime',
  'close',
  'dup',
  'dup2',
  'dup3',
  'fchdir',
  'fcntl',
  'stat',
  'fstat',
  'fsync',
  'ftruncate',
  'getdents',
  'getegid',
  'getentropy',
  'geteuid',
  'getgid',
  'getgroups',
  'getitimer',
  'getlogin',
  'getpgid',
  'getpgrp',
  'getpid',
  'getppid',
  'getresgid',
  'getresuid',
  'getrlimit',
  'getrtable',
  'getsid',
  'getthrid',
  'gettimeofday',
  'getuid',
  'issetugid',
  'lseek',
  'madvise',
  'minherit',
  'mmap',
  'mprotect',
  'mquery',
  'munmap',
  'nanosleep',
  'pipe',
  'pipe2',
  'poll',
  'pread',
  'preadv',
  'pwrite',
  'pwritev',
  'read',
  'readv',
  'recvfrom',
  'recvmsg',
  'select',
  'sendmsg',
  'sendsyslog',
  'sendto',
  'setitimer',
  'shutdown',
  'sigaction',
  'sigprocmask',
  'sigreturn',
  'socketpair',
  'umask',
  'wait4',
  'write',
  'writev'
]

const inet = [
  'socket',
  'listen',
  'bind',
  'connect',
  'accept4',
  'accept',
  'getpeername',
  'getsockname',
  'setsockopt',
  'getsockopt'
]

const proc = [
  'clone',

  'fork',
  'vfork',
  'kill',
  'getpriority',
  'setpriority',
  'setrlimit',
  'setpgid',
  'setsid'
]

module.exports = function (...groups) {
  seccomp(groups.reduce((b, a) => b.concat(a)))
}

module.exports.stdio = stdio
module.exports.inet = inet
module.exports.proc = proc
