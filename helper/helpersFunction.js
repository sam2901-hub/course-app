import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


function validateFields(body, requiredFields) {
    const errors = [];
    const validatedFields = {};
  
    for (const field in requiredFields) {
      if (body[field] === undefined) {
        errors.push(`Missing field: ${field}`);
      } else if (typeof body[field] !== requiredFields[field]) {
        errors.push(
          `Incorrect type for field ${field}: expected ${
            requiredFields[field]
          }, got ${typeof body[field]}`
        );
      } else {
        validatedFields[field] = body[field];
      }
    }
  
    return { errors, validatedFields };
  }

  function passwordbcrypt(password) {
    const hashpassword = bcrypt.hashSync(password, 10);
    return hashpassword;
  }
  
function comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }
// const secrectKey = crypto.randomBytes(48).toString("hex");
const secrectKey =
  "a328eda480c9927206fcbf0175f185739eddad77e3b7e274c989a6b7cd6a866689baa21d92ff5d727336e794b65d9118";
  function generateAccessToken(id, email,role) {
    const encoded_tokenPayload = {
      id,
      role,
      email,
    };
    const public_tokenPayload = {
      id,
      role,
      email,
    };
    const encoded_token = jwt.sign(encoded_tokenPayload, secrectKey, {
      expiresIn: "2h",
    });
    const public_token = jwt.sign(public_tokenPayload, secrectKey, {
      expiresIn: "1d",
    });
    return { encoded_token, public_token };
  }

  function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token, secrectKey, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.locals["id"] = user.id;
      res.locals["role"]=user.role
      res.locals["email"] = user.email;
  
      next();
    });
  }
  
  export
  {
    validateFields,
    passwordbcrypt,
    comparePassword,
    generateAccessToken,
    authMiddleware
  }