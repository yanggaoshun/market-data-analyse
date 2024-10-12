declare module "bufferpack" {
  function unpack(format: string, buffer: Buffer): number[];
  function pack(format: string, ...values: any[]): Buffer;

  export { unpack, pack };
}
