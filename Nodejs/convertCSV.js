const fs = require('fs'); 
const csv = require('csv-parser');

fs.createReadStream('./python/output.csv')
.pipe(csv())
.on('data', function(data){
    var json = JSON.stringify(data);
    try {
        fs.appendFileSync('./json/recommendation.json', json + ',\n', 'utf8', function(error) {
            if(error) {
                return console.log(error);
            }
            console.log("JSON file has been saved");
        });
    }
    catch(error) {
        console.log(error)
    }
})
.on('end',function(){
    //some final operation
}); 