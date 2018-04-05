var data = {
	'country' : [
		{ 
		'name': 'Англия',
			'price': 3500,
			'hotels':[
			{'price' : [ 1200,2500, 3500,8000, 3500, 4500,500 ]
			},
			{		'price':[1200,2500,3500,8000,3500,4500,5500]	
			},
			{
				'price':[ 1200, 2500,3500, 8000, 3500, 4500,5500 ]
			}
			],
			'hotelsName':[
				'Jurys Inn Birmingham',
				'Hilton London Metropole',
				'Hampton By Hilton Newcastle'
			]
		
		},
		
		{
			'name': 'Вьетнам',
				'price': 1500,	
					'hotels':[
						{
							'price':[1200,2500,3500,8000,3500,4500,5500 ]
						},
						{	'price':[1200,2500,3500, 8000,3500,4500,5500 ]
						},
						{		'price':[ 1200,2500,3500,8000,3500,4500,5500 ]
						}
					],
				
					'hotelsName':[
							'Melia Danang',					
							'Meliá Hanoi',				
							'JW Marriott Hotel Hanoi'				
						]		
		},
		{
			'name': 'Турция',
			'price' : 2000,
			'hotels':[
				{'Grand Hyatt Istanbul':[1200,2500,3500,8000, 3500,4500,5500 ]
				},
				{
					'price':[1200,2500, 3500,8000,3500,4500,5500]
				},
				{
					'price':[1200,2500,3500,8000,3500, 4500,5500]
				},
				{
					'price':[1200,2500,3500,8000,3500, 4500,5500 ]
				},
				{
					'price':[1200, 2500,3500,8000,3500,4500,5500 ]
				}
			],
			'hotelsName':[
				'Grand Hyatt Istanbul',
				'The Ritz-Carlton Istanbul',
				'Land of Legends Theme Park',
				'Divan Suites Istanbul GPlus',
				'Marriott The Istanbul Edition'
			]
			
		},
		{
			'name': 'Египет',
			'price' : 3000,
		
			'hotels':[
			{
				'price' :[500,1500, 2500, 6000, 2500, 3500,4500 ]
			},
			{
				'price':[550,1550, 2500,7000,3000, 4000, 5000 ]
			},
			{	
				'price':[ 1200, 2500, 3500, 8000, 3500, 4500,5500 ]
			},
			
			{
				'price':[ 1500,2800,3500,7000,3500,4500,5500 ]
			}
				
			],
			'hotelsName':[
				'Desert Rose Resort 5',
				'Movenpick Resort Taba',
				'Cleopatra Luxury Resort Makadi Bay',
				'Harmony Makadi Bay'
			]
		},
		{
			
			'name': 'Дубаи', 
			'price' : 5000,
			'hotels':[
				{
					'price':[ 1200,2500,3500,8000,3500,4500,5500 ]
				},
				{	
					'price':[ 1200, 2500,3500,8000, 3500, 4500,5500 ]
				},
				{
					'price':[1200,2500, 3500,8000,3500, 4500,5500 ]
				},
				{
					'price':[ 1200,2500, 3500,8000, 3500,4500,5500 ]
				}
			],
			'hotelsName':[
				'Crowne Plaza Dubai',
				'Holiday Inn Dubai Al Barsha',
				'Gulf Oasis Hotel Apartments',
				'Legacy Hotel Apartments'
			]
		
		}
		
	]
	
};

/*
	Cxeма распределения номеров. Рекомендация для исключения ошибок в фунциональности 
	придерживаться общей схемы!!!
			
					'Одиночная' : 1200,
					'Семейная': 2500,
					'Для двоих с разделенными кроватями': 3500,
					'Lux': 8000,
					'Для двоих с общей кроватью': 3500,
					'Студия': 4500,
					'Duplex':5500 *
*/


/*
* Функция конечных расчетов
*
*/
function calculate(){
	var childrenAmount = document.getElementById('childrenAmount').value,
		adultsAmount = document.getElementById('adultsAmount').value,
		daysAmount = document.getElementById('daysAmount').value,
		result = document.getElementById('result'),
		collectedData = collectData();
		if(childrenAmount<0)
			childrenAmount=0;
		if(adultsAmount<0)
			adultsAmount=0;
		if(daysAmount<0)
			daysAmount=0;
		
		var answer = (collectedData.tourPrice * (childrenAmount+adultsAmount)*daysAmount) +  (collectedData.hotelPrice * (childrenAmount+adultsAmount))*daysAmount;
	//alert(answer);
	//result.innerHTML  = (collectedData.tourPrice * (childrenAmount+adultsAmount)) +  (collectedData.hotelPrice * (childrenAmount+adultsAmount))*daysAmount;
		result.value=(collectedData.tourPrice * (childrenAmount+adultsAmount)) +  (collectedData.hotelPrice * (childrenAmount+adultsAmount))*daysAmount;
	};	

/*
* Возвращает имя страны 
* @param {int} number (номер страны в select начиная с 0)
* return name {string}
*/
function getCountryName(number){
	switch(number){ 
		case 0:
			return 'Не выбрана страна'
		break;
		
		case 1:
			return 'Египет';
		break;
		
		case 2:
			return 'Турция' ;
		break;
		
		case 3:
			return 'Вьетнам';
		break;
		
		case 4:
			return 'Англия';
		break;
		
		case 5:
			return 'Дубаи';
		break;
	}
}
/*
* Виды номеров
*/
var roomTypes = {
	'rooms' :['Одиночная','Семейный','Для двоих с разделенными кроватями','Lux','Для двоих с общей кроватью','Студия','Duplex']
}


function collectData(){
	var countryIndex = document.getElementById('country').options.selectedIndex;
		
		switch(countryIndex)
		{
			case 1:
				countryIndex = 3;
			break;
			
			case 2:
				countryIndex = 2;
			break;
			
			case 3:
				countryIndex = 1;
			break;
			
			case 4:
				countryIndex = 0;
			break;
			
			case 5:
				countryIndex = 4;
			break;
			
			default:
			break;
		}
		var hotelIndex = document.getElementById('hotels').options.selectedIndex,
			roomIndex = document.getElementById('hotelRoom').options.selectedIndex,
			hotel = data.country[countryIndex].hotels[hotelIndex];
		
		/*alert('Выбран отель: '+ data.country[countryIndex].hotelsName[hotelIndex]+
				' \nВыбран номер: '+ roomTypes.rooms[roomIndex]+
				' \nСтоимость одно ночи составит: '+hotel.price[roomIndex]+' у.е.');*/
				var object = { 'hotelPrice': hotel.price[roomIndex],'tourPrice': data.country[countryIndex].price };
		return object;
}

/*
* Заполняет список номеров
*/
function fillRoomsList(){
	var rooms = document.getElementById('hotelRoom'),
		options = rooms.options;
		
	    while(options.length>0)
		{
			options[options.length-1] = null; 
		}
	for(var i=0; i<roomTypes.rooms.length; i++)
		addOption(rooms,roomTypes.rooms[i],'room'+i,true,true);
}

/*
* Формирует список отелей согласно выбранной стране
*/
function fillHotelsList(){
	var selectedCountry = document.getElementById('country').options.selectedIndex;
	
	var hotels = document.getElementById('hotels');
		
		var myCountry  = getCountryName(selectedCountry),
		    options = hotels.options;
		while(options.length>0)
		{
			options[options.length-1] = null; 
		}
		
		switch(myCountry){
			case 'Египет':
				for(var i=0 ;i< data.country[3].hotelsName.length;i++)
					addOption(hotels,data.country[3].hotelsName[i],'hotel',true,true);
			break;
			
			case 'Турция':
				for(var i=0 ;i< data.country[2].hotelsName.length;i++)
				    addOption(hotels,data.country[2].hotelsName[i],'hotel',true,true);
			break;
			
			case 'Вьетнам':
				for(var i=0 ;i< data.country[1].hotelsName.length;i++)
					addOption(hotels,data.country[1].hotelsName[i],'hotel',true,true);
			break;
			
			case 'Англия':
				for(var i=0 ;i< data.country[0].hotelsName.length;i++)
					addOption(hotels,data.country[0].hotelsName[i],'hotel',true,true);
			break;
			
			case 'Дубаи':	
				for(var i=0 ;i< data.country[4].hotelsName.length;i++)
					addOption(hotels,data.country[4].hotelsName[i],'hotel',true,true);
			break;
				
		}
};

/*
* Добавляет тэг option
* @param {WebElement} listbox (<list> в который необходимо добавить тэг)
* @param {string} text (значение заключенное в тэг)
* @param {string} value (значение атрибута 'value')
* @param {boolean} isDefaultSelected (выбран ли по умолчанию)
* @param {boolean} isSelected (выбрать элемент)
*/
function addOption (listbox, text, value, isDefaultSelected, isSelected){
	 var myOption = document.createElement('option');
	 
		myOption.appendChild(document.createTextNode(text));
		myOption.setAttribute("value", value);
		myOption.setAttribute("class","option-style");
  if (isDefaultSelected) 
	  myOption.defaultSelected = true;
  else if(isSelected) 
	  myOption.selected = true;

	listbox.appendChild(myOption);

}





