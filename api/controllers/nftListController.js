'use strict';

var mongoose = require('mongoose')
var NFT = mongoose.model('nft');
const fs = require('fs')
const {create} = require('ipfs-http-client')
const ipfs = create('http://localhost:5001')
exports.list_all_nfts = function(req, res) {
	var filters = req.query
	var query = {}
	// localhost:8000/nfts?search[collects][0]=Tiger&search[status][0]=0&search[status][1]=1&search[price][min]=0.04&search[price][max]=0.07
	if(filters.search !== undefined) {
		if(filters.search.status !== undefined) {
			query["status"] = {$in: filters.search.status}
		}
		if(filters.search.price !== undefined) {
			query["price"] = {$gte: filters.search.price.min, $lte: filters.search.price.max}
		}
		// {"collects.name": {$in: ['Bear']}}
		if(filters.search.collects !== undefined) {
			query["collects"] = {$in: filters.search.collects}
		}
		// query["collects.name"] = {$in: filters.search.collects}
		
	}
    NFT.find(
		query, 
		function(err, nft) {
			if (err)
				res.send(err);
			res.json(nft);
    });
}
function getDateName() {
	let curDate = new Date()
	let year = curDate.getFullYear().toString()
	let month = (curDate.getMonth()+1).toString()
	if(curDate.getMonth() < 9 ) month = '0' + month;
	let date = curDate.getDate().toString() 
	if(curDate.getDate() < 10 ) date = '0' + date;
	let hour = curDate.getHours().toString()
	if(hour < 10 ) hour = '0' + hour;
	let min = curDate.getMinutes().toString() 
	if(curDate.getMinutes() < 10) min = '0' + min;
	let sec = curDate.getSeconds().toString()
	if(curDate.getSeconds() < 10 ) sec = '0' + sec;
	return (year + month + date + hour + min + sec)
}
const addFile = async (fileName, filePath) => {
	const file = fs.readFileSync(filePath)
	const filesAdded = await ipfs.add({
		path: fileName,
		content: file
	},
	{
		progress: (len) => console.log('Uploading file ... ' + len)
	})
	const fileHash = filesAdded.cid
	return fileHash.toString()
}
exports.create_a_nft = async function(req, res) {
	let fileHash

	let fileName = req.body.name + '_' + getDateName() + '.jpg'
	let filePath = process.env.PWD + '/files/' + fileName 
	
	let imageFile = req.files.file;
	imageFile.mv(filePath, async (err) => {
		if (err) {
			console.log('Error: failed to download file')
			return res.status(500).send(err);
		}
	});

	let count = await NFT.countDocuments();
	req.body.nft_id = count

	fileHash = await addFile(fileName, filePath)
	req.body.hash = fileHash

	req.body.imgURL = fileName
	let img = {
		data: fs.readFileSync(filePath),
		contentType: 'image/jpg'
	}
	
	req.body.img = img
	
	var newNft = new NFT(req.body)
	newNft.save(function(err, nft) {
		if(err)
			res.send(err)
		res.json(nft)
	})
}

exports.read_a_nft = function(req, res) {
	NFT.find({nft_id: req.params.nftId}, function(err, nft) {
		if (err)
		  res.send(err);
		res.json(nft);
	})
}

exports.update_a_nft = function(req, res) {
	NFT.findOneAndUpdate({nft_id: req.params.nftId}, req.body, {new: true}, function(err, nft) {
		if (err)
		  res.send(err);
		res.json(nft);
	});
}

exports.update_fav = function(req, res) {
	NFT.findOneAndUpdate({nft_id: req.params.nftId}, {favUserIds: req.body.favUserIds}, function(err, nft) {
		if (err)
		  res.send(err);
		res.json(nft);
	});
}
exports.nftFavCnt = function(req, res) {
	NFT.aggregate()
		.match({nft_id: parseInt(req.params.nftId)})
		.project({
			numberOfFavs: {
			  $cond: {
				if: {
				  $isArray: "$favUserIds"
				},
				then: {
				  $size: "$favUserIds"
				},
				else: 0
			  }
			}
		  })
		.exec(function(err, numberOfFavs) {
			if(err) {
				res.send(err)
			} else {
				if (numberOfFavs[0] !== undefined)
					res.json(numberOfFavs[0].numberOfFavs)
				else 
					res.json(0)
			}
		})
}

exports.delete_a_nft = function(req, res) {
	NFT.remove({
		_id: req.params.nftId
	  }, function(err, nft) {
		if (err)
		  res.send(err);
		res.json({ message: 'NFT successfully deleted' });
	});
}
