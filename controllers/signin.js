const handleSignin = (req, res, knex, bcrypt) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    knex.select("email", "hash")
        .from("login")
        .where("email", "=", email)
        .then(data => {
            const isvalid = bcrypt.compareSync(password, data[0].hash);
            if (isvalid) {
                return knex
                    .select("*")
                    .from("users")
                    .where("email", "=", email)
                    .then(user => {
                        // console.log(user);
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json("unable to get user"));
            } else {
                res.status(400).json("worng password or email");
            }
        })
        .catch(err => res.status(400).json("wrong credentials"));
};

module.exports = {
    handleSignin
};
