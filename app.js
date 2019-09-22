const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => {
    // console.log(req.body);
    // res.send('henlo');
    const { firstName, lastName, email} = req.body;

    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    const options = {
        url: 'https://us4.api.mailchimp.com/3.0/lists/273f1eb45d',
        method: 'POST',
        headers:{
            Authorization:'auth ca036a474aeb40490e53589209a257a1-us4'
        },
        body: postData
    };

    request(options, (err, response, body) => {
        if(err){
            res.redirect('/fail.html');
        }
        else{
            if(response.statusCode === 200){
                res.redirect('success.html');
            }
            else{
                res.redirect('/fail.html');
            }
        }
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server Started on ${PORT}`));