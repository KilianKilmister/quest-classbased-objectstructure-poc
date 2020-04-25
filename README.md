# General Info on the Node Debugger Crash
<!-- TOC -->

- [General Info on the Node Debugger Crash](#general-info-on-the-node-debugger-crash)
  - [General](#general)
  - [VS-Code](#vs-code)
  - [Crash-Log](#crash-log)
  - [Involved Files](#involved-files)
  - [ENV](#env)

<!-- /TOC -->

## General

- launched via VS-Code run task
  - both 'debug' and 'quick launch' cause a crash
- crash doesn't happen when launched via integrated terminal


## VS-Code

- happens with all extensions disabled, too
- complete config and `launch.json` can be found in the [.vscode folder](.vscode/)


## Crash-Log

````LOG
Note: Using the "preview" debug extension
/usr/local/bin/node ./bin/ex.js
Debugger listening on ws://127.0.0.1:50032/9399bdea-1954-4adf-b249-1c4870f9d30f
For help, see: https://nodejs.org/en/docs/inspector
Debugger attached.

***I cut out everything from `console.log()` from my code***

bin/ex.js:112
Debugger listening on ws://127.0.0.1:50032/9399bdea-1954-4adf-b249-1c4870f9d30f
For help, see: https://nodejs.org/en/docs/inspector
undefined:0



illegal access
FATAL ERROR: 
node::inspector::Agent::ToggleAsyncHook Cannot toggle Inspector's AsyncHook, please report this.
 1: 0x1012303e5 node::Abort() (.cold.1) [/usr/local/bin/node]
 2: 0x10009d2c9 node::Abort() [/usr/local/bin/node]
 3: 0x10009d42f node::OnFatalError(char const*, char const*) [/usr/local/bin/node]
 4: 0x10009d2d9 node::FatalError(char const*, char const*) [/usr/local/bin/node]
 5: 0x100164e33 node::inspector::Agent::ToggleAsyncHook(v8::Isolate*, v8::Global<v8::Function> const&) [/usr/local/bin/node]
 6: 0x100845d13 v8_inspector::V8Debugger::setAsyncCallStackDepth(v8_inspector::V8DebuggerAgentImpl*, int) [/usr/local/bin/node]
 7: 0x10084d2c3 v8_inspector::V8DebuggerAgentImpl::disable() [/usr/local/bin/node]
 8: 0x1008641f4 v8_inspector::V8InspectorSessionImpl::~V8InspectorSessionImpl() [/usr/local/bin/node]
 9: 0x1008644ae v8_inspector::V8InspectorSessionImpl::~V8InspectorSessionImpl() [/usr/local/bin/node]
10: 0x100165c9b node::inspector::(anonymous namespace)::ChannelImpl::~ChannelImpl() [/usr/local/bin/node]
11: 0x100165d0e node::inspector::(anonymous namespace)::ChannelImpl::~ChannelImpl() [/usr/local/bin/node]
12: 0x1001665ce node::inspector::NodeInspectorClient::disconnectFrontend(int) [/usr/local/bin/node]
13: 0x10016633b node::inspector::(anonymous namespace)::SameThreadInspectorSession::~SameThreadInspectorSession() [/usr/local/bin/node]
14: 0x1001790bc node::inspector::(anonymous namespace)::DeletableWrapper<node::inspector::(anonymous namespace)::MainThreadSessionState>::~DeletableWrapper() [/usr/local/bin/node]
15: 0x10015805a unsigned long std::__1::__hash_table<std::__1::__hash_value_type<int, std::__1::unique_ptr<node::inspector::Deletable, std::__1::default_delete<node::inspector::Deletable> > >, std::__1::__unordered_map_hasher<int, std::__1::__hash_value_type<int, std::__1::unique_ptr<node::inspector::Deletable, std::__1::default_delete<node::inspector::Deletable> > >, std::__1::hash<int>, true>, std::__1::__unordered_map_equal<int, std::__1::__hash_value_type<int, std::__1::unique_ptr<node::inspector::Deletable, std::__1::default_delete<node::inspector::Deletable> > >, std::__1::equal_to<int>, true>, std::__1::allocator<std::__1::__hash_value_type<int, std::__1::unique_ptr<node::inspector::Deletable, std::__1::default_delete<node::inspector::Deletable> > > > >::__erase_unique<int>(int const&) [/usr/local/bin/node]
16: 0x1001792ae node::inspector::(anonymous namespace)::DeleteRequest::Call(node::inspector::MainThreadInterface*) [/usr/local/bin/node]
17: 0x100177f2d node::inspector::MainThreadInterface::DispatchMessages() [/usr/local/bin/node]
Process exited with code null
````


## Involved Files

- Entry File: ./bin/ex
- code files:
  - [ex.js](bin/ex.js)
  - [lib/](lib/)
    - [main.js](lib/main.js)
    - [model/](lib/model/)
      - [model.js](lib/model/model.js)
      - [baseClasses/](lib/model/baseClasses)
        - [classUtils.js](lib/model/baseClasses/classUtils.js)
        - [gameObjectClasses.js](lib/model/baseClasses/gameObjectClasses.js)
        - [worldObjectClasses.js](lib/model/baseClasses/worldObjectClasses.js)
    - [controller/](lib/controller/)
      - [controller.js](lib/controller/controller.js)
      - [addressModule.js](lib/controller/addressModule.js)
      - [scopeModule.js](lib/controller/scopeModule.js)


## ENV

```jsonc
{ // LAUNCHED FROM VSCODE
  "AMD_ENTRYPOINT": "vs/workbench/services/extensions/node/extensionHostProcess",
  "APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL": "true",
  "NODE_INSPECTOR_EXEC_PATH": "/usr/local/bin/node",
  "NODE_INSPECTOR_IPC": "/var/folders/6n/2ntjymqd7qq2v5ttsdfltr000000gn/T/node-cdp.42890-11.sock",
  "NODE_INSPECTOR_PPID": "44927",
  "NODE_INSPECTOR_WAIT_FOR_DEBUGGER": "",
  "NODE_OPTIONS": "--require /var/folders/6n/2ntjymqd7qq2v5ttsdfltr000000gn/T/vscode-js-debug-bootloader.js ",
  "OLDPWD": "/",
  "PATH": "/opt/local/bin:/opt/local/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/VMware Fusion.app/Contents/Public:/usr/local/share/dotnet:~/.dotnet/tools:/Users/kilian/.npm-packages/bin",
  "PIPE_LOGGING": "true",
  "PWD": "/",
  "SHLVL": "0",
  "VERBOSE_LOGGING": "true",
  "VSCODE_DEBUGGER_ONLY_ENTRYPOINT": "false"
  "VSCODE_HANDLES_UNCAUGHT_ERRORS": "true",
  "VSCODE_IPC_HOOK": "/Users/kilian/Library/Application Support/Code - Insiders/1.45.0-insider-main.sock",
  "VSCODE_IPC_HOOK_EXTHOST": "/var/folders/6n/2ntjymqd7qq2v5ttsdfltr000000gn/T/vscode-ipc-ae45da2c-bb22-4968-b670-0b58ef489ded.sock",
  "VSCODE_LOGS": "/Users/kilian/Library/Application Support/Code - Insiders/logs/20200421T012415",
  "VSCODE_LOG_STACK": "true",
  "VSCODE_NLS_CONFIG": "{\"locale\":\"en-gb\",\"availableLanguages\":{},\"_languagePackSupport\":true}",
  "VSCODE_NODE_CACHED_DATA_DIR": "/Users/kilian/Library/Application Support/Code - Insiders/CachedData/ec0d19789f89d4c25895f4a0cf364276cfb0c6ed",
  "VSCODE_PID": "7628",
  "XPC_SERVICE_NAME": "com.microsoft.VSCodeInsiders.11124",
  "_": "/Applications/Visual Studio Code - Insiders.app/Contents/MacOS/Electron",
  /* !!! OVERLAP !!! */
  //"DEBUG": "true",
  //"EDITOR": "micro",
  //"HOME": "/Users/kilian",
  //"LESS": "-R",
  //"LOGNAME": "kilian",
  //"LSCOLORS": "Gxfxcxdxbxegedabagacad",
  //"PAGER": "col -bx |micro",
  //"SHELL": "/bin/zsh",
  //"SSH_AUTH_SOCK": "/private/tmp/com.apple.launchd.cbxsf1XOqp/Listeners",
  //"TMPDIR": "/var/folders/6n/2ntjymqd7qq2v5ttsdfltr000000gn/T/",
  //"USER": "kilian",
  //"VISUAL": "micro",
  //"XPC_FLAGS": "0x0",
  //"ZSH": "/Users/kilian/.oh-my-zsh",
  //"__CF_USER_TEXT_ENCODING": "0x1F5:0x0:0x0",
},
{ // LAUNCHED FROM INTEGRATED TERMINAL
  "COLORTERM": "truecolor",
  "EDITOR": "micro",
  "HOME": "/Users/kilian",
  "LANG": "en_GB.UTF-8",
  "LESS": "-R",
  "LOGNAME": "kilian",
  "LSCOLORS": "Gxfxcxdxbxegedabagacad",
  "OLDPWD": "/Users/kilian/dev/Quest/classbased-objectstructure-poc",
  "PAGER": "col -bx |micro",
  "PATH": "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/VMware Fusion.app/Contents/Public:/usr/local/share/dotnet:~/.dotnet/tools:/opt/local/bin:/opt/local/sbin:/Users/kilian/.npm-packages/bin:/Users/kilian/.npm-packages/bin",
  "PWD": "/Users/kilian/dev/Quest/classbased-objectstructure-poc",
  "SHELL": "/bin/zsh",
  "SHLVL": "2",
  "SSH_AUTH_SOCK": "/private/tmp/com.apple.launchd.cbxsf1XOqp/Listeners",
  "TERM": "xterm-256color",
  "TERM_PROGRAM": "vscode",
  "TERM_PROGRAM_VERSION": "1.45.0-insider",
  "TMPDIR": "/var/folders/6n/2ntjymqd7qq2v5ttsdfltr000000gn/T/",
  "USER": "kilian",
  "VISUAL": "micro",
  "XPC_FLAGS": "0x0",
  "XPC_SERVICE_NAME": "0",
  "ZSH": "/Users/kilian/.oh-my-zsh",
  "__CF_USER_TEXT_ENCODING": "0x1F5:0x0:0x0",
  "DEBUG": "true",
  "_": "/usr/bin/env"
}
```
