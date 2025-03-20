/*
// 샘플 데이터
const sampleObj = {
    "orderDate": "2024-12-02",
    "type": "일반",
    "company": "동신",
    "business": "서울사업장",
    "orderCode": "P110321859452684",
    "productCode": "1160521",
    "productName": "캐스터(고정)",
    "remarks": "비고 내용",
    "orderStatus": "접수중",
    "spec": "K-100(600CC)",
    "unit": "EA",
    "quantity": "100",
    "unitPrice": "5000",
    "orderAmount": "500000"
}
const rowData = []
for (let i = 0; i < 50; i++) {
    rowData.push({ ...sampleObj })
}
console.log(rowData)

// 확인을 위해 인덱스 변경
rowData[11].business = "11번인덱스입니다.";
rowData[21].business = "21번인덱스입니다.";
rowData[0].orderCode = "111111111111";
rowData[1].orderCode = "222222222222";
rowData[2].orderCode = "333333333333";
rowData[3].orderCode = "44444444444";
rowData[4].orderCode = "555555555555555";
rowData[5].orderCode = "6666666666666";
rowData[6].orderCode = "777777777777777";
rowData[7].orderCode = "8888888888888";
rowData[8].orderCode = "999999999999";
rowData[9].orderCode = "100000000000";
*/


// 순서대로 정리
let rowsPerPage = 10; // 페이지당 보여줄 개수
let currentPage = 1; // 현재 페이지

// 페이지 데이터 가져오기
async function fetchOrderData(){
    try{
        const rowData = await fetch('http://192.168.180.9:8080/data/pagedata.json');
        if(!rowData.ok) throw new Error(rowData, "not ok");
        return rowData.json();

    }catch(error){
        console.log("패치에 실패하였습니다.", error)
    }
}

// 페이지 업데이트
async function updatePagination() {
    try {
        const data = await fetchOrderData();
        const totalPages = Math.ceil(data.length / rowsPerPage);

        // 좌,우 버튼 및 페이지 번호
        const pageNumber = document.querySelector("#page-number");
        const totalPagesElement = document.querySelector("#total-pages");
        const prevButton = document.querySelector("#prev-page");
        const nextButton = document.querySelector("#next-page");

        pageNumber.textContent = currentPage;
        totalPagesElement.textContent = totalPages;

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        await loadTableData(currentPage);

        // 이벤트 리스너는 한 번만 설정하도록 수정
        prevButton.removeEventListener("click", handlePrevClick);
        nextButton.removeEventListener("click", handleNextClick);

        prevButton.addEventListener("click", handlePrevClick);
        nextButton.addEventListener("click", handleNextClick);

        function handlePrevClick() {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        }
    
        function handleNextClick() {
            currentPage++;
            updatePagination();
        }

        labelUpdate();
        
    } catch (error) {
        console.error("페이지네이션 업데이트 중 오류 발생:", error);
    }
}

// 데이터 로드 함수
async function loadTableData(page) {
    const tbody = document.querySelector("#order-body");
    tbody.innerHTML = "";

    try {
        const data = await fetchOrderData();
        let dataLength = data.length;
        for (let i = 0; i < data.length; i++) {
            data[i].noticeNumber = dataLength;
            dataLength--;
        }
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = data.slice(startIndex, endIndex);
        
        pageData.forEach((dataItem) => {
            const newItem = document.querySelector(".item-row-template").content.cloneNode(true);

            // 데이터를 객체 형태로 매핑
            const dataMap = {
                "lab-date": dataItem.date,
                "lab-order-date": dataItem.orderDate,
                "lab-delivery-request-date": dataItem.deliveryRequestDate,
                "lab-delivery-available-date": dataItem.deliveryAvailableDate || dataItem.deliveryRequestDate,
                "lab-delivery-due-date": dataItem.deliveryDueDate,
                "lab-delivery-dispatch-date": dataItem.deliveryDispatchDate,
                "lab-delay-reason": dataItem.delayReason,
                "lab-type": dataItem.type,
                "lab-company": dataItem.company,
                "lab-business": dataItem.business,
                "lab-order-code": dataItem.orderCode,
                "lab-product-code": dataItem.productCode,
                "lab-product-name": dataItem.productName,
                "lab-remarks": dataItem.remarks,
                "lab-order-status": dataItem.orderStatus,
                "lab-spec": dataItem.spec,
                "lab-unit": dataItem.unit,
                "lab-quantity": this.numberToCurrency(dataItem.quantity),
                "lab-unit-price": this.numberToCurrency(dataItem.unitPrice),
                "lab-order-amount": this.numberToCurrency(dataItem.orderAmount),
                "lab-code": dataItem.code,
                "lab-invoice-number": dataItem.invoiceNumber,
                "lab-brand": dataItem.brand,
                "lab-item": dataItem.item,
                "lab-supply": this.numberToCurrency(dataItem.supply),
                "lab-vat": this.numberToCurrency(dataItem.vat),
                "lab-tax": this.numberToCurrency(dataItem.tax),
                "lab-bank": dataItem.bank,
                "lab-amount": this.numberToCurrency(dataItem.amount),
                "lab-deposit": this.numberToCurrency(dataItem.deposit),
                "lab-cumulative": this.numberToCurrency(dataItem.cumulative),
                "lab-payment-type": dataItem.paymentType,
                "lab-payment-date": dataItem.paymentDate,
                "lab-account-number": dataItem.accountNumber,
                "lab-account-holder": dataItem.accountHolder,
                "lab-total-amount": addComma(Number(dataItem.supplyAmount) + Number(dataItem.vat)),
                "lab-currency-unit": dataItem.currencyUnit,
                "lab-exchange-rate": dataItem.exchangeRate,
                "lab-foreign-amount": dataItem.foreignAmount,
                "lab-total-quantity": this.numberToCurrency(dataItem.totalQuantity),
                "lab-supply-amount": this.numberToCurrency(dataItem.supplyAmount),
                "lab-manager": dataItem.manager,
                "lab-notice-number": dataItem.noticeNumber,
                "lab-notice-type": dataItem.noticeType,
                "lab-notice-title": dataItem.noticeTitle,
                "lab-notice-writer": dataItem.noticeWriter,
                "lab-notice-date": dataItem.noticeDate,
            };

            Object.keys(dataMap).forEach(key => {
                const element = newItem.querySelector(`.${key}`);
                if (element) {
                    element.innerHTML = dataMap[key];
                }
            });

            tbody.appendChild(newItem);

        })
        const tableSet = document.querySelectorAll("tbody .order-check");
        let count = 1;
        if (tableSet) {
            tableSet.forEach((td) => {
                const countNum = `count-${count}`;
                const name = td.parentElement.querySelector(".order-code").innerText;
                td.querySelector("input").setAttribute("id", countNum);
                td.querySelector("input").setAttribute("name", name)
                td.querySelector("label").setAttribute("for", countNum);
                count++;
            })
        }

        const tableWrap = document.querySelector(".table_wrap");
        const table = document.querySelector("table")
        
            if (table.offsetWidth < tableWrap.offsetWidth) {
                table.style.width = "100%";
            }

    } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        //handleException(error);
    }
}