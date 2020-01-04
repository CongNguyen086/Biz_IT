const geo = require('geolib')

exports.getCenterPoint = (location) => {
    return (geo.getCenterOfBounds(location))
}