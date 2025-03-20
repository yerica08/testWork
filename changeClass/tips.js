/*동적 로딩 (필요한 경우만 코드 실행)
모든 페이지에서 pages.js가 동일하게 실행되면, 사용하지 않는 코드도 실행될 수 있습니다.
이를 방지하려면 페이지에 따라 필요한 모듈만 동적으로 불러오는 방식을 고려하세요. */
const currentPage = document.body.dataset.page;

if (currentPage === 'home') {
    import('./base/homePage.js').then((module) => {
        module.initializeHomePage();
    });
} else if (currentPage === 'about') {
    import('./base/aboutPage.js').then((module) => {
        module.initializeAboutPage();
    });
}