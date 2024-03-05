const UserService = require("../services/user.services");

exports.register = async (req, res, next) => {
    console.log("called register");
    try {
        const { email, password } = req.body;
        await UserService.registerUser(email, password);

        res.status(200).json({ status: 200, success: "User Successfully Registered" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
}

exports.login = async (req, res, next) => {
    console.log("began login")
    try {
        const { email, password } = req.body;
        const user = await UserService.checkUser(email);

        if (!user) {
            return res.status(401).json({ status: 401, message: "User doesn't exist" });
        }


        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ status: 401, message: "Invalid password" });
        }

        let tokenData = { _id: user._id, email: user.email };
        const token = await UserService.generateToken(tokenData, "secretKey", "1h");

        res.status(200).json({ status: 200, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
}
