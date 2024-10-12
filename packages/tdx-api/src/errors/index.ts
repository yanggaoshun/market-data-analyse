export class SocketClientNotReady extends Error {} // { constructor(...args) { super(...args) } }
export class SendPkgNotReady extends Error {}
export class SendRequestPkgFails extends Error {}
export class ResponseHeaderRecvFails extends Error {}
export class ResponseRecvFails extends Error {}
export class MethodNotImplemented extends Error {}

export class TdxFileNotFoundException extends Error {}
export class TdxNotAssignVipdocPathException extends Error {}