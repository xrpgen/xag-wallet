function hexToAscii(hex) {
    var str = "";
    for (var i = 0; i < hex.length; i += 2) {
        var code = parseInt(hex.substr(i, 2), 16);
        if (code > 0) {
            str += String.fromCharCode(code);
        }
    }
    return str;
}

function asciiToHex(str) {
    var hex = "";
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }
    return (hex + "0000000000000000000000000000000000000000").substring(0, 40).toUpperCase();
}

export function realCode(input) {
    return input && input.length > 3 && input.length <= 20 ? asciiToHex(input) : input;
}

export function fmtCode(input) {
    return input && input.length == 40 ? hexToAscii(input) : input;
}
