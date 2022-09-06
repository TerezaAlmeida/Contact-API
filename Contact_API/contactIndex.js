const Joi = require('joi');
const express = require('express');
const app = express();
const url = require('url');
const { query } = require('express');
const { type } = require('os');

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
    id: 1,
    personDetails: { 
        firstName : "Contact1",
        lastName : "LastName1",
        dateOfBirth : "1990-08-20", 
        },
        company : "Company1",
        profileImage : "XImage.jpg",
        email: {
            type: "Home",
            value: "contactx@gmail.com"
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

app.get('/api/v1/user/:emailId/contact', (req, res) =>{

    const queryEmail = req.query.email;
    const queryPhone = req.query.phone;

    let typeOfCall;

    if(queryEmail) {
        if (queryPhone) typeOfCall = 'PhoneAndEmail';
        else typeOfCall = 'Email';
    } 
    else if (queryPhone) typeOfCall = 'Phone';
    else typeOfCall = 'Undefined';

    let findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The contact with the given user email was not found.');

    switch(typeOfCall){
        case 'Email':
            let findContactsEmail = [];

            for(var i=0; i<contacts.length; i++){
                if (Array.isArray(contacts[i].email && contacts[i].email)) {

                    for (var j = 0; j<contacts[i].email.length;j++){
                        if(contacts[i].email[j].value === queryEmail) findContactsEmail.push(contacts[i]);
                    }
                }
                else {
                    if(contacts[i].email.value === queryEmail) findContactsEmail.push(contacts[i]);
                }
            }

            if(!findContactsEmail || findContactsEmail.length === 0) return res.status(404).send('The contact with the given email was not found.');
            return res.send(findContactsEmail);

        case 'Phone':
                let findContactsPhone = [];
    
                for(var i=0; i<contacts.length; i++){
                    if (Array.isArray(contacts[i].phoneNumber && contacts[i].phoneNumber)) {
    
                        for (var j = 0; j<contacts[i].phoneNumber.length;j++){
                            if(contacts[i].phoneNumber[j].value === queryPhone) findContactsPhone.push(contacts[i]);
                        }
                    }
                    else {
                        if(contacts[i].phoneNumber.value === queryPhone) findContactsPhone.push(contacts[i]);
                    }
                }
    
                if(!findContactsPhone || findContactsPhone.length === 0) return res.status(404).send('The contact with the given phone was not found.');
                return res.send(findContactsPhone);

        case 'PhoneAndEmail':
            let findContactsPhoneEmail = [];
    
            for(var i=0; i<contacts.length; i++){
                if (Array.isArray(contacts[i].phoneNumber && contacts[i].phoneNumber) 
                    && Array.isArray(contacts[i].email && contacts[i].email)) {

                    for (var j = 0; j<contacts[i].phoneNumber.length;j++){
                        if(contacts[i].phoneNumber[j].value === queryPhone 
                            && contacts[i].email[j].value === queryEmail) findContactsPhoneEmail.push(contacts[i]);
                    }
                }
                else {
                    if(contacts[i].phoneNumber.value === queryPhone 
                        && contacts[i].email.value === queryEmail) findContactsPhoneEmail.push(contacts[i]);
                }
            }

            if(!findContactsPhoneEmail || findContactsPhoneEmail.length === 0) return res.status(404).send('The contact with the given Email and Phone was not found.');
            return res.send(findContactsPhoneEmail);

        default:
            return res.send(contacts);
    }
});

app.get('/api/v1/contact/address', (req, res) =>{

    const queryCity = req.query.city;
    const queryState = req.query.state;

    let typeOfCall;

    if(queryCity) typeOfCall = 'City';
    
    else if (queryState) typeOfCall = 'State';

    switch(typeOfCall){
        case 'City':
            let findContactsCity = [];

            for(var i=0; i<contacts.length; i++){
                if (Array.isArray(contacts[i].address && contacts[i].address)) {

                    for (var j = 0; j<contacts[i].address.length;j++){
                        if(contacts[i].address[j].city === queryCity) findContactsCity.push(contacts[i]);
                    }
                }
                else {
                    if(contacts[i].address.city === queryCity) findContactsCity.push(contacts[i]);
                }
            }

            if(!findContactsCity || findContactsCity.length === 0) return res.status(404).send('The contact with the given city was not found.');
            return res.send(findContactsCity);

        case 'State':
                let findContactsState = [];
    
                for(var i=0; i<contacts.length; i++){
                    if (Array.isArray(contacts[i].address && contacts[i].address)) {
    
                        for (var j = 0; j<contacts[i].address.length;j++){
                            if(contacts[i].address[j].state === queryState) findContactsState.push(contacts[i]);
                        }
                    }
                    else {
                        if(contacts[i].address.state === queryState) findContactsState.push(contacts[i]);
                    }
                }
    
                if(!findContactsState || findContactsState.length === 0) return res.status(404).send('The contact with the given state was not found.');
                return res.send(findContactsState);
    }
});

app.get('/api/v1/user/:emailId', (req, res) =>{
    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The contact with the given email was not found. Create a user with the email: ' + contacts.find(c => c.email.value));
    res.send(findUser);
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

app.post('/api/v1/user/:emailId/contact', (req, res) =>{

    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The contact with the given email was not found.');

    const {error} = validateContact(req.body); 

    if (error) return res.status(400).send(error);

    const contact = {
        id: contacts.length + 1,
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

app.put('/api/v1/user/:emailId/contact/:contactId', (req, res) =>{
    const findContact = contacts.find(c => c.id === parseInt(req.params.contactId));
    if(!findContact) return res.status(404).send('The contact with the given ID was not found.');
    
    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The user with the given email was not found.');

    const {error} = validateContact(req.body); 

    if (error) return res.status(400).send(error);

    findContact.personDetails.firstName = req.body.personDetails.firstName;
    findContact.personDetails.lastName = req.body.personDetails.lastName;
    findContact.personDetails.dateOfBirth = req.body.personDetails.dateOfBirth;
    findContact.company = req.body.company;
    findContact.profileImage = req.body.profileImage;
    findContact.email = displayArray(req.body.email, "email");
    findContact.phoneNumber = displayArray(req.body.phoneNumber, "phoneNumber");
    findContact.address = displayArray(req.body.address, "address");

    res.send(findContact);
});

app.delete('/api/v1/user/:emailId', (req, res) =>{
    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The user with the given user email was not found.');

    const indexUser = users.indexOf(findUser);
    users.splice(indexUser, 1);

    res.send(users);
})

app.delete('/api/v1/user/:emailId/contact/:contactId', (req, res) =>{
    const findContact = contacts.find(c => c.id === parseInt(req.params.contactId));
    if(!findContact) return res.status(404).send('The contact with the given ID was not found.');

    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The user with the given email was not found.');

    const index = contacts.indexOf(findContact);
    contacts.splice(index, 1);

    res.send(contacts);
})

app.delete('/api/v1/user/:emailId/contact', (req, res) =>{
    const findUser = users.find(c => c.email.value === req.params.emailId);
    if(!findUser) return res.status(404).send('The user with the given email was not found.');

    for(var i = 0; i<contacts.length; i++){
        contacts.splice(i);
    }

    res.send(contacts);
})

function validateUser(user){
    const schema = Joi.object({
        personDetails: {
            firstName: Joi.string().required(),
            lastName : Joi.string().required(),
            dateOfBirth: Joi.string().required(),
        },
        email: {
            type: Joi.string(),
            value : Joi.string().required(),
        },
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
            value : Joi.string().required(),
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
app.listen(port, () => console.log(`Listening on port ${port}...`));