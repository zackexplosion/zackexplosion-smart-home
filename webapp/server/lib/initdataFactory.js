module.exports = function(_) {
  const time = _.timestamp
  if (_.humidity !== 0) {
    return [time, _.temperature, _.humidity]
  } else {
    return [time, _.temperature, _.co2ppm]
  }
}
