const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')



//register
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (checkUser) return res.json({
            success: false,
            message: 'User Already Exists with the same email ! plase try again',
        })
        //password hash
        const hashPassword = await bcrypt.hash(password, 12);

        //create new User
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        })
        //save new user in DB
        await newUser.save()
        res.status(200).json({
            success: true,
            message: 'Registration Successful'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured'
        })
    }
}





//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first"
            })
        }
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if (!checkPasswordMatch) {
            return res.json({
                success: false,
                message: "Incorrect Password! Please try again"
            })
        }
        //create token using json web token
        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            username: checkUser.userName

        }, 'CLIENT_SECRET_KEY', { expiresIn: '60m' })

        res.cookie('token', token, { httpOnly: true, secure: false }).json({
            success: true,
            message: 'Logged in successfully',
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                username: checkUser.userName
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occured'
        })
    }
}
//logout

const logoutUser = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        message: 'Logged out Successfully!',
    })
}

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorised User! "
        })
    }
    try{
        const decoded = jwt.verify(token,'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    }catch(error){
        res.status(401).json({
            success: false,
            message: "Unauthorised User! "
        })
    }
}

module.exports = { registerUser, loginUser, logoutUser,authMiddleware }