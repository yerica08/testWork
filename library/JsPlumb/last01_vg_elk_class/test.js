import { FlowEditor } from './flowEditor.js';

const editor = new FlowEditor('canvas');

fetch('demo.json')
   .then((response) => response.json())
   .then((data) => {
      editor.loadData(data);
   });

// 버튼 연결
document.getElementById('renderCanvas2').addEventListener('click', () => {
   editor.renderCanvas2();
});

document.getElementById('btnExport').addEventListener('click', () => {
   editor.exportToJson();
});

document.getElementById('btnShowEndpoint').addEventListener('click', () => {
   editor.showEndpoint();
});

document.getElementById('btnAddNode').addEventListener('click', () => {
   editor.addBaseNode();
});
