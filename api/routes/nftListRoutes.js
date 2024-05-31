'use strict'
module.exports = function(app) {
    var nftList = require('../controllers/nftListController')

    app.route('/nfts')
        .get(nftList.list_all_nfts)
        // Post Data E.X.
        // Postman -> Body/raw/JSON
        // {
        //     "nft_id":3,
        //     "name": "Bear"
        // }
        .post(nftList.create_a_nft) 

    app.route('/nfts/:nftId')
        .get(nftList.read_a_nft)
        .put(nftList.update_a_nft)
        .delete(nftList.delete_a_nft)
    app.route('/nfts/favs/:nftId')
        .put(nftList.update_fav)
    app.route('/nftFavCnt/:nftId')
        .get(nftList.nftFavCnt)
}