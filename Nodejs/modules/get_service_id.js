const fs = require('fs')

const serviceId = (Id) => {
    let jsonString = fs.readFileSync('../json/recommendation.json');
    let jsonData = JSON.parse(jsonString);
    let serviceData = [];

    jsonData.forEach(element => {
        if (element.user_id == Id) {
            serviceData.push({ 
                userId: Id,
                serviceId: element.service_id,
                point: element.rank
            });
        }
    })
    console.log(serviceData);
    return serviceData;
}

serviceId(9223308265286104986);