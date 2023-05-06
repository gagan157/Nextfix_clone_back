const adddate = (usermonth=0,useryear=0) =>{
    const currentDate = new Date
    const date = currentDate.getDate()
    const month = currentDate.getMonth()
    const year = currentDate.getFullYear()
    const fulldate = new Date(year,month,date)  
    fulldate.setMonth(fulldate.getMonth()+usermonth)
    fulldate.setFullYear(fulldate.getFullYear()+useryear)
    const todaytDate = currentDate.toDateString()
    const updateDate = fulldate.toDateString()
    const objdate = {nowDate:todaytDate,nextDate:updateDate}
    return objdate
}

module.exports = adddate