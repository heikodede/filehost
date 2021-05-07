/**
	RoundRobin eine Klasse um in einer Liga Spieltage zu erzeugen.
	Der Algorithmus der Berechnung folgt in etwa dem, der auf dieser Seite beschrieben wird: http://www-i1.informatik.rwth-aachen.de/~algorithmus/algo36.php
	
	@author  J. Str�big
	@version  1.0.0
	@date  12:21 21.10.2011
*/
function RoundRobin(teams) {
	if(!teams) throw new TypeError('Parameter must be greater than zero');
	
	this.fireEvent = function(name, evt) {
        if(this['on' + name]) {
            evt.name = name;
            return this['on' + name](evt);
        }
    };
	this.addEventListener = function(name, f) {
        this['on' + name] = function(e){
            return f.call(this, e);
        };
    };
	
    var num = parseInt(teams / 2),
	ghost_team = 0, result, max
	;
    if(teams % 2) {
        ++num;
        ghost_team = 1;
    }
	var max = num * 2;
	
/**
 * Berechnung der Spielepaarungen
 * 
 * @private
 * @param Runde
 * @param Teams (Array)
 * 
 * @return Array
*/
	function get_round(r, t) {
		var tmp = [], t1, t2;
		
		if(t[0] == ghost_team) tmp.push(max);
		else tmp.push(!(r % 2)? [max, t[0]] : [t[0], max]);
		
		for(var j = 1; j < num; j++) {
			t1 = t[j];
			t2 = t[max-j-1];
			var rev = !(j % 2);
			if(t1 == ghost_team) tmp.push(t2);
			else if(t2 == ghost_team) tmp.push(t1);
			else tmp.push(rev ? [t2, t1] : [t1, t2] );
		}
		return tmp;
	}
	this.teams = function() {return max;};
	this.rounds = function() {return parseInt(teams - 1 + .5);};
	this.calc = function() {
		var t = [];
		for(var i = 1; i < max; i++) t.push(i);
		
		result = [];
		for (var i = 1; i <= this.rounds(); i++) {
			result.push(get_round(i, t));
			t.push(t.shift());
		}
        return result;
	};
	this.out = function () {
		var t = '';
		this.fireEvent('start', {});
		for(var i = 0; i < result.length; i++) {
			var r = i + 1;
			this.fireEvent('round_start', {round:r});
			for(var j = 0; j < result[i].length; j++) {
				this.fireEvent('round', {round:r, pair: result[i][j]});
			}
			this.fireEvent('round_end', {round:r});
		}
		this.fireEvent('end', {});
		return t;
	};
}
