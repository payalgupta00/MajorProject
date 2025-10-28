
const Listing=require("../models/listing");
module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm=(req, res) => {
 res.render("listings/new");
};


module.exports.showListing =async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews", populate: {path:"author",},}).populate("owner");

  if (!listing) {
   req.flash("error","Listing you requested for does not exise!");
   res.redirect("/listings");
  }
res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    // ✅ 1. Get geolocation (latitude, longitude) from OpenStreetMap
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.listing.location)}`
    );
    const geoData = await geoResponse.json();

    // ✅ 2. Create new listing
    const newListing = new Listing(req.body.listing);

    // ✅ 3. Add geometry if found
    if (geoData.length > 0) {
      newListing.geometry = {
        type: "Point",
        coordinates: [
          parseFloat(geoData[0].lon),
          parseFloat(geoData[0].lat)
        ]
      };
    }

    // ✅ 4. Add Cloudinary image details (from multer)
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    // ✅ 5. Set the owner (current user)
    newListing.owner = req.user._id;

    // ✅ 6. Save to database
    await newListing.save();

    // ✅ 7. Flash success and redirect
    req.flash("success", "New Listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    next(err);
  }
};


module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing) {
   req.flash("error","Listing you requested for does not exise!");
   res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing ,  originalImageUrl});
};

module.exports.updatedListing = async (req, res) => {
    
  const { id } = req.params;
 const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

 if(typeof req.file !== "undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url, filename};
  await listing.save();
 } 
  req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
 console.log(deletedListing);
 req.flash("success","Listing Deleted");
  res.redirect("/listings");
};