// data.json 파일의 데이터를 가져오기
fetch('http://192.168.180.9:8080/data/pagedata.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // JSON 형식으로 변환
  })
  .then(datas => {
    console.log('Fetched data:', datas);
    // 데이터 사용 예시
    datas.forEach(data => {
      console.log(`User ID: ${data.orderDate}, Name: ${data.spec}`);
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  