export function bufferToBytes(buf: Buffer) {
  const bytes = [];
  for(var i= 0; i< buf.length; i++){
    const byteInt = buf[i];
    bytes.push(byteInt);
  }
  return bytes;
}

export function bytesToBuffer(bytes: WithImplicitCoercion<Uint8Array | readonly number[] | string>) {
  return Buffer.from(bytes);
}
