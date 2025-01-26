/**
 * This is the core logic for determining the week number according to the ISO-8601 standard
 * The week number can be described by counting the Thursdays
 * 
 * @param {Date} aDate the date to calculate the week number for
 * @returns {number} the week number
 */
function getWeekNumber(aDate) {
  const clonedDate = new Date(aDate.getTime())

  // if day is 0 (Sunday) we make the value 7. Monday is 1, Tue is 2, ..., Sunday is 7.
  const currentDayNumber = clonedDate.getUTCDay() || 7
  // calculate the date of the nearest Thursday
  clonedDate.setUTCDate(clonedDate.getUTCDate() + 4 - currentDayNumber)

  const yearStart = getUTCFirstDateOfTheYear()
  const millisecondsInADay = 86400000

  // calculate full weeks to nearest Thursday (add 1 to account for the current day)
  const weekNo = Math.ceil((((clonedDate - yearStart) / millisecondsInADay) + 1) / 7)

  return weekNo
}

/**
 * Gets the first day of the year, UTC.
 * 
 * @returns {Date} Jan 01 of the current year, UTC
 */
function getUTCFirstDateOfTheYear() {
  const today = new Date()
  return new Date(Date.UTC(today.getUTCFullYear(), 0 /* month, zero based */, 1 /* day of month */))
}

/**
 * Update all nodes in a NodeList with the output of updateFn.
 * 
 * @param {NodeList} nodeList the nodeList that contains all the nodes to update
 * @param {Function} updateFn the function to call to get the text contents to update with
 */
function updateTextContents(nodeList, updateFn) {
  for (let i = 0; i < nodeList.length; i++) {
    nodeList[i].textContent = updateFn && updateFn()
  }
}

/**
 * Report an error to console and the user.
 * 
 * @param {Error} err the error that was thrown
 */
function reportError(err) {
  console.error(err)
  alert && alert('uh oh there was an error in the code (sorry!) or you are probably not running a modern browser:\n\n' + err)
}

/**
 * Calculate the week offset based on the Singapore school system.
 * 
 * See  https://en.wikipedia.org/wiki/Academic_year#:~:text=Term%201%20starts%20the%20day%20immediately%20after%20New%20Year%27s%20Day.%20If%20the%20first%20school%20day%20is%20a%20Thursday%20or%20a%20Friday%2C%20it%20is%20not%20counted%20as%20a%20school%20week.
 */
function calculateWeekOffset() {

  const startOfTheYear = getUTCFirstDateOfTheYear() // 1st Jan
  startOfTheYear.setDate(startOfTheYear.getDate() + 1) // now set to next day 2nd Jan - when school starts
  
  // remember, 0 is Sun, 1 is Mon, and so on
  const day = startOfTheYear.getDay()

  if (day === 4 /* Thurs */ || day === 5 /* Fri */) {
    return 1 // the next week will be counted as the first school week
  } else {
    return 0
  }
}

function numberToEmoji(num) {
  const digitEmojis = [
    "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"
  ];

  return String(num)
    .split("")
    .map(digit => digitEmojis[parseInt(digit, 10)])
    .join("");
}

/**
 * Main function.
 */
function main () {
  const today = new Date()

  const weekOffset = calculateWeekOffset()
  const todayWeekNumber = getWeekNumber(today) - weekOffset
  const isEven = todayWeekNumber % 2 === 0
  const weekNumberNodeList = document.querySelectorAll(".week-number")
  updateTextContents(weekNumberNodeList, () => numberToEmoji(todayWeekNumber))
  
  const allOddOrEvenNodeList = document.querySelectorAll(".odd-or-even")
  updateTextContents(allOddOrEvenNodeList, () => {
    return isEven? "even" : "odd"
  })

  const oeDecoratorNodeList = document.querySelectorAll(".oe-decorator")
  updateTextContents(oeDecoratorNodeList, () => {
    return isEven? "✌" : "☝️"
  })
}

/**
 * Kick off
 */
try {
  main()
} catch (err) {
  reportError(err)
}
