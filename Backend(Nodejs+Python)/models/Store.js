const geolib = require('geolib')
// const Builder = require('./DB')
import { builder }  from './DB'

const getAllStores = async () => {
    try {
        let allStore = await builder.select('s.*' ,'m.serviceId', 'm.icon', 'c.categoryId','c.categoryName', 'p.description')
                            .from('merchants AS m')
                            .join('categories AS c', 'm.categoryId', 'c.categoryId')
                            .join('stores AS s', 's.serviceId', 'm.serviceId')
                            .leftJoin('promotions AS p', 'p.serviceId', 's.serviceId')
        // let allStore = await builder.select().table('stores')
        return allStore
    } catch (error) {
        return null
    }
}

const getStoresInRange = async (middleLat, middleLng, radius) => {
    let storeInRangeList = []
    try {
        let allStores = await getAllStores()
        if (allStores != null) {
            allStores.forEach(element => {
                let storeCoords = { latitude: element.latitude, longitude: element.longitude }
                let middleCoords = { latitude: middleLat, longitude: middleLng }
                let isInRange = geolib.isPointWithinRadius(storeCoords, middleCoords, radius)
                if (isInRange) {
                    storeInRangeList.push(element)
                }
            });
        }
        console.log(storeInRangeList)
        return storeInRangeList
    } catch (error) {
        console.log('Error: \n', err)
        return null
    }
}

exports.getStoresInRange = getStoresInRange