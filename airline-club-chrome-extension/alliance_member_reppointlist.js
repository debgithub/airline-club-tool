var ele=document.querySelector('#allianceDetails');
s=document.createElement('div');
s.setAttribute('class','section');
s.style="width: 95%;";
s.innerHTML=`
	<h4>Alliance Member Reputation Points</h4>
	<div style="width: 100%;">
		<div class="table data" style="width: 100%;">
			<div class="table-header">
				<div class="cell" style="width: 50%">Airline</div>
				<div class="cell" style="width: 30% align='right'">Loyalist</div>
				<div class="cell" style="width: 20% align='right'">Reputation Bonus</div>
			</div>
		</div>
		<div style="max-height: 200px; overflow: auto;">
			<div class="table data" id="allianceAirlineRepPointList" style="width: 100%;">
			  <div class="table-header">
				<div class="cell" style="width: 50%; border-bottom: none;"></div>
				<div class="cell" style="width: 30% align='right'; border-bottom: none;"></div>
				<div class="cell" style="width: 20% align='right'; border-bottom: none;"></div>
			  </div>
			</div>
		</div>
	</div>
`;
ele.insertBefore(s,ele.children[2]);
async function alliance_member_reputation(allianceId){
	obj = await (await fetch("https://www.airline-club.com/alliances/"+allianceId+"/championed-airports")).json();
	document.querySelectorAll('#allianceAirlineRepPointList > .table-row').forEach(function(ele){
		ele.remove();
	});
	var membersobject={};
	obj.members.forEach(function(ele){
		if(Object.prototype.hasOwnProperty.call(membersobject, ele.airlineName)){
			membersobject[ele.airlineName]["reputation"]+=ele.reputationBoost;
			membersobject[ele.airlineName]["loyalist"]+=ele.loyalistCount;
			membersobject[ele.airlineName]["id"]=ele.airlineId;
		}
		else{
			membersobject[ele.airlineName]={};
			membersobject[ele.airlineName]["reputation"]=ele.reputationBoost;
			membersobject[ele.airlineName]["loyalist"]=ele.loyalistCount;
			membersobject[ele.airlineName]["id"]=ele.airlineId;
		}
	});
	var applicantsobject={};
	obj.applicants.forEach(function(ele){
		if(Object.prototype.hasOwnProperty.call(applicantsobject, ele.airlineName)){
			applicantsobject[ele.airlineName]["reputation"]+=ele.reputationBoost;
			applicantsobject[ele.airlineName]["loyalist"]+=ele.loyalistCount;
			applicantsobject[ele.airlineName]["id"]=ele.airlineId;
		}
		else{
			applicantsobject[ele.airlineName]={};
			applicantsobject[ele.airlineName]["reputation"]=ele.reputationBoost;
			applicantsobject[ele.airlineName]["loyalist"]=ele.loyalistCount;
			applicantsobject[ele.airlineName]["id"]=ele.airlineId;
		}
	});
	var allianceAirlineMembers=[];
	for (let key in membersobject){
		let a=membersobject[key]
		a["name"]=key;
		allianceAirlineMembers.push(a);
	}
	var allianceAirlineApplicants=[];
	for (let key in applicantsobject){
		let a=applicantsobject[key]
		a["name"]=key;
		allianceAirlineApplicants.push(a);
	}
	allianceAirlineMembers.sort(function(a,b){
		return b.reputation-a.reputation;
	});
	allianceAirlineApplicants.sort(function(a,b){
		return b.reputation-a.reputation;
	});
	function getStatusElement(id){
		return loadedRivalsById[id] && `<img src='${getStatusLogo(loadedRivalsById[id].loginStatus)}' title='${getStatusTitle(loadedRivalsById[id].loginStatus)}' style='vertical-align:middle;'/>` || "";
	}
	allianceAirlineMembers.forEach(function(ele){
		var row=document.createElement('div');
		row.setAttribute('class','table-row');
		row.innerHTML=`
		<div class='cell'> ${getStatusElement(ele.id) + getAirlineLogoImg(ele.id) + ele.name} </div>
		<div class='cell' align='right'> ${commaSeparateNumber(ele.loyalist)} </div>
		<div class='cell' align='right'> ${ele.reputation.toFixed(2)} </div>
		`;
		document.querySelector('#allianceAirlineRepPointList').appendChild(row);
	});
	allianceAirlineApplicants.forEach(function(ele){
		var row=document.createElement('div');
		row.setAttribute('class','table-row');
		row.innerHTML=`
		<div class='cell'> ${getStatusElement(ele.id) + getAirlineLogoImg(ele.id) + ele.name} </div>
		<div class='cell' align='right'> ${commaSeparateNumber(ele.loyalist)} </div>
		<div class='cell warning' align='right'><img src='assets/images/icons/information.png' title='Points not counted as this airline is not an approved member yet'> ${ele.reputation.toFixed(2)} </div>
		`;
		document.querySelector('#allianceAirlineRepPointList').appendChild(row);
	});
}
function updateAllianceChampions(allianceId) {
    updateAllianceAirportChampions(allianceId);
    updateAllianceCountryChampions(allianceId);
	alliance_member_reputation(allianceId);
}