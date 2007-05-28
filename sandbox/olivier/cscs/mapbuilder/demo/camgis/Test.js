function Test() { }
Test._path = 'http://testbed.geomatys.fr/ultime/dwr';

Test.getInstance = function(callback) {
DWREngine._execute(Test._path, 'Test', 'getInstance', callback);
}

Test.addHaie = function(callback) {
 DWREngine._execute(Test._path, 'Test', 'addHaie', callback);
}

Test.updateDb = function(callback) {
 DWREngine._execute(Test._path, 'Test', 'updateDb', callback);
}

Test.deleteHaie = function(p0, callback) {
 DWREngine._execute(Test._path, 'Test', 'deleteHaie', p0, callback);
}

Test.bbox = function(p0, callback) {
 DWREngine._execute(Test._path, 'Test', 'bbox', p0, callback);
}

Test.bboxTab = function(p0, callback) {
 DWREngine._execute(Test._path, 'Test', 'bboxTab', p0, callback);
}

Test.updateAllDb = function(callback) {
 DWREngine._execute(Test._path, 'Test', 'updateAllDb', callback);
}