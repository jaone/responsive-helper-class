'use strict'

const
	// required
	fs = require('fs'),
	EventEmitter = require('events'),

	// variables
	generatorFiles 	= 'generetor.less',
	csValuesFiles	= 'assets/less/constructor-values.less',
	cssProperties 	= 'assets/css-properties.json';

let 
	generatorAllKeys = ["property","prefixName","responsiveClass"],
	generatorLoopAllKeys = ["property","prefixName","responsiveClass","increaseAmount","sizeType","counterEnd","counterBegin"];

global.propertyAndValues = "";
class MyEmitter extends EventEmitter {}

fs.watch(generatorFiles, { encoding: 'buffer' }, (eventType, filename) => {
  if (eventType == "change") {
  	
  	// Clears
  	fs.writeFile(csValuesFiles, '', () => {});
  	global.propertyAndValues = "";

  	// Read Generator Less
    readFile(generatorFiles).then((data) => {

    	// Split Lines
    	data.trim().split("\n").map((_mixinItem) => {
    		
    		//Less Transform to Json
			_mixinItem =
				JSON.parse( 
					_mixinItem
					.trim()
					.replace('.generator', '')
					.replace('(', '{"')
					.replace(/@/g,'')
					.replace(')', '"}') 
					.replace(';', '')
					.replace(/:/g,'":"')
					.replace(/;/g,'')
					.replace(/,/g,'","')
				)

			// Read CSS Properties JSON Data 
			readFile(cssProperties).then((data) => {
				
	    		JSON.parse(data).map((_item) => {

	    			let definedKeys = Object.assign({}, _item);
						delete definedKeys.values;

	    			if(_item.property == _mixinItem.property) {
							 
						if (_item.values != 'num') { 				

		    				concatKeys(_mixinItem,generatorAllKeys,definedKeys).then((_concatItem) => {
								
								_item.values.map(_values => {
									global.propertyAndValues += `.generator(${_concatItem},@value:${_values}); \n`;
								})
								
							});
							
						}else {
							concatKeys(_mixinItem,generatorLoopAllKeys,definedKeys).then((_concatItem) => {

								global.propertyAndValues += `.generator-increase-loop(${_concatItem}); \n`;
								
							});
						}
	    			}
	    		})
			   
	    	})
    		
    	})

    	// Write Less
	    myEmitter.emit('write:less', csValuesFiles, global.propertyAndValues);

    })

  }
});



const myEmitter = new MyEmitter();

myEmitter.on('write:less', (file,content) => {
   fs.appendFile(file, content,  (err) => {
	  if (err) throw err;
	});
});



let readFile = (file) => {
	return new Promise((resolve,reject) => {
		fs.readFile(file, 'utf8', (err, data) => {
		    if (err) reject(err)  
		    else resolve(data)
		});
	})
};


let concatKeys = (currentKeys,allKeys,dk) => {
	let _loopValues = "",
		ck= Object.assign(currentKeys, dk),
		ckKeys = new concatArr(Object.keys(ck), allKeys);

	ckKeys.map((key,index) => {
		if (key != undefined) {
			if ( ck[key] != undefined) {
				 _loopValues+=`@${key}:${ck[key]}`
				 
			}else {
				_loopValues+=`@${key}`;
			}

			if (ckKeys.length -1 != index) {
				_loopValues+=","
			}
		}
	});
	
	return new Promise((resolve,reject) => {
		resolve(_loopValues)
	})
}

var d = [];
function concatArr(x,y) {
  d = []; 
  x.concat(y).forEach(item =>{

     if (d.indexOf(item) == -1) 
       d.push(item); 
  });
  return d;

}

