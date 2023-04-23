let express=require("express")
 let mongoose =require("mongoose");
let dotenv=require("dotenv")
let cors=require("cors")
let session=require("express-session")
let passport=require("passport");
const cookieSession = require("cookie-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


dotenv.config();

const app = express();
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);
mongoose.connect('mongoURI=mongodb+srv://sanjayv:sanjay@cluster0.9ycsbw8.mongodb.net/nxm301cwgoogleauth?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log("Connected to mongoose successfully")
});

// Middleware
app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.set("trust proxy", 1);

// app.use(
//   session({
//     secret: "secretcode",
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//       sameSite: "none",
//       secure: true,
//       maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
//     }
//   }))


app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) => {
 return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: "147798063236-iv20ceu6gpr21g5kdeg53rjehvenvg1d.apps.googleusercontent.com",
      clientSecret:"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",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/userdashboard",
//     failureRedirect: "/auth/login/failed",
//   })
// );
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: 'http://localhost:3000', session: true }),
//   function (req, res) {
//     res.redirect('http://localhost:3000/userdashboard');
//   });

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "http://localhost:3000/userdashboard",
      failureRedirect: "/auth/login/failed",
    })
  );
  app.get("/auth/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "failure",
    });
  });
  

app.get("/", (req, res) => {
  res.send("Helllo WOlrd");
})

app.get("/login/success", (req, res) => {

  let payload = req.user;
  console.log(payload)
  res.status(200).json({
    success: true,
    message: "successfull",
    user: payload
    //   cookies: req.cookies
  });
})

app.get("/auth/logout", (req, res) => {
  if (req.user) {
    req.logout();
    res.send("done");
  }
})

app.listen(4000, () => {
  console.log("Server Starrted at 4000");
})