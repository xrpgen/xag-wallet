export default function(vaule, length) {
  if (!vaule || vaule === "") {
    return vaule;
  }
  if (!length) {
    length = 8;
  }

  if (vaule.length <= 10) {
    return vaule;
  }
  return vaule.slice(0, length) + "..." + vaule.slice(-length);
}
