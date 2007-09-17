// a set of points in map XY and Lon/Lat that are supposed to correspond between
// forward and invers transforms

Proj4js.testPoints = [
  {code: 'EPSG:42304',
    xy: [-358185.267976, -40271.099023],
    ll: [-99.84375, 48.515625]
  },
  {code: 'EPSG:2403',
    xy: [27500000, 4198690.07776],
    ll: [81.0, 37.92]
  },
  {code: 'EPSG:42304',
    xy: [-358185.267976, -40271.099023],
    ll: [-99.84375, 48.515625]
  },
  {code: 'EPSG:27563',
    xy: [653704.865208, 176887.660037],
    ll: [3.005, 43.89]
  },
  {code: 'google',
    xy: [-8531595.34908, 6432756.94421],
    ll: [-76.640625, 49.921875]
  },
  {code: 'EPSG:2736',
    xy: [512093.668732, 7883657.46572],
    ll: [33.115, -19.14]
  }
];

    function runTests() {
      var testTable = $('testResult');
      for (var i=0; i < Proj4js.testPoints.length; ++i) {
        var row = document.createElement('tr');
        var test = Proj4js.testPoints[i];
        var proj = new Proj4js.Proj(test.code);
        
        var td = document.createElement('td');
        td.innerHTML = test.code;
        row.appendChild(td);
        
        var xyTest = proj.forward(new Proj4js.Point(test.ll[0],test.ll[1]));
        td = document.createElement('td');
        td.innerHTML = test.xy.toString();
        row.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = xyTest.toString();
        row.appendChild(td);
        
        var llTest = proj.inverse(new Proj4js.Point(test.xy[0],test.xy[1]));
        td = document.createElement('td');
        td.innerHTML = test.ll.toString();
        row.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = llTest.toString();
        row.appendChild(td);
        
        testTable.tBodies[0].appendChild(row);
      }
    }


