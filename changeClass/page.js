// 넣고싶은 데이터와 보여주고싶은 페이지 갯수
function pageSet(getData, setPageNum = 10) {
    // 페이지네이션 처리 함수 개선
    let currentPage = 1;
    const rowsPerPage = setPageNum;

    async function updatePagination() {
        try {
            const totalPages = await getTotalPages();
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
            labelUpdate();
            
        } catch (error) {
            console.error("페이지네이션 업데이트 중 오류 발생:", error);
        }
    }

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

    // 데이터 로드 함수
    async function loadTableData(page) {
        const tbody = document.querySelector("#order-body");
        tbody.innerHTML = "";

        try {
            const data = await fetchOrderData();
            // 확인을 위한 인덱스 변경
            data[11].business = "11번인덱스입니다.";
            data[21].business = "21번인덱스입니다.";
            data[0].orderCode = "111111111111";
            data[1].orderCode = "222222222222";
            data[2].orderCode = "333333333333";
            data[3].orderCode = "44444444444";
            data[4].orderCode = "555555555555555";
            data[5].orderCode = "6666666666666";
            data[6].orderCode = "777777777777777";
            data[7].orderCode = "8888888888888";
            data[8].orderCode = "999999999999";
            data[9].orderCode = "100000000000";
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
                    "lab-quantity": numberToCurrency(dataItem.quantity),
                    "lab-unit-price": numberToCurrency(dataItem.unitPrice),
                    "lab-order-amount": numberToCurrency(dataItem.orderAmount),
                    "lab-code": dataItem.code,
                    "lab-invoice-number": dataItem.invoiceNumber,
                    "lab-brand": dataItem.brand,
                    "lab-item": dataItem.item,
                    "lab-supply": numberToCurrency(dataItem.supply),
                    "lab-vat": numberToCurrency(dataItem.vat),
                    "lab-tax": numberToCurrency(dataItem.tax),
                    "lab-bank": dataItem.bank,
                    "lab-amount": numberToCurrency(dataItem.amount),
                    "lab-deposit": numberToCurrency(dataItem.deposit),
                    "lab-cumulative": numberToCurrency(dataItem.cumulative),
                    "lab-payment-type": dataItem.paymentType,
                    "lab-payment-date": dataItem.paymentDate,
                    "lab-account-number": dataItem.accountNumber,
                    "lab-account-holder": dataItem.accountHolder,
                    "lab-total-amount": addComma(Number(dataItem.supplyAmount) + Number(dataItem.vat)),
                    "lab-currency-unit": dataItem.currencyUnit,
                    "lab-exchange-rate": dataItem.exchangeRate,
                    "lab-foreign-amount": dataItem.foreignAmount,
                    "lab-total-quantity": numberToCurrency(dataItem.totalQuantity),
                    "lab-supply-amount": numberToCurrency(dataItem.supplyAmount),
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
            
            // 공지사항 상위 세개만 돋보기에 해보고싶었던,,
            //const newTitle = document.querySelectorAll("td.notice-title");

            //if (newTitle) {
            //    console.log(newTitle);
            //    newTitle[0].classList.add("new");
            //    newTitle[1].classList.add("new");
            //    newTitle[2].classList.add("new");
            //}

        } catch (error) {
            //console.error("데이터 로드 중 오류 발생:", error);
            handleException(error);
        }
    }

    async function fetchOrderData() {
        const rowData = await getData;
        return rowData;
    }

    async function getTotalPages() {
        const data = await fetchOrderData();
        return Math.ceil(data.length / rowsPerPage);
    }

    function labelUpdate() {
        const allBox = document.getElementById("checkedAll");
        const checkBoxes = document.querySelectorAll("tbody input[type='checkbox']");
        const orderCheckTd = document.querySelectorAll("td.order-check");
        const orderSelected = document.getElementById("select-order-number");
        const selectedNum = document.querySelector("section.order_update li.selected-order span");
        const closeBtn = document.querySelector(".order_update .close_wrap");

        if (selectedNum) {
            orderCheckTd.forEach((td) => {
                const checkBox = td.querySelector("input");
                checkBox.addEventListener("change", changeInput);
            })

            // "전체 선택" 체크박스 상태 변경 시, 모든 체크박스 상태 변경
            allBox.addEventListener("change", function () {
                checkBoxes.forEach((box) => {
                    box.checked = allBox.checked;
                    box.dispatchEvent(new Event("change"));
                })
            })
            closeBtn.addEventListener("click", function () {
                allBox.checked = false;
                checkBoxes.forEach((box) => {
                    box.checked = false;
                    box.dispatchEvent(new Event("change"));
                })
            })
            changeDeliveryDate();

        } else {
            if (allBox) {
                allBox.addEventListener("change", function () {
                    checkBoxes.forEach((box) => {
                        box.checked = allBox.checked;
                    })
                })
            }
        }

        function changeInput() {
            const shippingOrderUpdate = document.querySelector("section.order_update");

            let boxName = this.name
            if (this.checked) {
                shippingOrderUpdate.style.display = "block";
                let options = orderSelected.querySelectorAll(".checkList")
                for (let i = 0; i < options.length; i++) {
                    if (options[i].textContent == boxName) {
                        orderSelected.removeChild(options[i]);
                    }
                }
                const newList = document.createElement("option");
                let text = document.createTextNode(boxName);
                newList.value = boxName;
                newList.disabled = true;
                newList.classList.add("checkList");
                newList.appendChild(text);
                orderSelected.appendChild(newList);
                orderSelected.animate(
                    [
                        { borderColor: "red", color: "red" },
                        { borderColor: "#ccc", color: "red" },
                        { borderColor: "red", color: "red" },
                        { borderColor: "#ccc", color: "#333" },
                    ],
                    2000
                );
                options = orderSelected.querySelectorAll(".checkList");
                selectedNum.innerHTML = options.length;
            } else {
                let options = orderSelected.querySelectorAll(".checkList");
                for (let i = 0; i < options.length; i++) {
                    if (options[i].textContent == boxName) {
                        orderSelected.removeChild(options[i]);
                        let have = orderSelected.querySelectorAll(".checkList");
                        selectedNum.innerHTML = have.length;
                        if (have.length == 0) shippingOrderUpdate.style.display = "none";
                    }
                }
            }

        }

        function changeDeliveryDate() {
            const deliveryDateBtn = document.querySelector("button.change-delay");
            const changeDate = document.getElementById("change-delivery-date");
            const delayReason = document.getElementById("delay-reason");

            deliveryDateBtn.addEventListener("click", function () {
                if (!changeDate.value || delayReason.value == "undefind") {
                    if (!changeDate.value) {
                        return alert("납품가능일을 입력하세요");
                    } else {
                        return alert("지연사유를 선택하세요");
                    }
                } else {
                    const orderCheckTd = document.querySelectorAll("td.order-check");
                    orderCheckTd.forEach((td) => {
                        const checkBox = td.querySelector("input");
                        if (checkBox.checked) {
                            td.parentElement.querySelector(".lab-delivery-available-date").innerHTML = changeDate.value;
                            td.parentElement.querySelector(".lab-delivery-available-date").style.color = "#ff3838";
                            td.parentElement.querySelector(".lab-delay-reason").innerHTML = delayReason.value;
                            td.parentElement.querySelector(".lab-delay-reason").style.color = "#ff3838";
                        }
                    })
                }
            })
        }
    }
    // 페이지네이션 초기화
    updatePagination();
}