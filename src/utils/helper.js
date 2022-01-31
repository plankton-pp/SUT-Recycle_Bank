import moment from "moment";
// import CryptoJS from "crypto-js";
/**************** Date Time Config ****************/
export const monthsFull = {
  th: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};
const monthsShort = {
  th: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};
// const weekdaysFull = {
//   th: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
//   en: [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ],
// };
// const weekdaysShort = {
//   th: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
//   en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
// };


export const getDate = (date) => {
  let dd = (moment(date).get("date") < 10 ? "0" : "") + moment(date).get("date");
  let MM = (moment(date).get("month") + 1 < 10 ? "0" : "") + (moment(date).get("month") + 1);
  let yyyy = moment(date).get("year");
  return yyyy + "-" + MM + "-" + dd;
};
export const getDateFormat = (date) => {
  let dd = (moment(date).get("date") < 10 ? "0" : "") + moment(date).get("date");
  let MM = (moment(date).get("month") + 1 < 10 ? "0" : "") + (moment(date).get("month") + 1);
  let yyyy = moment(date).get("year");
  return dd + "/" + MM + "/" + yyyy;
};

export const getDateFormatTH = (date) => {
  let dd = (moment(date).get("date") < 10 ? "0" : "") + moment(date).get("date");
  let MM = (moment(date).get("month") + 1 < 10 ? "0" : "") + (moment(date).get("month") + 1);
  let yyyy = moment(date).get("year")+543;
  return dd + "/" + MM + "/" + yyyy;
};

export const getDateFormat2 = (date) => {
  let dateTime = new Date(Date.UTC(date));

  return new Intl.DateTimeFormat('en-TH', { dateStyle: 'full', timeStyle: 'long' }).format(dateTime);
};
export const setDatePickerFormat = (date) => {
  let dd = moment(date).get("date");
  let MM = moment(date).get("month");
  let yyyy = moment(date).get("year");
  return yyyy + "," + MM + "," + dd;
};

export const checkEmailFormat = (email) => {
  let emailPattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(email);
};
export const momentDayMonth = (datetime, lang = "en", type = "month") => {
  if (datetime !== null) {
    let year;
    if (lang === "en") {
      year = parseInt(moment(datetime).format("YYYY"));
    } else {
      year = parseInt(moment(datetime).format("YYYY")) + 543;
    }
    let dd = moment(datetime).get("date");
    let month =
      (moment(datetime).get("month") + 1 < 10 ? "0" : "") +
      (moment(datetime).get("month") + 1);
    if (type === "month") {
      return month + "." + year;
    } else {
      return dd;
    }
  } else {
    return "-";
  }
};
export const momentDate = (datetime, lang = "en", type = "short") => {
  if (datetime !== null) {
    let year;
    if (lang === "en") {
      year = Number(moment(datetime).format("YYYY"));
    } else {
      year = Number(moment(datetime).format("YYYY")) + 543;
    }
    let dd = moment(datetime).get("date");
    let month;
    if (type === "short") {
      month = monthsShort[lang][moment(datetime).get("month")];
    } else {
      month = monthsFull[lang][moment(datetime).get("month")];
    }
    return dd + " " + month + " " + year;
  } else {
    return "-";
  }
};

export const momentDateTh = (datetime, lang = "th", type = "short") => {
  if (datetime !== null) {
    let year;
    if (lang === "th") {
      year = Number(moment(datetime).format("YY")) + 43;
    } else {
      year = Number(moment(datetime).format("YY"));
    }
    let dd = moment(datetime).get("date");
    let month;
    if (type === "short") {
      month = monthsShort[lang][moment(datetime).get("month")];
    } else {
      month = monthsFull[lang][moment(datetime).get("month")];
    }
    return dd + " " + month + " " + year;
  } else {
    return "-";
  }
};

export const getTodayTh = (style = 'full') => {
  let time = new Date().getTime();
  return momentDateTh(time, 'th', style)
}

export const fullDateTh = (datetime, lang = "th", type = "long") => {
  if (datetime !== null) {
    let year;
    if (lang === "th") {
      year = Number(moment(datetime).format("YYYY")) + 543;
    } else {
      year = Number(moment(datetime).format("YYYY"));
    }
    let dd = moment(datetime).get("date");
    let month;
    if (type === "long") {
      month = monthsFull[lang][moment(datetime).get("month")];
    } else {
      month = monthsShort[lang][moment(datetime).get("month")];
    }
    return dd + " " + month + " " + year;
  } else {
    return "-";
  }
};

export const momentTime = (time, lang = "en") => {
  let datetime = moment().format("YYYY-MM-DD " + time);
  return moment(datetime).format(`HH:mm ${lang === "en" ? "" : "[น.]"}`);
};
export const getTime = (time, lang = "en") => {
  return moment(time).format(`HH:mm:ss ${lang === "en" ? "" : "[น.]"}`);
};
export const momentDateTime = (datetime, lang = "en", type = "short", setTime = false) => {
  let year;
  if (lang === "en") {
    year = Number(moment(datetime).format("YYYY"));
  } else {
    year = Number(moment(datetime).format("YYYY")) + 543;
  }
  let date = moment(datetime).get("date");
  let month;
  if (type === "short") {
    month = monthsShort[lang][moment(datetime).get("month")];
  } else {
    month = monthsFull[lang][moment(datetime).get("month")];
  }
  let time = setTime ? moment(datetime).format(`HH:mm ${lang === "en" ? "" : "[น.]"}`) : "";

  return date + " " + month + " " + year + " " + time;
};
// export const momentTime = (datetime, lang = "en") => {

//   let time = moment(datetime).format(`HH:mm ${lang === "en" ? "" : "[น.]"}`);

//   return time;
// };
export const nextZeroPadLeft = (num, width, sign) => {
  num = num + "";
  width = width || 6;
  sign = sign || "0";
  return num.length >= width
    ? num
    : new Array(width - num.length + 1).join(sign) + num;
};

export const totalPageCalc = (array, page_size) => {
  return Math.ceil(array.length / page_size);
};
export const pageData = (array, page_number, page_size) => {
  --page_number;
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
};
export const rowNumber = (indx, page_number, page_size) => {
  return indx + 1 + (page_number - 1) * page_size;
};
export const pageControl = (page_number, total_pages) => {
  let page;
  if (page_number < 1) {
    page = 1;
  } else if (page_number > total_pages) {
    page = total_pages;
  } else {
    page = page_number;
  }
  return page;
};
export const isEvenRow = (value) => {
  return value % 2 === 0 ? "even" : "odd";
};
export const pagination = (current, last, delta = 2) => {
  let left = current + 1 - delta,
    right = current + delta + 1,
    range = [];

  if (right > last) {
    right = last;
    left = last - delta * 2;
    left = left < 1 ? 1 : left;
  }

  if (left <= 1) {
    left = 1;
    right = Math.min(delta * 2 + 1, last);
  }

  if (left <= 3) {
    for (let i = 1; i < left; i++) {
      range.push(i);
    }
  } else {
    range.push(1);
    range.push("n");
  }

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right >= last - 2) {
    for (let i = right + 1; i <= last; i++) {
      range.push(i);
    }
  } else {
    range.push("n");
    range.push(last);
  }

  return range;
};

/********** End of Pagination Calculation ****************/
/********************* format price ***********************/
export const formatNumber = (price) => {
  return new Intl.NumberFormat("en").format(price);
};
/**************** Local Storage *******************/
export const storageSave = (name, items) => {
  localStorage.setItem(name, JSON.stringify(items));
};
export const storageGet = (name) => {
  return localStorage.getItem(name);
};
export const storageRemove = (name) => {
  localStorage.removeItem(name);
};

/**************** Local Storage *******************/
export const sessionSave = (key, items) => {
  sessionStorage.setItem(key, JSON.stringify(items));
};
export const sessionGet = (key) => {
  return sessionStorage.getItem(key);
};
export const sessionRemove = (key) => {
  sessionStorage.removeItem(key);
};

/**************** Cookie Save *******************/
export const setCookie = (cname, cvalue, hours = 1, domain = null) => {
  if (hours === null) {
    document.cookie = `${cname}=${cvalue};  ${domain ? "domain=" + domain + ";" : ""} path=/`;
  } else if (hours < 0) {
    document.cookie = `${cname}=${cvalue};  ${domain ? "domain=" + domain + ";" : ""} expires=${new Date(0)}; path=/`;
  } else {
    let now = new Date();
    now.setTime(now.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${cname}=${cvalue}; ${domain ? "domain=" + domain + ";" : ""} expires=${now.toUTCString()};  path=/`;
  }
};
export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
/*************************************************/
/**************** Set Time Format *******************/
export const setSQLTimeFormat = (time) => {
  return moment(time).format("YYYY-MM-DD HH:mm:ss");
};
export const base64toBlob = (base64Data, contentType) => {
  contentType = contentType || "";
  var sliceSize = 1024;
  var byteCharacters = atob(base64Data);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
};
export const setBase64ToFile = async (fileBase64) => {
  const file_Ext = [
    { type: "image/png", name: "png", ext: ".png" },
    { type: "image/jpeg", name: "jpeg", ext: ".jpg" }
  ]
  const block = await fileBase64.split(";");
  const contentType = await block[0].split(":")[1];
  const realData = await block[1].split(",")[1];
  const fileType = file_Ext.find(item => {
    return item.type === contentType;
  })
  let ext = ".jpg";
  if (fileType) {
    ext = fileType.ext;
  }
  // const blob = await this.base64toBlob(realData, contentType);

  let getFile;
  const timeStamp = await moment().format("DD_MM_YYYY_HH_mm");
  await (fetch(fileBase64)
    .then(function (res) { return res.arrayBuffer(); })
    .then(function (buf) { return new File([buf], timeStamp + ext, { type: contentType }); })
  ).then(function (file) {
    getFile = file;
    // return file
  });
  return getFile;
};
// export const renderCategory = (data) => {
//   let str = "";
//   if (data) {
//     data.map((item, index) => {
//       str += item.name;
//       if (index !== data.length - 1) str += ", ";
//     });
//   }
//   return str;
// };

// export const encryptData = (data, obj = false) => {
//   if (obj) {
//     return CryptoJS.AES.encrypt(
//       JSON.stringify(data),
//       process.env.NEXT_PUBLIC_SECRET_KEY
//     ).toString();
//   } else {
//     return CryptoJS.AES.encrypt(
//       data,
//       process.env.NEXT_PUBLIC_SECRET_KEY
//     ).toString();
//   }
// };
// export const decryptData = (ciphertext, obj = false) => {
//   let bytes = CryptoJS.AES.decrypt(
//     ciphertext.toString(),
//     process.env.NEXT_PUBLIC_SECRET_KEY
//   );
//   if (obj) {
//     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//   } else {
//     return bytes.toString(CryptoJS.enc.Utf8);
//   }
// };
export const chkDigitPid = (pid) => {
  let total = 0;
  let iPID = pid;
  let chk;
  let Validchk;
  Validchk = iPID.substr(12, 1);
  let j = 0;
  let pidcut;
  for (let n = 0; n < 12; n++) {
    pidcut = parseInt(iPID.substr(j, 1));
    total = total + pidcut * (13 - n);
    j++;
  }
  chk = 11 - Math.ceil(total % 11);
  if (chk === 10) {
    chk = 0;
  } else if (chk === 11) {
    chk = 1;
  }
  if (chk === Validchk) {
    return true;
  } else {
    return false;
  }
};
/*************************************************/
export const getTimeHAndM = (time, lang = "en") => {
  return moment(time).format(`HH:mm ${lang === "en" ? "" : "[น.]"}`);
};

export const getTimeAll = (time, lang = "en") => {
  return moment(time).format(`HH:mm:ss ${lang === "en" ? "" : "[น.]"}`);
};

/*************************************************/
export const getRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;

  // return Array(length)
  //   .join()
  //   .split(",")
  //   .map(function () {
  //     return characters.charAt(Math.floor(Math.random() * characters.length));
  //   })
  //   .join("");
};