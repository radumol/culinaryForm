//Assignment 2
//COMP2406
//Radu Molea (100992298)
///////////////////////////////////////////////////////////////////
//Calling functions for dropMenu and the two buttons
filenamesMenu();
window.addEventListener('load', function () {
    document.getElementById('view').addEventListener('click', viewButton);
});
window.addEventListener('load', function () {
    document.getElementById('update').addEventListener('click', updateButton);
});
/////////////////////////////////////////////////////////////////
var recipe;
var recipeNames;

//the dropdown menu, gets an array of recipe's filenames and populates the menu
function filenamesMenu(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "/recipes/");
	xhr.addEventListener('load', function(){
		recipeNames = JSON.parse(xhr.responseText);
		
		select = document.getElementById('recipesDrop');
		for (r in recipeNames){
			select.add(new Option(recipeNames[r].replace(/_/g," ").replace(".json", ""), recipeNames[r]));
		}
	});
	xhr.send();
}
//accesses the /recipes file directory and gets the contents of recipe in question and displays it
function viewButton(){
	var xhr = new XMLHttpRequest();
	
	var url = document.getElementById('recipesDrop').value;
	xhr.open("GET", "recipes/" + url);
	xhr.addEventListener('load', function(){
				recipe = JSON.parse(xhr.responseText);
				document.getElementById("duration").value = recipe.duration;
				document.getElementById("ingredients").value = recipe.ingredients;
				document.getElementById("directions").value = recipe.directions;
				document.getElementById("notes").value = recipe.notes;
	});
	xhr.send();
}

//sends post message to server with the data of the new recipe and dislpays green chekmark once pressed
function updateButton(){
	var post = new XMLHttpRequest();
	post.open("POST", "/recipes/");
	var jsonRecipe = {"name": recipe.name,
							"duration": document.getElementById("duration").value,
							"ingredients": [document.getElementById("ingredients").value],
							"directions": [document.getElementById("directions").value],
							"notes": document.getElementById("notes").value};
	var index = document.getElementById("recipesDrop").selectedIndex;
	post.send(recipeNames[index] + JSON.stringify(jsonRecipe));
	post.onload = function () {
		if(post.status === 200){
			document.getElementById("checkmark").style.visibility = "visible";
			setTimeout(function() {
				document.getElementById("checkmark").style.visibility = "hidden";
			}, 3000);
		}
	};
}
