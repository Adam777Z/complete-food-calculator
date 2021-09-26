document.addEventListener('DOMContentLoaded', (event) => {
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});

	var spinner_container = document.querySelector('#spinner-container');
	var section_main = document.querySelector('#section-main');

	// section_main.style.display = 'none';
	spinner_container.style.display = 'block';

	for (let [product, flavors] of Object.entries(complete_food)) {
		let flavors_list = '';

		for (let [flavor, value] of Object.entries(flavors)) {
			if (flavors_list.length) {
				flavors_list += ',';
			}

			flavors_list += flavor;

			if (!document.querySelector('select[id="flavor"] option[value="' + flavor + '"]')) {
				let option = document.createElement('option');
				option.value = flavor;
				option.text = flavor;
				option.style.display = 'none';
				document.querySelector('select[id="flavor"]').add(option);
			}
		}

		let option = document.createElement('option');
		option.value = product;
		option.text = product;
		option.dataset['flavors'] = flavors_list;
		document.querySelector('select[id="product"]').add(option);
	}

	document.querySelector('select[id="product"]').addEventListener('change', (event) => {
		document.querySelectorAll('select[id="flavor"] option').forEach(e => e.style.display = 'none');

		let flavors = event.target.selectedOptions[0].dataset['flavors'].split(',');

		flavors.forEach((flavor) => {
			document.querySelector('select[id="flavor"] option[value="' + flavor + '"]').style.display = 'block';
		});

		document.querySelector('select[id="flavor"]').value = document.querySelector('select[id="flavor"] option[value="' + flavors[0] + '"]').value;

		calculate_values();
	});

	document.querySelector('select[id="flavor"]').addEventListener('change', (event) => {
		calculate_values();
	});

	['input', 'change'].forEach((type) => {
		document.querySelector('#amount').addEventListener(type, (event) => {
			calculate_values();
		});
	});

	document.querySelector('select[id="product"]').dispatchEvent(new Event('change'));

	spinner_container.style.display = 'none';
	section_main.style.display = 'block';

	function calculate_values() {
		const number_format = new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 });
		const percent_format = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 });

		let product = document.querySelector('select[id="product"]').value;
		let flavor = document.querySelector('select[id="flavor"]').value;
		let amount = parseInt( document.querySelector('#amount').value );

		let ri = {
			'kcal': 2000,
			'kj': 8400,
			'fat': 70,
			'fat_saturated': 20,
			'carbohydrate': 260,
			'carbohydrate_sugars': 90,
			'fiber': 28,
			'protein': 50,
			'salt': 6,
			'vitamin_a': 800,
			'vitamin_b1': 1.1,
			'vitamin_b2': 1.4,
			'vitamin_b3': 16,
			'vitamin_b5': 6,
			'vitamin_b6': 1.4,
			'vitamin_b7': 50,
			'vitamin_b9': 200,
			'vitamin_b12': 2.5,
			'vitamin_c': 80,
			'vitamin_d': 5,
			'vitamin_e': 12,
			'vitamin_k': 75,
			'potassium': 2000,
			'chloride': 800,
			'calcium': 800,
			'phosphorus': 700,
			'magnesium': 375,
			'iron': 14,
			'zinc': 10,
			'copper': 1,
			'manganese': 2,
			// 'fluoride_mg': 3.5,
			'selenium': 55,
			'chromium': 40,
			'molybdenum': 50,
			'iodine': 150,
		};

		document.querySelector('#kcal').textContent = number_format.format( parseFloat( complete_food[product][flavor]['kcal'] ) * amount );
		document.querySelector('#kj').textContent = number_format.format( parseFloat( complete_food[product][flavor]['kj'] ) * amount );

		document.querySelector('#fat').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fat'] ) * amount );
		document.querySelector('#fat-saturated').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fat_saturated'] ) * amount );

		if (complete_food[product][flavor]['fat_polyunsaturated'] !== undefined) {
			document.querySelector('#fat-polyunsaturated').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fat_polyunsaturated'] ) * amount );
			document.querySelector('#fat-polyunsaturated-container').style.display = 'flex';
		} else {
			document.querySelector('#fat-polyunsaturated-container').style.display = 'none';
		}

		if (complete_food[product][flavor]['fat_monounsaturated'] !== undefined) {
			document.querySelector('#fat-monounsaturated').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fat_monounsaturated'] ) * amount );
			document.querySelector('#fat-monounsaturated-container').style.display = 'flex';
		} else {
			document.querySelector('#fat-monounsaturated-container').style.display = 'none';
		}

		if (complete_food[product][flavor]['fat_trans'] !== undefined) {
			document.querySelector('#fat-trans').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fat_trans'] ) * amount );
			document.querySelector('#fat-trans-container').style.display = 'flex';
		} else {
			document.querySelector('#fat-trans-container').style.display = 'none';
		}

		document.querySelector('#carbohydrate').textContent = number_format.format( parseFloat( complete_food[product][flavor]['carbohydrate'] ) * amount );
		document.querySelector('#carbohydrate-sugars').textContent = number_format.format( parseFloat( complete_food[product][flavor]['carbohydrate_sugars'] ) * amount );

		if (complete_food[product][flavor]['carbohydrate_sugars_added'] !== undefined) {
			document.querySelector('#carbohydrate-sugars-added').textContent = number_format.format( parseFloat( complete_food[product][flavor]['carbohydrate_sugars_added'] ) * amount );
			document.querySelector('#carbohydrate-sugars-added-container').style.display = 'flex';
		} else {
			document.querySelector('#carbohydrate-sugars-added-container').style.display = 'none';
		}

		document.querySelector('#fiber').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fiber'] ) * amount );

		if (complete_food[product][flavor]['fiber_soluble'] !== undefined) {
			document.querySelector('#fiber-soluble').textContent = number_format.format( parseFloat( complete_food[product][flavor]['fiber_soluble'] ) * amount );
			document.querySelector('#fiber-soluble-container').style.display = 'flex';
		} else {
			document.querySelector('#fiber-soluble-container').style.display = 'none';
		}

		document.querySelector('#protein').textContent = number_format.format( parseFloat( complete_food[product][flavor]['protein'] ) * amount );
		document.querySelector('#salt').textContent = number_format.format( parseFloat( complete_food[product][flavor]['salt'] ) * amount );
		document.querySelector('#vitamin-a').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_a'] ) * amount );
		document.querySelector('#vitamin-b1').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b1'] ) * amount );
		document.querySelector('#vitamin-b2').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b2'] ) * amount );
		document.querySelector('#vitamin-b3').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b3'] ) * amount );
		document.querySelector('#vitamin-b5').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b5'] ) * amount );
		document.querySelector('#vitamin-b6').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b6'] ) * amount );
		document.querySelector('#vitamin-b7').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b7'] ) * amount );
		document.querySelector('#vitamin-b9').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b9'] ) * amount );
		document.querySelector('#vitamin-b12').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_b12'] ) * amount );
		document.querySelector('#vitamin-c').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_c'] ) * amount );
		document.querySelector('#vitamin-d').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_d'] ) * amount );
		document.querySelector('#vitamin-e').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_e'] ) * amount );
		document.querySelector('#vitamin-k').textContent = number_format.format( parseFloat( complete_food[product][flavor]['vitamin_k'] ) * amount );
		document.querySelector('#potassium').textContent = number_format.format( parseFloat( complete_food[product][flavor]['potassium'] ) * amount );
		document.querySelector('#chloride').textContent = number_format.format( parseFloat( complete_food[product][flavor]['chloride'] ) * amount );
		document.querySelector('#calcium').textContent = number_format.format( parseFloat( complete_food[product][flavor]['calcium'] ) * amount );
		document.querySelector('#phosphorus').textContent = number_format.format( parseFloat( complete_food[product][flavor]['phosphorus'] ) * amount );
		document.querySelector('#magnesium').textContent = number_format.format( parseFloat( complete_food[product][flavor]['magnesium'] ) * amount );
		document.querySelector('#iron').textContent = number_format.format( parseFloat( complete_food[product][flavor]['iron'] ) * amount );
		document.querySelector('#zinc').textContent = number_format.format( parseFloat( complete_food[product][flavor]['zinc'] ) * amount );
		document.querySelector('#copper').textContent = number_format.format( parseFloat( complete_food[product][flavor]['copper'] ) * amount );
		document.querySelector('#manganese').textContent = number_format.format( parseFloat( complete_food[product][flavor]['manganese'] ) * amount );
		document.querySelector('#selenium').textContent = number_format.format( parseFloat( complete_food[product][flavor]['selenium'] ) * amount );
		document.querySelector('#chromium').textContent = number_format.format( parseFloat( complete_food[product][flavor]['chromium'] ) * amount );
		document.querySelector('#molybdenum').textContent = number_format.format( parseFloat( complete_food[product][flavor]['molybdenum'] ) * amount );
		document.querySelector('#iodine').textContent = number_format.format( parseFloat( complete_food[product][flavor]['iodine'] ) * amount );

		document.querySelector('#kcal-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['kcal'] ) * amount ) / ri['kcal'] );
		document.querySelector('#kj-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['kj'] ) * amount ) / ri['kj'] );
		document.querySelector('#fat-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['fat'] ) * amount ) / ri['fat'] );
		document.querySelector('#fat-saturated-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['fat_saturated'] ) * amount ) / ri['fat_saturated'] );
		document.querySelector('#carbohydrate-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['carbohydrate'] ) * amount ) / ri['carbohydrate'] );
		document.querySelector('#carbohydrate-sugars-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['carbohydrate_sugars'] ) * amount ) / ri['carbohydrate_sugars'] );
		document.querySelector('#fiber-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['fiber'] ) * amount ) / ri['fiber'] );
		document.querySelector('#protein-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['protein'] ) * amount ) / ri['protein'] );
		document.querySelector('#salt-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['salt'] ) * amount ) / ri['salt'] );
		document.querySelector('#vitamin-a-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_a'] ) * amount ) / ri['vitamin_a'] );
		document.querySelector('#vitamin-b1-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b1'] ) * amount ) / ri['vitamin_b1'] );
		document.querySelector('#vitamin-b2-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b2'] ) * amount ) / ri['vitamin_b2'] );
		document.querySelector('#vitamin-b3-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b3'] ) * amount ) / ri['vitamin_b3'] );
		document.querySelector('#vitamin-b5-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b5'] ) * amount ) / ri['vitamin_b5'] );
		document.querySelector('#vitamin-b6-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b6'] ) * amount ) / ri['vitamin_b6'] );
		document.querySelector('#vitamin-b7-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b7'] ) * amount ) / ri['vitamin_b7'] );
		document.querySelector('#vitamin-b9-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b9'] ) * amount ) / ri['vitamin_b9'] );
		document.querySelector('#vitamin-b12-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_b12'] ) * amount ) / ri['vitamin_b12'] );
		document.querySelector('#vitamin-c-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_c'] ) * amount ) / ri['vitamin_c'] );
		document.querySelector('#vitamin-d-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_d'] ) * amount ) / ri['vitamin_d'] );
		document.querySelector('#vitamin-e-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_e'] ) * amount ) / ri['vitamin_e'] );
		document.querySelector('#vitamin-k-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['vitamin_k'] ) * amount ) / ri['vitamin_k'] );
		document.querySelector('#potassium-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['potassium'] ) * amount ) / ri['potassium'] );
		document.querySelector('#chloride-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['chloride'] ) * amount ) / ri['chloride'] );
		document.querySelector('#calcium-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['calcium'] ) * amount ) / ri['calcium'] );
		document.querySelector('#phosphorus-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['phosphorus'] ) * amount ) / ri['phosphorus'] );
		document.querySelector('#magnesium-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['magnesium'] ) * amount ) / ri['magnesium'] );
		document.querySelector('#iron-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['iron'] ) * amount ) / ri['iron'] );
		document.querySelector('#zinc-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['zinc'] ) * amount ) / ri['zinc'] );
		document.querySelector('#copper-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['copper'] ) * amount ) / ri['copper'] );
		document.querySelector('#manganese-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['manganese'] ) * amount ) / ri['manganese'] );
		document.querySelector('#selenium-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['selenium'] ) * amount ) / ri['selenium'] );
		document.querySelector('#chromium-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['chromium'] ) * amount ) / ri['chromium'] );
		document.querySelector('#molybdenum-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['molybdenum'] ) * amount ) / ri['molybdenum'] );
		document.querySelector('#iodine-ri').textContent = percent_format.format( ( parseFloat( complete_food[product][flavor]['iodine'] ) * amount ) / ri['iodine'] );
	}


	function calculate_values2() {
		document.querySelector('#amount-result').value = parseFloat(document.querySelector('#amount2').value) / parseFloat(document.querySelector('#amount3').value);
	}

	document.querySelectorAll('#amount2, #amount3').forEach((e) => {
		['input', 'change'].forEach((event) => {
			e.addEventListener((event), (event2) => {
				calculate_values2();
			});
		});

		e.addEventListener('click', (event) => {
			event.target.select();
		});
	});

	document.querySelector('#amount-result').addEventListener('click', (event) => {
		event.target.select();
		document.execCommand('copy');
	});

	calculate_values2();
});