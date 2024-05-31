'use strict';
const {create} = require('ipfs-http-client')

const fs = require('fs')

const ipfs = create('http://localhost:5001')

var mongoose = require('mongoose'),
  NFT = mongoose.model('nft');
exports.list_all_nfts = function(req, res) {
  NFT.find({}, function(err, nft) {
    if (err)
      res.send(err);
    res.json(nft);
  });
};




exports.create_a_nft = async function(req, res) {
  if(req.files.file) {
    const file = req.files.file
    const fileName = file.name
    const filePath = __dirname + '/files/' + fileName
    let fileHash
    file.mv(filePath, async (err) => {
      if(err) {
          console.log('Error: failed to download file')
          return res.status(500).send(err)
      }
      fileHash = await addFile(fileName, filePath)
      console.log('File Hash received __>', fileHash)
      req.body.hash = fileHash
      var new_nft = new NFT(req.body)
      new_nft.save(function(err, nft) {
        if(err)
          res.send(err)
        res.json(nft)
      })
      console.log('requestion: ', req.body)
      fs.unlink(filePath, (err) => {
          if(err) {
              console.log("Error: Unable to delete file.", err)
          }
      })
    })
  } else {
    res.send('file upload false')
  }
  // Example of the IPFS Result
  // https://gateway.ipfs.io/ipfs/QmWLf9F2jakLsARFkNti7jjuoeHAQEJC1WuDbPwTDJc9yT
};


exports.read_a_nft = function(req, res) {
    NFT.findById(req.params.nftId, function(err, nft) {
      if (err)
        res.send(err);
      res.json(nft);
    });
  };
  
  
  exports.update_a_nft = function(req, res) {
    NFT.findOneAndUpdate({_id: req.params.nftId}, req.body, {new: true}, function(err, nft) {
      if (err)
        res.send(err);
      res.json(nft);
    });
  };
  
  
  exports.delete_a_nft = function(req, res) {
    NFT.remove({
      _id: req.params.nftId
    }, function(err, nft) {
      if (err)
        res.send(err);
      res.json({ message: 'NFT successfully deleted' });
    });
  };

function handleUploadFile(file) {
  const fileName = file.name
  const filePath = __dirname + '/files/' + fileName
  let fileHash
  file.mv(filePath, async (err) => {
    if(err) {
        console.log('Error: failed to download file')
        return res.status(500).send(err)
    }
    fileHash = await addFile(fileName, filePath)
    console.log('File Hash received __>', fileHash)
    fs.unlink(filePath, (err) => {
        if(err) {
            console.log("Error: Unable to delete file.", err)
        }
    })
  })
  return fileHash
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
  // console.log(filesAdded)
  const fileHash = filesAdded.cid
  // console.log(fileHash)
  return fileHash.toString()
}