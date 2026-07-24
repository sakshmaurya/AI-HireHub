import jwt from "jsonwebtoken";

// Generate Access Token (short-lived)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // token is the name of the cookie as we gave while storing it (in user.controller.js)
    
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided", success: false });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token", success: false });
    }

    req.id = decoded.userId; // userId is the name of the field we gave while storing it (in user.controller.js)
    next();
  } catch (error) {
    console.log("Error in auth.middleware.js", error);
    return res
      .status(401)
      .json({ message: "Unauthorized - Token Expired or Invalid", success: false });
  }
};

// Middleware for recruiter-only access
export const recruiterOnly = (req, res, next) => {
  try {
    // We need to fetch the user to check role
    // This will be handled in the controller or we can add user to req in protect middleware
    // For now, we'll check if the user is a recruiter by fetching from DB
    import("../models/user.model.js").then(({ default: User }) => {
      User.findById(req.id).then(user => {
        if (user && user.role === "recruiter") {
          next();
        } else {
          res.status(403).json({ message: "Access denied, recruiter only", success: false });
        }
      }).catch(err => {
        res.status(500).json({ message: "Internal Server Error", success: false });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Middleware for admin-only access
export const adminOnly = (req, res, next) => {
  try {
    import("../models/user.model.js").then(({ default: User }) => {
      User.findById(req.id).then(user => {
        if (user && user.role === "admin") {
          next();
        } else {
          res.status(403).json({ message: "Access denied, admin only", success: false });
        }
      }).catch(err => {
        res.status(500).json({ message: "Internal Server Error", success: false });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
