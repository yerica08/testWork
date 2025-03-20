const info = 	[
    'java backend junior pizza 150',
    'python frontend senior chicken 210',
    'python frontend senior chicken 150',
    'cpp backend senior pizza 260',
    'java backend junior chicken 80',
    'python backend senior chicken 50'
  ];
const query = [
    'java and backend and junior and pizza 100',
    'python and frontend and senior and chicken 200',
    'cpp and - and senior and pizza 250',
    '- and backend and senior and - 150',
    '- and - and - and chicken 100',
    '- and - and - and - 150'
  ];
  // [1,1,1,1,2,4]
solution(info, query);
function solution(a,b) {
    let want = b.map(x=> x.split(' ').filter(x=>x !== 'and' && x !== '-'));
    want.forEach(x=> x[x.length -1] = Number(x[x.length -1]))
    let have = a.map(x=> x.split(' ').filter(x=>x !== 'and'));
    have.forEach(x=> x[x.length -1] = Number(x[x.length -1]))
    // console.log("want :",want)
    // console.log("have :", have)
    let result = want.map((wantIndex)=>{ // wantIndex = [ 'java', 'backend', 'junior', 'pizza', 100 ],
        let num = 0;
        
        have.forEach((haveIndex)=>{ // haveIndex = [ 'java', 'backend', 'junior', 'pizza', 150 ],
            let same = true;
            wantIndex.forEach((x) => { // x =  'java'
                //console.log('wnatIndex : ', wantIndex, 'haveindex : ', haveIndex , 'x :', x)
                if(typeof x == 'number' ){
                    if (!x >= haveIndex[haveIndex.length - 1]) same = false;
                }else{
                    if(!haveIndex.includes(x)) same = false;
                }
                //console.log('wnatIndex : ', wantIndex, 'haveindex : ', haveIndex , 'x :', x, 'same :', same)
            })
            if(same) num += 1;
        })

        return num;
    })
    console.log(result)

}