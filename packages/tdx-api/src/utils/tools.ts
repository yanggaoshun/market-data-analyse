import { EMarketType } from "../types/enum";
import bufferpack from "bufferpack";

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getVolume(iVol: number) {
  const logPoint = iVol >> (8 * 3);
  // const hheax = iVol >> (8 * 3);  // [3]
  const hleax = (iVol >> (8 * 2)) & 0xff; // [2]
  const lheax = (iVol >> 8) & 0xff; // [1]
  const lleax = iVol & 0xff; // [0]

  // const dbl1 = 1.0
  // const dbl1 = 2.0
  // const dbl128 = 128.0

  const dwEcx = logPoint * 2 - 0x7f;
  const dwEdx = logPoint * 2 - 0x86;
  const dwEsi = logPoint * 2 - 0x8e;
  const dwEax = logPoint * 2 - 0x96;
  let tmpEax;
  if (dwEcx < 0) tmpEax = -dwEcx;
  else tmpEax = dwEcx;

  let dblXmm6 = Math.pow(2.0, tmpEax);
  if (dwEcx < 0) dblXmm6 = 1.0 / dblXmm6;

  let dblXmm0,
    dblXmm4 = 0;
  if (hleax > 0x80) {
    // const tmpdblXmm1 = 0.0
    const dwtmpeax = dwEdx + 1;
    const tmpdblXmm3 = Math.pow(2.0, dwtmpeax);
    dblXmm0 = Math.pow(2.0, dwEdx) * 128.0;
    dblXmm0 += (hleax & 0x7f) * tmpdblXmm3;
    dblXmm4 = dblXmm0;
  } else {
    dblXmm0 = 0.0;
    if (dwEdx >= 0) {
      dblXmm0 = Math.pow(2.0, dwEdx) * hleax;
    } else {
      dblXmm0 = (1 / Math.pow(2.0, dwEdx)) * hleax;
    }
    dblXmm4 = dblXmm0;
  }

  let dblXmm3 = Math.pow(2.0, dwEsi) * lheax;
  let dblXmm1 = Math.pow(2.0, dwEax) * lleax;
  if (hleax & 0x80) {
    dblXmm3 *= 2.0;
    dblXmm1 *= 2.0;
  }

  return dblXmm6 + dblXmm4 + dblXmm3 + dblXmm1;
}

export function parsePrice(price: number | string, precision = 4) {
  return typeof price === "number" ? +price.toFixed(precision) : price;
}

/**
 * 从symbol解析标的代码、市场代码、子类别等信息
 * @param {String} symbol code.${marketCode}.${subType}
 * marketCode 可选值:
 * SH: 上证
 * SZ: 深证
 *
 * subType 可选值: (空值表示非指数)
 * 暂无
 */
export function parseSymbol(symbol: string): any {
  const arr = /^(\w+)\.(\w+)(?:\.(\w+))?$/.exec(symbol);
  const data: any = {};

  if (arr) {
    data.marketCode = arr[1];
    data.code = arr[2].toUpperCase(); // 通达信扩展行情的期货合约品种字母必须全部为大写, 比如rb2105必须转换为RB2105

    if (arr[3]) {
      data.subType = arr[3];
    }

    if (
      EMarketType[data.code] === data.marketCode ||
      /^880\d{3}$/.test(data.code)
    ) {
      // 板块指数以880开头
      data.isIndex = true;
    }

    data.marketId = EMarketType[data.marketCode];
  }

  return data;
}

export function getPrice(data: Buffer, pos: number) {
  let posByte = 6;
  let bData = data[pos];
  let intData = bData & 0x3f;
  let sign;

  if (bData & 0x40) sign = true;
  else sign = false;

  if (bData & 0x80) {
    while (true) {
      pos += 1;
      bData = data[pos];
      intData += (bData & 0x7f) << posByte;
      posByte += 7;

      if (!(bData & 0x80)) break;
    }
  }

  pos += 1;

  if (sign) intData = -intData;

  return [intData, pos];
}

export function findCSA(arr: Buffer, subArr: number[], fromIndex: number) {
  var i = fromIndex >>> 0,
    sl = subArr.length,
    l = arr.length + 1 - sl;

  loop: for (; i < l; i++) {
    for (var j = 0; j < sl; j++) {
      if (arr[i + j] !== subArr[j]) {
        continue loop;
      }
    }
    return i;
  }
  return -1;
}
export function getTime(buffer: Buffer, pos: number) {
  const [minutes] = bufferpack.unpack(
    "<H",
    buffer.slice(pos, pos + 2),
  ) as number[];
  const hour = (minutes / 60) | 0;
  const minute = minutes % 60;
  pos += 2;

  return [hour, minute, pos];
}

export function padStart(str: string | number, count: number, fillStr = "0") {
  if (typeof str === "number") {
    str = "" + str;
  }
  if (str.length < count) {
    return str.padStart(count, fillStr);
  } else {
    return str;
  }
}

export function getDateTime(category: number, buffer: Buffer, pos: number) {
  let year = 0,
    month = 0,
    day = 0,
    hour = 15,
    minute = 0;

  if (category < 4 || category === 7 || category === 8) {
    const [zippy, minutes] = bufferpack.unpack(
      "<HH",
      buffer.subarray(pos, pos + 4),
    ) as number[];
    year = (zippy >> 11) + 2004;
    month = ((zippy % 2048) / 100) | 0;
    day = (zippy % 2048) % 100;

    hour = (minutes / 60) | 0;
    minute = minutes % 60;
  } else {
    const [zippy] = bufferpack.unpack(
      "<I",
      buffer.slice(pos, pos + 4),
    ) as number[];

    year = (zippy / 10000) | 0;
    month = ((zippy % 10000) / 100) | 0;
    day = zippy % 100;
  }

  pos += 4;

  return [year, month, day, hour, minute, pos];
}

export function formatDateTime(...args: any[]) {
  let fmt = args.pop();
  let date;
  if (args.length === 1) {
    const firstArg = args[0];
    if (typeof firstArg === "string") {
      date = new Date(firstArg);
    } else if (Object.prototype.toString.call(firstArg) === "[object Date]") {
      date = firstArg;
    }
  } else {
    if (args[1]) {
      // 月份
      args[1] -= 1;
    }
    date = new Date(...(args as []));
  }

  const o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S+": date.getMilliseconds(), //毫秒
  } as any;
  if (/(y+)/i.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length),
    );
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")", "i").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(-RegExp.$1.length),
      );
    }
  }

  return fmt;
}

export function calcStartTimestamp(startDateTime: string) {
  if (startDateTime && /^\d{4}-\d{2}-\d{2}$/.test(startDateTime)) {
    // 开始时间只有日期没有时间, 在后面加上' 00:00'
    startDateTime += " 00:00";
  }

  return new Date(startDateTime).getTime();
}

export function calcEndTimestamp(endDatetime: string) {
  if (endDatetime && /^\d{4}-\d{2}-\d{2}$/.test(endDatetime)) {
    // 结束时间只有日期没有时间, 在后面加上' 15:00'
    endDatetime += " 15:00";
  }

  return endDatetime ? new Date(endDatetime).getTime() : Date.now() + 3600000; // 1000 * 60 * 60, 多加个一小时的时间戳, 保证始终能查到最新的数据
}
