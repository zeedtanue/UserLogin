
exports.getIndex= function(req, res, next) {
	
    res.render('index', { title: 'Home' });
  }
exports.ensureAuthenticate=(req,res,next)=> {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash('error','You have to Login First.');
	res.redirect('/users/login');
}