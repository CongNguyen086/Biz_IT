const geo = require('geolib')
// import { getCenter, getCenterOfBounds } from 'geolib'

exports.getCenterPoint = (location) => {
    return (geo.getCenterOfBounds(location))
}