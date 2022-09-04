const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const contacts = [{
    personDetails: { 
        firstName : "Contact1",
        lastName : "LastName1",
        dateOfBirth : "1990-08-20", 
        },
        company : "Company1",
        profileImage : "XImage.jpg",
        email: {
            type: "Home",
            value: "contact1@gmail.com"
        },
        phoneNumber: {
            type : "primary",
            value : "152-288887884",
        },
        address : {
            apartment : " ",
            street : "25 Avenue",
            city : "Boston",
            state : "MA",
            postalCode : "2654895",
            country : "USA",
        }
}];

app.get('/api/v1/user', (req, res) =>{
    res.send(contacts);
});

app.get('/api/v1/user/:emailId', (req, res) =>{
    const contact = contacts.find(c => c.email.value === req.params.emailId);
    if(!contact) res.status(404).send('The contact with the given email was not found: ' + contacts.find(c => c.email.value));
    res.send(contact);
});

app.post('/api/v1/user', (req, res) =>{
    const {error} = validateContact(req.body); //result.error

    if (error) return res.status(400).send(error);

    const contact = {
        personDetails: { 
        firstName : req.body.personDetails.firstName,
        lastName : req.body.personDetails.lastName,
        dateOfBirth : req.body.personDetails.dateOfBirth, 
        },
        company : req.body.company,
        profileImage : req.body.profileImage,
        email: {
            type: req.body.email.type,
            value: req.body.email.value
        },
        phoneNumber: {
            type : req.body.phoneNumber.type,
            value : req.body.phoneNumber.value,
        },
        address : {
            apartment : req.body.address.apartment,
            street : req.body.address.street,
            city : req.body.address.city,
            state : req.body.address.state,
            postalCode : req.body.address.postalCode,
            country : req.body.address.country,
        }
    };

    contacts.push(contact);
    res.send(contact);
})

function validateContact(contact) {
    const schema = Joi.object({
        personDetails: {
            firstName: Joi.string().required(),
            lastName : Joi.string().required(),
            dateOfBirth: Joi.string().required(),
        },
        company: Joi.string().required(),
        profileImage: Joi.string(),
        email: {
            type : Joi.string(),
            value : Joi.string(),
        },
        phoneNumber: {
            type : Joi.string(),
            value: Joi.string(),
        },
        address: {
            apartment : Joi.string(),
            street : Joi.string().required(),
            city : Joi.string().required(),
            state : Joi.string().required().max(2),
            postalCode : Joi.string(),
            country : Joi.string().required().max(3),
        },
   });

    return schema.validate(contact);
}

const port = process.env.port || 4000
app.listen(port, () => console.log(`Listenin on port ${port}...`));