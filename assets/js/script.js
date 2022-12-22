if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js');
}

document.addEventListener('DOMContentLoaded', (event) => {
	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});

	var spinner_container = document.querySelector('#spinner-container');
	var section_main = document.querySelector('#section-main');

	// section_main.style.display = 'none';
	spinner_container.style.display = 'block';

	for (let [product, flavors] of Object.entries(products)) {
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

	document.querySelector('select[id="product"]').addEventListener('change', (event2) => {
		document.querySelectorAll('select[id="flavor"] option').forEach(e => e.style.display = 'none');

		let flavors = event2.target.selectedOptions[0].dataset['flavors'].split(',');

		flavors.forEach((flavor) => {
			document.querySelector('select[id="flavor"] option[value="' + flavor + '"]').style.display = 'block';
		});

		document.querySelector('select[id="flavor"]').value = document.querySelector('select[id="flavor"] option[value="' + flavors[0] + '"]').value;

		calculate_values();
	});

	document.querySelector('select[id="flavor"]').addEventListener('change', (event2) => {
		calculate_values();
	});

	document.querySelectorAll('#amount, #amount2').forEach((e) => {
		e.addEventListener('keypress', (event2) => {
			let charCode = event2.which ? event2.which : event2.keyCode;
			if ( charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57) ) {
				event2.preventDefault();
				return false;
			}
		}, false);

		['input', 'change'].forEach((type) => {
			e.addEventListener((type), (event3) => {
				if ( !isNaN( parseFloat(e.value) ) ) {
					calculate_values();
				}
			});
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
		let amount = parseFloat( document.querySelector('#amount').value );
		let amount2 = parseFloat( document.querySelector('#amount2').value );

		let ri = {
			'kcal': 2000,
			'kj': 8400,
			'fat': 70,
			'fat_saturated': 20,
			'cholesterol': 300,
			'carbohydrate': 260,
			'carbohydrate_sugars': 90,
			'carbohydrate_sugars_added': 50,
			'fiber': 28,
			'protein': 50,
			'salt': 6,
			'vitamin_a': 800,
			'vitamin_b1_thiamine': 1.1,
			'vitamin_b2_riboflavin': 1.4,
			'vitamin_b3_niacin': 16,
			'vitamin_b5_pantothenic_acid': 6,
			'vitamin_b6': 1.4,
			'vitamin_b7_biotin': 50,
			'vitamin_b9_folic_acid': 200,
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
			'selenium': 55,
			'chromium': 40,
			'molybdenum': 50,
			'iodine': 150,
			'fluoride': 3.5,
			'choline': 500
		};

		document.querySelector('#product-link').href = products[product][flavor]['url'];

		document.querySelector('#kcal').textContent = number_format.format( parseFloat( products[product][flavor]['kcal'] ) * amount );
		document.querySelector('#kj').textContent = number_format.format( parseFloat( products[product][flavor]['kj'] ) * amount );

		document.querySelector('#fat').textContent = number_format.format( parseFloat( products[product][flavor]['fat'] ) * amount );
		document.querySelector('#fat-saturated').textContent = number_format.format( parseFloat( products[product][flavor]['fat_saturated'] ) * amount );

		if (products[product][flavor]['fat_monounsaturated'] !== undefined) {
			document.querySelector('#fat-monounsaturated').textContent = number_format.format( parseFloat( products[product][flavor]['fat_monounsaturated'] ) * amount );
			document.querySelector('#fat-monounsaturated-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fat_monounsaturated'] ) * amount ) * amount2 );
			document.querySelector('#fat-monounsaturated-container').style.display = 'flex';
		} else {
			document.querySelector('#fat-monounsaturated-container').style.display = 'none';
		}

		if (products[product][flavor]['fat_polyunsaturated'] !== undefined) {
			document.querySelector('#fat-polyunsaturated').textContent = number_format.format( parseFloat( products[product][flavor]['fat_polyunsaturated'] ) * amount );
			document.querySelector('#fat-polyunsaturated-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fat_polyunsaturated'] ) * amount ) * amount2 );
			document.querySelector('#fat-polyunsaturated-container').style.display = 'flex';
		} else {
			document.querySelector('#fat-polyunsaturated-container').style.display = 'none';
		}

		if (products[product][flavor]['fat_trans'] !== undefined) {
			document.querySelector('#fat-trans').textContent = number_format.format( parseFloat( products[product][flavor]['fat_trans'] ) * amount );
			document.querySelector('#fat-trans-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fat_trans'] ) * amount ) * amount2 );
			document.querySelector('#fat-trans-container').style.display = 'flex';
		} else {
			document.querySelector('#fat-trans-container').style.display = 'none';
		}

		if (products[product][flavor]['cholesterol'] !== undefined) {
			document.querySelector('#cholesterol').textContent = number_format.format( parseFloat( products[product][flavor]['cholesterol'] ) * amount );
			document.querySelector('#cholesterol-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['cholesterol'] ) * amount ) / ri['cholesterol'] );
			document.querySelector('#cholesterol-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['cholesterol'] ) * amount ) * amount2 );
			document.querySelector('#cholesterol-container').style.display = 'flex';
		} else {
			document.querySelector('#cholesterol-container').style.display = 'none';
		}

		document.querySelector('#carbohydrate').textContent = number_format.format( parseFloat( products[product][flavor]['carbohydrate'] ) * amount );
		document.querySelector('#carbohydrate-sugars').textContent = number_format.format( parseFloat( products[product][flavor]['carbohydrate_sugars'] ) * amount );

		if (products[product][flavor]['carbohydrate_sugars_added'] !== undefined) {
			document.querySelector('#carbohydrate-sugars-added').textContent = number_format.format( parseFloat( products[product][flavor]['carbohydrate_sugars_added'] ) * amount );
			document.querySelector('#carbohydrate-sugars-added-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['carbohydrate_sugars_added'] ) * amount ) / ri['carbohydrate_sugars_added'] );
			document.querySelector('#carbohydrate-sugars-added-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['carbohydrate_sugars_added'] ) * amount ) * amount2 );
			document.querySelector('#carbohydrate-sugars-added-container').style.display = 'flex';
		} else {
			document.querySelector('#carbohydrate-sugars-added-container').style.display = 'none';
		}

		document.querySelector('#fiber').textContent = number_format.format( parseFloat( products[product][flavor]['fiber'] ) * amount );

		if (products[product][flavor]['fiber_soluble'] !== undefined) {
			document.querySelector('#fiber-soluble').textContent = number_format.format( parseFloat( products[product][flavor]['fiber_soluble'] ) * amount );
			document.querySelector('#fiber-soluble-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fiber_soluble'] ) * amount ) * amount2 );
			document.querySelector('#fiber-soluble-container').style.display = 'flex';
		} else {
			document.querySelector('#fiber-soluble-container').style.display = 'none';
		}

		document.querySelector('#protein').textContent = number_format.format( parseFloat( products[product][flavor]['protein'] ) * amount );
		document.querySelector('#salt').textContent = number_format.format( parseFloat( products[product][flavor]['salt'] ) * amount );
		document.querySelector('#vitamin-a').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_a'] ) * amount );
		document.querySelector('#vitamin-b1').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b1_thiamine'] ) * amount );
		document.querySelector('#vitamin-b2').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b2_riboflavin'] ) * amount );
		document.querySelector('#vitamin-b3').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b3_niacin'] ) * amount );
		document.querySelector('#vitamin-b5').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b5_pantothenic_acid'] ) * amount );
		document.querySelector('#vitamin-b6').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b6'] ) * amount );
		document.querySelector('#vitamin-b7').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b7_biotin'] ) * amount );
		document.querySelector('#vitamin-b9').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b9_folic_acid'] ) * amount );
		document.querySelector('#vitamin-b12').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_b12'] ) * amount );
		document.querySelector('#vitamin-c').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_c'] ) * amount );
		document.querySelector('#vitamin-d').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_d'] ) * amount );
		document.querySelector('#vitamin-e').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_e'] ) * amount );
		document.querySelector('#vitamin-k').textContent = number_format.format( parseFloat( products[product][flavor]['vitamin_k'] ) * amount );
		document.querySelector('#potassium').textContent = number_format.format( parseFloat( products[product][flavor]['potassium'] ) * amount );
		document.querySelector('#chloride').textContent = number_format.format( parseFloat( products[product][flavor]['chloride'] ) * amount );
		document.querySelector('#calcium').textContent = number_format.format( parseFloat( products[product][flavor]['calcium'] ) * amount );
		document.querySelector('#phosphorus').textContent = number_format.format( parseFloat( products[product][flavor]['phosphorus'] ) * amount );
		document.querySelector('#magnesium').textContent = number_format.format( parseFloat( products[product][flavor]['magnesium'] ) * amount );
		document.querySelector('#iron').textContent = number_format.format( parseFloat( products[product][flavor]['iron'] ) * amount );
		document.querySelector('#zinc').textContent = number_format.format( parseFloat( products[product][flavor]['zinc'] ) * amount );
		document.querySelector('#copper').textContent = number_format.format( parseFloat( products[product][flavor]['copper'] ) * amount );
		document.querySelector('#manganese').textContent = number_format.format( parseFloat( products[product][flavor]['manganese'] ) * amount );
		document.querySelector('#selenium').textContent = number_format.format( parseFloat( products[product][flavor]['selenium'] ) * amount );
		document.querySelector('#chromium').textContent = number_format.format( parseFloat( products[product][flavor]['chromium'] ) * amount );
		document.querySelector('#molybdenum').textContent = number_format.format( parseFloat( products[product][flavor]['molybdenum'] ) * amount );
		document.querySelector('#iodine').textContent = number_format.format( parseFloat( products[product][flavor]['iodine'] ) * amount );

		document.querySelector('#kcal-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['kcal'] ) * amount ) / ri['kcal'] );
		document.querySelector('#kj-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['kj'] ) * amount ) / ri['kj'] );
		document.querySelector('#fat-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['fat'] ) * amount ) / ri['fat'] );
		document.querySelector('#fat-saturated-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['fat_saturated'] ) * amount ) / ri['fat_saturated'] );
		document.querySelector('#carbohydrate-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['carbohydrate'] ) * amount ) / ri['carbohydrate'] );
		document.querySelector('#carbohydrate-sugars-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['carbohydrate_sugars'] ) * amount ) / ri['carbohydrate_sugars'] );
		document.querySelector('#fiber-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['fiber'] ) * amount ) / ri['fiber'] );
		document.querySelector('#protein-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['protein'] ) * amount ) / ri['protein'] );
		document.querySelector('#salt-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['salt'] ) * amount ) / ri['salt'] );
		document.querySelector('#vitamin-a-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_a'] ) * amount ) / ri['vitamin_a'] );
		document.querySelector('#vitamin-b1-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b1_thiamine'] ) * amount ) / ri['vitamin_b1_thiamine'] );
		document.querySelector('#vitamin-b2-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b2_riboflavin'] ) * amount ) / ri['vitamin_b2_riboflavin'] );
		document.querySelector('#vitamin-b3-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b3_niacin'] ) * amount ) / ri['vitamin_b3_niacin'] );
		document.querySelector('#vitamin-b5-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b5_pantothenic_acid'] ) * amount ) / ri['vitamin_b5_pantothenic_acid'] );
		document.querySelector('#vitamin-b6-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b6'] ) * amount ) / ri['vitamin_b6'] );
		document.querySelector('#vitamin-b7-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b7_biotin'] ) * amount ) / ri['vitamin_b7_biotin'] );
		document.querySelector('#vitamin-b9-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b9_folic_acid'] ) * amount ) / ri['vitamin_b9_folic_acid'] );
		document.querySelector('#vitamin-b12-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_b12'] ) * amount ) / ri['vitamin_b12'] );
		document.querySelector('#vitamin-c-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_c'] ) * amount ) / ri['vitamin_c'] );
		document.querySelector('#vitamin-d-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_d'] ) * amount ) / ri['vitamin_d'] );
		document.querySelector('#vitamin-e-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_e'] ) * amount ) / ri['vitamin_e'] );
		document.querySelector('#vitamin-k-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['vitamin_k'] ) * amount ) / ri['vitamin_k'] );
		document.querySelector('#potassium-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['potassium'] ) * amount ) / ri['potassium'] );
		document.querySelector('#chloride-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['chloride'] ) * amount ) / ri['chloride'] );
		document.querySelector('#calcium-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['calcium'] ) * amount ) / ri['calcium'] );
		document.querySelector('#phosphorus-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['phosphorus'] ) * amount ) / ri['phosphorus'] );
		document.querySelector('#magnesium-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['magnesium'] ) * amount ) / ri['magnesium'] );
		document.querySelector('#iron-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['iron'] ) * amount ) / ri['iron'] );
		document.querySelector('#zinc-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['zinc'] ) * amount ) / ri['zinc'] );
		document.querySelector('#copper-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['copper'] ) * amount ) / ri['copper'] );
		document.querySelector('#manganese-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['manganese'] ) * amount ) / ri['manganese'] );
		document.querySelector('#selenium-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['selenium'] ) * amount ) / ri['selenium'] );
		document.querySelector('#chromium-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['chromium'] ) * amount ) / ri['chromium'] );
		document.querySelector('#molybdenum-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['molybdenum'] ) * amount ) / ri['molybdenum'] );
		document.querySelector('#iodine-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['iodine'] ) * amount ) / ri['iodine'] );

		document.querySelector('#kcal-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['kcal'] ) * amount ) * amount2 );
		document.querySelector('#kj-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['kj'] ) * amount ) * amount2 );
		document.querySelector('#fat-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fat'] ) * amount ) * amount2 );
		document.querySelector('#fat-saturated-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fat_saturated'] ) * amount ) * amount2 );
		document.querySelector('#carbohydrate-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['carbohydrate'] ) * amount ) * amount2 );
		document.querySelector('#carbohydrate-sugars-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['carbohydrate_sugars'] ) * amount ) * amount2 );
		document.querySelector('#fiber-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fiber'] ) * amount ) * amount2 );
		document.querySelector('#protein-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['protein'] ) * amount ) * amount2 );
		document.querySelector('#salt-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['salt'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-a-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_a'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b1-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b1_thiamine'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b2-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b2_riboflavin'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b3-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b3_niacin'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b5-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b5_pantothenic_acid'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b6-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b6'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b7-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b7_biotin'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b9-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b9_folic_acid'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-b12-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_b12'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-c-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_c'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-d-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_d'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-e-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_e'] ) * amount ) * amount2 );
		document.querySelector('#vitamin-k-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['vitamin_k'] ) * amount ) * amount2 );
		document.querySelector('#potassium-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['potassium'] ) * amount ) * amount2 );
		document.querySelector('#chloride-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['chloride'] ) * amount ) * amount2 );
		document.querySelector('#calcium-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['calcium'] ) * amount ) * amount2 );
		document.querySelector('#phosphorus-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['phosphorus'] ) * amount ) * amount2 );
		document.querySelector('#magnesium-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['magnesium'] ) * amount ) * amount2 );
		document.querySelector('#iron-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['iron'] ) * amount ) * amount2 );
		document.querySelector('#zinc-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['zinc'] ) * amount ) * amount2 );
		document.querySelector('#copper-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['copper'] ) * amount ) * amount2 );
		document.querySelector('#manganese-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['manganese'] ) * amount ) * amount2 );
		document.querySelector('#selenium-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['selenium'] ) * amount ) * amount2 );
		document.querySelector('#chromium-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['chromium'] ) * amount ) * amount2 );
		document.querySelector('#molybdenum-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['molybdenum'] ) * amount ) * amount2 );
		document.querySelector('#iodine-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['iodine'] ) * amount ) * amount2 );

		if (products[product][flavor]['fluoride'] !== undefined) {
			document.querySelector('#fluoride').textContent = number_format.format( parseFloat( products[product][flavor]['fluoride'] ) * amount );
			document.querySelector('#fluoride-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['fluoride'] ) * amount ) / ri['fluoride'] );
			document.querySelector('#fluoride-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['fluoride'] ) * amount ) * amount2 );
			document.querySelector('#fluoride-container').style.display = 'flex';
		} else {
			document.querySelector('#fluoride-container').style.display = 'none';
		}

		if (products[product][flavor]['choline'] !== undefined) {
			document.querySelector('#choline').textContent = number_format.format( parseFloat( products[product][flavor]['choline'] ) * amount );
			document.querySelector('#choline-ri').textContent = percent_format.format( ( parseFloat( products[product][flavor]['choline'] ) * amount ) / ri['choline'] );
			document.querySelector('#choline-x').textContent = number_format.format( ( parseFloat( products[product][flavor]['choline'] ) * amount ) * amount2 );
			document.querySelector('#choline-container').style.display = 'flex';
		} else {
			document.querySelector('#choline-container').style.display = 'none';
		}
	}


	/* function calculate_values2() {
		document.querySelector('#amount-result').value = parseFloat( ( parseFloat(document.querySelector('#amount3').value) / parseFloat(document.querySelector('#amount4').value) ).toPrecision(10) );
	}

	document.querySelectorAll('#amount3, #amount4').forEach((e) => {
		['input', 'change'].forEach((type) => {
			e.addEventListener((type), (event2) => {
				calculate_values2();
			});
		});

		e.addEventListener('click', (event3) => {
			event3.target.select();
		});
	});

	document.querySelector('#amount-result').addEventListener('click', (event2) => {
		event2.target.select();
		document.execCommand('copy');
	});

	calculate_values2(); */
});