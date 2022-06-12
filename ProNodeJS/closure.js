
//_cnt not accessible from outside
// treated as 'member variable' thus denoted with 'under bar'
    
let intvSend = (()=>{
    let _cnt = 0;
    return () => {
        console.log(++_cnt)
        if(_cnt == 5)_cnt = 0;
    }
})()

for(let i = 0; i < 23; i++)
    intvSend()