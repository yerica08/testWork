window.addEventListener("load", ()=>{
    const clockElement = document.getElementById("currentTime");
      
    function updateClock() {
        const now = new Date();

        // 두 자리 형식으로 만들기 (ex: 01, 09)
        let hours = String(now.getHours()).padStart(2, '0');
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
      
        // 화면에 시간 표시
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }
      
    // 1초마다 업데이트
    updateClock();  // 첫 실행
    setInterval(updateClock, 1000);
})

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',  // 기본 월간 뷰
        headerToolbar: {
            left: 'prev title next',
            right: 'dayGridMonth,dayGridWeek'
        },
        locale: 'ko', 
        views: {
            dayGridMonth: {
                dayHeaderFormat: { weekday: 'long' }  // 월간 뷰에서 요일만 표시
            },
            dayGridWeek: {
                dayHeaderContent: (args) => {
                    const date = args.date;
                    const dayName = date.toLocaleDateString('ko-KR', { weekday: 'long' });
                    const dayNumber = String(date.getDate()).padStart(2, '0');
                    return `${dayNumber} / ${dayName}`;  // 날짜와 요일을 커스터마이즈하여 표시
                }
            }
        },
        businessHours: {
            daysOfWeek: [ 1, 2, 3, 4, 5 ]
        },
        events: [],
        datesSet: function (info) {
            const viewType = info.view.type;  // 현재 뷰 타입 가져오기 (dayGridMonth, dayGridWeek 등)

            if (viewType === 'dayGridMonth') {
                // 월별 뷰에서는 고정 높이를 제거하고 기본 동작으로 복구
                calendar.setOption('height', null);  // 기존 height 설정 해제
            } else if (viewType === 'dayGridWeek') {
                // 주간 뷰: 적절한 셀 높이 요소 선택
                const tdElement = calendarEl.querySelector('.fc-col-header-cell, .fc-day');
                if (tdElement) {
                    const tdHeight = tdElement.getBoundingClientRect().height;

                    // 주간 뷰 높이 설정 (적절히 조정 가능)
                    calendar.setOption('height', tdHeight * 5);
                } else {
                    // 셀을 찾지 못한 경우 기본 높이 설정
                    calendar.setOption('height', 130);
                }
            }
        }
    });
    calendar.render();
});