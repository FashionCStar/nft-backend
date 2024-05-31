'use strict';

var mongoose = require('mongoose')
var Collects = mongoose.model('collect');
exports.list_all_collect = function(req, res) {
	var filters = req.query
	var query = {}
	if(filters.collectsName !== undefined) {
		query['name'] = {$regex: filters.collectsName}
	}
	console.log(query)
    Collects.find(
        query,
		function(err, collect) {
			if (err)
				res.send(err);
			res.json(collect);
    });
}

exports.create_a_collect = function(req, res) {
    var new_collect = new Collects(req.body)
	new_collect.save(function(err, collect) {
		if(err) 
			res.send(err)
		res.json(collect)
	})
}

exports.read_a_collect = function(req, res) {

}
exports.update_a_collect = function(req, res) {
    
}
exports.delete_a_collect = function(req, res) {
    
}