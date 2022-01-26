export const CheckNumber = (Number) => {
    let decimal = false;
    Number = Number.toString();
    Number = Number.replace(/ |,|บาท|฿/gi, '');
    for (let i = 0; i < Number.length; i++) {
        if (Number[i] === '.') {
            decimal = true;
        }
    }
    if (decimal === false) {
        Number = Number + '.00';
    }
    return Number
}
export const ArabicNumberToText = (numberParams) => {
    let number = CheckNumber(numberParams);
    const NumberArray = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ"];
    const DigitArray = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
    let BahtText = "";
    if (isNaN(number)) {
        return "ข้อมูลนำเข้าไม่ถูกต้อง";
    } else {
        if ((number - 0) > 9999999.9999) {
            return "ข้อมูลนำเข้าเกินขอบเขตที่ตั้งไว้";
        } else {
            number = number.split(".");
            if (number[1].length > 0) {
                number[1] = number[1].substring(0, 2);
            }
            let NumberLen = number[0].length - 0;
            for (let i = 0; i < NumberLen; i++) {
                let tmp = number[0].substring(i, i + 1) - 0;
                if (tmp !== 0) {
                    if ((i === (NumberLen - 1)) && (tmp === 1)) {
                        BahtText += "เอ็ด";
                    } else
                        if ((i === (NumberLen - 2)) && (tmp === 2)) {
                            BahtText += "ยี่";
                        } else
                            if ((i === (NumberLen - 2)) && (tmp === 1)) {
                                BahtText += "";
                            } else {
                                BahtText += NumberArray[tmp];
                            }
                    BahtText += DigitArray[NumberLen - i - 1];
                }
            }
            BahtText += "บาท";
            if ((number[1] === "0") || (number[1] === "00")) {
                BahtText += "ถ้วน";
            } else {
                let DecimalLen = number[1].length - 0;
                for (let i = 0; i < DecimalLen; i++) {
                    let tmp = number[1].substring(i, i + 1) - 0;
                    if (tmp !== 0) {
                        if ((i === (DecimalLen - 1)) && (tmp === 1)) {
                            BahtText += "เอ็ด";
                        } else
                            if ((i === (DecimalLen - 2)) && (tmp === 2)) {
                                BahtText += "ยี่";
                            } else
                                if ((i === (DecimalLen - 2)) && (tmp === 1)) {
                                    BahtText += "";
                                } else {
                                    BahtText += NumberArray[tmp];
                                }
                        BahtText += DigitArray[DecimalLen - i - 1];
                    }
                }
                BahtText += "สตางค์";
            }
            return BahtText;
        }
    }
}

