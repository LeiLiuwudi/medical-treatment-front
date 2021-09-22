/*
包含n个日期时间处理的工具函数模块
*/

// 格式化日期 XXXX-MM-DD-HH-MM-SS
export function formatDateToSecond(time) {
  if (!time) return "";
  let date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return (
    year +
    "-" +
    (month + 1 < 10 ? "0" + (month + 1) : month + 1) +
    "-" +
    (day < 10 ? "0" + day : day) +
    " " +
    (hour < 10 ? "0" + hour : hour) +
    ":" +
    (minute < 10 ? "0" + minute : minute) +
    ":" +
    (second < 10 ? "0" + second : second)
  );
}

//格式化日期：yyyy-MM-dd
export function formatDate(time) {
  var date = new Date(time);
  var myYear = date.getFullYear();
  var myMonth = date.getMonth() + 1;
  var myWeekday = date.getDate();
  if (myMonth < 10) {
    myMonth = "0" + myMonth;
  }
  if (myWeekday < 10) {
    myWeekday = "0" + myWeekday;
  }
  return myYear + "-" + myMonth + "-" + myWeekday;
}

export function getAge(birthday) {
  //出生时间 毫秒
  var birthDayTime = new Date(birthday).getTime();
  //当前时间 毫秒
  var nowTime = new Date().getTime();
  //一年毫秒数(365 * 86400000 = 31536000000)
  return Math.ceil((nowTime - birthDayTime) / 31536000000);
}
