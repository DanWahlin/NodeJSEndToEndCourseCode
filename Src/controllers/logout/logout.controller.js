"use strict";

module.exports = function (router) {
    
    router.get("/", function (req, res, next) {
        req.logout();
        res.redirect("/");
    });

};