var jwt = require('jsonwebtoken')



// getUser function validates the auth-token header 
const getUser = (req, res, next) =>{
    const token=req.header('auth-token')
    if (token) {
        const user=jwt.verify(token,"udayisg$$db@y")
        req.user=user
        next();
    }else{
        res.status(401).send({error:"Please login using valid token."})
    }
}



module.exports = getUser;