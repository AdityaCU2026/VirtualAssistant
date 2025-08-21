import  jwt from "jsonwebtoken";

const genToken = async (userId)=>{
    try{
      const token = await jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: "30d"
      });
      return token;
    }
    catch(err){
        console.error("Error generating token:", err);
        throw new Error("Token generation failed");
    }
}

export default genToken;