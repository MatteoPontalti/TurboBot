module.exports = function(app) {

    const server = app.listen(process.env.PORT || 5000 , () => {
        console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
    });
    return server;
};
