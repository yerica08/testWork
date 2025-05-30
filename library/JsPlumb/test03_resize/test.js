const diamond = document.getElementById('diamond1');
const resizer = diamond.querySelector('.resizer');

resizer.addEventListener('mousedown', function (e) {
   e.preventDefault();

   const startX = e.clientX;
   const startY = e.clientY;
   const startWidth = parseInt(window.getComputedStyle(diamond).width, 10);
   const startHeight = parseInt(window.getComputedStyle(diamond).height, 10);

   function doDrag(e) {
      const newWidth = startWidth + e.clientX - startX;
      const newHeight = startHeight + e.clientY - startY;

      diamond.style.width = newWidth + 'px';
      diamond.style.height = newHeight + 'px';

      jsPlumb.repaint(diamond); // 연결선 갱신
   }

   function stopDrag() {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
   }

   document.addEventListener('mousemove', doDrag);
   document.addEventListener('mouseup', stopDrag);
});
