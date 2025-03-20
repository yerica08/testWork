export class Pagination{
    constructor(dataUrl, rowsPerPage = 10) {
        this.dataUrl = dataUrl;
        this.rowsPerPage = rowsPerPage;
        this.currentPage = 1;

        this.pageNumberElement = document.querySelector("#page-number");
        this.totalPagesElement = document.querySelector("#total-pages");
        this.prevButton = document.querySelector("#prev-page");
        this.nextButton = document.querySelector("#next-page");
        this.tbody = document.querySelector("#order-body");

        this.init();
    }

    async init() {
        try {
            this.data = await Utils.requestService2(this.dataUrl);
            this.totalPages = this.calculateTotalPages();
            this.addEventListeners();
            this.updatePagination();
        } catch (error) {
            console.error("초기화 중 오류 발생:", error);
        }
    }

    calculateTotalPages() {
        return Math.ceil(this.data.length / this.rowsPerPage);
    }

    addEventListeners() {
        this.prevButton.removeEventListener("click", this.handlePrevClick.bind(this));
        this.nextButton.removeEventListener("click", this.handleNextClick.bind(this));

        this.prevButton.addEventListener("click", this.handlePrevClick.bind(this));
        this.nextButton.addEventListener("click", this.handleNextClick.bind(this));
    }

    async updatePagination() {
        try {
            this.pageNumberElement.textContent = this.currentPage;
            this.totalPagesElement.textContent = this.totalPages;
            this.prevButton.disabled = this.currentPage === 1;
            this.nextButton.disabled = this.currentPage === this.totalPages;
            this.loadTableData();
            this.updateLabels();
        } catch (error) {
            console.error("페이지네이션 업데이트 중 오류 발생:", error);
        }
    }

    loadTableData() {
        this.tbody.innerHTML = ""; // 테이블 초기화

        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        const pageData = this.data.slice(startIndex, endIndex);

        pageData.forEach((dataItem) => this.renderRow(dataItem));
    }

    renderRow(dataItem) {
        const newRow = document.querySelector(".item-row-template").content.cloneNode(true);
        const dataMap = this.mapData(dataItem);

        Object.keys(dataMap).forEach((key) => {
            const element = newRow.querySelector(`.${key}`);
            if (element) {
                element.innerHTML = dataMap[key];
            }
        });

        this.tbody.appendChild(newRow);

        const tableSet = document.querySelectorAll("tbody .order-check");
        let count = 1;
        if (tableSet) {
            tableSet.forEach((td) => {
                const countNum = `count-${count}`;
                const name = td.parentElement.querySelector(".ORDERCODE").innerText;
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
    }

    mapData(dataItem) {
        return {
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
            "lab-quantity": Utils.numberToCurrency(dataItem.quantity),
            "lab-unit-price": Utils.numberToCurrency(dataItem.unitPrice),
            "lab-order-amount": Utils.numberToCurrency(dataItem.orderAmount),
            "lab-code": dataItem.code,
            "lab-invoice-number": dataItem.invoiceNumber,
            "lab-brand": dataItem.brand,
            "lab-item": dataItem.item,
            "lab-supply": Utils.numberToCurrency(dataItem.supply),
            "lab-vat": Utils.numberToCurrency(dataItem.vat),
            "lab-tax": Utils.numberToCurrency(dataItem.tax),
            "lab-bank": dataItem.bank,
            "lab-amount": Utils.numberToCurrency(dataItem.amount),
            "lab-deposit": Utils.numberToCurrency(dataItem.deposit),
            "lab-cumulative": Utils.numberToCurrency(dataItem.cumulative),
            "lab-payment-type": dataItem.paymentType,
            "lab-payment-date": dataItem.paymentDate,
            "lab-account-number": dataItem.accountNumber,
            "lab-account-holder": dataItem.accountHolder,
            "lab-total-amount": Utils.addComma(Number(dataItem.supplyAmount) + Number(dataItem.vat)),
            "lab-currency-unit": dataItem.currencyUnit,
            "lab-exchange-rate": dataItem.exchangeRate,
            "lab-foreign-amount": dataItem.foreignAmount,
            "lab-total-quantity": Utils.numberToCurrency(dataItem.totalQuantity),
            "lab-supply-amount": Utils.numberToCurrency(dataItem.supplyAmount),
            "lab-manager": dataItem.manager,
            "lab-notice-number": dataItem.noticeNumber,
            "lab-notice-type": dataItem.noticeType,
            "lab-notice-title": dataItem.noticeTitle,
            "lab-notice-writer": dataItem.noticeWriter,
            "lab-notice-date": dataItem.noticeDate,
            "LABORDERCODE": dataItem.ORDERCODE,
            "LABORDERDATE": dataItem.ORDERDATE,
            "LABDELIVERYREQUESTDATE": dataItem.DELIVERYREQUESTDATE,
            "LABDELIVERYAVAILABLEDATE": dataItem.DELIVERYAVAILABLEDATE,
            "LABDELAYREASON": dataItem.DELAYREASON,
            "LABDELIVERYDUEDATE": dataItem.DELIVERYDUEDATE,
            "LABORDERTYPE": dataItem.ORDERTYPE,
            "LABORDERCOMPANY": dataItem.ORDERCOMPANY,
            "LABORDERBUSINESS": dataItem.ORDERBUSINESS,
            "LABORDERUSER": dataItem.ORDERUSER,
            "LABORDERPHONE": dataItem.ORDERPHONE,
            "LABORDERADDRESS": dataItem.ORDERADDRESS,
            "LABDELIVERYMETHOD": dataItem.DELIVERYMETHOD,
            "LABORDERSTATUS": dataItem.ORDERSTATUS,
            "LABPRODUCTCODE": dataItem.PRODUCTCODE,
            "LABPRODUCTNAME": dataItem.PRODUCTNAME,
            "LABPRODUCTBRAND": dataItem.PRODUCTBRAND,
            "LABPRODUCTSPEC": dataItem.PRODUCTSPEC,
            "LABPRODUCTUNIT": dataItem.PRODUCTUNIT,
            "LABPRODUCTUNITPRICE": dataItem.PRODUCTUNITPRICE,
            "LABPRODUCTQUANTITY": dataItem.PRODUCTQUANTITY,
            "LABPRODUCTTOTALPRICE": dataItem.PRODUCTTOTALPRICE,
            "LABPRODUCTREMARKS": dataItem.PRODUCTREMARKS,
            "LABINVOICENUMBER": dataItem.INVOICENUMBER,
        };
    }

    updateLabels() {
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

    handlePrevClick() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    handleNextClick() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }
}