//-----------------------------------------
// NAME        : Oluwanifemi Paul Tawoju
// STUDENT NUMBER : 7980612
// COURSE      : COMP 2150
// INSTRUCTOR  : Olivier Tremblay-Savard
// ASSIGNMENT  : Assignment 4
// QUESTION    : Question 2      
// 
// REMARKS: This program defines button-related classes for interacting with 
//          the game's counter, including clicking and building buttons.
//-----------------------------------------

"use strict"


// CLASS: Button
//
// Author: Oluwanifemi Paul Tawoju, 7980612
//
// REMARKS: This is an abstract class representing a generic button in the game.
//          It provides basic functionality for interacting with the counter.
//
//-----------------------------------------
class Button
{
	//
	//Instance variables
	//
	#name;
	#counter;
	#htmlButton;
	
	//
	//Class constants
	//
	static get TEXT_ATTRIBUTE() { return "-text"; }
	

	//
    //Constructor
    //
    //------------------------------------------------------
    // Button
    //
    // PURPOSE: Initializes a generic button and sets up its click event listener.
    // PARAMETERS:
    //     name: The ID of the button element in the HTML.
    //     counter: The Counter object associated with this button.
    //------------------------------------------------------
	constructor(name, counter)
	{
		if (new.target === Button) // Check if the constructor is being called directly

		{
			throw new Error("Button is an abstract class and cannot be instantiated directly.");
		}
		this.#name = name;
		this.#counter = counter;
		this.#htmlButton = document.getElementById(name);
		this.#htmlButton.addEventListener('click', this.clickAction.bind(this)); // Bind the clickAction method to the current instance
	}



	//------------------------------------------------------
    // clickAction
    //
    // PURPOSE: Abstract method to define the button's click behavior.
    //------------------------------------------------------
	clickAction() //abstract method
	{
		throw new Error("clickAction() must be implemented in the derived class.");
	}
	
	//------------------------------------------------------
    // updateText
    //
    // PURPOSE: Updates the inner HTML text of the button.
    // PARAMETERS:
    //     newText: The new text to display on the button.
    //------------------------------------------------------
	//Updating the innerHTML text of the button 
	//(note that not all types of buttons have text, but I placed this here to give that code to you)
	updateText(newText)
	{
		document.getElementById(this.name + Button.TEXT_ATTRIBUTE).innerHTML = newText;
	}
	
	//
	//Accessors below that you might find useful
	//
	get name()
	{
		return this.#name;
	}

	set name(name)
	{
		this.#name = name;
	}


	
	get counter()
	{
		return this.#counter;
	}

	set counter(counter)
	{
		this.#counter = counter;
	}
	
	get htmlButton()
	{
		return this.#htmlButton;
	}
}



// CLASS: ClickingButton
//
// Author: Oluwanifemi Paul Tawoju, 7980612
//
// REMARKS: This class represents a button that increments the counter when clicked.
//
//-----------------------------------------
class ClickingButton extends Button
{
	//
    //Constructor
    //
    //------------------------------------------------------
    // ClickingButton
    //
    // PURPOSE: Initializes a clicking button.
    // PARAMETERS:
    //     name: The ID of the button element in the HTML.
    //     counter: The Counter object associated with this button.
    //------------------------------------------------------
	constructor(name, counter)
	{
		super(name, counter);
	}	


	//------------------------------------------------------
    // clickAction
    //
    // PURPOSE: Increments the counter and displays a message when the button is clicked.
    //------------------------------------------------------
	clickAction()
	{
		this.counter.addPotatoes(1);
		this.counter.showMessage("+1", 0.1);
	}
}




// CLASS: CountableClasses
//
// Author: Oluwanifemi Paul Tawoju, 7980612
//
// REMARKS: This class serves as a base for buttons that track counts and costs.
//
//-----------------------------------------
//Extra class in the hierarchy to make the code more readable and to avoid code duplication(superclass of BuildingButton and UpgradeButton)
class CountableClasses extends Button{
	#cost;
	#count;


	//------------------------------------------------------
    // CountableClasses
    //
    // PURPOSE: Initializes a countable button with a cost and count.
    // PARAMETERS:
    //     name: The ID of the button element in the HTML.
    //     counter: The Counter object associated with this button.
    //     cost: The initial cost of the button.
    //     count: The initial count (default is 0).
    //------------------------------------------------------
	constructor(name, counter, cost, count = 0){
		super(name, counter);
		this.#cost = cost;
		this.#count = count;
	}

	get cost(){
		return this.#cost;
	}

	set cost(newCost){
		this.#cost = newCost;
	}

	get count(){
		return this.#count;
	}

	
	//------------------------------------------------------
    // incrementCount
    //
    // PURPOSE: Increments the count of the button.
    //------------------------------------------------------
	incrementCount(){
		this.#count++;
		
	}



}



// CLASS: BuildingButton
//
// Author: Oluwanifemi Paul Tawoju, 7980612
//
// REMARKS: This class represents a button for purchasing buildings that increase PPS.
//
//-----------------------------------------
class BuildingButton extends CountableClasses
{
	#buildingRate; //building rate
	//
	//Constructor
	//
	//------------------------------------------------------
    // BuildingButton
    //
    // PURPOSE: Initializes a building button with a rate and upgrade multiplier.
    // PARAMETERS:
    //     name: The ID of the button element in the HTML.
    //     counter: The Counter object associated with this button.
    //     price: The initial price of the building.
    //     rate: The rate at which the building increases PPS.
    //------------------------------------------------------
	constructor(name, counter, price, rate)
	{
		super(name, counter, price);
		this.#buildingRate = rate;
		this.#updateBuildingButtonText();
	}	



	//------------------------------------------------------
    // clickAction
    //
    // PURPOSE: Handles the purchase of a building, updating the count and cost.
    //------------------------------------------------------
	clickAction()
	{
		if (this.counter.subtractPotatoes(this.cost)) //if the player has enough potatoes to buy the building
		{
			this.incrementCount(); //increment the building count
			this.cost = Math.round(this.cost * 1.5);
			

			this.counter.updateRate(this.#buildingRate); //update rate of counter
			this.#updateBuildingButtonText();
		
		} else {
			this.counter.showMessage("Not enough potatoes!");
		}
	}

	getBuildingRate()
	{
		return this.#buildingRate;
	}

	

	#updateBuildingButtonText(){
		this.updateText(`${this.count} ${this.name}<br>Cost: ${Math.round(this.cost)}<br>Adds: ${this.#buildingRate} pps`);

	}



	
	//------------------------------------------------------
    // upgradeBuildingButton
    //
    // PURPOSE: Upgrades the building by applying a multiplier to its production rate.
    // PARAMETERS:
    //     upgradeMultiplier: The multiplier to apply to the building's production rate.
    //------------------------------------------------------
	upgradeBuildingButton(upgradeMultiplier){

		// Update the counter's rate calculation
		if (this.count > 0) {
			// Adjust the rate in the counter by the difference in production
			const oldBuildingProduction = this.#buildingRate * this.count;

			const newBuildingProduction = oldBuildingProduction * upgradeMultiplier;
			
			const differenceProduction = newBuildingProduction - oldBuildingProduction;

			this.counter.updateRate(differenceProduction);
		}

		this.#buildingRate = this.#buildingRate * upgradeMultiplier; //update the building rate to the new value
		this.#updateBuildingButtonText();


	}
}



// CLASS: UpgradeButton
//
// Author: Oluwanifemi Paul Tawoju, 7980612
//
// REMARKS: This class represents a button for purchasing upgrades that enhance
//          the production rate of associated buildings.
//
//-----------------------------------------
class UpgradeButton extends CountableClasses
{
	
	#buildingButton; // The associated building button
    #upgradeMultiplier; // Multiplier for the upgrade

    //
    // Constructor
    //
    //------------------------------------------------------
    // UpgradeButton
    //
    // PURPOSE: Initializes an upgrade button with a multiplier and associated building.
    // PARAMETERS:
    //     upgradeButtonName: The ID of the upgrade button element in the HTML.
    //     counter: The Counter object associated with this button.
    //     price: The initial price of the upgrade.
    //     multiplier: The multiplier applied to the associated building's production rate.
    //     buildingButton: The building button associated with this upgrade.
    //------------------------------------------------------
	constructor(upgradeButtonName, counter, price, multiplier, buildingButton)
	{
		super(upgradeButtonName, counter, price);
		
		this.#buildingButton = buildingButton;
		this.#upgradeMultiplier=multiplier;
		this.#updateUpgradeButtonText();
	}	


	//------------------------------------------------------
    // clickAction
    //
    // PURPOSE: Handles the purchase of an upgrade, applying the multiplier to
    //          the associated building and updating the cost.
    //------------------------------------------------------
	clickAction(){
		// Check if player has enough potatoes
		if (this.counter.count >= this.cost) {
			// Subtract cost from counter
			this.counter.subtractPotatoes(this.cost);
			
			// Increase upgrade count
			this.incrementCount();
			
			// Apply the upgrade to the associated building
			this.#buildingButton.upgradeBuildingButton(this.#upgradeMultiplier);
			
			// Increase cost by factor of 5
			this.cost = Math.round(this.cost * 5);
			
			// Update the button text
			this.#updateUpgradeButtonText();
		} else {
			// Show message that player doesn't have enough potatoes
			this.counter.showMessage("Not enough potatoes to buy " + this.name);
		}
	}

	

	//------------------------------------------------------
    // #updateUpgradeButtonText
    //
    // PURPOSE: Updates the text displayed on the upgrade button to reflect
    //          the current count, cost, and production multiplier.
    //------------------------------------------------------
	#updateUpgradeButtonText(){
		this.updateText(`${this.count} ${this.name}<br>Cost: ${Math.round(this.cost)}<br>${this.#buildingButton.name} prod. x 2`);

	}

	

}





// CLASS: BonusButton
//
// Author: Oluwanifemi Paul Tawoju, 7980612
//
// REMARKS: This class represents a bonus button that temporarily applies a multiplier
//          to the counter's production rate for a specified duration.
//
//-----------------------------------------

class BonusButton extends Button
{
	#multiplier; //multiplier
	#duration; //duration in seconds


	//
	//Constructor
	//
	constructor(name, counter, multiplier, duration)
	{
		super(name, counter);
		this.#multiplier = multiplier;
		this.#duration = duration;
	}	


	//------------------------------------------------------
    // clickAction
    //
    // PURPOSE: Handles the click event for the bonus button. Hides the button,
    //          applies the bonus multiplier to the counter, and displays a message.
    //------------------------------------------------------
	clickAction(){
		

		// Hide the button after clicking
		this.htmlButton.classList.add("hidden");
		
		// Apply the bonus multiplier
		this.counter.applyBonus(this.#multiplier, this.#duration);
		
		// Show a message about the bonus
		const message = `${this.name.replace(" Bonus", "")} Bonus started!<br>${this.#multiplier} x pps for ${this.#duration} seconds!`;
		this.counter.showMessage(message, 5);

	}


	//------------------------------------------------------
    // showBonusButton
    //
    // PURPOSE: Displays the bonus button at a random position on the screen
    //          and hides it after 10 seconds if not clicked.
    //------------------------------------------------------
	// Method to show the bonus button
	showBonusButton() 
	{
		// Place the button at a random position
		const top = Math.floor(Math.random() * 400) + 200; // Between 200 and 600
		const left = Math.floor(Math.random() * 800) + 200; // Between 200 and 1000
		this.htmlButton.style.top = `${top}px`;
		this.htmlButton.style.left = `${left}px`;
		
		// Show the button
		this.htmlButton.classList.remove("hidden");
		
		// Hide the button after 10 seconds if not clicked
		setTimeout(() => {
			this.htmlButton.classList.add("hidden");
		}, 10000);
	}


	// Accessors
	get multiplier() 
	{
		return this.#multiplier;
	}
	
	get duration() 
	{
		return this.#duration;
	}

	
	
}		