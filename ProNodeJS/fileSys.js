// basic
console.log ('filename:' + __filename);
console.log('dirname: ' + __dirname);
console.log('cwd: ' + process.cwd());

process.chdir('/');
console.log('cwd: ' + process.cwd());

console.log(process.execPath);

console.log('----');

//path module
var path = require('path');
let p = ['foo','bar','baz'];
console.log(p.join(path.sep));
process.env.PATH.split(path.delimiter).forEach((tkn)=>{console.log(tkn)});

let p2 = 'A/B/C/d.txt';
console.log(path.extname(p2));
console.log(path.basename(p2));
console.log(path.basename(p2, path.extname(p2)));
console.log(path.dirname(p2));
//path.normalize, path.relative

//fs module
var fs = require('fs');

//stat-open-read : very bulky
/*
fs.stat(__filename, (err, stat)=>{
    console.log('isFile? ' + stat.isFile());
    console.log('isDir? ' + stat.isDirectory());
    console.log(stat);

    fs.open(__filename, 'r', (err,fd)=>{
        let buff = Buffer.alloc(stat.size);
        fs.read(fd,buff, 0, stat.size, null, (err,bytesRead, bu)=>{
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^')
            console.log(bu.toString());

            fs.close(fd, (err)=>{if(err) console.log(err);})
        })
    })
})
*/

//readFile: no need to close
let fname = __dirname + '/cli_1.js'; //relative path does not work?
let outfname = __dirname + '/out.txt';
fs.readFile(fname,'utf8',(err,data)=>{
    if (err) console.log(err);
    else console.log(data); //because of 'utf' data is string type
    //fs.writeFile(outfname,data,'utf8',(err)=>{if(err)console.log(err);})
});
//fs.unlink(outfname, (err) =>{if(err)console.log(err)});

