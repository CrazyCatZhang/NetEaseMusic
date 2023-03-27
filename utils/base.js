function shiftTimeStamp(time) {
  time /= 1000;
  function f_m_dispose(min, sec) { // 分秒处理函数
    if (min < 10 && sec < 10) {
      return "0" + min + ":" + "0" + sec; // 如果分和秒都小于10，则前面都加入0
    } else if (min < 10 && sec >= 10) {
      return "0" + min + ":" + sec; // 如果分小于10，秒大于10，则给分前面加0
    } else if (min >= 10 && sec < 10) {
      return min + ":" + "0" + sec; // 如果分大于10，秒小于10，则给秒前面加0
    } else {
      return min + ":" + sec; // 如果分秒都大于10，则直接return 
    }
  }
  let hour = Number.parseInt(time / 3600); // 获取总的小时
  let min = Number.parseInt((time - hour * 3600) / 60); // 获取总分钟
  let sec = time - (hour * 3600) - (min * 60); // 减去总 分 后剩余的分秒数
  if (!hour) { // 小时为0时
    return f_m_dispose(min, sec);
  } else { // 小时大于0的处理
    if (!min) { // 分为0时
      // 如果秒也小于10，则返回 例1:00:07
      return sec < 10 ? hour + ":" + "00" + ":0" + sec : hour + ":" + "00" + ":" + sec;
    } else { // 有分钟时的处理
      return hour + ":" + f_m_dispose(min, sec); // 返回总小时加上处理好的分秒数
    }
  }
}

export {
  shiftTimeStamp
}