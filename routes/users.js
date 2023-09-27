const router = require("express").Router();
const { User } = require("../models/User");
const bcrycpt = require("bcrypt");
const jwt = require("jsonwebtoken");

router
  .get(`/`, async (req, res) => {
    const users = await User.find().select("name phone email");
    if (!users) {
      res.status(500).json("No users In Your List");
    }
    res.status(200).json(users);
  })
  .get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id).select("name phone email");
    if (!user) {
      return res.status(400).json("User Not Found !!!");
    }
    return res.status(200).json(user);
  })
  .post("/register", async (req, res) => {
    const salt = await bcrycpt.genSalt(10);
    const hashedPassword = await bcrycpt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
    });
    user
      .save()
      .then((createdUser) => {
        res.status(200).json({ createdUser: createdUser });
      })
      .catch((err) => {
        res.status(403).json(err);
      });
  })
  .post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const isMatch = await bcrycpt.compare(req.body.password, user.password);
      if (isMatch) {
        const payload = {
          userId: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.status(200).json(token);
      } else {
        res.status(401).json({ message: "Password is incorrect !!!" });
      }
    } else {
      res.status(401).json({ message: "User not found !!!" });
    }
  })
  .get("/get/count", async (req, res) => {
    const count = await User.countDocuments();
    if (!count) {
      res.status(500).json("No Users In Your List");
    }
    res.status(200).json({ "Users Count": count });
  });

module.exports = router;
