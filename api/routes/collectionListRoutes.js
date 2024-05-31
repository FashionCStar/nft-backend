'use strict'
module.exports = function(app) {
    var collectList = require('../controllers/collectController')

    app.route('/collects')
        .get(collectList.list_all_collect)
        .post(collectList.create_a_collect)
    app.route('/collects/:collectId')
        .get(collectList.read_a_collect)
        .put(collectList.update_a_collect)
        .delete(collectList.delete_a_collect)
}