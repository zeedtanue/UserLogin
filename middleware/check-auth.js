const jwt =require('jsonwebtoken');

module.exports= (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jst.verify(token, 'ItsTheSecretMesage');
        req.userData = decoded;
    }catch (error){
        return res.status(401).json({
            message: 'Auth failed'
        });

    };

    
    next();
}
//jwt verify
function verifyJwt(jwtString){
	const value = jwt.verify(jwtString, 'ItsTheSecretMesage');
	return value;
}