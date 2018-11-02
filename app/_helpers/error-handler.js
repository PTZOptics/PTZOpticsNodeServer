module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.log(err);
    if (typeof err === 'string') {
        return res.status(409).json({message: err});
    }
    return res.status(500).json({message: err.message});
}
