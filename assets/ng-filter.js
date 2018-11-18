app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});

app.filter('ArrayString', function() {
  return function(input) {
    var arr = input.join(', ');
    return arr;
  };
});

app.filter('na', function() {
  return function(input) {
    return input != '' ? input : 'N/A';
  };
});

var weekday = {
    SUN : "Sunday",
    MON : "Monday",
    TUE : "Tuesday",
    WED : "Wednesday",
    THU : "Thursday",
    FRI : "Friday",
    SAT : "Saturday",
}

app.filter('days', function() {
    return function(input) {
        return weekday[input];
    };
});

app.filter('times', function() {
    return function(input) {
        if(input == '**-**') return 'Closed';
        return input.replace("-"," - ");
    };
});

app.filter('stateClass', function() {
    return function(state) {
        if(state == 'scheduled') return 'label-warning';
        if(state == 'cancelled') return 'label-danger';
        return 'label-success';
    };
});

app.filter('DP', function() {
    return function(image) {
        if(image) return base_url + "assets/public/profile/" + image;
        return base_url + 'assets/no-user.png';
    };
});


var codeRange = {
    AL:["35801 - 35816"],
    AK:["99501 - 99524"],
    AZ:["85001 - 85055"],
    AR:["72201 - 72217"],
    CA:["94203 - 94209","90001 - 90089","90209 - 90213"],
    CO:["80201 - 80239"],
    CT:["06101 - 06112"],
    DE:["19901 - 19905"],
    DC:["20001 - 20020"],
    FL:["32501 - 32509","33124 - 33190","32801 - 32837"],
    GA:["30301 - 30381"],
    HI:["96801 - 96830"],
    ID:["83254 - 83254"],
    IL:["60601 - 60641","62701 - 62709"],
    IN:["46201 - 46209"],
    IA:["52801 - 52809","50301 - 50323"],
    KS:["67201 - 67221"],
    KY:["41701 - 41702"],
    LA:["70112 - 70119"],
    ME:["04032 - 04034"],
    MD:["21201 - 21237"],
    MA:["02101 - 02137"],
    MI:["49036 - 49036","49734 - 49735"],
    MN:["55801 - 55808"],
    MS:["39530 - 39535"],
    MO:["63101 - 63141"],
    MT:["59044 - 59044"],
    NE:["68901 - 68902"],
    NV:["89501 - 89513"],
    NH:["03217 - 03217"],
    NJ:["07039 - 07039"],
    NM:["87500 - 87506"],
    NY:["10001 - 10048"],
    NC:["27565 - 27565"],
    ND:["58282 - 58282"],
    OH:["44101 - 44179"],
    OK:["74101 - 74110"],
    OR:["97201 - 97225"],
    PA:["15201 - 15244"],
    RI:["02840 - 02841"],
    SC:["29020 - 29020"],
    SD:["57401 - 57402"],
    TN:["37201 - 37222"],
    TX:["78701 - 78705"],
    UT:["84321 - 84323"],
    VT:["05751 - 05751"],
    VA:["24517 - 24517"],
    WA:["98004 - 98009"],
    WV:["25813 - 25813"],
    WY:["82941 - 82941"],
    WI:["53201 - 53228"],
}

function findState(zip) {
    var ss = '';
    $.each(codeRange, function(state,ranges){
        $.each(ranges, function(key,range){
            var r = range.split(" - ");
            for (var i = r[0]; i <= r[1]; i++) {
                if(i == zip){                    
                    ss =  state;
                    return true;
                }
            }
        })
    })

    return ss;
}

app.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

app.directive('ngConfirmClick', [
    function(){ return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;

            element.bind('click',function (event) {
                swal({   
                    title              : msg,
                    type               : "warning",   
                    showCancelButton   : true,   
                    confirmButtonColor : "#DD6B55",   
                    confirmButtonText  : "Yes",
                    cancelButtonText   : "No",
                    closeOnConfirm     : false,
                    closeOnCancel      : false
                }, function(isConfirm){   
                    if (isConfirm) {
                        scope.$eval(clickAction)
                    } else {
                        swal.close()
                    } 
                });
            });
        }
    };
}])

