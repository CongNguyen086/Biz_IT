// let today = new Date().valueOf();
// let current_time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
// console.log(today);

check = async () => {
    setTimeout(() => {
        let today = new Date().valueOf();
        console.log(today);
    }, 1000);
    setTimeout(() => {
        let today = new Date().valueOf();
        console.log(today);
    }, 2000);
}

console.log(1000 * 60);