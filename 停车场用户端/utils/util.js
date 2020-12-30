const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getDate(istime){
  var date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if(!istime)return [year, month, day].map(formatNumber).join('-');
  else return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getDay(year_,month_){
  var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  if(year_%4==0&&month_==2)return 29;
  else return monthDays[month_-1];
}

function addDate(startDate_,month_){
  var startDate=new Date(startDate_);
  var year,month,day;
  year = startDate.getFullYear();
  month = startDate.getMonth() + 1 + month_;
  day = startDate.getDate();
  if(month>12){
    year++;
    month=month-12;
  }
  if(day>getDay(year,month)){
    day=day-getDay(year,month);
    month++;
  }
  return [year, month, day].map(formatNumber).join('-');
}

module.exports = {
  getDate: getDate,
  addDate: addDate
}
