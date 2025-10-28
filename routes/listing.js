const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner , validateListing} = require("../middleware/isLoggedIn");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage} = require("../cloudConfig.js");
const upload=multer({storage});

router.route("/")
.get( isLoggedIn, wrapAsync (listingController.index ))
.post(isLoggedIn,upload.single('image'),validateListing, wrapAsync (listingController.createListing));

// New listing form
router.get("/new",isLoggedIn, listingController.renderNewForm );


router.route("/:id")
.get( wrapAsync (listingController.showListing))
.put( upload.single("image"),validateListing,wrapAsync (listingController.updatedListing))
.delete( wrapAsync (listingController.destroyListing));



// Edit form
router.get("/:id/edit", wrapAsync (listingController.renderEditForm));
router.get("/listings/:id", async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listings/show", { listing });
});



module.exports=router;