
module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req,res,next)=>{
    let {id}=req.params;
    let currListing= await Listing.findById(id);
    if(!currListing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Access Denied");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.method=="GET"){
            req.session.redirectUrl=req.originalUrl;
        }
        // req.flash("error","Please Login to Continue");
        return res.redirect("/login");
    }
    next();
}