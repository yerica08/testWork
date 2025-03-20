class Common {
   constructor(title) {
      this.title = title;

      this.message =
         '처리중 문제가 발생되었습니다.\n관리자에게 문의해주시기 바랍니다.';
      this.gnb = document.querySelector(".gnb");
      this.blackBlur = document.querySelector(".black_blur");
      this.gnb?.addEventListener('mouseover', () => {this.blackBlurFnc("in")});
      this.gnb?.addEventListener('mouseleave', () => {this.blackBlurFnc("out")});

      // 서치 박스 날짜
      this.startDate = document.querySelector(".start-date");
      this.endDate = document.querySelector(".end-date");
      this.searchDiv = document.querySelector(".search_box");
      // 폼 초기화 버튼
      this.resetBtn = document.querySelector(".reset-btn");
      this.resetBtn?.addEventListener("click", this.resetBtnFnc.bind(this));
      /*
         Class에서 이벤트 리스너를 등록할 때, 이벤트의 호출 함수 내부에서 사용되는 this가 다른 요소를 참조할 수도 있기 때문에 주의해야한다.
         예를 들어, 클릭 이벤트가 발생하면 클릭 이벤트의 호출 함수 내부의 this는 Class가 아닌 클릭된 버튼 요소를 참조한다.
         이를 해결하기 위해서 두가지 방법을 알아보았다.

         1) bind(this)
            : bind(this)를 사용하면 this가 항상 클래스 인스턴스를 참조하도록 고정된다.
            ✔ this.resetBtn?.addEventListener("click", this.resetBtnFnc.bind(this));

         2) 화살표 함수 사용
            : 화살표 함수는 this가 상위 컨텍스트를 그대로 유지하므로, bind(this) 없이도 클래스 인스턴스를 참조한다.
            ✔ this.resetBtn?.addEventListener("click", () => this.resetBtnFnc());
      */

      // 페이지 넘버와 데이터
      
   }
   showLoadingPanel() {
      if (!document.querySelector("[id$='masterLoadingPanel'")) return;

      const x = window.innerWidth / 2 - 150;
      const y =
         window.innerHeight / 2 - 50 + document.scrollingElement.scrollTop;
      masterLoading.ShowAtPos(x, y);
   }
   hideLoadingPanel() {
      if (!document.querySelector("[id$='masterLoadingPanel'")) return;
      masterLoadingPanel.Hide();
   }

   // 매개변수의 afterHandler는 언제 사용되는건지?
   handleException(e) {
      console.error(e);

      if ((e.message || '').toUpperCase().includes('FAILED TO FETCH')) {
         window.addEventListener('keydown', function (e) {
            if (
               e.key === 'F5' ||
               (e.ctrlKey && e.key === 'r') ||
               (e.ctrlKey && e.shiftKey && e.code === 'KeyR')
            ) {
               e.preventDefault();
            }
         });
         return;
      }

      if (e instanceof Error) {
         try {
            const obj = JSON.parse(e.message);
            let alert;

            if (obj.code == '9') {
               alert(obj.message || this.message);
               showLoadingPanel();
               location.href = '/Login.aspx';
            } else if (obj.code == 'NC') {
               showLoadingPanel();
               location.href = '/Disabled/NoSelectedCustomer.aspx';
            } else if (obj.code == '7') {
               alert(obj.message || this.message);
               showLoadingPanel();
               location.href = '/Index.aspx';
            } else if (obj.code == 'M9') {
               alert(obj.message || this.message);
            } else if (obj.code == '99') {
               alert(obj.message || this.message);
               location.href = '/Index.aspx';
            } else if (obj.code == '8') {
               alert(obj.message || this.message);
            } else {
               alert(obj.message || this.message);
            }
         } catch (e) {
            alert(this.message);
         }
      } else {
         if (!!e?.responseJSON?.d) {
            if (JSON.parse(e.responseJSON.d).code == '9') {
               alert(JSON.parse(e.responseJSON.d).message);
               location.href = '/Login.aspx';
            } else if (JSON.parse(e.responseJSON.d).code == 'NC') {
               location.href = '/Disabled/NoSelectedCustomer.aspx';
            } else if (JSON.parse(e.responseJSON.d).code == '7') {
               alert(JSON.parse(e.responseJSON.d).message);

               showLoadingPanel();
               location.href = '/Index.aspx';
            } else if (JSON.parse(e.responseJSON.d).code == 'M9') {
               alert(JSON.parse(e.responseJSON.d).message);
            } else if (JSON.parse(e.responseJSON.d).code == '8') {
               alert(JSON.parse(e.responseJSON.d).message);
            } else {
               alert(this.message);
            }
         } else {
            alert(this.message);
         }
      }
   }

   /*
      Promise 생성자는 함수에 콜백을 전달하는 대신에, 콜백을 첨부하는 방식으로 사용된다.
      Promise 생성자에서 받는 인자 resolve/reject는 비동기 작업할 코드를 포함하는 콜백 함수인 것이다.
      그렇기 때문에 생성자를 통해 Promise를 선언할 경우 resolve와 reject의 존재가 필수이다.

      async 함수는 Promise 객체를 명시적으로 생성하지 않더라도 기본적으로 Promise 객체를 반환한다.
      함수 내부에서 return이 호출되면 자동으로 resolve가 호출된 것과 동일하게 동작하고,
      throw가 발생하면 자동으로 reject가 호출된 것과 동일하게 동작한다.
      따라서, async 함수에서는 resolve와 reject 메서드를 사용하는 것 대신 return 과 throw로 자동 처리가 가능하다.
   */
   async requestService(url, args) {
      try {
         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ args: args || '' }),
         });

         const result = await response.json();
         if (!response.ok) throw new Error(result.d);

         return JSON.parse(result.d); // 성공 시 자동으로 Promise.resolve() 호출
      } catch (ex) {
         throw ex; // 에러 발생 시 자동으로 Promise.reject() 호출
      }
   }

   /*
      Date 객체 자체는 "읽기용"으로 설계되어있다.
      숫자 값이 아니기 때문에 +, -, * , / 연산자 등을 사용하여 직접 연산이 불가능하다.
      그렇기 때문에 Unix Epoch기준의 타임스탬프(밀리초 단위의 숫자 값)을 반환해부즌 getTime()과 now()메서드를 사용한다.

      getTime()과 now()가 없는데도 계산이 됐던 이유는 뭘까?
      이유는 자바스크립트의 유연성에 있다.
      자바스크립트 내부적으로 new Date()에서 getTime()호출 없이도 산술 연산이 호출되면 내부적으로 타임스탬프를 가져와 계산한다.
      자동 변환 기능 덕에 getTime()을 사용하지 않아도 계산에는 차이가 없지만, 
      명확성과 일관성을 위해 getTime()을 사용하는 방식을 권장한다.
   */
   countDownTimer(dt, selector) {
      const end = new Date(dt).getTime();
      const timeUnits = {day: 86400000, hour: 3600000, minute: 60000, second: 1000}; // ms 단위

      const formatTime = (unit) => (unit < 10 ? `0${unit}` : unit); // 두 자리 형식
      let timer = null;

      const showRemaining = () => {
         const now = Date.now();
         const distance = end - now;

         if (distance < 0) {
            clearInterval(timer);
            document.querySelectorAll(selector).innerHTML = '00:00:00';
            return;
         }

         const days = Math.floor(distance / timeUnits.day);
         const hours = Math.floor((distance % timeUnits.day) / timeUnits.hour);
         const minutes = Math.floor((distance % timeUnits.hour) / timeUnits.minute);
         const seconds = Math.floor((distance % timeUnits.minute) / timeUnits.second);

         const outputText = "";
         
         if (days > 0) outputText += "<span id='todays-count-d'>" + formatTime(days) + '일 ' +'</span>';
         outputText += "<span id='todays-count-h'>" + formatTime(hours) + '</span><span>' + ':' + '</span>';
         outputText += "<span id='todays-count-m'>" + formatTime(minutes) + '</span><span>' + ':' + '</span>';
         outputText += "<span id='todays-count-s'>" + formatTime(seconds) + '</span>';

         const spanGroup = document.querySelectorAll(selector);

         for (let i = 0; i < spanGroup.length; i++) {
            spanGroup[i].innerHTML = outputText;
         }
      };

      showRemaining();
      timer = setInterval(showRemaining, 1000);
   }

   // 숫자를 문자열로 변환
   numberToCurrency(value){
      value = String(value).replace(/[^-\d]+/g, '');
      return console.log(Number(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
   }
   // 문자를 숫자로 변환
   currencyToNumber(value){
      return console.log(Number(String(value).replace(/[^-\d]+/g, '')));
   }
   // yyyy-mm-dd 형태의 문자열로 변환
   to_yyyyMMdd(v, day) {
      let retValue = "";
  
      try {
          retValue = `${v.getFullYear().toString().padStart(4, '0')}-${(v.getMonth() + 1).toString().padStart(2, '0')}`;
          if(!day) retValue += `-${v.getDate().toString().padStart(2, '0')}`

      } catch (ex) {
          console.error(ex);
      }
      return retValue;
   }

   /*
   일부 브라우저가 IE를 흉내내거나 userAgent를 조작한 경우를 대비하여, 현대에는 기능감지(Feature Detection)을 권장한다.
   Internet Explorer 에서만 지원되는 특정 기능을 활용해 감지하는 것이다.
   예를들어, document.documentMode는 IE 브라우저에서만 사용할 수 있다.
   document.documentMode 속성은 IE8(2009년 3월 19월에 출시)부터 IE11까지 모든 버전에서 지원되는 속성이다.

   function checkIE() {
    return !!window.document.documentMode;
   }
   console.log(checkIE()); // IE 브라우저: true, 다른 브라우저: false

   만약 IE8 미만을 감지하고 싶다면 userAgent 문자열에서 msie를 검색하여 감지해야한다.
   
   plaintext
   - IE6: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
   - IE7: Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)
   - IE8: Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)
   */
   checkIE(){
      // IE8 이상 감지
      if (window.document.documentMode) {
         return true;
      }
 
     // IE8 미만 감지
     const agent = navigator.userAgent.toLowerCase();
     if (agent.indexOf("msie") !== -1) {
         return true;
     }
 
     return false;
   }

   blackBlurFnc(inOrOut){
      this.blackBlur.style.display = (inOrOut == "in") ? "block" : "none";
      setTimeout(() => {
         this.blackBlur.style.opacity = (inOrOut == "in") ? 1 : 0;
      }, 100)
   }

   /*
   unescape와 escape는 오래된 웹 표준으로, 더 이상 권장되지 않는(deprecated) 메서드이다.
   unescape와 escape는 여전히 대부분의 브라우저에서 사용이 가능하지만, 향후 브라우저에서 지원이 중단될 가능성이 있으므로 사용을 피하는 것이 좋다.
   대부분 최신 브라우저와 런타임 환경에서는 대체 메서드인 encodeURIComponent와 decodeURIComponent 사용을 권장한다.
   구형 브라우저(예: IE6~IE8등)에서는 encodeURIComponent와 decodeURIComponent가 제대로 작동하지 않을 수 있다. 
   이 경우, escape와 unescape를 사용해야 할 수도 있다.

   왜 더이상 권장되지 않을까?
   1. 유니코드 처리 문제
   : escape 는 ASCII 문자를 제외한 문자를 %u 형식으로 인코딩한다.
   이는 현대 웹에서 사용하는 UTF-8 표준과 맞지 않으므로, 일부 환경에서 잘못된 결과를 초래할 수 있다.
   console.log(escape("안녕하세요")); // "%uC548%uB155%uD558%uC138%uC694" (UTF-8과 호환되지 않음)

   2. 표준화 된 대안 존재
   : 현대 웹에서는 URL 인코딩 및 디코딩을 위해 encodeURIComponent와 decodeURIComponent을 사용한다.
   이 메서드는 UTF-8을 기반으로 작동하며, 웹 어플리케이션에서 필요한 모든 기능을 제공한다. 
   console.log(encodeURIComponent("안녕하세요")); // "%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94" (UTF-8 기반)

   3. 보안 문제
   : unescape와 escape는 보안 취약점과 관련이 있었던 기록이 있으며, 표준이 아닌 환경에서 예측하지 못한 동작을 유발할 가능성이 있다.

   < encodeURIComponent와 decodeURIComponent >
   1. encodeURIComponent : URL에서 사용할 수 없는 문자(예: 공백, 특수문자)를 안전하게 인코딩.
   const value = "안녕하세요";
   const encoded = encodeURIComponent(value);
   onsole.log(encoded); // "%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94"

   2. decodeURIComponent : URL 인코딩 된 문자열을 원래 문자열로 디코딩.
   const decoded = decodeURIComponent(encoded);
   console.log(decoded); // "안녕하세요"
   */

   /*
    gc(name)은 특정 쿠키(name)의 값을 읽어오는 용도로 사용된다.
    document.cookie는 모든 쿠키를 문자열로 반환하며, ;로 구분된 key=value 형식이다.
    반복문을 통해 document.cookie 문자열에서 name= 패턴을 찾는다.
    name과 일치하는 쿠키 이름을 찾으면 ;또는 그 값을 추출하여 unescape를 통해 URL-인코딩된 데이터를 디코딩하고,
    만약 쿠키가 존재하지 않으면 빈 문자열을 반환한다.
   */

   //함수 gc는 가져오려는 쿠키의 이름을 name이라는 매개변수로 갖고있다.
   gc(name) {
      // 쿠키 문자열에서 검색할 때 사용할 쿠키 이름과 기호(=)를 함친 문자열을 obj라는 변수로 선언한다.
      const obj = name + "=";
      // 반복문에서 사용할 인덱스 변수 x와 쿠키 끝 위치를 저장할 변수 e를 선언하고 0으로 초기화한다.
      let x = 0, e = 0;
  
      /*이후 반복문으로 쿠키를 검색한다.
      document.cookie를 사용하면 브라우저의 모든 쿠키를 문자열 형태로 반환한다.
      쿠키들은 name=value; name2=value2; 와 같은 형식으로 저장된다.*/
      while (x <= document.cookie.length) {
         //x는 현재 검색 위치를 나타내고, 반복문 내부에서 선언된 y는 현재 검색 위치(x)에서 쿠키 이름(obj)의 길이만큼 더한 위치를 계산한다.
         let y = (x + obj.length);
         //substring(x,y)를 통해 document.cookie의 x부터 y 까지를 가져오고 이것이 obj와 일치하는 부분이 있는지 확인한다.
         //** substring(a,b)는 인덱스a부터 인덱스b앞에 있는 문자까지 반환한다. **
         if (document.cookie.substring(x, y) == obj) {
            /* 만약 쿠키 이름이 일치하면 indexOf(';', y)를 통해 현재 위치 y부터 ;(다음 쿠키의 구분자)까지의 인덱스를 찾는다.
            ** indexOf('찾을 문자') : 문자열 왼쪽에서부터 일치하는 문자를 찾아서 제일 먼저 일치하는 문자의 index 번호를 반환한다. 없을 경우 -1을 반환한다.
            두번째 인수는 검색을 시작할 인덱스 값을 받는다. 이 인수는 옵션으로 생략하면 문자열 처음(0) 부터 검색한다. ** 
            만약 ;를 찾지 못하면(-1) 이 쿠키는 마지막 쿠키이므로 e를 전체 쿠키 문자열의 끝으로 설정한다. */
            if ((e = document.cookie.indexOf(";", y)) == -1)  e = document.cookie.length;
            // 이후 substring(y,e)로 y부터 e까지의 값을 가져와 unescape로 디코딩한다. 
            return unescape(document.cookie.substring(y, e));
          }
          // 현재 위치(x) 부터 다음 공백(구분자)를 찾는다. 공백을 찾지 못하면 -1을 반환한다.
          // 다음 쿠키를 검색하기 위해 +1 하여 인덱스를 증가시킨다.
          x = document.cookie.indexOf(" ", x) + 1;
  
          // 공백을 찾지 못하여 -1 을 반환하면, - 1 + 1 = 0이 되고, 더이상 쿠키가 없다는 뜻으로 반복을 종료한다.
          if (x == 0) break;
      }
      // 쿠키 이름이 일치하지 않거나 찾을 수 없는 경우 빈 문자열("")을 반환한다.
      return "";
   }

   /*
   첫번째 방식은 정규식 객체 RegExp를 사용하여 검색하는 방법이다.
   정규식을 사용하여 찾기 때문에 원하는 쿠키의 이름만 즉시 찾을 수 있고, 코드 간결하고 효율적이기 때문에 성능적으로 빠르다는 장점이있다.(쿠키의 개수가 많을 수록 이득)
   단점은 정규식을 이해하지 못하면 직관적이지 않을 수 있고, 정규식 작성 오류가 발생할 가능성이 있으므로 신중해야한다.
  */
   getCookie(name) {
      // 허용된 문자만 확인 (RFC 6265 표준)
      /*
         RFC 6265 표준에 따르면, 쿠키 이름은 영문자(a-z, A-Z)와 숫자(0-9), 몇가지 특수문자(!, #, $, %, &, ', *, +, -, ., ^, _, `, |, ~)만 허용되어 있다.
         공백, ;, ,, =, ", 그리고 ASCII 제어 문자는 사용이 금지되어있기 때문에, 만약 이름에 이러한 특수문자가 발생할 경우 대처하기위해 아래와같이 오류코드를 추가했다.

         만약, 오류 코드를 추가하는 것이 아니라 이스케이프(escape)하고 싶다면,
         정규식 처리와 replace 메서드를 통해 같이 허용되지 않는 특수문자 앞에 \를 추가하여 이스케이프 처리할 수 있다. 
         예시 ) name.replace(/[^a-zA-Z0-9!#$%&'*+.^_`|~-]/g, '\\$&');
      */
      const invalidChars = name.match(/[^a-zA-Z0-9!#$%&'*+.^_`|~-]/);
      if (invalidChars) {
         throw new Error(`Invalid cookie name: "${name}". Invalid character(s): ${invalidChars.join('')}`);
      }

      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : "";
   }

   /*
      두번째 방식은, 모든 쿠키를 배열로 변환하여 검색하는 방법을 사용하고있다.
      이 방식을 사용할 경우, 구현이 간단하고 정규식을 모르는 초보자도 이해하기 쉬우며, 모든 쿠키를 배열로 변환하므로 쿠키를 순회하거나 디버깅에 유용할 수 있다.
      하지만, 모든 쿠키를 split하고 배열을 순회하기 때문에 성능이 좀 느릴 수 있으며(쿠키의 개수가 많아질수록 부하 증가), 코드가 길다는 단점이 있다.
   */
   getCookie2(name) {
      const cookies = document.cookie.split("; "); // 쿠키 문자열을 배열로 분리
      for (let cookie of cookies) {
         const [key, value] = cookie.split("="); // 각 쿠키를 key=value로 분리
         if (key === name) {
            return decodeURIComponent(value); // 원하는 쿠키 반환
         }
      }
      return ""; // 쿠키가 없으면 빈 문자열 반환
   }


   /*
      const로 선언한 변수에 대해 setDate()를 호출하면 수정이 가능한 이유는 
      const가 변수 자체를 "재할당"하지 못하게 할 뿐, 변수가 가리키는 객체의 내부 상태는 변경할 수 있기 때문이다.

      const는 "변수가 가리키는 참조(reference)"를 변경할 수 없지만, const가 가리키는 객체(Object)나 배열(Array)의 속성(Property)는 변경할 수 있다.
      < 재할당 불가능 >
      const todayDate = new Date();
      todayDate = new Date(); // ❌ TypeError: Assignment to constant variable.

      < 객체 내부 수정은 가능 >
      const todayDate = new Date();
      todayDate.setDate(todayDate.getDate() + 7); // ✅ 정상 동작
      console.log(todayDate); // 오늘 날짜 + 7일

      따라서, new Date()로 생성된 객체는 자바스크릅트의 내장 객체인 Date의 인스턴스이기 때문에, 객체 내부 데이터 수정이 가능하다.

      ---
      +) 달의 마지막 날짜 쉽게 구하는 방법
         : 구하려는 달의 다음 달 + 일자 0으로 설정. ex.(new Date(2025, 2, 0)).getDate() => 2월 마지막 날
   */
   setCookie(a, b, c) {
      const todayDate = new Date();
      todayDate.setDate(todayDate.getDate() + c);
      document.cookie = `${a}=${encodeURIComponent(b)}; path=/; expires=${todayDate.toUTCString()}`;
   }

   /* 쿠키 이름 중 data가 없다면 IP 주소를 가져온다.
   성공 시 쿠키에 IP를 저장하고 실패하면 빈값을 저장한다.*/
   async getIP(){
      // 단순 쿠키가 존재하는지 확인하는 목적이라면 document.cookie.includes("data=")
      // 쿠키가 존재 여부 뿐만 아니라 값이 비어있는 경우("")를 포함해 처리해야 한다면 getCookie("data")
      if (!document.cookie.includes(`data=`)) { // 쿠키 존재 확인
         try {
            const response = await fetch("https://ipinfo.io/ip");
            const ipData = await response.text();
            this.setCookie("data", ipData, 1); // 쿠키 저장
         } catch {
            this.setCookie("data", "", 1); // 실패 시 빈 값 저장
         }
      }
   }

   dateRange() {
      this.endDate?.value = new Date().toISOString().slice(0, 10);
      this.startDate?.value = getLastMonth();

      // 한 달 전 날짜 반환 함수
      function getLastMonth() {
         const prevMonthDate = new Date();
         prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
         return prevMonthDate.toISOString().slice(0, 10);
      }
   }

   resetBtnFnc() {
      // 텍스트 필드 초기화
      document.querySelectorAll(`${this.searchDiv} input[type='text']`).forEach(input => {
          input.value = "";
      });

      // 셀렉트 박스 초기화
      document.querySelectorAll(`${this.searchDiv} select`).forEach(select => {
          select.value = this.title;
      });

      // 날짜 필드 초기화
      this.dateRange();
   }


}

const foo1 = new Common();

