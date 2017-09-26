'use strict'

const
	// required
	fs = require('fs'),
	// variables
	generatorFiles 	= 'less/generetor.less',
	helperFiles 	= 'less/helper.less',
	csValuesFiles	= 'less/constructor-values.less',
	cssProperties 	= 'css-properties.json';

let 
	generatorAllKeys = ["property","prefixName","responsiveClass"],
	generatorLoopAllKeys = ["property","prefixName","responsiveClass","increaseAmount","sizeType","counterEnd","counterBegin"],
	propertyAndValues = "";

fs.watch(generatorFiles, { encoding: 'buffer' }, (eventType, filename) => {
  if (eventType == "change") {
  	
  	// Clears
  	fs.writeFile(csValuesFiles, '', () => {});
  	propertyAndValues = "";

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
							
							// concatKeys leri tek satıra düşür. if _item.values == 'num' değilse generatorLoopAllKeys çağır ve 				

		    				concatKeys(_mixinItem,generatorAllKeys,definedKeys).then((_concatItem) => {
								
								_item.values.map(_values => {
									propertyAndValues += `.generator(${_concatItem},@value:${_values}); \n`;
								})
								
							});
							
						}else {
							concatKeys(_mixinItem,generatorLoopAllKeys,definedKeys).then((_concatItem) => {

								propertyAndValues += `.generator-increase-loop(${_concatItem}); \n`;
								
							});
							
						}
	    				
	    			}
	    		})

	    		// Write Less
			    fs.appendFile(csValuesFiles, propertyAndValues,  (err) => {
				  if (err) throw err;
				   
				});
	    	})
    		
    	})

    })

  }
});


let readFile = (file) => {
	return new Promise((resolve,reject) => {
		fs.readFile(file, 'utf8', (err, data) => {
		    if (err) reject(err)  
		    else resolve(data)
		    // console.log(data)
		});
	})
};

// keyler boşmu dolumu o kontrol edilecek
//tekrara düşüp defalarca aynı şeyi yazıyor. Bunu loopsuz şekilde veya looplu düzgün olacak şekilde çöz 

let concatKeys = (currentKeys,allKeys,dk) => {
	let _loopValues = "",
		ck= Object.assign(currentKeys, dk),
		ckKeys = new concatArr(Object.keys(ck), allKeys);

	ckKeys.map((key,index) => {
		if (key != undefined) {
			console.log(ck)
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

