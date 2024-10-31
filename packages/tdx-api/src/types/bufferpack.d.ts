declare module "bufferpack" {
  function unpack(format: string, buffer: Buffer | string): (string | number)[];
  function pack(format: string, ...values: any[]): Buffer;

  export { unpack, pack };
}
