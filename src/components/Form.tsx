import * as React from "react";

let selectDep: string = "";
let selectArr: string = "";
let chooseAlgo: string = "fastest";
const Graph = require('node-dijkstra');
const route = new Graph();

export class Form extends React.Component<any, {}> {
    details = require('../json/response.json');
    deals: any[] = this.details.deals;

    handleSubmit(event: any): void {
        // if (chooseAlgo == "fastest"){
            
        // }else if (chooseAlgo == "cheapest"){
            
        // }
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
        console.log(selectDep + " | " + selectArr + " | " + chooseAlgo);
    }

    render() {
        let i = 0;
        let departure = createOptions(this.deals, "departure");
        let arrival = createOptions(this.deals, "arrival");

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <select name="selectDep" onChange={this.handleChange}><option value="">FROM</option>{departure}</select>
                    <br/>
                    <select name="selectArr" onChange={this.handleChange}><option value="">DESTINATION</option>{arrival}</select>
                        <div className="onoffswitch">
                            <input type="checkbox" name="chooseAlgo" className="onoffswitch-checkbox" id="myonoffswitch" onChange={this.handleChange} />
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"></span>
                                <span className="onoffswitch-switch"></span>
                            </label>
                        </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

function createOptions(list: any[], keyName: string): any[] {
    let options = [];
    var uniqueArray = removeDuplicates(list, keyName);
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