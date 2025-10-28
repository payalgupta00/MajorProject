const User=require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup");
};
module.exports.signup=async(req,res) => {
    try{
 let {username, email, password}= req.body;
    const newUser=new User({email, username});
    const registeredUser=await User.register(newUser, password);
    console.log(registeredUser);
       req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/");
    });
  }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
   }
};

module.exports.renderLoginForm=(req,res) => {
    res.render("users/login");
};

module.exports.login = (req,res) => {
      const redirectUrl = req.session.returnTo || "/listings";
    delete req.session.returnTo;
    req.flash("success","Welcome back to Wanderlust!");
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res, next) => {
  req.logout(function (err) {
    if (err) { 
      return next(err);
     }
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
}