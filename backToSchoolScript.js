// basic assumptions
let incomeBaseline = 0;
let incomeBackToSchool = 0;
let expensesBaseline = 0;
let expensesBackToSchool = 0;

let currentSavings = 0;
let investmentReturn = 0;

let yearsOfSchooling = 0;
let tuitionCost = 0;
let expensesDuringSchooling = 0;
let schoolingCostPaidWithSavings = 0;
let studentLoanInterestRate = 0;
let studentLoanPayback = 0;

// advanced assumptions
let sc1Promotion1Years = 0;
let sc2Promotion1Years = 0;

let sc1Promotion1Income = 0;
let sc2Promotion1Income = 0;

let sc1Promotion2Years = 0;
let sc2Promotion2Years = 0;

let sc1Oromotion2Income = 0;
let sc2Promotion2Income = 0;

//output arrays
let yearsArray = [];

let sc1IncomeArray = [];
let sc2IncomeArray = [];

let sc1Array = [];
let sc2Array = [];
let differenceArray = [];

let totalCostOfSchooling = 0;
let savingsRatio = 0;
let loanRatio = 0;

let studentLoanPayment = 0;

let maxYears = 30;

let chart;

let advancedAssumptionsButton = document.getElementById("advancedAssumptionButton");
let advancedAssumptionTableContainer = document.getElementById("advancedAssumptionTableContainer");
let advancedAssumptionsToggleMarker = document.getElementById("advancedAssumptionToggleMarker");

let generateURLButton = document.getElementById("generateURLButton");
let customURLOutput = document.getElementById("customURLOutput");

getURLValues();
initValues();
addInputEventListeners();
generateIncomeArrays();
generateNetWorthArrays();
drawNetWorthChart();
toggleAdvancedAssumptions();
generateCustomURL();


//Set promotion income values to the starting salary values
document.getElementById('sc1Promotion1Income').value = incomeBaseline;
document.getElementById('sc1Promotion2Income').value = incomeBaseline;
document.getElementById('sc2Promotion1Income').value = incomeBackToSchool;
document.getElementById('sc2Promotion2Income').value = incomeBackToSchool;

//run getURLValues again to reverse the actions above if a user is coming in through a custom link click
getURLValues();


function getURLValues () {
    let hashParams = window.location.hash.substr(1).split('&'); // substr(1) to remove the `#`
    console.log(hashParams);
    if(hashParams[0] === "") {
        return;
    }
    for(let i = 0; i < hashParams.length; i++){
        console.log(hashParams.length);
        let p = hashParams[i].split('=');

        document.getElementById(p[0]).value = decodeURIComponent(p[1]);
    }
}

function initValues() {
    //initiate basic assumptions
    incomeBaseline = Number(document.getElementById('incomeBaseline').value);
    incomeBackToSchool = Number(document.getElementById('incomeBackToSchool').value);
    expensesBaseline = Number(document.getElementById('expensesBaseline').value);
    expensesBackToSchool = Number(document.getElementById('expensesBackToSchool').value);

    currentSavings = Number(document.getElementById('currentSavings').value);
    investmentReturn = Number(document.getElementById('investmentReturn').value) / 100;

    yearsOfSchooling = Number(document.getElementById('yearsOfSchooling').value);
    tuitionCost = Number(document.getElementById('tuitionCost').value);
    expensesDuringSchooling = Number(document.getElementById('expensesDuringSchooling').value);
    schoolingCostPaidWithSavings = Number(document.getElementById('schoolingCostPaidWithSavings').value);
    studentLoanInterestRate = Number(document.getElementById('studentLoanInterestRate').value) / 100;
    studentLoanPayback = Number(document.getElementById('studentLoanPayback').value);

    //initiate advanced assumptions
    sc1Promotion1Years = Number(document.getElementById('sc1Promotion1Years').value);
    sc2Promotion1Years = Number(document.getElementById('sc2Promotion1Years').value);
    sc1Promotion1Income = Number(document.getElementById('sc1Promotion1Income').value);
    sc2Promotion1Income = Number(document.getElementById('sc2Promotion1Income').value);
    sc1Promotion2Years = Number(document.getElementById('sc1Promotion2Years').value);
    sc2Promotion2Years = Number(document.getElementById('sc2Promotion2Years').value);
    sc1Promotion2Income = Number(document.getElementById('sc1Promotion2Income').value);
    sc2Promotion2Income = Number(document.getElementById('sc2Promotion2Income').value);

    //Get rid of zero values for promotion years
    if(sc1Promotion1Years == 0) {
        sc1Promotion1Years = 5000;
    }
    
    if(sc1Promotion2Years == 0) {
        sc1Promotion2Years = 5000;
    }

    if(sc2Promotion1Years == 0) {
        sc2Promotion1Years = 5000;
    }

    if(sc2Promotion2Years == 0) {
        sc2Promotion2Years = 5000;
    }

    //Other settings
    document.getElementById('schoolingCostPaidWithSavings').max = currentSavings;

    advancedAssumptionToggleMarker = Number(document.getElementById('advancedAssumptionToggleMarker').value);

    totalCostOfSchooling = tuitionCost * yearsOfSchooling + expensesDuringSchooling * 12 * yearsOfSchooling;
    if(totalCostOfSchooling == 0) {
        savingsRatio = 0;
    } else {
        savingsRatio = schoolingCostPaidWithSavings / totalCostOfSchooling;
    }
    loanRatio = 1 - savingsRatio;

    // Calc based on annuity formula
    studentLoanPayment = (studentLoanInterestRate * (totalCostOfSchooling - schoolingCostPaidWithSavings))/(1-Math.pow((1+studentLoanInterestRate),studentLoanPayback*-1)) / 12;
    console.log("Monthly student loan payment: "+studentLoanPayment);


   //Fill implied cells in assumption tables
    document.getElementById('impliedCostOfSchoolingCell').innerHTML = "<i>$"+Math.round(totalCostOfSchooling)+"</i>";
    document.getElementById('impliedStudentLoanBalance').innerHTML = "<i>$"+Math.round(totalCostOfSchooling - schoolingCostPaidWithSavings)+"</i>";
    document.getElementById('impliedLoanPaymentCell').innerHTML = "<i>$"+Math.round(studentLoanPayment)+"</i>";

    //Reset breakeven text
    document.getElementById("breakevenText").innerHTML = "Going back to school doesn't become a better financial decision in the next 30 years...";
}

function addInputEventListeners() {
    let inputsArray = document.getElementsByClassName("assumptionField");
    console.log("# of event listeners: "+inputsArray.length);

    for(i=0;i<inputsArray.length;i++) {
        inputsArray[i].addEventListener('change',refreshNetWorthCalcs, false);
    }
}

function refreshNetWorthCalcs() {
    console.log("refresh net worth calcs");
    chart.destroy();
 
    customURLOutput.innerHTML = "<< Click button to get a shareable link for your custom scenario";

    initValues();
    generateIncomeArrays();
    generateNetWorthArrays();
    drawNetWorthChart();
}

function generateIncomeArrays() {

    console.log("start for loop");
    for(i=0; i<=maxYears; i++) {

        //Set income to static levels
        if(advancedAssumptionToggleMarker == 0) {

            sc1IncomeArray[i] = incomeBaseline * 12;

            if(i > yearsOfSchooling) {
                sc2IncomeArray[i] = incomeBackToSchool * 12;
            } else {
                sc2IncomeArray[i] = 0;
            }

        } else {
            //Advanced assumptions turned on -- use promotion data
            sc1IncomeArray[i] = 1000;
            sc2IncomeArray[i] = 2000;

            let sc1FirstTimePeriod = 1;
            let sc1SecondTimePeriod = 5000;
            let sc1ThirdTimePeriod = 5000;

            let sc1FirstIncome = incomeBaseline * 12;
            let sc1SecondIncome = 0;
            let sc1ThirdIncome = 0;

            let sc2FirstTimePeriod = 1;
            let sc2SecondTimePeriod = 5000;
            let sc2ThirdTimePeriod = 5000;

            let sc2FirstIncome = incomeBackToSchool * 12;
            let sc2SecondIncome = 0;
            let sc2ThirdIncome = 0;

            //re-order sc1 by chronological order
            if(sc1Promotion1Years <= sc1Promotion2Years) {
                sc1SecondTimePeriod = sc1Promotion1Years;
                sc1ThirdTimePeriod = sc1Promotion2Years;
                sc1SecondIncome = sc1Promotion1Income * 12;
                sc1ThirdIncome = sc1Promotion2Income * 12;
            } else {
                sc1SecondTimePeriod = sc1Promotion2Years;
                sc1ThirdTimePeriod = sc1Promotion1Years;
                sc1SecondIncome = sc1Promotion2Income * 12;
                sc1ThirdIncome = sc1Promotion1Income * 12;
            }

            //generate sc1 income array
            if(i > sc1ThirdTimePeriod) {
                sc1IncomeArray[i] = sc1ThirdIncome;
            } else if(i > sc1SecondTimePeriod) {
                sc1IncomeArray[i] = sc1SecondIncome;
            } else {
                sc1IncomeArray[i] = sc1FirstIncome;
            }

            //re-order sc2 by chronological order
            if(sc2Promotion1Years <= sc2Promotion2Years) {
                sc2SecondTimePeriod = sc2Promotion1Years;
                sc2ThirdTimePeriod = sc2Promotion2Years;
                sc2SecondIncome = sc2Promotion1Income * 12;
                sc2ThirdIncome = sc2Promotion2Income * 12;
            } else {
                sc2SecondTimePeriod = sc2Promotion2Years;
                sc2ThirdTimePeriod = sc2Promotion1Years;
                sc2SecondIncome = sc2Promotion2Income * 12;
                sc2ThirdIncome = sc2Promotion1Income * 12;
            }

            //generate sc2 income array
            if(i <= yearsOfSchooling) {
                sc2IncomeArray[i] = 0;
            } else {
                if(i > sc2ThirdTimePeriod + yearsOfSchooling) {
                    sc2IncomeArray[i] = sc2ThirdIncome;
                } else if(i > sc2SecondTimePeriod + yearsOfSchooling) {
                    sc2IncomeArray[i] = sc2SecondIncome;
                } else {
                    sc2IncomeArray[i] = sc2FirstIncome;
                }
            }
        }
        console.log("sc1 income for year " + i +": " + sc1IncomeArray[i]);
        console.log("sc2 income for year " + i +": " + sc2IncomeArray[i]);
    }
}

function generateNetWorthArrays() {

    let sc1BOPPortfolio = 0;
    let sc1InYearSavings = 0;
    let sc1InvestmentReturns = 0;

    let sc1Income = 0;
    let sc1Expenses = 0;

    let sc2TuitionCost = 0;
    let sc2SchoolingExpenses = 0;
    let sc2TotalSchoolingCost = 0;

    let sc2CostPaidWithSavings = 0;
    let sc2CostPaidWithLoan = 0;

    let sc2LoanArray = [];

    let sc2LoanBOP = 0;
    let sc2LoanIncrease = 0;
    let sc2LoanInterest = 0;
    let sc2LoanPayment = 0;

    let sc2Income = 0;
    let sc2Expenses = 0;
    let sc2ImpliedSavings = 0;

    let sc2BOPPortfolio = 0;
    let sc2SavingsUsedForSchool = 0;
    let sc2InvestmentReturns = 0;
    let sc2EOPPortfolioArray = [];

    for(i=0;i<=maxYears;i++) {

        yearsArray[i] = i;

        // Set year 0 net worth to initial savings amount
        if(i==0) {
            sc1Array[i] = currentSavings;
            sc2Array[i] = currentSavings;
            sc2EOPPortfolioArray[i] = currentSavings;
            sc2LoanArray[i] = 0;
        }

        else {

            // Calculate baseline scenario net worth for current year
            sc1Income = sc1IncomeArray[i];
            sc1Expenses = expensesBaseline * 12;
            sc1InYearSavings = sc1Income - sc1Expenses;

            sc1BOPPortfolio = sc1Array[i-1];

            sc1InvestmentReturns = sc1BOPPortfolio * investmentReturn;

            sc1Array[i] = sc1BOPPortfolio + sc1InYearSavings + sc1InvestmentReturns;

            // Calculate back to school scenario net worth for current year
            if (i <= yearsOfSchooling) {
                sc2TuitionCost = tuitionCost;
                sc2SchoolingExpenses = expensesDuringSchooling * 12;
            } else {
                sc2TuitionCost = 0;
                sc2SchoolingExpenses = 0;
            }

            sc2TotalSchoolingCost = sc2TuitionCost + sc2SchoolingExpenses;
            console.log("Total cost of school in year: "+sc2TotalSchoolingCost);

            sc2CostPaidWithSavings = sc2TotalSchoolingCost * savingsRatio;
            sc2CostPaidWithLoan = sc2TotalSchoolingCost * loanRatio;

            //Create student loan array with running tally
            sc2LoanBOP = sc2LoanArray[i-1];
            sc2LoanIncrease = sc2CostPaidWithLoan;
            
            if(i > yearsOfSchooling) {
                sc2LoanInterest = (sc2LoanBOP + sc2LoanIncrease) * studentLoanInterestRate;
            } else {
                sc2LoanInterest = 0;
            }

            if(i > yearsOfSchooling && i <= yearsOfSchooling + studentLoanPayback) {
                sc2LoanPayment = studentLoanPayment * 12;
            } else {
                sc2LoanPayment = 0;
            }

            sc2LoanArray [i] = sc2LoanBOP + sc2LoanIncrease + sc2LoanInterest - sc2LoanPayment;
            console.log("Student loan balance in year "+ i + ": "+sc2LoanArray[i]);

            //Calc in year savings
            if(i > yearsOfSchooling) {
                sc2Expenses = expensesBackToSchool * 12;
            } else {
                sc2Expenses = 0;
            }

            sc2Income = sc2IncomeArray[i];

            sc2ImpliedSavings = sc2Income - sc2Expenses - sc2LoanPayment;
            console.log("Sc2 Savings in year "+ i + ": "+sc2ImpliedSavings);

            //Calc sc2 investment portfolio

            sc2BOPPortfolio = sc2EOPPortfolioArray[i-1];

            sc2SavingsUsedForSchool = sc2CostPaidWithSavings;

            sc2InvestmentReturns = (sc2BOPPortfolio - sc2SavingsUsedForSchool) * investmentReturn;

            sc2EOPPortfolioArray[i] = sc2BOPPortfolio - sc2SavingsUsedForSchool + sc2ImpliedSavings + sc2InvestmentReturns;
            
            sc2Array[i] = sc2EOPPortfolioArray[i] - sc2LoanArray[i];
            console.log("Sc2 EOP portfolio in year" + i + ": " + sc2EOPPortfolioArray[i]);
        }

        differenceArray[i] = sc2Array[i] - sc1Array[i];

        if(differenceArray[i] >= 0 && differenceArray[i-1] < 0) {
            let breakevenYear = Math.round((i - 1 + (Math.abs(differenceArray[i-1]) / (differenceArray[i] - differenceArray[i-1])))*10)/10; 
            document.getElementById("breakevenText").innerHTML = "Going back to school becomes the better financial decision after " + breakevenYear + " years";
        }
    }
}

function drawNetWorthChart(){
    var ctx = document.getElementById('netWorthChart').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: yearsArray,
            datasets: [
                {
                    label: "Baseline Scenario",
                    borderColor: 'rgb(0, 143, 149)',
                    pointBackgroundColor: 'rgb(0, 143, 149)',
                    fill: false,
                    data: sc1Array,
                    pointHitRadius: 7,
                },
    
                {
                    label: "Back to School Scenario",
                    borderColor: 'rgb(226, 78, 66)',
                    pointBackgroundColor: 'rgb(226, 78, 66)',
                    fill: false,
                    data: sc2Array,
                    pointHitRadius: 7,
                },

                {
                    label: "Difference - Back to School vs Baseline",
                    borderColor: 'rgb(0, 0, 0)',
                    pointBackgroundColor: 'rgb(0, 0, 0)',
                    fill: 'rgb(0, 0, 0)',
                    data: differenceArray,
                    pointHitRadius: 7,
                },
    
                
            ]
        },
    
        // Configuration options go here
        options: {
            maintainAspectRatio: false,
        
            tooltips: {
                 // Include a dollar sign in the ticks and add comma formatting
                 callbacks: {
                    label: function(tooltipItem, data) {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += '$'+Math.round(tooltipItem.yLabel).toLocaleString();
                        return label;
                    }
                },
            },
    
            scales: {
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks and add comma formatting
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        },

                        fontColor: "rgb(56,56,56)",
                    },
    
                    scaleLabel: {
                        display: true,
                        labelString: "Net Worth",
                        fontColor: "rgb(56,56,56)",
                        fontStyle: "bold",
                        fontSize: 15,
                    },

                    gridLines: {
                        drawTicks: false,
                        zeroLineColor: "rgb(56,56,56)",
                        zeroLineWidth: 2,
                    },
                }],
    
                xAxes: [{
                    ticks: {
                        userCallback: function(item, index) {
                            if (!(index % 5)) return item;
                         },
                         autoSkip: false,
                         fontColor: "rgb(56,56,56)",

                        maxRotation: 0,
                        minRotation: 0, 
                    },
    
                    scaleLabel: {
                        display: true,
                        labelString: "# of Years from Today",
                        fontColor: "rgb(56,56,56)",
                        fontStyle: "bold",
                        fontSize: 15,
                    },

                    gridLines: {
                        drawTicks: false,
                        zeroLineColor: "rgb(56,56,56)",
                        zeroLineWidth: 2,
                    },
                }],    
            },
            
            legend: {
                labels: {
                    fontColor: "rgb(56,56,56)",
                    boxWidth: 13,
                    padding: 10,
                },
            },

            title: {
                display: true,
                text: "Net Worth Over Time",
                fontSize: 18,
                fontColor: "rgb(56,56,56)",
                padding: 2,
            },
        }
    });
}

function toggleAdvancedAssumptions() {
    
    if(Number(advancedAssumptionsToggleMarker.value) === 0) {
        advancedAssumptionTableContainer.style.display = "none";
    } else {
        advancedAssumptionsButton.innerHTML = "Remove advanced options";
    }
    
    advancedAssumptionsButton.addEventListener('click', function() {

        if(Number(advancedAssumptionsToggleMarker.value) === 0){
            advancedAssumptionTableContainer.style.display = "block";
            advancedAssumptionsToggleMarker.value = 1;
            console.log(advancedAssumptionsToggleMarker.value);
            advancedAssumptionsButton.innerHTML = "Remove advanced options";
            refreshNetWorthCalcs();
        } else {
            advancedAssumptionTableContainer.style.display = "none";
            advancedAssumptionsToggleMarker.value = 0;
            console.log(advancedAssumptionsToggleMarker.value);
            advancedAssumptionsButton.innerHTML = "+ Advanced options";
            refreshNetWorthCalcs();
        }
    }, false);
}

function generateCustomURL() {

    generateURLButton.addEventListener('click', function() {

        let customURL = [location.protocol, '//', location.host, location.pathname].join('');
        console.log(customURL);

        customURL += "#incomeBaseline="+document.getElementById('incomeBaseline').value+"&incomeBackToSchool="+document.getElementById('incomeBackToSchool').value
        +"&expensesBaseline="+document.getElementById('expensesBaseline').value+"&expensesBackToSchool="+document.getElementById('expensesBackToSchool').value
        +"&amp;currentSavings="+document.getElementById('currentSavings').value+"&investmentReturn="+document.getElementById('investmentReturn').value
        +"&yearsOfSchooling="+document.getElementById('yearsOfSchooling').value+"&tuitionCost="+document.getElementById('tuitionCost').value
        +"&expensesDuringSchooling="+document.getElementById('expensesDuringSchooling').value+"&schoolingCostPaidWithSavings="+document.getElementById('schoolingCostPaidWithSavings').value
        +"&studentLoanInterestRate="+document.getElementById('studentLoanInterestRate').value+"&studentLoanPayback="+document.getElementById('studentLoanPayback').value;
       
        if(Number(advancedAssumptionsToggleMarker.value) === 1) {
            customURL += "&advancedAssumptionToggleMarker="+document.getElementById('advancedAssumptionToggleMarker').value
            +"&sc1Promotion1Years="+document.getElementById('sc1Promotion1Years').value+"&sc2Promotion1Years="+document.getElementById('sc2Promotion1Years').value
            +"&sc1Promotion1Income="+document.getElementById('sc1Promotion1Income').value+"&sc2Promotion1Income="+document.getElementById('sc2Promotion1Income').value
            +"&sc1Promotion2Years="+document.getElementById('sc1Promotion2Years').value+"&sc2Promotion2Years="+document.getElementById('sc2Promotion2Years').value
            +"&sc1Promotion2Income="+document.getElementById('sc1Promotion2Income').value+"&sc2Promotion2Income="+document.getElementById('sc2Promotion2Income').value;
        }

        customURLOutput.innerHTML = customURL;
        copyToClipboard('customURLOutput');
        
    }, false);

}

function copyStringToClipboard (str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

function selectText(containerid) {
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}

function copyToClipboard(containerid) {
    if (screen.width >= 600) {
        if (document.selection) { 
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select().createTextRange();
            document.execCommand("copy"); 
        
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
            document.execCommand("copy");
        }
    }
    else {
        return;
    }
}