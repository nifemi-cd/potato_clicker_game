//-----------------------------------------
// NAME        : Oluwanifemi Paul Tawoju
// REMARKS: This program manages a counter for a game, including features like 
//          tracking potatoes, applying bonuses, and updating the UI.
//-----------------------------------------

"use strict"


// CLASS: Counter
//
// Author: Oluwanifemi Paul Tawoju
//
// REMARKS: This class manages the game's counter, including potatoes count, 
//          potatoes per second (PPS), bonuses, and achievements.
//
//-----------------------------------------
class Counter
{
	//
	//Instance variables
	//
	#count;  //the current amount of potatoes held
	#name;  //id of the counter in the html file
	#htmlCounter;  //the html element representing the counter
	#htmlPPS;  //the html element representing the pps
	#htmlMessage;  //the html element for showing a message
	#htmlAchievement;  //the html element for showing an achievement
	#rate;  //the pps value
	#multiplier;  //a pps multipler (1 by default)
	#bonusButtonList;  //a list of all BonusButtons
	#totalClickedPotatoes;  //the amount of potatoes clicked
	#bonusEndTime;  //the time when the bonus ends
	
	//
	//Class constants
	//
	static get #INTERVAL() { return 50; }  //setting the interval to 50 milliseconds
	static get #SECOND_IN_MS() { return 1000; }  //one second in milliseconds
	static get DEFAULT_MESSAGE_DURATION() { return 5; }  //in seconds

	static get #BONUS_INTERVAL() { return 90; }  //in seconds, the interval for spawning bonus buttons
	
	//
    //Constructor
    //
    //------------------------------------------------------
    // Counter
    //
    // PURPOSE: Initializes the Counter object with default values and sets up
    //          the necessary HTML elements and timers.
    // PARAMETERS:
    //     name: The ID of the counter element in the HTML.
    //     pps: The ID of the PPS element in the HTML.
    //     messageBox: The ID of the message box element in the HTML.
    //     achievementBox: The ID of the achievement box element in the HTML.
    //------------------------------------------------------
	constructor(name, pps, messageBox, achievementBox)
	{
		this.#count = 0;
		this.#name = name;
		this.#htmlCounter = document.getElementById(name);
		this.#htmlPPS = document.getElementById(pps);
		this.#htmlMessage = document.getElementById(messageBox);
		this.#htmlAchievement = document.getElementById(achievementBox);
		this.#rate = 1;
		this.#multiplier = 1;
		this.#bonusButtonList = [];
		this.#totalClickedPotatoes = 0;
		this.#bonusEndTime = 0;
		this.#initCounter();
		this.#startBonusTime();
	}


	//------------------------------------------------------
    // applyBonus
    //
    // PURPOSE: Applies a multiplier bonus to the counter for a specified duration.
    // PARAMETERS:
    //     multiplier: The multiplier to apply to the counter rate.
    //     duration: The duration (in seconds) for which the bonus is active.
    //------------------------------------------------------
	// Method to apply a bonus multiplier for a duration
	applyBonus(multiplier, duration)
	{
		// Set multiplier
		this.#multiplier = multiplier;
		
		// Set end time
		this.#bonusEndTime = Date.now() + (duration * Counter.#SECOND_IN_MS);
	}


	//------------------------------------------------------
    // #startBonusTime
    //
    // PURPOSE: Starts a timer to periodically spawn bonus buttons.
    //------------------------------------------------------
	// Start timer to spawn bonus buttons
	#startBonusTime()
	{
		setInterval(() => {
			// Select a random bonus button
			if (this.#bonusButtonList.length > 0) {
				const randomIndex = Math.floor(Math.random() * this.#bonusButtonList.length);
				const randomBonus = this.#bonusButtonList[randomIndex];
				randomBonus.showBonusButton();
			}
		}, Counter.#BONUS_INTERVAL * Counter.#SECOND_IN_MS);
	}
	
	//Top secret...
	cheatCode()
	{
		this.#count = 50000000;
	}
	

	//------------------------------------------------------
    // #updateCounter
    //
    // PURPOSE: Updates the counter and PPS values, checks for achievements, 
    //          and handles bonus expiration.
    //------------------------------------------------------
	//Method that regularly updates the counter and pps texts
	#updateCounter() 
	{
		const potatoes = this.#rate * this.#multiplier * (Counter.#INTERVAL / Counter.#SECOND_IN_MS); //Update the counter
		// if (potatoes > 0){
			this.#count += potatoes; //Update the counter
			this.checkForAchievements(); //Check for achievements
			
		// }

		// Check if any bonus has expired
		if (this.#multiplier > 1 && Date.now() > this.#bonusEndTime) {
			this.#multiplier = 1;
		}

		this.#htmlCounter.innerText = `Counter: ${Math.round(this.#count)} potatoes`; // Display the counter
		this.#htmlPPS.innerText = `Potatoes per second: ${(this.#rate * this.#multiplier)} pps`;
	}
	

	//------------------------------------------------------
    // #initCounter
    //
    // PURPOSE: Starts the counter update process, ensuring it updates every interval.
    //------------------------------------------------------
	//Starting the counter and making sure that it updates every Counter.#INTERVAL milliseconds
	#initCounter()
	{
		setInterval(this.#updateCounter.bind(this), Counter.#INTERVAL);
	}
	

	//------------------------------------------------------
    // showMessage
    //
    // PURPOSE: Displays a message or achievement in the UI for a specified duration.
    // PARAMETERS:
    //     theMessage: The message to display.
    //     time: The duration (in seconds) to display the message.
    //     achievement: Whether the message is an achievement (true/false).
    //------------------------------------------------------
	//Method that can be used to present a message: 
	//either a regular message (when the achievement parameter is set to false) OR
	//an achievement message (when the achievement parameter is set to true).
	showMessage(theMessage, time=Counter.DEFAULT_MESSAGE_DURATION, achievement = false)  //time is in seconds;
	{
		let theElement = this.#htmlMessage;
		if (achievement)
			theElement = this.#htmlAchievement;
		theElement.innerHTML = theMessage;
		theElement.classList.remove("hidden");
		//The following statement will make theElement invisible again after [time] seconds
		setTimeout(() => {theElement.classList.add("hidden");}, time*Counter.#SECOND_IN_MS);
	}


	//------------------------------------------------------
    // addPotatoes
    //
    // PURPOSE: Adds a specified number of potatoes to the counter.
    // PARAMETERS:
    //     value: The number of potatoes to add.
    //------------------------------------------------------
	addPotatoes(value){
		this.#count += value;
		if(value > 0){
			this.#totalClickedPotatoes += value;
			// this.checkForAchievements();
		}
	}


	//------------------------------------------------------
    // checkForAchievements
    //
    // PURPOSE: Checks if the current count qualifies for an achievement.
    //------------------------------------------------------
	checkForAchievements(){
		
		if (this.#isPowerOfTen(Math.round(this.#count))){

			this.showMessage("Congratulations you made a total of " + Math.round(this.#count) + "potatoes ", Counter.DEFAULT_MESSAGE_DURATION, true);
		}
	}


	//------------------------------------------------------
    // #isPowerOfTen
    //
    // PURPOSE: Determines if a number is a power of ten.
    // PARAMETERS:
    //     n: The number to check.
    // Returns: True if the number is a power of ten, false otherwise.
    //------------------------------------------------------
	#isPowerOfTen(n) {
		if (n < 10) {
			return false;
		}
		const log10 = Math.log10(n);
		return Number.isInteger(log10);
  	}

	get count(){
		return this.#count;
	}

	updateRate(rate){
		this.#rate += rate;
	}

	addBonusButton(button){
		this.#bonusButtonList.push(button);
	}

	subtractPotatoes(value){
		if (this.#count >= value){
			this.#count -= value;
			return true;
		}
		else{
			this.showMessage("Not enough potatoes!", 1);
			return false;
		}
	}
}

