
// async function fetchData() {
//     try{
//         const response = await fetch('http://192.168.180.9:8080/data/mokup.json');
//         let list = await response.json();

//         list.forEach(data => {
//             console.log(`User ID: ${data.id}, PW: ${data.pw}`);
//         });

//     }catch(error){
//         console.log(error);
//     }
// }
// fetchData();

async function returnData(data) {
    try{
        const response = await fetch(`http://192.168.180.9:8080/data/mokup/${data}`, {
            method: "DELETE"
        });

        if(response.ok){
            console.log(data,'삭제 성공')
        }else{
            console.log(data,'삭제 실패')
        }

    }catch(error){
        console.log("2", error)
    }
}
returnData("00000");
