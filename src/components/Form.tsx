import * as React from "react";

let selectDep: string = "";
let selectArr: string = "";
let chooseAlgo: string = "fastest";
let filterdCites = [];
let resultHTML:string = "";
let totalTime:number = 0;
let totalCost:number = 0;
const Graph = require('node-dijkstra');
const g = new Graph();
const details = require('../json/response.json');
const deals: any[] = details.deals;

export class Form extends React.Component<any, {}> {
    

    handleSubmit(event: any): void {
        buildGraph(chooseAlgo);
        var route = g.shortestPath(selectDep, selectArr);
        let resultsArray = [];
        resultHTML = "";
        totalCost = 0;
        totalTime = 0;
        for (let i = 0; i < route.length-1; i++) {
            let detObj = getDetails(route[i], route[i+1])
            resultHTML += '<div class="item">';
            resultHTML += "<h3>"+detObj.departure+"<strong> > </strong> "+detObj.arrival+"</h3>";
            resultHTML += "<h5>"+detObj.transport+" <em>"+detObj.reference+"</em> for "+detObj.duration.h+"H:"+detObj.duration.m+"m <span><strong class='cost-span'>"+detObj.cost+" $</strong></span></h5>";
            resultHTML += '</div>';
            totalCost += detObj.cost;
            totalTime = totalTime + Number(detObj.duration.h)*60 + Number(detObj.duration.m);
        };
        document.getElementById("resultright").innerHTML=resultHTML;
        resultHTML = "<h2 style='margin-bottom: 0px;'>"+selectDep+" to "+selectArr+"</h2>";
        resultHTML += "<h3 style='margin-top: 0px; text-transform: capitalize;'>"+chooseAlgo+" trip</h3>";
        resultHTML += "<span><strong class='cost-span2'> Total cost: "+totalCost+" $</strong></span>";
        resultHTML += "<br/><span><strong class='cost-span2'> Total time: "+totalTime/60+" Hours"+"</strong></span>";
        document.getElementById("resultleft").innerHTML=resultHTML;
        event.preventDefault();
    }

    handleChange(event: any): void {
        switch (event.target.name){
            case "selectDep":
                selectDep = event.target.value;
                break;
            case "selectArr":
                selectArr = event.target.value;
                break;
            case "chooseAlgo":
                if(event.target.checked){
                    chooseAlgo = "cheapest";
                }else{
                    chooseAlgo = "fastest";
                }
                break;
        }
    }

    render() {
        let i = 0;
        let departure = createOptions(deals, "departure");
        let arrival = createOptions(deals, "arrival");

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <select name="selectDep" onChange={this.handleChange}><option value="">FROM</option>{departure}</select>
                    <br/>
                    <select name="selectArr" onChange={this.handleChange}><option value="">TO</option>{arrival}</select>
                        <div className="onoffswitch">
                            <input type="checkbox" name="chooseAlgo" className="onoffswitch-checkbox" id="myonoffswitch" onChange={this.handleChange} />
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    <input type="submit" value="Submit" className="button" />
                </form>
                <div id="result" className="resultbox">
                    <div id="resultright" className="resultbox-right">

                    </div>
                    <div id="resultleft" className="resultbox-left">

                    </div>
                </div>        
            </div>
        );
    }
}

function createOptions(list: any[], keyName: string): any[] {
    let options = [];
    let uniqueArray = removeDuplicates(list, keyName);
    for (let i = 0; i<uniqueArray.length-1; i++){
        let value = uniqueArray[i][keyName];
        options.push(<option key={i} value={value}>{value}</option>);
    }
    return options;
}

function removeDuplicates(myArr: any[], prop: string): any[] {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
}

const buildGraph = function(algorithm) {
    // filterdCites is an array of new filterd data
    
    let uniqueCities = removeDuplicates(deals, "departure");
    //algorithm is cheapest or fastest
    if (algorithm == 'cheapest') {
        // filter the data with lowest value in cost
        filterdCites = filterCities('cheapest');
        // after filteration build the graph
        for (var i = 0; i < uniqueCities.length; i++) {
            var currentCityName = uniqueCities[i].departure;
            var object = new Object;
            for (var j = 0; j < filterdCites.length; j++) {
                if (filterdCites[j].departure == currentCityName) {
                    var arrivalName = filterdCites[j].arrival;
                    var cost = filterdCites[j].cost;
                    object[arrivalName] = cost;
                }
            }
            if (!isEmpty(object)) {
                g.addVertex(currentCityName, object);
            }
        }
    } else if (algorithm == 'fastest') {
        // filter the data with lowest value in time
        filterdCites = filterCities('fastest');
        // after filteration build the graph
        for (var i = 0; i < uniqueCities.length; i++) {
            var currentCityName = uniqueCities[i].departure;
            var object = new Object;
            for (var j = 0; j < filterdCites.length; j++) {
                if (filterdCites[j].departure == currentCityName) {
                    var arrivalName = filterdCites[j].arrival;
                    var duration = Number(filterdCites[j].duration.h) * 60 + Number(filterdCites[j].duration.m);
                    object[arrivalName] = duration;
                }
            }
            if (!isEmpty(object)) {
                g.addVertex(currentCityName, object);
            }
        }
    }
}

const isEmpty = function(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

const filterCities = function(algorithm) {
    if (algorithm == 'cheapest') {
        var filterdDeals = [];
        // filter by cheapest 
        for (var i = 0; i < deals.length; i++) {
            var currentObject = deals[i];
            for (var j = i; j < deals.length; j++) {
                if (currentObject.departure == deals[j].departure && currentObject.arrival == deals[j].arrival) {
                    // apply the discount on the cost and choose the lowest value
                    if (currentObject.discount != 0)
                        var currentObjectFinalCost = Number(currentObject.cost) * (currentObject.discount / 100);
                    else
                        var currentObjectFinalCost = Number(currentObject.cost);
                    if (deals[j].discount != 0)
                        var tempObjectFinalCost = Number(deals[j].cost) * (deals[j].discount / 100);
                    else
                        var tempObjectFinalCost = Number(deals[j].cost);

                    if (currentObjectFinalCost > tempObjectFinalCost)
                        currentObject = deals[j];
                }
            }
            if (objectNotExistsBefore(currentObject, filterdDeals))
                filterdDeals.push(currentObject);
        }
        return filterdDeals;
    } else if (algorithm == 'fastest') {
        var filterdDeals = [];
        // filter by fastest
        for (var i = 0; i < deals.length; i++) {
            var currentObject = deals[i];
            for (var j = i; j < deals.length; j++) {
                if (currentObject.departure == deals[j].departure && currentObject.arrival == deals[j].arrival) {
                    // calculate the time in minutes to compare the fastest
                    var currentObjectDurationTime = Number(currentObject.duration.h) * 60 + Number(currentObject.duration.m);
                    var tempObjectDurationTime = Number(deals[j].duration.h) * 60 + Number(deals[j].duration.m);

                    if (currentObjectDurationTime > tempObjectDurationTime)
                        currentObject = deals[j];
                }
            }
            if (objectNotExistsBefore(currentObject, filterdDeals))
                filterdDeals.push(currentObject);
        }
        return filterdDeals;
    }
}

const objectNotExistsBefore = function(object, array) {
    for (var i = 0; i < array.length; i++) {
        if (object.arrival == array[i].arrival && object.departure == array[i].departure)
            return false;
    }
    return true;
}

const getDetails = function(from, to){
    for (var i = 0; i < filterdCites.length; i++) {
         if(filterdCites[i].departure == from && filterdCites[i].arrival == to)
             return filterdCites[i];
    };
}