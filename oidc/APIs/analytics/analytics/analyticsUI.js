
function init() {

    document.getElementById('getDetailedCalls').addEventListener("click", () => { 
        let chargeable = document.getElementById('chargeable').value;
        let bound = document.getElementById('bound').value;
        let status = document.getElementById('status').value;
        let body = {};

        if(chargeable != 'select'){
            body['chargeable'] = [chargeable];
        }
        
        if(bound != 'select' && status != 'select'){
            body['callAttributes'] =[bound, status];
        }

        getDetailedCalls(localStorage.getItem('S2SToken'),
            document.getElementById('dateFromDetailedCalls').value,
            document.getElementById('dateToDetailedCalls').value,
            document.getElementById('timezone').value,
            document.getElementById('sortColumn').value,
            document.getElementById('descending').value,
            document.getElementById('offset').value,
            document.getElementById('getDetailedCallsSize').value,
            document.getElementById('getDetailedCallsAccountId').value,
            body ? body : null);
    });

    document.getElementById('getUserCalls').addEventListener("click", () => { 
        getUserCalls(localStorage.getItem('S2SToken'),
            document.getElementById('userIds').value,
            document.getElementById('dateFromUserCalls').value,
            document.getElementById('dateToUserCalls').value,
            document.getElementById('getUserCallsTimezone').value,
            document.getElementById('getUserCallsAccountId').value);
    });

    document.getElementById('getUserFilters').addEventListener("click", () => { 
        getUserFilters(localStorage.getItem('S2SToken'),
            document.getElementById('dateFromUserFilters').value,
            document.getElementById('dateToUserFilters').value,
            document.getElementById('getUserFiltersTimezone').value,
            document.getElementById('getUserFiltersAccountId').value);
    });
}