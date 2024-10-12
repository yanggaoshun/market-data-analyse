import fs from "fs";
import bufferPack from "bufferpack";
import { TdxFileNotFoundException } from "../errors";

export default abstract class BaseReader<Record> {
  protected format = "<IIIIIfII";
  protected records: Record[] = [];

  protected unpackRecordsBy32(data: Buffer) {
    const result = [];
    for (let offset = 0; offset < data.length; offset += 32) {
      const r = bufferPack.unpack(this.format, data.subarray(offset, offset + 32));
      result.push(r);
    }
    return result;
  }

  protected read(filename: string) {
    const content = fs.readFileSync(filename);
    if (!content) {
      throw new TdxFileNotFoundException(
        `no tdx day data, please check path ${filename}`
      );
    }
    const rawList = this.unpackRecordsBy32(content);
    return rawList.map(this.parseRecord.bind(this));
  }

  protected abstract parseRecord(record: number[]): Record;

  getRecords() {
    return this.records;
  }
}
