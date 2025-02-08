const getHomePage = (req, res) => {
    res.send('Hello World Le Thoai dep trai!')
}

const getQhuong = (req, res) => {
    res.render('samples.ejs');
}

module.exports = {
    getHomePage, getQhuong
}