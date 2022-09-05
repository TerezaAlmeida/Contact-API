const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const users = [{
    personDetails: { 
        firstName : "Contact1",
        lastName : "LastName1",
        dateOfBirth : "1990-08-20", 
        },
        email: {
            type: "Home",
            value: "contact1@gmail.com"
        },
}];

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
    res.send(users);
});

app.get('/api/v1/user/:emailId/contact', (req, res) =>{ // to do
    res.send(contacts);
});

app.get('/api/v1/user/:emailId', (req, res) =>{
    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The contact with the given email was not found. Create a user with the email: ' + contacts.find(c => c.email.value));
    res.send(findUser);
});

app.get('/api/v1/user/:emailId/contact?email', (req, res) =>{ // to do query params
    res.send(contacts);
});

app.post('/api/v1/user', (req,res) =>{
    const {error} = validateUser(req.body); 

    if (error) return res.status(400).send(error);
    const user = {
        personDetails: { 
            firstName : req.body.personDetails.firstName,
            lastName : req.body.personDetails.lastName,
            dateOfBirth : req.body.personDetails.dateOfBirth, 
            },
            email: {
                type: req.body.email.type,
                value: req.body.email.value
            },
    }
    users.push(user);
    res.send(user);
})

app.post('/api/v1/user//contact', (req, res) =>{

    const {error} = validateContact(req.body); 

    if (error) return res.status(400).send(error);

    const contact = {
        personDetails: { 
        firstName : req.body.personDetails.firstName,
        lastName : req.body.personDetails.lastName,
        dateOfBirth : req.body.personDetails.dateOfBirth, 
        },
        company : req.body.company,
        profileImage : req.body.profileImage,
        email : displayArray(req.body.email, "email"),
        phoneNumber: displayArray(req.body.phoneNumber, "phoneNumber"),
        address : displayArray(req.body.address, "address")
    };

    contacts.push(contact);
    res.send(contact);
})

function validateUser(user){
    const schema = Joi.object({
        personDetails: {
            firstName: Joi.string().required(),
            lastName : Joi.string().required(),
            dateOfBirth: Joi.string().required(),
        },
        email: Joi.array().items(Joi.object({
            type: Joi.string(),
            value : Joi.string().required(),
        })),
    });

    return schema.validate(user);
}

function validateContact(contact) {
    const schema = Joi.object({
        personDetails: {
            firstName: Joi.string().required(),
            lastName : Joi.string().required(),
            dateOfBirth: Joi.string().required(),
        },
        company: Joi.string().required(),
        profileImage: Joi.string().allow(null, ''),
        email: Joi.array().items(Joi.object({
            type: Joi.string().allow(null, ''),
            value : Joi.string().required(),
        })),
        phoneNumber: Joi.array().items(Joi.object({
            type: Joi.string().allow(null, ''),
            value : Joi.string(),
        })),
        address: Joi.array().items(Joi.object({
            apartment: Joi.string().allow(null, ''),
            street : Joi.string().required(),
            city : Joi.string().required(),
            state : Joi.string().required().max(2),
            postalCode : Joi.string(),
            country : Joi.string().required().max(3),
        })),
   });

    return schema.validate(contact);
}

function displayArray(contactData, contactType){
    const list = []
    switch(contactType){
        case "address":
            for (var i = 0; i<contactData.length; i++){
                const newContactData = {
                    apartment : contactData[i].apartment,
                    street : contactData[i].street,
                    city : contactData[i].city,
                    state : contactData[i].state,
                    postalCode : contactData[i].postalCode,
                    country : contactData[i].country,
                 }
                list.push(newContactData);
            }
            return list;

        default:
            for (var i = 0; i<contactData.length; i++){
                const newContactData = {
                    type: contactData[i].type,
                    value: contactData[i].value
                 }
                list.push(newContactData);
            }
            return list;
        }
    }

const port = process.env.port || 4000
app.listen(port, () => console.log(`Listenin on port ${port}...`));