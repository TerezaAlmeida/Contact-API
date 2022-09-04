const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

app.get('/', (req, res) =>{
    res.send('Hello World today');
});

app.get('/api/courses', (req, res) =>{
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) =>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found');
    res.send(course);
})

app.post('/api/courses', (req, res) =>{
    
    const {error} = validateCourse(req.body); //result.error

    if (error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) =>{
    //If the course didn't exist return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');

    //Validate, if invalid return 400
    const {error} = validateCourse(req.body); //result.error

    if (error) return res.status(400).send(error.details[0].message);

    //Update course and return it

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) =>{
    // Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found');

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course);
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().required()
   });

    return schema.validate(course);
}

const port = process.env.port || 3000
app.listen(port, () => console.log(`Listenin on port ${port}...`));