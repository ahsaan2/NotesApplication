exports.isLoggedIn = function(req, res, next){
// if we get a user(that is when we log in , then we go to the next)
if(req.user){
    next();// go to the next middleware
}else{
    return res.status(401).send('UnAuthorized')   // unauthorized access
}
}