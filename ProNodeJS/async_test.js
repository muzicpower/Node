
var async = require('async');

function f_1(){
    console.log('f_1');

    return 1;
}
function f_2(){
    console.log('f_2');
    //throw new Error('f_2 error @#$#%');
    return 2;
}
function f_3(){
    console.log('f_3');
    return 3;
}

//setTimeout(()=>{f_1();},300);
//setTimeout(()=>{f_2();},200);
//setTimeout(()=>{f_3();},100);

console.log('**************');

//cb(Callback) plays a critical role to gaurantee the order of execution
//-> arguments[i+1] is executed only after arguments[i]'s cb is returned

/*
async.series([
    (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 10);
        },300);
    },
    (cb)=>{
        setTimeout(()=>{
            f_2();
            //cb(new Error('f2 error occurred T_T'), 20);
            cb(null, 20);

        },200);

    },
    (cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,30);

        },100);

    }],
    (err,res)=>{
        
        if(err)
            console.log('__error: ' + err);
        else
            res.forEach((ele,i)=>{console.log(i+'th return: ' + ele);} );
        
    }
);
async.waterfall([
    (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 300, 400);
        },300);
    },
    (a,b, cb)=>{
        setTimeout(()=>{
            f_2();
            cb(null, a*a + b*b);

        },200);

    },
    (c, cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,Math.sqrt(c));

        },100);

    }],
    (err,res)=>{
        
        if(err)
            console.log('__error: ' + err);
        else
            console.log(res); //prints 500
    }
);


async.parallel({
    il: (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 10);
        },300);
    },
    ee: (cb)=>{
        setTimeout(()=>{
            f_2();
            //cb(new Error('f2 error occurred T_T'), 20);
            cb(null, 20);

        },200);

    },
    sam: (cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,30);

        },100);

    }},
    (err,res)=>{
        
        if(err)
            console.log('__error: ' + err);
        else
            console.log(res);
    });

async.parallelLimit({
    il: (cb)=>{
        setTimeout(()=>{
            f_1();
            cb(null, 10);
        },300);
    },
    ee: (cb)=>{
        setTimeout(()=>{
            f_2();
            //cb(new Error('f2 error occurred T_T'), 20);
            cb(null, 20);

        },200);

    },
    sam: (cb)=>{
        setTimeout(()=>{
            f_3();
            cb(null,30);

        },100);

    }}, 2 ,
    (err,res)=>{
        
        if(err)
            console.log('__error: ' + err);
        else
            console.log(res);
    });
*/

console.log('---------------');

let queue = async.queue((task, cb)=>{
    console.log(task);
    cb('cb: ' + task.id); //error report: cb == 2nd argment of queue.push
},4);

let i = 0;
setInterval(()=>{
    queue.push({id:i++},(err)=>{console.log(err);})
},500);

/*
let idx = 0;
async.whilst( //until
    (cb)=>{
        console.log('condition func');
        cb(null, idx<5);
    },
    (cb)=>{
        setTimeout(()=>{
            console.log('idx: ' + idx++);
            //if (idx == 3)      //this is like breaking the loop
            //    cb('ABC___');
            cb(null);
        },800);
    },
    (err)=>{
        console.log('end of while loop: ' + err);
    }
);
*/
