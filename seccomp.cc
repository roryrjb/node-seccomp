// Copyright (C) 2019, Rory Bradford <roryrjb@gmail.com>
// MIT License

#include <node.h>
#include <seccomp.h>

namespace seccomp {

const char* ToCString(const v8::String::Utf8Value& value) {
  return *value;
}

void exports(const v8::FunctionCallbackInfo<v8::Value>& args) {
  scmp_filter_ctx ctx = seccomp_init(SCMP_ACT_KILL_PROCESS);

  v8::Isolate* isolate = args.GetIsolate();

  v8::Local<v8::Array> syscalls = v8::Local<v8::Array>::Cast(args[0]);

  for (uint i = 0; i < syscalls->Length(); i++) {
    v8::String::Utf8Value syscall(isolate, syscalls->Get(i));

    seccomp_rule_add_exact(
      ctx,
      SCMP_ACT_ALLOW,
      seccomp_syscall_resolve_name(ToCString(syscall)),
      0
    );
  }

  seccomp_load(ctx);
  seccomp_release(ctx);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  NODE_SET_METHOD(module, "exports", seccomp::exports);
}

NODE_MODULE(addon, Init)

}

