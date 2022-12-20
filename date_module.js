module.exports.getDate = function(){
  const format = { weekday: 'long', day: 'numeric', month: 'long'}
  const date = new Date()
  const formatted_date = date.toLocaleDateString("en-Us", format)
  return formatted_date
};

exports.getDay = function(){
  const format = { weekday: 'long'}
  const day = new Date()
  const formatted_day = date.toLocaleDateString("en-Us", format)
  return formatted_day
};
